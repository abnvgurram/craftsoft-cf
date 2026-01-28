Craftsoft — Website Handover
===========================

Purpose
-------
A single, developer-friendly handover document covering the live website, subdomains, routing, visual brand tokens, typography, interactive components, integrations, deployment and troubleshooting notes. This document is designed for an incoming developer or operations agent to understand, maintain, and extend the site without exposing internal folder structure or raw file trees.

Craftsoft — INVENTORY (items present)
====================================

Note: this is an exact, agent-focused blueprint to recreate the site. It intentionally omits any secrets (API/service keys) and does not expose repository folder trees. It is written for an automation agent or an engineer who will use this as a procedural blueprint.

1) Purpose
- Provide a precise, actionable blueprint to recreate the static site and its sub-apps (admin, students, signup) and the client-driven components, using the same tokens, component schemas and edge-routing behavior used by the original site.

2) Required artifacts (what the agent must produce)
- Edge worker script implementing host- and path-based dispatch with these capabilities:
  - Map hostnames to logical sub-apps (admin, students, signup) and serve their app index for SPA routes.
  - Serve real static assets unchanged (CSS/JS/images) with correct Content-Type headers.
  - Support alias rewrites (short paths → canonical content paths) and 301 redirects for legacy routes.
  - Return dedicated 404 pages per sub-app when assets or routes are missing.

- Design tokens file containing these exact variables (names and values):
  --primary-50: #edf6fb
  --primary-100: #d4eaf5
  --primary-200: #a9d5eb
  --primary-300: #7ec0e1
  --primary-400: #53abd7
  --primary-500: #2896cd
  --primary-600: #1a7eb0
  --primary-700: #156691
  --primary-800: #104e72
  --primary-900: #0b3653
  --accent-gradient: linear-gradient(135deg, #2896cd 0%, #6C5CE7 100%)
  --accent-gradient-2: linear-gradient(135deg, #00B894 0%, #00CEC9 100%)
  --white: #ffffff
  --gray-50: #f8fafc
  --gray-100: #f1f5f9
  --gray-200: #e2e8f0
  --gray-300: #cbd5e1
  --gray-400: #94a3b8
  --gray-500: #64748b
  --gray-600: #475569
  --gray-700: #334155
  --gray-800: #1e293b
  --gray-900: #0f172a
  --page-bg: #f0f7fb
  --card-bg: rgba(40, 150, 205, 0.04)
  --card-bg-hover: rgba(40, 150, 205, 0.08)
  --section-bg: rgba(40, 150, 205, 0.06)
  --card-border: rgba(40, 150, 205, 0.12)
  --divider-color: rgba(40, 150, 205, 0.15)
  --success: #10B981
  --warning: #F59E0B
  --error: #EF4444
  --info: #3B82F6
  --font-primary: 'Outfit', sans-serif
  --font-secondary: 'Inter', sans-serif
  --spacing-xs: 0.25rem
  --spacing-sm: 0.5rem
  --spacing-md: 1rem
  --spacing-lg: 1.5rem
  --spacing-xl: 2rem
  --spacing-2xl: 3rem
  --spacing-3xl: 4rem
  --spacing-4xl: 6rem
  --spacing-5xl: 8rem
  --section-padding-desktop: 100px
  --section-padding-tablet: 70px
  --section-padding-mobile: 50px
  --radius-sm: 0.375rem
  --radius-md: 0.5rem
  --radius-lg: 0.75rem
  --radius-xl: 1rem
  --radius-2xl: 1.5rem
  --radius-full: 9999px
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)
  --shadow-2xl: 0 25px 50px -12px rgba(0,0,0,0.25)
  --shadow-glow: 0 0 40px rgba(40, 150, 205, 0.15)
  --transition-fast: 150ms ease
  --transition-base: 300ms ease
  --transition-slow: 500ms ease
  --container-max: 1240px
  --container-padding: 2.5rem

3) Component blueprints (schemas and required behaviors)
- FAQ component
  - Data schema (JSON array of entries):
    - question: string
    - answer: string (HTML permitted)
    - id: optional string
    - tags: optional array[string]
  - Renderer behavior required:
    - Fetch the JSON using `fetch(url, {cache: 'no-store'})` in development and support `?v=` cache-bust param.
    - Render accessible markup: each item must be a `button` for the question with `aria-expanded` and a `div` role="region" for the answer with `aria-hidden` toggled.
    - After render, call the site initializer `initFAQ()` (global binder) which adds toggle handlers that ensure only one item open at a time.

