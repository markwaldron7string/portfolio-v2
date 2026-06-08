# Mark Waldron - Developer Portfolio

[![Quality checks](https://github.com/markwaldron7string/portfolio-v2/actions/workflows/quality.yml/badge.svg)](https://github.com/markwaldron7string/portfolio-v2/actions/workflows/quality.yml)

My personal portfolio - a fast, accessible, single-page site built from scratch with vanilla HTML, CSS, and JavaScript.

**Live:** [mark-waldron.com](https://www.mark-waldron.com/)

---

## About

I'm a frontend developer based in Cheyenne, WY, focused on React, clean UI, and real-world projects that feel fast, clear, and polished. I started my coding journey through Frontend Simplified, building a foundation in HTML, CSS, JavaScript, and React, and have since shipped projects spanning client tools, AI product flows, e-commerce, and marketing sites.

This repository is the source for my portfolio site itself. It's intentionally dependency-free - no framework, no build step - so the site stays small and loads instantly, while the quality bar is enforced automatically in CI (see below).

## Tech stack

**This site:** HTML5 · CSS3 · vanilla JavaScript · [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) · deployed on [Vercel](https://vercel.com/)

**Used across my projects:** JavaScript · TypeScript · React · Next.js · Node.js · Tailwind CSS · Sass · Firebase · REST APIs · Git / GitHub · Figma

## Featured projects

| Project | What it is | Stack | Live |
|---|---|---|---|
| **Lead Scraper** | Full-stack lead-generation dashboard combining Google Places data, AI contact extraction, ABN matching, and enrichment | Next.js · OpenAI · Places API · Resend | [↗](https://buyersagent-leadscraper.vercel.app/) |
| **Skinstric** | AI-powered skincare analysis app with a refined, responsive guided flow | React · Next.js · Tailwind | [↗](https://skinstric-app-tau.vercel.app/) |
| **The Wicked Woods Equestrian** | Marketing site for a horse riding and boarding business | React · Next.js · Resend | [↗](https://www.thewickedwoodsec.com/) |
| **DimiB Photography** | Photography portfolio with gallery presentation and responsive image layouts | HTML · CSS · JavaScript | [↗](https://www.dimibphoto.com/) |
| **LazyCat Trees** | Cat-tree storefront with product browsing, cart, and checkout | Next.js · Tailwind · Stripe | [↗](https://lazycat-trees.vercel.app/) |
| **Summarist** | Book-summary library with auth, dynamic routing, and subscription logic | React · Firebase · API | [↗](https://advanced-virtual-internship-pied.vercel.app/) |
| **Cryptogram** | Cryptocurrency dashboard with live market data and interactive charts | React · REST APIs · Charts | [↗](https://cryptogram-six.vercel.app/) |
| **Ultraverse** | NFT marketplace landing experience with animation and responsive sections | React · APIs · AOS | [↗](https://mark-internship.vercel.app/) |

## Quality & CI

Every push runs an automated quality gate via GitHub Actions ([`.github/workflows/quality.yml`](.github/workflows/quality.yml)):

- **Lighthouse CI** - audits the live site and fails the build if Performance, Accessibility, Best Practices, or SEO drops below a 90 score (thresholds in [`lighthouserc.json`](lighthouserc.json)). Runs are taken as a median of multiple passes to smooth out network variance.
- **Link checking** - [lychee](https://github.com/lycheeverse/lychee-action) scans every link in the HTML, including the external project demos, and fails on any dead link. A weekly scheduled run catches demos that go down over time.

The site is built to clear these gates honestly: semantic landmarks, a proper heading hierarchy, WCAG AA color contrast, a `<picture>` element serving an optimized WebP hero image with a JPEG fallback, and explicit image dimensions to keep layout shift near zero.

## Running locally

No build step required - it's a static site. Clone and serve the folder with anything that serves static files:

```bash
git clone https://github.com/markwaldron7string/portfolio-v2.git
cd portfolio-v2

# pick one:
npx serve .                 # Node
python3 -m http.server 8000 # Python
```

Then open the printed local URL (e.g. `http://localhost:8000`). You can also just open `index.html` directly in a browser, though serving it is closer to production.

## Project structure

```
portfolio-v2/
├── index.html                 # the entire site
├── assets/                    # project screenshots and images
├── profilepic.jpg             # hero image (JPEG fallback)
├── profilepic.webp            # hero image (optimized, served first)
├── lighthouserc.json          # Lighthouse CI score thresholds
└── .github/
    └── workflows/
        └── quality.yml         # Lighthouse + link-check CI
```

## Contact

- **Email:** [contact@mark-waldron.com](mailto:contact@mark-waldron.com)
- **LinkedIn:** [mark-waldron](https://www.linkedin.com/in/mark-waldron-449940158/)
- **GitHub:** [@markwaldron7string](https://github.com/markwaldron7string)

Open to frontend roles, freelance projects, and collaborations involving React or anything UI-focused.

---

© 2026 Mark Waldron · designed & built in Cheyenne, WY