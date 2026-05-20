-- Essays table: one row per essay.
CREATE TABLE essays (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  featured_image TEXT,
  timestamp TEXT NOT NULL,
  natural_zoom_level TEXT NOT NULL,
  is_ai_generated INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_essays_timestamp ON essays(timestamp DESC);

-- Versions table: one row per (essay, zoom_level).
CREATE TABLE essay_versions (
  slug TEXT NOT NULL,
  zoom_level TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  is_original INTEGER NOT NULL DEFAULT 0,
  is_human_vetted INTEGER NOT NULL DEFAULT 0,
  vetted_timestamp TEXT,
  is_ai_generated INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (slug, zoom_level),
  FOREIGN KEY (slug) REFERENCES essays(slug) ON DELETE CASCADE
);
