import { markdown, formatTimestampUTC, rewriteRelativeImagesToAbsolute } from "./markdown.ts";
import type { EssayRow } from "./db.ts";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface BuildFeedArgs {
  baseUrl: string;
  essays: Array<{ essay: EssayRow; originalMarkdown: string }>;
}

export function buildRssFeed({ baseUrl, essays }: BuildFeedArgs): string {
  const items = essays
    .map(({ essay, originalMarkdown }) => {
      const withAbs = rewriteRelativeImagesToAbsolute(originalMarkdown, essay.slug, baseUrl);
      const rendered = markdown.render(withAbs);
      return `    <item>
      <title>${escapeXml(essay.title)}</title>
      <link>${baseUrl}/${essay.slug}/</link>
      <pubDate>${formatTimestampUTC(essay.timestamp)}</pubDate>
      <guid>${baseUrl}/${essay.slug}/</guid>
      <description><![CDATA[${rendered}]]></description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>George Strakhov's Telescopic Essays</title>
    <link>${baseUrl}</link>
    <description>Telescopic essays that can be read at different zoom levels</description>
    <atom:link href="${baseUrl}/feed.rss" rel="self" type="application/rss+xml" />
    <language>en-US</language>
${items}
  </channel>
</rss>`;
}
