import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const TARGET = process.argv.includes("--remote") ? "--remote" : "--local";

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function escapeSql(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  return "'" + String(value).replace(/'/g, "''") + "'";
}

async function main() {
  const tocPath = path.join(ROOT, "toc.json");
  const toc = JSON.parse(await fs.readFile(tocPath, "utf-8"));

  const essaysSql = [];
  const versionsSql = [];

  let skippedDrafts = 0;
  for (const essay of toc) {
    if (essay.isDraft) {
      skippedDrafts++;
      continue;
    }
    const naturalZoom = essay.naturalZoomLevel || "medium";
    essaysSql.push(
      `INSERT OR REPLACE INTO essays (slug, title, description, featured_image, timestamp, natural_zoom_level, is_ai_generated) VALUES (${[
        escapeSql(essay.slug),
        escapeSql(essay.title),
        escapeSql(essay.description ?? null),
        escapeSql(essay.featured_image ?? null),
        escapeSql(essay.timestamp),
        escapeSql(naturalZoom),
        essay.isAIGenerated ? 1 : 0,
      ].join(", ")});`,
    );

    // Only seed the ORIGINAL version (per user's explicit instruction).
    const originalEntry = Object.entries(essay.versions || {}).find(
      ([, v]) => v && v.isOriginal === true,
    );
    if (!originalEntry) {
      console.warn(`[seed] no original version found for ${essay.slug}, skipping content`);
      continue;
    }
    const [originalZoom, originalMeta] = originalEntry;
    const filename = originalZoom === naturalZoom
      ? `${essay.slug}.md`
      : `${essay.slug}.${originalZoom}.md`;
    const filePath = path.join(ROOT, "essays", essay.slug, filename);
    let content;
    try {
      content = await fs.readFile(filePath, "utf-8");
    } catch (err) {
      console.warn(`[seed] could not read ${filePath}: ${err.message}`);
      continue;
    }

    versionsSql.push(
      `INSERT OR REPLACE INTO essay_versions (slug, zoom_level, content, word_count, is_original, is_human_vetted, vetted_timestamp, is_ai_generated) VALUES (${[
        escapeSql(essay.slug),
        escapeSql(originalZoom),
        escapeSql(content),
        originalMeta.wordCount ?? countWords(content),
        1,
        originalMeta.isHumanVetted ? 1 : 0,
        escapeSql(originalMeta.vettedTimestamp ?? null),
        essay.isAIGenerated ? 1 : 0,
      ].join(", ")});`,
    );
  }

  const sqlPath = path.join(ROOT, ".seed.tmp.sql");
  await fs.writeFile(sqlPath, [...essaysSql, ...versionsSql].join("\n"), "utf-8");
  console.log(`[seed] wrote ${essaysSql.length} essays + ${versionsSql.length} originals to ${sqlPath} (${skippedDrafts} drafts skipped)`);

  const cmd = `npx wrangler d1 execute essays-thoughts-letters ${TARGET} --file=${sqlPath}`;
  console.log(`[seed] running: ${cmd}`);
  execSync(cmd, { cwd: ROOT, stdio: "inherit" });
  await fs.unlink(sqlPath);
  console.log("[seed] done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
