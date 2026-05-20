import { ZOOM_LEVELS, type ZoomLevel, SYSTEM_PROMPTS, userPromptTemplate, NEW_ESSAY_PROMPTS, findNaturalZoomLevel } from "./prompts.ts";
import { countWords } from "./markdown.ts";
import { upsertEssay, upsertVersion, getEssayWithVersions } from "./db.ts";
import { sendMarkdownEmail } from "./email.ts";
import corpusText from "../CORPUS.md";

const MODEL = "anthropic/claude-opus-4.7";
const TEMPERATURE = 0.7;
const MAX_RETRIES = 3;

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
}

async function callOpenRouter(
  apiKey: string,
  messages: OpenRouterMessage[],
  maxTokens: number,
): Promise<string> {
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://essays.georgestrakhov.com",
          "X-Title": "Telescopic Essays",
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: TEMPERATURE,
          max_tokens: maxTokens,
          messages,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`OpenRouter ${response.status}: ${text}`);
      }
      const data = (await response.json()) as OpenRouterResponse;
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error(`No content in response: ${JSON.stringify(data)}`);
      return content;
    } catch (err) {
      lastError = err;
      console.error(`[llm] attempt ${attempt}/${MAX_RETRIES} failed:`, err);
      if (attempt < MAX_RETRIES) await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("OpenRouter failed");
}

async function stripInvalidLinks(content: string): Promise<string> {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [...content.matchAll(linkRegex)];
  let result = content;
  for (const [fullMatch, text, url] of links) {
    if (url.startsWith("./") || url.startsWith("#")) continue;
    try {
      const probe = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(8000),
      });
      if (probe.status === 404) {
        result = result.replace(fullMatch, text);
      }
    } catch {
      result = result.replace(fullMatch, text);
    }
  }
  return result;
}

interface GenerateVersionArgs {
  db: D1Database;
  apiKey: string;
  resendApiKey: string;
  fromEmail: string;
  adminEmail: string;
  slug: string;
  zoom: ZoomLevel;
  originalText: string;
}

export async function generateVersion(args: GenerateVersionArgs): Promise<void> {
  console.log(`[llm] generating ${args.zoom} version for ${args.slug}`);
  const messages: OpenRouterMessage[] = [
    { role: "system", content: SYSTEM_PROMPTS[args.zoom] },
    { role: "user", content: `REFERENCE STYLE AND CONTENT (George's other essays):\n\n${corpusText}` },
    { role: "user", content: userPromptTemplate(args.originalText, args.zoom) },
  ];
  const maxTokens = args.zoom === "large" ? 30000 : 8000;
  const raw = await callOpenRouter(args.apiKey, messages, maxTokens);
  const cleaned = await stripInvalidLinks(raw);
  const wordCount = countWords(cleaned);

  await upsertVersion(args.db, {
    slug: args.slug,
    zoom_level: args.zoom,
    content: cleaned,
    word_count: wordCount,
    is_original: 0,
    is_human_vetted: 0,
    vetted_timestamp: null,
    is_ai_generated: 1,
  });

  await sendMarkdownEmail({
    apiKey: args.resendApiKey,
    from: args.fromEmail,
    to: args.adminEmail,
    subject: `New Version Generated: ${args.slug} (${args.zoom})`,
    text: `A new ${args.zoom} version was generated for ${args.slug}.\n\nView: https://essays.georgestrakhov.com/${args.slug}/?zoom=${args.zoom}`,
    attachmentName: `${args.slug}.${args.zoom}.md`,
    attachmentContent: cleaned,
  });

  console.log(`[llm] done ${args.zoom} for ${args.slug} (${wordCount} words)`);
}

interface GenerateEssayArgs {
  db: D1Database;
  apiKey: string;
  resendApiKey: string;
  fromEmail: string;
  adminEmail: string;
  slug: string;
}

function formatCurrentTimestamp(): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  return `0${yyyy}${mm}${dd}`;
}

function titleCase(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export async function generateNewEssay(args: GenerateEssayArgs): Promise<void> {
  console.log(`[llm] generating new essay for ${args.slug}`);
  const topic = args.slug.replace(/-/g, " ");
  const messages: OpenRouterMessage[] = [
    { role: "system", content: NEW_ESSAY_PROMPTS.system },
    { role: "user", content: `REFERENCE STYLE AND CONTENT (George's other essays):\n\n${corpusText}` },
    { role: "user", content: NEW_ESSAY_PROMPTS.user(topic) },
  ];
  const raw = await callOpenRouter(args.apiKey, messages, 8000);
  const cleaned = await stripInvalidLinks(raw);
  const wordCount = countWords(cleaned);
  const naturalZoom = findNaturalZoomLevel(wordCount);

  await upsertEssay(args.db, {
    slug: args.slug,
    title: titleCase(args.slug),
    description: null,
    featured_image: null,
    timestamp: formatCurrentTimestamp(),
    natural_zoom_level: naturalZoom,
    is_ai_generated: 1,
  });

  await upsertVersion(args.db, {
    slug: args.slug,
    zoom_level: naturalZoom,
    content: cleaned,
    word_count: wordCount,
    is_original: 1,
    is_human_vetted: 0,
    vetted_timestamp: null,
    is_ai_generated: 1,
  });

  await sendMarkdownEmail({
    apiKey: args.resendApiKey,
    from: args.fromEmail,
    to: args.adminEmail,
    subject: `New Essay Generated: ${args.slug} (${naturalZoom})`,
    text: `A new AI essay was generated for ${args.slug}.\n\nView: https://essays.georgestrakhov.com/${args.slug}/`,
    attachmentName: `${args.slug}.md`,
    attachmentContent: cleaned,
  });

  console.log(`[llm] done new essay ${args.slug} (${wordCount} words)`);
}