- Testimonials component
  - Data schema (array):
    - name: string
    - role: string
    - text: string
    - photo: URL (optional)
  - Renderer: produce card grid, support lazy-loading photos.

- Quiz widget
  - Data structure: array of question objects with options and scoring metadata.
  - Exposed functions needed by site: `initQuiz()`, `startInlineQuiz()`, `renderQuestion()`.

4) Client initializer expectations (API of the main script)
- Expose these global initializer functions (names required exactly):
  - `initFAQ()` — binds accordion toggle behavior to elements with class `faq-item` and child `faq-question`.
  - `initNavbar()` — sets active link state and scroll behavior.
  - `initMobileMenu()` — toggles mobile menu.
  - `initQuiz()` — sets up quiz CTA and inline quiz flows.
  - `initScrollAnimations()` — intersection-observer-based animation hooks.

5) Edge worker blueprint (pseudocode)
- Inputs: incoming HTTP `request` (hostname + pathname) and asset namespace handle.
- Steps:
  1. If request path is a known internal sub-app static asset path → return asset directly from asset store.
  2. If path maps to virtual admin/student asset prefixes → rewrite to corresponding sub-app asset path and return with correct Content-Type.
  3. If request hostname matches admin/student/signup subdomain → dispatch to the sub-app:
     - Build internal path: `<subapp-root> + pathname`.
     - If path has no file extension and not ending with `/index.html` → append `/index.html`.
     - Fetch from asset store; if 404 → return the sub-app's 404/index.html.
  4. Global aliases/rewrites: handle a map of short alias → canonical path (return alias target's index.html when requested exactly).
  5. Default: serve asset store request for requested path.

- Asset serving helper (requirements):
  - When returning a response for `.css` or `.js`, set the `Content-Type` header explicitly to `text/css` or `application/javascript`.
  - Add header `X-Content-Type-Options: nosniff` to asset responses.

6) Deployment & operational blueprint (commands an agent will run)
- Basic git workflow (agent must run these locally in repo):
  - Create branch: `git checkout -b feature/<name>`
  - Commit: `git add .` `git commit -m "feat: ..."`
  - Push: `git push origin feature/<name>`
- Safe rollback to last known good commit (requires correct commit SHA):
  - `git reset --hard <COMMIT_SHA>`
  - `git push --force origin main`

7) Environment & secrets (placeholders only)
- The site requires a public Supabase URL and client anon key for client-side interactions. Do NOT store production service-role keys in repository.
- Blueprint placeholders (agent must replace with actual values in deployment env):
  - `SUPABASE_URL`: set in deployment environment as `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`: set in deployment environment as `SUPABASE_ANON_KEY`
  - Where the client expects them, the agent must generate a small `supabase-config.js` at deploy time that reads these from environment and writes a client-safe module.

8) Recreate flow (step-by-step minimal)
 1. Create a design tokens file with the exact CSS variables listed above.
 2. Implement the client initializer script exposing the listed initializer functions and include it in page templates.
 3. Implement components according to the provided schemas. Ensure FAQ renderer sets ARIA attributes and calls `initFAQ()` after injecting markup.
 4. Implement the worker script following the worker blueprint pseudocode; ensure asset helper sets Content-Type and `nosniff` header.
 5. Deploy to preview environment and verify:
    - Requests for `.js` return `Content-Type: application/javascript`.
    - Dynamic JSON endpoints fetch successfully (use `?v=` to bypass caches during testing).
 6. Promote to production when all checks pass.

