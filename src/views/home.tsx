import type { FC } from "hono/jsx";
import { Layout } from "./layout.tsx";
import type { EssayRow } from "../db.ts";

interface HomeProps {
  essays: EssayRow[];
}

export const Home: FC<HomeProps> = ({ essays }) => (
  <Layout title="Essays. Thoughts. Letters.">
    <h1>
      <a href="https://georgestrakhov.com" style="text-decoration: none; color: inherit;">
        George Strakhov
      </a>
      's Telescopic Essays
    </h1>

    <div class="ai-essays-control no-print">
      <button class="zoom-close" aria-label="Hide AI essays info">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <p class="ai-essays-explanation">
        By default, only the certified human-written essays are shown here. But there are also some nice AI-generated essays that were written by George's well-educated robot doppelganger from 404 page links.{" "}
        <a href="#" class="toggle-all-ai-btn">Show AI-generated essays</a>.
      </p>
    </div>

    <div class="list essays-list">
      {essays.map((essay) => (
        <div class={`list-item${essay.is_ai_generated ? " ai-essay" : ""}`}>
          <a href={`${essay.slug}/`}>{essay.title}</a>
          {" "}[{essay.timestamp}]
          {essay.is_ai_generated ? (
            <span class="ai-generated-tag"> ~ written by my well-educated robocopy from 404 page</span>
          ) : null}
        </div>
      ))}
    </div>

    <hr />
    <h4>
      <i>Disclaimer: I don't necessarily agree with everything I write. Or my AI doppelganger.</i>
    </h4>
  </Layout>
);
