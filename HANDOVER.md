Craftsoft — Website Handover
===========================

Purpose
-------
A single, developer-friendly handover document covering the live website, subdomains, routing, visual brand tokens, typography, interactive components, integrations, deployment and troubleshooting notes. This document is designed for an incoming developer or operations agent to understand, maintain, and extend the site without exposing internal folder structure or raw file trees.

Audience
--------
- Developers taking over feature work
- DevOps / Deploy agents
- Designers needing brand tokens and typographic rules
- Support/ops personnel who must triage runtime issues

High-level Site Map (URLs)
--------------------------
- Primary site (main domain): the root site (homepage, course pages, features, contact, portfolio, policies)
- Canonical www host: mirrors primary site (www)
- Admin subdomain: admin portal (login, dashboard, records, payments, students, tutors, settings)
- Student portal subdomain: student-facing area (login, dashboard, courses, assignments, materials, payments)
- Signup subdomain: enrollment / signup pages and verification flows
- Misc pages: privacy policy, terms of service, contact, portfolio, features-needed docs, verify flows, 404 pages

Routing & Edge Logic (concept)
------------------------------
- The site uses an edge-worker/router that rewrites specific hostnames and paths into the published site assets and special subdomain folders.
- Admin and student portals are mounted on the same site host but routed by the worker by hostname and path rewriting to the correct application assets and index.html fallbacks.
- The worker ensures single-page-app fallbacks for app sections (serves index.html for routes that don’t map to a real file), but protects real static assets so they return their original MIME types.

Brand Tokens (colors & gradients)
---------------------------------
Primary palette (used across the site):
- Primary (brand): #2896CD (hex)
- Primary dark: #1A7EB0
- Primary light / 50 variants: soft light blues used as backgrounds and card accents
- Primary gradient example: linear-gradient(135deg, #2896cd 0%, #00cec9 100%)

Neutral palette (grays, used for text/controls):
- Gray tones for text and borders vary from light (#f0f4f8/--gray-100) to darker text (--gray-800)

Usage notes
- Brand primary is used for CTAs, links, icon accents and card borders.
- Gradients are used on cards and hero/portfolio accents (135deg brand → teal).

Typography
----------
- Primary web fonts loaded: `Italianno`, `Inter`, `Outfit` (via Google Fonts). These cover headings, body and accent styles.
- Hierarchy conventions observed:
  - Hero/Display: decorative/handwritten for some logos (`Italianno`) or large display headings.
  - Headings (H1–H3): heavier weights (600–800) of `Inter`/`Outfit`.
  - Body copy: `Inter` regular (400) or `Outfit` for UI microcopy.
- Line-height and spacing use CSS variables and spacing scale (small/medium/large tokens).

Key Interactive Components (what they do)
-----------------------------------------
- Navbar / header: responsive with active link highlighting and mobile menu.
- Footer: dynamic loader script that injects footer content.
- FAQ accordion: question/answer accordion; previously a static block, now a templated component backed by JSON data and JS renderer.
- Testimonials: card-based component used on home and landing pages.
- Quiz/assessment: quiz widget used on course pages.
- Chat widget: quick-contact UI with WhatsApp, phone, email options.
- Logo-signature: small component for the brand mark and small script for any behaviour.

Content & Data (how content is supplied)
----------------------------------------
- Static content (pages) are primarily HTML pages for each course and landing area.
- Reusable UI components can be templated by supplying JSON data to a small client-side renderer (example: FAQs can be managed via a JSON resource that the FAQ renderer fetches and renders).
- Images, icons and media are published as static assets and referenced by pages.

Scripts & Integrations
----------------------
- Main site logic: `main.js` — app-wide behaviors (scroll animations, FAQ bindings, navbar, SPA-style fallbacks, animation hooks).
- Quiz logic: `quiz.js` / `quiz.min.js` for assessment widgets.
- Supabase: site integrates with Supabase client (CDN version) and a site-specific config script used by admin/student areas to connect to backend services.
- Worker/Edge script: route-handling logic that rewrites requests per hostname and path; must be maintained when adding new sub-app routes.

SEO & Structured Data
---------------------
- Pages include structured data JSON-LD for the organization and FAQ schema (where applicable).
- Meta tags for Open Graph and Twitter cards are present on key landing pages.

Accessibility & UX conventions
------------------------------
- Focus-visible and aria-expanded attributes are used for accordions and interactive elements.
- Buttons and interactive controls use semantic elements (button, anchor) with keyboard accessibility.

Maintenance & Operational Notes
-------------------------------
- Caching and edge/CDN: the site uses standard long-lived static caching for assets. When updating JSON-driven UI (e.g., FAQ JSON), either append a cache-busting query parameter or purge CDN caches to ensure immediate updates.
- MIME issues: ensure the edge worker serves real assets directly; missing resources should not return an HTML page with content-type `text/html` (this will break script loads due to `X-Content-Type-Options: nosniff`). Worker routing must return correct Content-Type headers.

Updating a Templated Component (example: FAQ)
---------------------------------------------
- Conceptual steps to update FAQs (no internal paths shown):
  1. Update the FAQ data file (JSON) used by the FAQ renderer.
  2. If the site uses a cached CDN, apply cache-busting (query string) or purge the CDN.
  3. Verify on the live page: open DevTools → Console for renderer logs and confirm the count of loaded FAQs.
  4. If accordion behavior doesn’t attach, ensure the main site initializer runs after dynamic rendering or call the FAQ bind function from the renderer.

Troubleshooting Checklist (quick wins)
-------------------------------------
- If JS file blocked by MIME type: check the worker/routing and ensure the request returned a JS asset, not an HTML fallback. Also inspect `X-Content-Type-Options` header.
- If dynamic JSON updates don't appear: clear cache, re-fetch with cache-busting parameter, or purge CDN.
- If SPA routes 404: confirm edge-worker rewrite rules return the appropriate `index.html` for app paths while allowing real static files through.

Deployment & Branching Guidance
-------------------------------
- Use feature branches for major UI changes (e.g., `feature/faq-templating`).
- Test client-side renders locally using a static server or preview of the branch deployment (if using Pages/Cloudflare preview).
- For safe rollouts, deploy to a preview environment first and verify assets, scripts, and worker rewrites before promoting to production.

Security & Secrets
------------------
- Backend keys and environment secrets are kept out of the site assets. The Supabase client uses a config module; secret service access keys should be managed at the server/edge environment level (not in public assets).

Hand-over Checklist (what I am passing to you)
----------------------------------------------
- Sitemap overview and list of public endpoints and subdomains.
- Brand tokens: primary color, gradients, neutral text palette, typography rules.
- Component inventory and behavior notes (FAQ, testimonials, chat, quiz).
- Integration list: Supabase client, CDN/worker routing, analytics if present.
- Maintenance and troubleshooting checklist (caching, MIME types, worker caveats).

Next recommended steps for the new agent
---------------------------------------
1. Verify the live site (open a few pages and the admin/student routes) and confirm worker routing behaves as expected.
2. Review the edge-worker logic with a focus on asset passthrough and correct Content-Type handling for static resources.
3. Run a staging deploy for any templating changes and validate caching behavior for JSON-driven components.
4. If required, migrate templated components to isolated feature branches and perform a controlled merge after QA.

If you want this converted into a formatted handover PDF or a one-page quick-reference sheet for designers (colors, gradients, font weights), I can generate that next.

End of document.