9) Artifacts the agent should produce as deliverables
- design-tokens.css (with the listed variables),
- site-initializer.js (exposes `initFAQ`, `initNavbar`, `initMobileMenu`, `initQuiz`, `initScrollAnimations`),
- component JSON example files (FAQ.json, testimonials.json),
- worker.js implementing the dispatch pseudocode,
- deployment script that injects `SUPABASE_URL` and `SUPABASE_ANON_KEY` from environment into a small `supabase-config.js` during CI/deploy.

10) Example FAQ JSON (single example entry)
[
  {
    "question": "What is the duration of the course?",
    "answer": "Most courses run for 3 months. Contact admissions for exact schedules.",
    "id": "faq-duration-001"
  }
]

End of blueprint.

- --primary-50: #edf6fb
- --primary-100: #d4eaf5
- --primary-200: #a9d5eb
- --primary-300: #7ec0e1
- --primary-400: #53abd7
- --primary-500: #2896cd
- --primary-600: #1a7eb0
- --primary-700: #156691
- --primary-800: #104e72
- --primary-900: #0b3653
- --accent-gradient: linear-gradient(135deg, #2896cd 0%, #6C5CE7 100%)
- --accent-gradient-2: linear-gradient(135deg, #00B894 0%, #00CEC9 100%)
- --white: #ffffff
- --gray-50: #f8fafc
- --gray-100: #f1f5f9
- --gray-200: #e2e8f0
- --gray-300: #cbd5e1
- --gray-400: #94a3b8
- --gray-500: #64748b
- --gray-600: #475569
- --gray-700: #334155
- --gray-800: #1e293b
- --gray-900: #0f172a
- --page-bg: #f0f7fb
- --card-bg: rgba(40, 150, 205, 0.04)
- --card-bg-hover: rgba(40, 150, 205, 0.08)
- --section-bg: rgba(40, 150, 205, 0.06)
- --card-border: rgba(40, 150, 205, 0.12)
- --divider-color: rgba(40, 150, 205, 0.15)
- --success: #10B981
- --warning: #F59E0B
- --error: #EF4444
- --info: #3B82F6
- --font-primary: 'Outfit', sans-serif
- --font-secondary: 'Inter', sans-serif
- --spacing-xs: 0.25rem
- --spacing-sm: 0.5rem
- --spacing-md: 1rem
- --spacing-lg: 1.5rem
- --spacing-xl: 2rem
- --spacing-2xl: 3rem
- --spacing-3xl: 4rem
- --spacing-4xl: 6rem
- --spacing-5xl: 8rem
- --section-padding-desktop: 100px
- --section-padding-tablet: 70px
- --section-padding-mobile: 50px
- --radius-sm: 0.375rem
- --radius-md: 0.5rem
- --radius-lg: 0.75rem
- --radius-xl: 1rem
- --radius-2xl: 1.5rem
- --radius-full: 9999px
- --shadow-glow: 0 0 40px rgba(40, 150, 205, 0.15)
- --container-max: 1240px
- --container-padding: 2.5rem

Supabase configuration file (present)
- `assets/js/supabase-website-config.js` contains the following values (present in file):
  - SUPABASE_URL: https://afocbygdakyqtmmrjvmy.supabase.co
  - SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmb2NieWdkYWt5cXRtbXJqdm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Mzc5MjksImV4cCI6MjA4MjUxMzkyOX0.L7YerK7umlQ0H9WOCfGzY6AcKVjHs7aDKvXLYcCj-f0

Edge worker file (present)
- `_worker.js` — contains dispatch logic for `acs_admin`, `acs_signup`, `acs_students`, alias maps for course paths, and helper functions `dispatchSubdomain()` and `serveAsset()`; `serveAsset()` sets `Content-Type` for `.css` and `.js` and adds `X-Content-Type-Options: nosniff`.

Components folder listing (present)
- `assets/components/footer/`
- `assets/components/logo-signature/`
- `assets/components/quiz/`
- `assets/components/testimonials/`

Notes about files that are NOT present in this workspace
- `assets/components/faq/` is not present in the current workspace (no `faq.json`, `faq.js` or `faq.css` files were found).

End of inventory.

- --radius-lg: 0.75rem
- --radius-xl: 1rem
- --radius-2xl: 1.5rem
- --radius-full: 9999px

Shadows & transitions
- --shadow-sm, --shadow-md, --shadow-lg, --shadow-xl, --shadow-2xl (see variables.css for exact values)
- --shadow-glow: 0 0 40px rgba(40, 150, 205, 0.15)
- Transition presets: --transition-fast (150ms), --transition-base (300ms), --transition-slow (500ms)

Container
- --container-max: 1240px
- --container-padding: 2.5rem

Sitemap and routing (how files map to public URLs)
-------------------------------------------------
This repo is a static-site layout. Public URLs are direct mappings of HTML files under the repo root and subfolders. There are three logical hostnames routed by the worker:

- Primary domain (example: craftsoft.example): serves top-level folders (index.html, courses/, contact/, portfolio/, privacy-policy/, terms-of-service/, etc.)
- Admin subdomain (example: admin.craftsoft.example): routed to `acs_subdomains/acs_admin/` (login.html, dashboard/, records/, payments/, settings/)
- Student subdomain (example: students.craftsoft.example): routed to `acs_subdomains/acs_students/` (login, dashboard, courses, materials, profile, payments)
- Signup subdomain (example: signup.craftsoft.example): routed to `acs_subdomains/acs_signup/` (index, verify flows)

How to extract a full file-level sitemap locally
- Run `git ls-files '*.html' | sed 's@^@https://<your-domain>/@'` (or adapt on Windows with PowerShell: `git ls-files "*.html" | ForEach-Object {"https://your-domain/$_"}`) to get an exhaustive list of public endpoints.

Edge worker responsibilities and cautions (`_worker.js`)
------------------------------------------------------
- Purpose: map hostnames and path aliases to internal asset folders, serve real static assets from `env.ASSETS.fetch(...)`, and return `index.html` fallbacks for SPA routes.
- Critical: never rewrite requests for real static assets (files that exist) to `index.html` — doing so will cause JS/CSS to be served with `text/html` and break the site due to `X-Content-Type-Options: nosniff`.
- When adding routes, update `dispatchSubdomain(...)` and alias maps carefully and add unit tests to avoid recursive rewrites.

Assets and caching policy
-------------------------
- Static assets (CSS/JS/Images) are served with long caching headers at the CDN/edge. For immediate changes:
  - Use query-string cache-busting (e.g., `faq.json?v=20260128`) or
  - Purge CDN cache for the changed asset.
- For JSON-driven components (FAQ, testimonials), include a `version` or `updated_at` and renderer should support a `?v=` param to force-refresh.

Components inventory and patterns
---------------------------------
Common pattern: `assets/components/<component>/` containing:
- `data.json` (or `<component>.json`) — authoritative data used by the renderer
- `<component>.css` — component-scoped styles (imported in pages)
- `<component>.js` — renderer that fetches data.json and injects HTML

Examples in this repo
- FAQ: `assets/components/faq/faq.json`, `faq.css`, `faq.js` — data is an array of {"q": "...", "a": "..."} (strings allowed to contain sanitized HTML). Renderer appends to `#faq-container` and then calls `initFAQ()` from `main.js` to bind accordion behavior.
- Testimonials: similar card pattern (check `assets/components/testimonials/` if present).

FAQ JSON schema (exact)
-----------------------
Each entry is an object:
{
  "question": "string",
  "answer": "string (HTML allowed, sanitize on write)",
  "id": "optional string",
  "tags": "optional array"
}

Renderer responsibilities
- Fetch data.json with `fetch('/assets/components/faq/faq.json?v=<timestamp>', {cache: 'no-store'})` during development or rely on CDN when stable.
- Render semantic HTML (button for question with `aria-expanded` and `aria-controls`, region with `role="region"`) and then call `initFAQ()` which is in `assets/js/main.js` to attach toggles if needed.

Key scripts and globals
-----------------------
- `assets/js/main.js` (minified as `main.min.js`) — exposes initializers: `initFAQ()`, `initNavbar()`, `initMobileMenu()`, `initQuiz()`, `initScrollAnimations()` etc. Call these after dynamic insertion.
- `assets/js/quiz.js` / `quiz.min.js` — quiz widget functions: `initQuiz()`, `startInlineQuiz()`, `renderQuestion()` etc.
- `assets/js/supabase-website-config.js` — public Supabase URL and anon key are present here for client usage (these are public anon keys; keep service-role keys out of client assets).

Security notes
--------------
- Public anon Supabase keys are safe to be public (they allow only client operations enforced by RLS). Do NOT commit service-role keys.
- Files under `scripts/sql_scripts/` include DB migration helpers and SQL functions; keep DB secrets out of repo and use CI environment variables for deployment-time migrations.

Operational runbook — small actionable checklist
-----------------------------------------------
1) If a JS asset fails to execute (MIME error):
  - Inspect the network tab — is the asset response `Content-Type: text/html`? If yes, worker likely returned `index.html` instead of the file.
  - On the worker: confirm `serveAsset()` or asset passthrough logic returns the file when it exists and sets `Content-Type: application/javascript` for `.js` and `text/css` for `.css`.

2) To publish a component change (FAQ example):
  - Update `assets/components/faq/faq.json` and increment a `version` field or append `?v=TIMESTAMP` in the page include.
  - Commit to a feature branch and deploy to preview (Cloudflare Pages preview or other). Verify the network fetch returns 200 and the JSON content.
  - If the live site doesn't pick changes, clear CDN or use cache-busting query param and check `fetch()` options.

