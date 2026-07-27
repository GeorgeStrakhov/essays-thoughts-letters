# Telescopic Writings of George Strakhov

This is a simple minimal repo for my essays, letters and thoughts that can expand or contract based on your available reading time.

Live at [essays.georgestrakhov.com](https://essays.georgestrakhov.com). Runs on Cloudflare Workers (Hono + JSX) with the essay content in D1.

## Structure

- `essays/` - one directory per essay, containing:
  - `{slug}.md` - the original, hand-written version
  - Zoom variations: `{slug}.{zoom}.md` where zoom is `small`, `medium` or `large`
  - `img/` subfolder - images (.png, .jpg, or .svg)
- `toc.json` - the manifest: title, description, slug, timestamp, word counts per zoom level, and flags (`isDraft`, `isAIGenerated`)
- `src/` - the Worker:
  - `index.tsx` - Hono routes (home, essay pages, RSS, generation endpoints, 404)
  - `db.ts` - D1 queries; `llm.ts` - generation via OpenRouter; `markdown.ts` - rendering
  - `prompts.ts` - zoom level definitions and system prompts
  - `views/` - JSX pages
- `migrations/` - D1 schema (`essays` + `essay_versions` tables)
- `scripts/` - build and maintenance scripts (see below)
- `static/` - CSS and JS, copied into `public/` at build time (`public/` is generated, not committed)
- `CORPUS.md` - all human-written originals concatenated; used as the style reference when the LLM writes something new

The database is the source of truth for what the site serves. The markdown files are the source of truth for what goes into the database. Editing a `.md` does nothing until you re-seed.

## Adding an essay

1. Write it into `essays/{slug}/{slug}.md`.
2. `npm run update-toc` - scans `essays/` and adds any new directory to `toc.json`, inferring title, description, word count and natural zoom level. Existing entries keep their hand-edited fields; re-run it any time to refresh word counts. Add `"isDraft": true` by hand to keep something out of the live site.
3. `npm run build:corpus` - regenerates `CORPUS.md`.
4. `npm run db:seed:remote` - upserts `toc.json` + the original markdown into D1. Drafts are skipped.
5. `npm run deploy` - builds assets and ships the Worker.

## Local development

```bash
npm install
npm run db:migrate:local     # apply schema to the local D1
npm run db:seed:local        # load essays into the local D1
npm run dev                  # wrangler dev on :8787
```

Secrets live in `.dev.vars` locally and in `wrangler secret` in production: `OPENROUTER_API_KEY`, `RECAPTCHA_SECRET_KEY`, `RESEND_API_KEY`. Non-secret config (`BASE_URL`, `RECAPTCHA_SITE_KEY`, `ADMIN_EMAIL`, `FROM_EMAIL`) sits in `wrangler.toml`.

## Telescopic Reading

These essays are telescopic (inspired by TelescopicText.org), allowing readers to zoom in or out based on their current attention capacity and time availability.

### Zoom levels

- `small` (~200 words) - TLDR with bullets
- `medium` (~1000 words) - the basic argument
- `large` (3000+ words) - detailed exploration

Each essay has a *natural* zoom level: the one I actually wrote, inferred from its word count. That version is marked `isOriginal` and is the one served by default.

Longer versions add content and enhance the original by adding:
- Commentary from multiple perspectives
- Analysis from different viewpoints
- Related discussions and context

### Dynamic generation

If a reader asks for a zoom level that doesn't exist yet, the Worker:
1. Generates it with `anthropic/claude-opus-5-fast` via OpenRouter, using the original as input
2. Writes it into D1 so it persists and is served instantly from then on
3. Emails it to me (via Resend) so I can vet it, and if I like it, commit the markdown back into the repo

Generated versions are labelled on the page (AI-generated, and whether I've reviewed them yet). Whole essays written from a 404 are hidden on the home page behind a "show AI-generated essays" toggle.

### Extra fun for the 404 page

If the requested essay doesn't exist, the 404 page offers to write it on the spot, in my style, using `CORPUS.md` as reference. reCAPTCHA guards both generation endpoints against robot abuse.

# TODO:

- fix bug on showing "not yet generated" when it is
- when generating: add pre-check on validity of URLs when generating. otherwise llms invent urls. if not real url - clean it.
- add admin interface to approve, reject, regenerate, edit essays that were generated - and have programmatic github push behind the scenes, so vetted versions make it back into the repo without me copy-pasting from email
- add diagram generation with nano banana pro (need to define the style) - including when creating from 404
- add auto-listen generation with notebookLM - including when creating from 404
- `update-toc` always adds new essays as live; a `--draft` flag would be handy
