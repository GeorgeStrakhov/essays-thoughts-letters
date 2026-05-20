import type { FC, PropsWithChildren } from "hono/jsx";

interface LayoutProps {
  title: string;
  description?: string | null;
  featuredImage?: string | null;
}

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({
  title,
  description,
  featuredImage,
  children,
}) => (
  <html class="theme-light">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {featuredImage ? (
        <>
          <meta property="og:image" content={featuredImage} />
          <meta name="twitter:image" content={featuredImage} />
        </>
      ) : null}
      {description ? (
        <>
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      ) : null}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.css" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
      />
      <link rel="stylesheet" href="/static/gstyle.css" />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-HTRYV9WX95"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-HTRYV9WX95');`,
        }}
      />
    </head>
    <body>
      <button id="theme-toggle" class="theme-toggle no-print" aria-label="Toggle theme">
        <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>

      <section class="section">
        <div class="container is-max-desktop">
          <div class="content">
            {children}
            <hr class="footer-divider no-print" />
            <p class="footer-note no-print">
              On the off chance you'd like to subscribe to my writing, please feel free to{" "}
              <a href="https://x.com/notevenwrongg" target="_blank">subscribe on twitter</a> or use{" "}
              <a href="https://essays.georgestrakhov.com/feed.rss" target="_blank">this RSS feed</a>. Thank you.
            </p>
          </div>
        </div>
      </section>

      <script
        dangerouslySetInnerHTML={{
          __html: `
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  htmlEl.className = 'theme-' + savedTheme;
} else {
  htmlEl.className = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'theme-dark' : 'theme-light';
}
themeToggle.addEventListener('click', () => {
  const isDark = htmlEl.className === 'theme-dark';
  const newTheme = isDark ? 'light' : 'dark';
  htmlEl.className = 'theme-' + newTheme;
  localStorage.setItem('theme', newTheme);
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    htmlEl.className = e.matches ? 'theme-dark' : 'theme-light';
  }
});
const scrollThreshold = 100;
const homeButton = document.getElementById('home-button');
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY <= scrollThreshold) {
    themeToggle.style.opacity = '1';
    themeToggle.style.pointerEvents = 'auto';
    if (homeButton) { homeButton.style.opacity = '1'; homeButton.style.pointerEvents = 'auto'; }
  } else {
    themeToggle.style.opacity = '0';
    themeToggle.style.pointerEvents = 'none';
    if (homeButton) { homeButton.style.opacity = '0'; homeButton.style.pointerEvents = 'none'; }
  }
});
if (homeButton) {
  homeButton.addEventListener('click', () => { window.location.href = '/'; });
}
`,
        }}
      />
      <script src="/js/main.js"></script>
    </body>
  </html>
);