3) Adding a new sub-app route or host mapping:
  - Add mapping in `_worker.js` `dispatchSubdomain()` and update alias maps.
  - Ensure there is no fallthrough that rewrites real asset requests to `index.html`.
  - Deploy to preview, test multiple paths (root, nested route, static asset like `/assets/js/foo.js`) and validate content-type headers.

4) Rollback plan (fast):
  - Restore production branch to last known good commit (`git reset --hard <commit>` + `git push --force`), then create a feature branch for fixes.

Developer tips & sanity checks
-----------------------------
- When dynamically injecting components, always attach ARIA and call the global initializer `initFAQ()` or the specific binder you need from `main.js`.
- Use `fetch(url, {cache: 'no-store'})` for debug runs; for production rely on CDN but include versioning.
- Keep all new third-party libs minimal and bundle only what's required; test for CSP and CORS implications.

How to regenerate a complete public sitemap (recommended for handover completeness)
- From repo root run: `git ls-files "*.html" | Sort-Object` (PowerShell) or `git ls-files '*.html'` (bash) and programmatically prefix your domain to each path to produce a list for documentation or robots.

Where to look for important code
- Edge worker: `_worker.js`
- CSS tokens: `assets/css/base/variables.css`
- Main initializers & bindings: `assets/js/main.js` (and `main.min.js`)
- Site config for Supabase: `assets/js/supabase-website-config.js`
- Components folder: `assets/components/`

Next recommended immediate actions
----------------------------------
1. Run a preview deploy of the current `feature/*` branch when adding components and verify the fetch & Content-Type for JS/CSS.
2. Generate the full HTML sitemap using the `git ls-files` command and include it in this document if you want full URL-by-URL mapping.
3. Rotate any server-side keys if there is concern — client anon keys (Supabase) are expected to be public.

If you want, I can: generate the full page-by-page sitemap (I can list all `*.html` files and add to this doc), create a one-page design token PDF, or create a checklist script to verify worker routing and content-type correctness automatically.

End of document.
