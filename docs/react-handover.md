# React Migration Handover — Craftsoft Website

Generated: 2026-01-28

Purpose: a concise handover for an engineer to rebuild the site in React (one SPA with subdomain apps or monorepo). Includes sitemap, subdomains, design tokens (colors/spacing), typography, assets, important scripts, and migration notes.

---

## 1) Project overview
- Repo root contains static site built for Netlify/Cloudflare Pages. Cloudflare Worker `_worker.js` handles routing for subdomains.
- Main website: `index.html` and directories under workspace root (courses, about, contact, portfolio, privacy-policy, terms-of-service, etc.).
- Subdomain apps live under `acs_subdomains/`:
  - `acs_students/` — student portal (dashboard, courses, assignments, materials, profile, payments, 404)
  - `acs_admin/` — admin portal (dashboard, students-clients, courses-services, payments, records, settings, 404)
  - `acs_signup/` — signup pages
- Assets: `assets/` contains `css/`, `js/`, `images/`, `components/` and more.

## 2) Sitemap (pages with `index.html` scanned)
Top-level pages (site root)
- /
- /about/
- /contact/
- /courses/ (and per-course pages under `/courses/*/index.html` — e.g., /courses/react/)
- /portfolio/
- /privacy-policy/
- /terms-of-service/
- /verify/
- Numerous course pages in `/courses/*`

Subdomains (folder = logical host)
- admin.craftsoft.co.in → `acs_subdomains/acs_admin/` (many subpages)
- acs-student.craftsoft.co.in → `acs_subdomains/acs_students/`
- signup.craftsoft.co.in → `acs_subdomains/acs_signup/`

Note: full list of scanned `index.html` files is available in the repo; include if needed.

## 3) Components & Shared assets
- Shared component folder: `assets/components/` (footer, logo-signature, quiz, testimonials, custom-select, etc.)
- Global CSS entry: `assets/css/master.css` which imports modular `assets/css/base/*`, `components/*`, `sections/*`, `utilities/*`.
- Global JS: `assets/js/main.js` (initializes navbar, animations, `initFAQ`, chat widget, etc.), plus `assets/js/main.min.js` for production.

Important files to preserve behavior during migration:
- `assets/js/main.js` (logic for animations, initFAQ, chat widget, mobile menu)
- `assets/js/supabase-website-config.js` (Supabase configuration — used by admin/student portals)
- `_worker.js` — routing logic (review for server-side routing equivalence)
- `netlify*.toml` — contains Netlify routing rules and redirects

## 4) Design tokens (colors / spacing / radii / shadows)
Primary color palette (from `assets/css/base/variables.css`):
- --primary-50: #edf6fb
- --primary-100: #d4eaf5
- --primary-200: #a9d5eb
- --primary-300: #7ec0e1
- --primary-400: #53abd7
- --primary-500: #2896cd  (brand primary)
- --primary-600: #1a7eb0
- --primary-700: #156691
- --primary-800: #104e72
- --primary-900: #0b3653

