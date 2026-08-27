# Mark Waldron - Software Developer Portfolio

[![Quality checks](https://github.com/markwaldron7string/portfolio-v2/actions/workflows/quality.yml/badge.svg)](https://github.com/markwaldron7string/portfolio-v2/actions/workflows/quality.yml)

My personal developer portfolio is a fast, accessible, single-page site built from scratch with vanilla HTML, CSS, and JavaScript. It features distinct light and dark visual themes with automated quality checks for performance, accessibility, SEO, and link integrity.

**Live:** [mark-waldron.com](https://www.mark-waldron.com/)

---

## About

I'm a software developer based in Louisville, Ohio, combining seven years of insurance experience with hands-on work across full-stack applications, AI-enabled automation, APIs, cloud deployment, and tested web software. I focus on turning real business problems into reliable, approachable products.

My projects include an Angular and ASP.NET Core application deployed across Vercel and Azure, insurance workflow tools with automated browser testing, an AI-enabled lead intelligence platform, and production websites built for real clients.

This repository contains the source for my portfolio. The site is intentionally dependency-free, with no framework or build step, keeping it lightweight and fast. Automated CI enforces the quality standards described below.

## Visual themes

The site includes two hand-crafted themes controlled by a navigation toggle:

**Dark mode (default):** A matrix-green terminal aesthetic with animated canvas rain, glowing accents, and a dark glassmorphic panel system.

**Light mode:** A layered atmospheric experience with a starfield fading into a dawn sky, animated clouds, a landscape photo strip, and underwater bubbles near the footer. Project cards and interactive elements use frosted-glass panels tuned specifically for the lighter palette.

## Tech stack

**Languages:** JavaScript · TypeScript · C# · SQL · HTML5 · CSS3

**Frontend:** React · Next.js · Angular · Redux Toolkit · Tailwind CSS · Three.js

**Backend and data:** .NET · ASP.NET Core · Node.js · Express · Entity Framework Core · PostgreSQL · SQLite · Firebase

**APIs and integrations:** REST APIs · OpenAI API · Google Places API · Stripe · Resend

**Testing and delivery:** Vitest · Jest · xUnit · Playwright · Cypress · GitHub Actions · Azure App Service · Vercel

## Project highlights

| Project                         | What it is                                                                                                                                                          | Stack                                               | Live                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| **Task Tracker**                | Full-stack task manager with an Angular PWA, ASP.NET Core API, EF Core persistence, offline synchronization, automated testing, and optional AI-assisted planning | Angular · TypeScript · C# · ASP.NET Core · Azure    | [↗](https://task-tracker-fullstack-nu.vercel.app/)        |
| **Lead Scraper**                | AI-enabled lead intelligence platform that processed over 7,000 businesses across 101 markets using external APIs, contact extraction, and data enrichment        | Next.js · OpenAI · Places API · Resend              | [↗](https://buyersagent-leadscraper.vercel.app/)           |
| **AP Workup Tool**              | Insurance workup calculators for driver experience and premium changes, with state-specific rules and CI-backed automated testing                                 | Angular · TypeScript · Vitest · Playwright          | [↗](https://ap-workup-angular.vercel.app/)                 |
| **LazyCat Trees**               | E-commerce storefront with configurable products, an interactive Three.js 3D builder, Stripe Checkout, inquiry handling, and automated tests                      | Next.js · TypeScript · Three.js · Stripe            | [↗](https://lazycat-trees.vercel.app/)                     |
| **Summarist Library**           | Book summary platform with Firebase authentication, Redux state management, audio playback, saved libraries, subscription gating, and automated tests             | Next.js · Redux Toolkit · Firebase · Jest · Cypress | [↗](https://advanced-virtual-internship-pied.vercel.app/) |
| **The Wicked Woods Equestrian** | Live client website for a horse riding and boarding business, with responsive layouts and integrated contact handling                                             | React · Next.js · Resend                            | [↗](https://www.thewickedwoodsec.com/)                     |
| **Skinstric**                   | AI-powered skincare analysis application with a refined, responsive guided flow                                                                                    | React · Next.js · Tailwind CSS                      | [↗](https://skinstric-app-tau.vercel.app/)                 |
| **DimiB Photography**           | Photography portfolio with gallery presentation, contact handling, and responsive image layouts                                                                   | HTML · CSS · JavaScript                             | [↗](https://www.dimibphoto.com/)                            |
| **Cryptogram**                  | Cryptocurrency dashboard with live market data, search, trend visualization, and interactive charts                                                               | React · REST APIs · Charts                          | [↗](https://cryptogram-six.vercel.app/)                    |

Additional project details and source repositories are available through the [live portfolio](https://www.mark-waldron.com/).

## Quality and CI

Every push and pull request runs automated quality checks through GitHub Actions using [`.github/workflows/quality.yml`](.github/workflows/quality.yml).

- **Lighthouse CI:** Audits Performance, Accessibility, Best Practices, and SEO. The workflow fails if any category falls below a score of 90, with thresholds defined in [`lighthouserc.json`](lighthouserc.json). Three runs are performed to reduce the effect of network variance.
- **Link checking:** [lychee](https://github.com/lycheeverse/lychee-action) scans links throughout the site and fails the workflow when it finds a dead link. A weekly scheduled run helps identify external project demos that become unavailable.

The site is built to meet these standards through semantic landmarks, a proper heading hierarchy, WCAG AA color contrast, optimized image formats, explicit image dimensions, and responsive layouts.

## Running locally

No build step is required. Clone the repository and serve the directory using any static file server:

```bash
git clone https://github.com/markwaldron7string/portfolio-v2.git
cd portfolio-v2

# Choose one:
npx serve .
python3 -m http.server 8000
```

Open the local URL printed in the terminal, such as `http://localhost:8000`.

You can also open `index.html` directly in a browser, although serving the directory more closely reflects the production environment.

## Project structure

```text
portfolio-v2/
├── index.html                 # Markup and page structure
├── styles.css                 # Styles for both visual themes
├── main.js                    # Theme logic, animations, and contact modal
├── assets/                    # Project screenshots and site images
├── profilepic.jpg             # Profile image fallback
├── profilepic.webp            # Optimized profile image
├── lighthouserc.json          # Lighthouse CI score thresholds
└── .github/
    └── workflows/
        └── quality.yml        # Lighthouse and link-checking workflow
```

## Contact

- **Email:** [contact@mark-waldron.com](mailto:contact@mark-waldron.com)
- **LinkedIn:** [mark-waldron](https://www.linkedin.com/in/mark-waldron-449940158/)
- **GitHub:** [@markwaldron7string](https://github.com/markwaldron7string)

Open to software engineering opportunities involving full-stack applications, frontend development, workflow automation, and AI-enabled products.

---

© 2026 Mark Waldron · Designed and built in Louisville, Ohio
