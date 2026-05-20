import MarkdownIt from "markdown-it";
import mdFootnote from "markdown-it-footnote";
import mdAttrs from "markdown-it-attrs";

export const markdown = new MarkdownIt({ html: true })
  .use(mdFootnote)
  .use(mdAttrs);

const defaultRender =
  markdown.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

markdown.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet("target", "_blank");
  return defaultRender(tokens, idx, options, env, self);
};

export function renderEssayHtml(markdownText: string, slug: string): string {
  let html = markdown.render(markdownText);
  html = html.replace(/src="\.\/img\//g, `src="/${slug}/img/`);
  return html;
}

export function rewriteRelativeImagesToAbsolute(
  markdownText: string,
  slug: string,
  baseUrl: string,
): string {
  return markdownText.replace(
    /!\[([^\]]*)\]\(\.\/img\/(.*?)\)/g,
    (_match, alt, imgPath) => `![${alt}](${baseUrl}/${slug}/img/${imgPath})`,
  );
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function formatTimestampUTC(timestamp: string): string {
  const t = timestamp.startsWith("0") ? timestamp.slice(1) : timestamp;
  const year = parseInt(t.slice(0, 4), 10);
  const month = parseInt(t.slice(4, 6), 10) - 1;
  const day = parseInt(t.slice(6, 8), 10);
  return new Date(Date.UTC(year, month, day)).toUTCString();
}

export function formatTimestampLong(timestamp: string): string {
  const t = timestamp.startsWith("0") ? timestamp.slice(1) : timestamp;
  const year = parseInt(t.slice(0, 4), 10);
  const month = parseInt(t.slice(4, 6), 10) - 1;
  const day = parseInt(t.slice(6, 8), 10);
  return new Date(Date.UTC(year, month, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