Accent & gradients
- --accent-gradient: linear-gradient(135deg, #2896cd 0%, #6C5CE7 100%)
- --accent-gradient-2: linear-gradient(135deg, #00B894 0%, #00CEC9 100%)

Neutrals / grayscale
- --white: #ffffff
- --gray-100: #f1f5f9
- --gray-200: #e2e8f0
- --gray-300: #cbd5e1
- --gray-400: #94a3b8
- --gray-500: #64748b
- --gray-600: #475569
- --gray-700: #334155
- --gray-800: #1e293b
- --gray-900: #0f172a

Spacing scale (CSS variables)
- --spacing-xs: 0.25rem
- --spacing-sm: 0.5rem
- --spacing-md: 1rem
- --spacing-lg: 1.5rem
- --spacing-xl: 2rem
- --spacing-2xl: 3rem
- --spacing-3xl: 4rem
- --spacing-4xl: 6rem
- --spacing-5xl: 8rem

Border radius / shadows
- Radii: --radius-lg = 0.75rem etc.
- Shadows: --shadow-sm, --shadow-md, --shadow-lg... (see `variables.css`)

## 5) Typography
- Font families loaded via Google Fonts in `index.html` and other pages:
  - `Italianno` (display/branding)
  - `Inter` (body/secondary)
  - `Outfit` (primary site UI)
- In `variables.css`:
  - --font-primary: 'Outfit', sans-serif;
  - --font-secondary: 'Inter', sans-serif;
- `base/typography.css` contains rules for headings, body sizes, line-heights and responsive scales.

## 6) Scripts, behavior & integrations
- Supabase: `assets/js/supabase-website-config.js` — contains project URL/keys used by admin/student portals.
- Main site JS: `assets/js/main.js` — initializes interactivity; it expects `.faq-item` in DOM and runs `initFAQ()` on DOMContentLoaded.
- Worker: `_worker.js` handles subdomain routing and asset fetch logic. Important to replicate server-side routing, or use Cloudflare Pages/Workers in new deployment.
- Chat widget: custom chat under `assets/components/footer` or `assets/components/footer/footer.js` and `chat-widget` markup — replicate chat triggers.

## 7) Images & media
- `assets/images/` contains logos, OG image and many images used in pages and courses. Large images may need optimization for React build.

## 8) Netlify / Deploy notes
- Netlify files: `netlify.toml`, `netlify-admin.toml`, `netlify-main.toml`, `netlify-students.toml` contain rewrite/redirect rules used previously — copy rules into new hosting configuration or Hand off to DevOps.
- Cloudflare: repo previously used Cloudflare Worker for routing; if moving to React app hosted on Cloudflare Pages, port `_worker.js` logic to handle SPA routes and subdomain mapping.

## 9) Suggested React project structure
Option A — Monorepo (recommended for shared assets):
- packages/
  - web/ (main public site) — React app using React Router for pages
  - admin/ (admin portal) — React app or Next.js app
  - students/ (student portal) — React app
  - shared/ (UI components, design tokens)

Option B — Single SPA with route prefixes and subdomain-aware routing (less isolated):
- src/
  - components/ (Header, Footer, FAQ, Testimonials, etc.)
  - pages/ (Home, About, Courses, CourseDetail...)
  - subdomains/admin/ (admin routes) or mount admin on admin subdomain via separate deployment
  - utils/ (supabase client, API wrappers)
  - styles/ (design-tokens.css or CSS-in-JS theme)

Design tokens: extract `:root` variables into a single `tokens.css` or a JavaScript theme object for styled-components / emotion / tailwind config.

Routing mapping (example)
- `/` -> `Home` component
- `/courses/:slug` -> `CourseDetail`
- Admin app: `/` on admin.craftsoft.co.in -> `AdminDashboard`

## 10) Migration checklist (practical)
1. Create feature repo or monorepo and add `design-tokens.css` (copy `variables.css`).
2. Build shared component library (Header, Footer, Card, FAQ, Testimonial).
3. Implement routing and convert static pages to React pages (start with `Home` and `Courses`).
4. Migrate `main.js` behaviors incrementally into React components/hooks (FAQ accordion, animations using IntersectionObserver, chat widget, etc.).
5. Integrate Supabase config securely (use environment variables; do NOT commit service keys).
6. Setup preview deploys (Netlify/Cloudflare Pages) per branch.
7. Port `_worker.js` rules or reimplement redirects in hosting platform.

## 11) Files/paths to hand to React dev (high-priority)
- `index.html` (reference markup and SEO tags)
- `assets/css/base/variables.css` (design tokens)
- `assets/css/base/typography.css` (type scale)
- `assets/components/*` (logo-signature, footer, testimonials, quiz, custom-select)
- `assets/js/main.js` (behavior reference)
- `assets/js/supabase-website-config.js` (sensitive values must be moved to env vars)
- `_worker.js` and `netlify*.toml`
- `assets/images/` (copy of media assets)

## 12) Developer notes & gotchas
- The site uses a mixture of static HTML with JS that expects DOM structure at load-time. When rendering dynamic data, ensure lifecycle hooks run after content is mounted (FAQ and other components need handlers attached).
- Supabase keys should be replaced with environment variables for builds; do not commit production keys.
- Image paths are relative; React build may require importing assets or placing them in `public/`.
- There are multiple minified `main.min.js` copies in subdomain folders — they may duplicate logic. Confirm when consolidating.

## 13) Next actions I can perform for you
- Generate `design-tokens.json` and a small React starter that imports tokens and renders a simple `FAQ` component wired to `faq.json`.
- Create a feature branch and scaffold a monorepo with `web`, `admin`, and `shared` packages.
- Export a full list of scanned pages and assets as CSV.

---

If you want, I'll now commit this `docs/react-handover.md` and push to `main` so you can hand it to the React developer. Reply "commit handover" to proceed.
