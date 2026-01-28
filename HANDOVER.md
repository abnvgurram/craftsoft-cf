Project Hand-over — Craftsoft Website

Overview
-------
This document summarizes the repository structure, sitemap, brand design tokens (colors, typography, spacing), component locations, subdomain folders, deployment notes, and recommended next steps to hand over to another agent.

Repository root: `e:/Craft soft/Website`

Summary
-------
- Static site built with plain HTML/CSS/JS, with subfolders for admin/student subdomains under `acs_subdomains/`.
- Cloudflare Pages used with a Worker `_worker.js` for routing between subdomains and asset handling; also Netlify config files are present for reference (`netlify.toml`, `netlify-admin.toml`, `netlify-main.toml`, `netlify-students.toml`).
- Assets are organized under `assets/` and many subdomain-specific assets under `acs_subdomains/.../assets/`.

Sitemap (top-level / important pages)
------------------------------------
- /index.html (Home)
- /about/index.html
- /contact/index.html
- /courses/index.html and course pages (e.g. /courses/react/, /courses/python/ etc.)
- /portfolio/index.html
- /privacy-policy/index.html
- /terms-of-service/index.html
- /verify/index.html

Subdomains (local folders)
--------------------------
- `acs_subdomains/acs_admin/` — Admin portal (index.html, dashboard, students, courses-services, assets/)
- `acs_subdomains/acs_students/` — Student portal (index.html, dashboard, courses, payments, assets/)
- `acs_subdomains/acs_signup/` — Signup flows
- Note: each subdomain contains its own `assets/` with CSS/JS built for that portal.

All HTML files (searchable list)
--------------------------------
All HTML pages are under the project root and `acs_subdomains/*`. (Full list committed in repo; see `git ls-files "**/*.html"` locally or inspect the repository tree.)

Design tokens — Brand Colors (from `assets/css/base/variables.css`)
-----------------------------------------------------------------
Primary palette (blue):
- --primary-500: #2896cd (primary)
- --primary-600: #1a7eb0
- --primary-400: #53abd7
- --primary-50: #edf6fb

Accent/Gradients:
- --accent-gradient: linear-gradient(135deg, #2896cd 0%, #6C5CE7 100%)
- --accent-gradient-2: linear-gradient(135deg, #00B894 0%, #00CEC9 100%)

Neutral (examples):
- --white: #ffffff
- --gray-100: #f1f5f9
- --gray-500: #64748b
- --gray-900: #0f172a

Other tokens (spacing, radii, shadows, transitions):
- Spacing scale: `--spacing-xs` → `--spacing-5xl` (0.25rem → 8rem)
- Border radius tokens: `--radius-sm` .. `--radius-2xl`, plus `--radius-full`
- Shadows: `--shadow-sm` .. `--shadow-2xl`, `--shadow-glow`
- Transitions: `--transition-fast`, `--transition-base`, `--transition-slow`

Typography (from `assets/css/base/variables.css` and `assets/css/base/typography.css`)
---------------------------------------------------------------------------------------
- Primary font-family: `--font-primary`: 'Outfit', sans-serif (used for headings)
- Secondary font-family: `--font-secondary`: 'Inter', sans-serif (body and UI)
- Special signature font: 'Italianno' used in `.logo-signature`.
- Headings use `font-weight: 700` and line-height ~1.2.
- Gradient text utility available via `.gradient-text` using `--accent-gradient`.

Components & Key files
----------------------
- `assets/components/` — reusable components (footer, logo-signature, quiz, testimonials, search-bar, etc.)
- `assets/js/` — site-wide JS (`main.js`, `main.min.js`, `quiz.js`, `custom-select.js`, etc.)
- `assets/css/` — site-wide CSS (`master.css`, `main.bundle.css`, `components/*`, `base/*`)
- Subdomain component variants: `acs_subdomains/*/assets/components/*` and `acs_subdomains/*/assets/css/*` for admin/student custom styling.

Routing & Deployment
--------------------
- `_worker.js` — Cloudflare Worker used for routing between hostnames (admin, signup, acs-student) and fetching assets from `ASSETS` KV/bucket. Review this carefully before making routing changes.
- `wrangler.toml` — Worker config for Cloudflare (if used).
- `netlify*.toml` — Netlify config files retained for parity and reference (original site was on Netlify).
- Deploy steps (current): push to `main` branch → Cloudflare Pages builds (repo connected to Cloudflare). Worker is included in repo (`_worker.js`) and needs to be published using `wrangler` if changed.

Build / Local testing
---------------------
- This is a static site — no build step required for most pages. If you modify JS/CSS, ensure paths remain correct.
- To preview locally, open `index.html` in a browser or run a small static server:

  ```bash
  # from repository root
  python -m http.server 8000
  # or (Node)
  npx http-server -p 8000
  ```

- If using Cloudflare Workers locally, use `wrangler dev` (requires Cloudflare account + env vars).

Assets
------
- Images: `assets/images/` and subdomain-specific images under `acs_subdomains/*/assets/images/`.
- JS: `assets/js/` and subdomain `assets/js/` files (e.g., `acs_admin/assets/js/*`).
- Fonts: loaded from Google Fonts in the `<head>` (Outfit, Inter, Italianno). Also `font-family` fallbacks set in CSS.

Analytics / Third-party
-----------------------
- Supabase: `assets/js/supabase-website-config.js` used in site (admin/student portals use Supabase config files)
- Live chat / WhatsApp links used in footer and widget.

Known special cases & gotchas
----------------------------
- Cloudflare Worker `_worker.js` performs URL rewrites; changing it can break MIME types or cause redirect loops. Test thoroughly.
- Some pages and subdomains have their own `main.bundle.*.css` and `main.min.js` — updates must be mirrored per subdomain if keeping behavior identical.
- When templatifying components (FAQ/testimonials), update all references (CSS & JS includes) and push carefully; changes were previously reverted after a bad partial integration.

Recommended Handover Checklist for Agent
----------------------------------------
1. Clone repo and set up local static server.
2. Inspect `assets/css/base/variables.css` for brand tokens and confirm any design changes with stakeholder.
3. Review `_worker.js` and `wrangler.toml` before modifying routing rules or asset fetch behavior.
4. If templatifying components, do changes in a feature branch, update all HTML references, and test locally before merging.
5. Run a full smoke test on admin and student subdomains (check JS assets load with correct MIME types).
6. Validate deploy by checking Cloudflare Pages logs and the Worker logs (if Worker modified).

Extras — Useful commands
------------------------
- List HTML files:
  ```bash
  git ls-files "**/*.html"
  ```
- Show recent commits:
  ```bash
  git log --oneline --max-count=20
  ```
- Revert local changes to remote main (be careful):
  ```bash
  git fetch origin
  git reset --hard origin/main
  ```

Contact / Ownership
-------------------
- Repo URL: (present in remote configuration) `https://github.com/abnvgurram/craftsoft-cf.git` (remote origin)
- Cloudflare account: worker and Pages are configured (check `wrangler.toml` and Cloudflare dashboard for account info and bindings).

End of handover
---------------
This document is a starting point — hand over to the next agent with access to the Cloudflare account and the repository. If you want, I can also generate a flattened `sitemap.xml` file from the HTML pages and include it here.
