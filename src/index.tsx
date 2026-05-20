import { Hono, type Context } from "hono";
import { Home } from "./views/home.tsx";
import { EssayPage } from "./views/essay.tsx";
import { NotFound } from "./views/notfound.tsx";
import { ZOOM_LEVELS, type ZoomLevel } from "./prompts.ts";
import { renderEssayHtml } from "./markdown.ts";
import { listEssays, getEssayWithVersions, getVersion } from "./db.ts";
import { verifyCaptcha } from "./captcha.ts";
import { generateVersion, generateNewEssay } from "./llm.ts";
import { buildRssFeed } from "./rss.ts";

type Bindings = {
  DB: D1Database;
  ASSETS: Fetcher;
  BASE_URL: string;
  RECAPTCHA_SITE_KEY: string;
  ADMIN_EMAIL: string;
  FROM_EMAIL: string;
  // secrets
  OPENROUTER_API_KEY: string;
  RECAPTCHA_SECRET_KEY: string;
  RESEND_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const SLUG_REGEX = /^[a-z0-9-]+$/;

app.get("/", async (c) => {
  const essays = await listEssays(c.env.DB, true);
  return c.html(<Home essays={essays} />);
});

app.get("/feed.rss", async (c) => {
  const baseUrl = c.env.BASE_URL || "http://localhost:8787";
  const allEssays = await listEssays(c.env.DB, true);
  const enriched: Array<{ essay: typeof allEssays[number]; originalMarkdown: string }> = [];
  for (const essay of allEssays) {
    const v = await getVersion(c.env.DB, essay.slug, essay.natural_zoom_level as ZoomLevel);
    if (v?.is_original) enriched.push({ essay, originalMarkdown: v.content });
  }
  const xml = buildRssFeed({ baseUrl, essays: enriched });
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
});

app.get("/:slug{[a-z0-9-]+}/check-version", async (c) => {
  const slug = c.req.param("slug");
  const zoom = c.req.query("zoom") as ZoomLevel | undefined;
  if (!zoom || !(zoom in ZOOM_LEVELS)) {
    return c.json({ error: "Invalid zoom level" }, 400);
  }
  const v = await getVersion(c.env.DB, slug, zoom);
  return c.json({ exists: Boolean(v) });
});

app.post("/:slug{[a-z0-9-]+}/generate-version", async (c) => {
  const slug = c.req.param("slug");
  const body = (await c.req.json().catch(() => null)) as
    | { captchaToken?: string; zoomLevel?: ZoomLevel }
    | null;
  if (!body?.captchaToken || !body.zoomLevel || !(body.zoomLevel in ZOOM_LEVELS)) {
    return c.json({ error: "Invalid request" }, 400);
  }
  const ok = await verifyCaptcha(body.captchaToken, c.env.RECAPTCHA_SECRET_KEY);
  if (!ok) return c.json({ error: "Invalid captcha" }, 400);

  const data = await getEssayWithVersions(c.env.DB, slug);
  if (!data) return c.json({ error: "Essay not found" }, 404);
  const original =
    data.versions[data.essay.natural_zoom_level as ZoomLevel] ??
    Object.values(data.versions).find((v) => v?.is_original);
  if (!original) return c.json({ error: "No original content" }, 500);

  c.executionCtx.waitUntil(
    generateVersion({
      db: c.env.DB,
      apiKey: c.env.OPENROUTER_API_KEY,
      resendApiKey: c.env.RESEND_API_KEY,
      fromEmail: c.env.FROM_EMAIL,
      adminEmail: c.env.ADMIN_EMAIL,
      slug,
      zoom: body.zoomLevel,
      originalText: original.content,
    }).catch((err) => console.error("[generate-version]", err)),
  );
  return c.json({ success: true });
});

app.post("/generate-essay/:slug{[a-z0-9-]+}", async (c) => {
  const slug = c.req.param("slug");
  const body = (await c.req.json().catch(() => null)) as
    | { captchaToken?: string }
    | null;
  if (!body?.captchaToken) return c.json({ error: "Invalid request" }, 400);
  const ok = await verifyCaptcha(body.captchaToken, c.env.RECAPTCHA_SECRET_KEY);
  if (!ok) return c.json({ error: "Invalid captcha" }, 400);

  const existing = await getEssayWithVersions(c.env.DB, slug);
  if (existing) return c.json({ error: "Essay already exists" }, 409);

  c.executionCtx.waitUntil(
    generateNewEssay({
      db: c.env.DB,
      apiKey: c.env.OPENROUTER_API_KEY,
      resendApiKey: c.env.RESEND_API_KEY,
      fromEmail: c.env.FROM_EMAIL,
      adminEmail: c.env.ADMIN_EMAIL,
      slug,
    }).catch((err) => console.error("[generate-essay]", err)),
  );
  return c.json({ success: true });
});

app.get("/:slug{[a-z0-9-]+}/", async (c) => {
  const slug = c.req.param("slug");
  const data = await getEssayWithVersions(c.env.DB, slug);
  if (!data) return notFoundResponse(c, slug);

  const queryZoom = c.req.query("zoom") as ZoomLevel | undefined;
  const isGenerating = c.req.query("generating") === "true";
  const zoomLevel: ZoomLevel =
    queryZoom && queryZoom in ZOOM_LEVELS
      ? queryZoom
      : (data.essay.natural_zoom_level as ZoomLevel);

  const version = data.versions[zoomLevel];
  if (!version) {
    if (isGenerating) {
      const placeholder = `<div class="generating"><h2>Writing ${ZOOM_LEVELS[zoomLevel].name} version for the first time...</h2><p>This may take a little while.</p></div>`;
      return c.html(
        <EssayPage
          essay={data.essay}
          versions={data.versions}
          zoomLevel={zoomLevel}
          renderedHtml={placeholder}
          isGenerating
          recaptchaSiteKey={c.env.RECAPTCHA_SITE_KEY}
        />,
      );
    }
    const fallback = data.versions[data.essay.natural_zoom_level as ZoomLevel];
    if (!fallback) return notFoundResponse(c, slug);
    return c.html(
      <EssayPage
        essay={data.essay}
        versions={data.versions}
        zoomLevel={data.essay.natural_zoom_level as ZoomLevel}
        renderedHtml={renderEssayHtml(fallback.content, slug)}
        isGenerating={false}
        recaptchaSiteKey={c.env.RECAPTCHA_SITE_KEY}
      />,
    );
  }

  return c.html(
    <EssayPage
      essay={data.essay}
      versions={data.versions}
      zoomLevel={zoomLevel}
      renderedHtml={renderEssayHtml(version.content, slug)}
      isGenerating={false}
      recaptchaSiteKey={c.env.RECAPTCHA_SITE_KEY}
    />,
  );
});

function notFoundResponse(c: Context<{ Bindings: Bindings }>, pathSlug: string) {
  const isEssayPath = SLUG_REGEX.test(pathSlug);
  const topicName = isEssayPath
    ? pathSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : undefined;
  return c.html(
    <NotFound
      isEssayPath={isEssayPath}
      topicName={topicName}
      recaptchaSiteKey={c.env.RECAPTCHA_SITE_KEY}
    />,
    404,
  );
}

app.notFound((c) => {
  const path = new URL(c.req.url).pathname;
  const parts = path.split("/").filter(Boolean);
  const candidate = parts.length === 1 ? parts[0] : "";
  return notFoundResponse(c, candidate);
});

export default app;
