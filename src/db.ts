import type { ZoomLevel } from "./prompts.ts";

export interface EssayRow {
  slug: string;
  title: string;
  description: string | null;
  featured_image: string | null;
  timestamp: string;
  natural_zoom_level: ZoomLevel;
  is_ai_generated: number;
}

export interface EssayVersionRow {
  slug: string;
  zoom_level: ZoomLevel;
  content: string;
  word_count: number;
  is_original: number;
  is_human_vetted: number;
  vetted_timestamp: string | null;
  is_ai_generated: number;
  created_at: string;
}

export interface EssayWithVersions {
  essay: EssayRow;
  versions: Partial<Record<ZoomLevel, EssayVersionRow>>;
}

export async function listEssays(db: D1Database, includeAI = true): Promise<EssayRow[]> {
  const sql = includeAI
    ? "SELECT * FROM essays ORDER BY timestamp DESC"
    : "SELECT * FROM essays WHERE is_ai_generated = 0 ORDER BY timestamp DESC";
  const { results } = await db.prepare(sql).all<EssayRow>();
  return results ?? [];
}

export async function getEssayWithVersions(
  db: D1Database,
  slug: string,
): Promise<EssayWithVersions | null> {
  const essay = await db
    .prepare("SELECT * FROM essays WHERE slug = ?")
    .bind(slug)
    .first<EssayRow>();
  if (!essay) return null;

  const { results } = await db
    .prepare("SELECT * FROM essay_versions WHERE slug = ?")
    .bind(slug)
    .all<EssayVersionRow>();

  const versions: Partial<Record<ZoomLevel, EssayVersionRow>> = {};
  for (const v of results ?? []) versions[v.zoom_level as ZoomLevel] = v;
  return { essay, versions };
}

export async function getVersion(
  db: D1Database,
  slug: string,
  zoom: ZoomLevel,
): Promise<EssayVersionRow | null> {
  return await db
    .prepare("SELECT * FROM essay_versions WHERE slug = ? AND zoom_level = ?")
    .bind(slug, zoom)
    .first<EssayVersionRow>();
}

export async function upsertVersion(
  db: D1Database,
  v: Omit<EssayVersionRow, "created_at"> & { created_at?: string },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO essay_versions
        (slug, zoom_level, content, word_count, is_original, is_human_vetted, vetted_timestamp, is_ai_generated)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(slug, zoom_level) DO UPDATE SET
         content = excluded.content,
         word_count = excluded.word_count,
         is_original = excluded.is_original,
         is_human_vetted = excluded.is_human_vetted,
         vetted_timestamp = excluded.vetted_timestamp,
         is_ai_generated = excluded.is_ai_generated`,
    )
    .bind(
      v.slug,
      v.zoom_level,
      v.content,
      v.word_count,
      v.is_original,
      v.is_human_vetted,
      v.vetted_timestamp,
      v.is_ai_generated,
    )
    .run();
}

export async function upsertEssay(db: D1Database, e: EssayRow): Promise<void> {
  await db
    .prepare(
      `INSERT INTO essays
        (slug, title, description, featured_image, timestamp, natural_zoom_level, is_ai_generated)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET
         title = excluded.title,
         description = excluded.description,
         featured_image = excluded.featured_image,
         timestamp = excluded.timestamp,
         natural_zoom_level = excluded.natural_zoom_level,
         is_ai_generated = excluded.is_ai_generated`,
    )
    .bind(
      e.slug,
      e.title,
      e.description,
      e.featured_image,
      e.timestamp,
      e.natural_zoom_level,
      e.is_ai_generated,
    )
    .run();
}
