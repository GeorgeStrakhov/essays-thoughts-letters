import type { FC } from "hono/jsx";
import { raw } from "hono/html";
import { Layout } from "./layout.tsx";
import { ZOOM_LEVELS, type ZoomLevel } from "../prompts.ts";
import type { EssayRow, EssayVersionRow } from "../db.ts";
import { formatTimestampLong } from "../markdown.ts";

interface EssayPageProps {
  essay: EssayRow;
  versions: Partial<Record<ZoomLevel, EssayVersionRow>>;
  zoomLevel: ZoomLevel;
  renderedHtml: string;
  isGenerating: boolean;
  recaptchaSiteKey: string;
}

export const EssayPage: FC<EssayPageProps> = ({
  essay,
  versions,
  zoomLevel,
  renderedHtml,
  isGenerating,
  recaptchaSiteKey,
}) => {
  const currentVersion = versions[zoomLevel];
  const currentZoom = ZOOM_LEVELS[zoomLevel];
  const naturalZoomLevel = essay.natural_zoom_level;

  return (
    <Layout
      title={essay.title}
      description={essay.description}
      featuredImage={essay.featured_image}
    >
      <button id="home-button" class="home-button no-print" aria-label="Go to homepage">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </button>

      <div class="zoom-control no-print">
        <button class="zoom-close" aria-label="Hide zoom controls">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <p class="zoom-explanation">
          This essay is <a href="/telescopic-content/">telescopic</a>. It can shrink or expand, depending on how much attention you are willing to give. <br />
          {isGenerating ? (
            <div class="version-info">Generating {currentZoom.name} version...</div>
          ) : currentVersion ? (
            <>
              {currentVersion.is_original
                ? `This is the original version (${currentVersion.word_count} words).`
                : currentVersion.is_human_vetted
                ? `This is an AI-generated, human-reviewed version (${currentVersion.word_count} words).`
                : `This is an AI-generated version (${currentVersion.word_count} words, not yet human-reviewed).`}
              {" "}<span><a href="#" class="show-sizes-link">Show other sizes</a>.</span>
            </>
          ) : (
            <div class="version-info">{currentZoom.name} version not yet generated.</div>
          )}
        </p>
        <div class="zoom-stuff hidden">
          <div class="zoom-slider">
            {(Object.entries(ZOOM_LEVELS) as [ZoomLevel, typeof ZOOM_LEVELS[ZoomLevel]][]).map(([key, cfg]) => {
              const version = versions[key];
              const classes = [
                "zoom-level",
                key === zoomLevel ? "active" : "",
                key === naturalZoomLevel ? "natural" : "",
                version?.is_original ? "original" : "",
                !version ? "not-generated" : "",
                version && !version.is_human_vetted ? "ai" : "",
              ]
                .filter(Boolean)
                .join(" ");
              const titleText = version
                ? `${cfg.description} (${version.word_count} words)` +
                  (version.is_original
                    ? essay.is_ai_generated
                      ? " - AI-Generated Original"
                      : " - Original Version"
                    : version.is_human_vetted
                    ? " - Human-Reviewed Version"
                    : " - AI-Generated")
                : cfg.description;
              return (
                <a
                  href={version ? `?zoom=${key}` : "#"}
                  class={classes}
                  data-zoom={key}
                  data-needs-generation={version ? undefined : "true"}
                  title={titleText}
                >
                  {cfg.name}
                  {version?.is_human_vetted ? <span class="status"></span> : null}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <h1 class="essay-title">{essay.title}</h1>
      {essay.is_ai_generated ? (
        <div class="ai-generated-notice">
          This essay was written by a well-educated robot from the 404 page. There was no essay with this title, but somebody (was it you?) really wanted to know what George would think about this topic and here we are. A robot wrote this based on George's other writings. Don't take too seriously. But then again, why would you take seriously anything George writes?
        </div>
      ) : null}

      {raw(renderedHtml)}

      {essay.timestamp ? (
        <div class="essay-date">
          <hr />
          Original published: {formatTimestampLong(essay.timestamp)}
        </div>
      ) : null}

      <div id="captcha-modal" class="modal">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="box" style="text-align: center;">
            <h2>Human Verification Required</h2>
            <p>Before generating a new version, please verify that you're human.</p>
            <div class="captcha-container" id="captcha-container"></div>
            <p class="is-size-7">Funny how we need to verify you're human before we can get a robot to write for you. Isn't it?</p>
          </div>
        </div>
        <button class="modal-close is-large" aria-label="close"></button>
      </div>

      {isGenerating ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
function checkVersion() {
  fetch('/${essay.slug}/check-version?zoom=${zoomLevel}')
    .then(r => r.json())
    .then(data => { if (data.exists) window.location.reload(); })
    .catch(console.error);
}
const pollInterval = setInterval(checkVersion, 2000);
setTimeout(() => {
  clearInterval(pollInterval);
  const generating = document.querySelector('.generating');
  if (generating) {
    generating.innerHTML = '<h2>Taking longer than expected...</h2><p>Please refresh the page manually to check if the version is ready.</p>';
  }
}, 180000);
`,
          }}
        />
      ) : (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `
document.addEventListener('DOMContentLoaded', function() {
  window.onRecaptchaLoad = function() {
    grecaptcha.render('captcha-container', {
      'sitekey': '${recaptchaSiteKey}',
      'callback': onCaptchaSuccess,
      'expired-callback': onCaptchaExpired
    });
  };
  const modal = document.getElementById('captcha-modal');
  let pendingZoomLevel = null;
  document.querySelectorAll('.zoom-level[data-needs-generation="true"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      pendingZoomLevel = this.getAttribute('data-zoom');
      modal.classList.add('is-active');
      grecaptcha.reset();
    });
  });
  document.querySelector('.modal-close').addEventListener('click', function() {
    modal.classList.remove('is-active');
    pendingZoomLevel = null;
  });
  document.querySelector('.modal-background').addEventListener('click', function() {
    modal.classList.remove('is-active');
    pendingZoomLevel = null;
  });
  async function onCaptchaSuccess(token) {
    if (!pendingZoomLevel) return;
    try {
      const response = await fetch('/${essay.slug}/generate-version', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captchaToken: token, zoomLevel: pendingZoomLevel })
      });
      if (response.ok) {
        window.location.href = '?zoom=' + pendingZoomLevel + '&generating=true';
      } else {
        throw new Error('Generation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start generation. Please try again.');
      modal.classList.remove('is-active');
      grecaptcha.reset();
    }
  }
  function onCaptchaExpired() { pendingZoomLevel = null; }
});
`,
            }}
          />
          <script
            src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
            async
            defer
          ></script>
        </>
      )}
    </Layout>
  );
};
