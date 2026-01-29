# Craftsoft — Complete System Specification

**Version:** 5.0  
**Date:** January 29, 2026  
**Target:** AI Agent for React + Material UI Migration

---

## Source of Truth

| Portal | Live URL |
|--------|----------|
| Main Website | https://www.craftsoft.co.in |
| Admin Portal | https://admin.craftsoft.co.in |
| Student Portal | https://acs-student.craftsoft.co.in |
| Signup Portal | https://signup.craftsoft.co.in |

---

# SECTION A: BRAND IDENTITY

## A1. Brand Name Variants

| Context | Format |
|---------|--------|
| Full Name | Abhi's Craftsoft |
| Short Name | Craftsoft |
| Domain | craftsoft.co.in |
| Email Handle | @craftsoft |

## A2. Logo Specifications

### Logo Components
| Part | Font | Weight | Style |
|------|------|--------|-------|
| "Abhi's" | Italianno | 400 | Cursive, 1.6em relative |
| "Craftsoft" | Outfit | 700 | Gradient text |

### Logo Colors
| Part | Color |
|------|-------|
| "Abhi's" | #0f172a (dark) |
| "Craftsoft" | Gradient: #2896cd → #6C5CE7 |

### Logo Clear Space
- Minimum clear space around logo: 16px (1rem)
- Never place logo on busy backgrounds
- Maintain aspect ratio always

### Logo Minimum Sizes
| Context | Minimum Width |
|---------|---------------|
| Desktop Header | 180px |
| Mobile Header | 140px |
| Footer | 160px |
| Favicon | 32×32px (SVG preferred) |

### Logo Variations
| Variant | When to Use |
|---------|-------------|
| Full Color | Light backgrounds |
| White Text "Abhi's" | Dark backgrounds (footer) |
| Icon Only | Favicon, app icons |

## A3. Tagline
- Primary: "Your career transformation starts here"
- Never modify this text

## A4. Brand Voice
| Attribute | Description |
|-----------|-------------|
| Tone | Professional yet approachable |
| Language | English (Indian context) |
| Formality | Semi-formal |
| Pronouns | "We" for company, "You" for user |

---

# SECTION B: COMPLETE SITEMAP

## B1. Main Website (www.craftsoft.co.in)

### Top-Level Pages
| Path | Page Title | Description |
|------|------------|-------------|
| `/` | Homepage | Landing page with hero, courses preview, services preview, testimonials, quiz CTA, contact section |
| `/about/` | About Us | Company story, mission, vision, founder section |
| `/courses/` | All Courses | Course category listing with filter tabs |
| `/services/` | Our Services | Service offerings grid |
| `/contact/` | Contact Us | Contact form, map, contact methods |
| `/portfolio/` | Portfolio | Case studies and work samples |
| `/privacy-policy/` | Privacy Policy | Legal page |
| `/terms-of-service/` | Terms of Service | Legal page |
| `/verify/` | Email Verification | Verification landing page |
| `/404.html` | Page Not Found | Custom 404 |

### Course Detail Pages
| Path | Course Name |
|------|-------------|
| `/courses/graphic-design/` | Graphic Design |
| `/courses/ui-ux/` | UI/UX Design |
| `/courses/full-stack/` | Full Stack MERN Development |
| `/courses/python/` | Python Full Stack Development |
| `/courses/java/` | Java Full Stack Development |
| `/courses/react/` | React JS Development |
| `/courses/dsa/` | Data Structures & Algorithms |
| `/courses/sql/` | SQL & Databases |
| `/courses/devops/` | DevOps Engineering |
| `/courses/devsecops/` | DevSecOps |
| `/courses/aws/` | AWS Cloud Excellence |
| `/courses/azure/` | Microsoft Azure |
| `/courses/cyber-security/` | Cyber Security |
| `/courses/salesforce/` | Salesforce Administration |
| `/courses/salesforce-developer/` | Salesforce Developer |
| `/courses/salesforce-marketing-cloud/` | Salesforce Marketing Cloud |
| `/courses/oracle-fusion-cloud/` | Oracle Fusion Cloud |
| `/courses/service-now/` | ServiceNow Administration |
| `/courses/ai-ml/` | AI & Machine Learning |
| `/courses/data-analytics/` | Data Analytics |
| `/courses/spoken-english/` | Spoken English |
| `/courses/soft-skills/` | Soft Skills Training |
| `/courses/resume-interview/` | Resume & Interview Prep |
| `/courses/handwriting/` | Handwriting Improvement |
| `/courses/git-github/` | Git & GitHub |
| `/courses/automation-python/` | Automation with Python |
| `/courses/python-programming/` | Python Programming |

### Service Detail Pages
| Path | Service Name |
|------|--------------|
| `/services/web-development/` | Website Development |
| `/services/ui-ux-design/` | UI/UX Design Services |
| `/services/graphic-design/` | Graphic Design Services |
| `/services/branding/` | Branding & Identity |
| `/services/cloud-devops/` | Cloud & DevOps Solutions |
| `/services/career-services/` | Career & Placement Services |

### URL Aliases (Redirects)
| Short URL | Redirects To |
|-----------|--------------|
| `/c-{course-slug}/` | `/courses/{course-slug}/` |
| `/s-{service-slug}/` | `/services/{service-slug}/` |

Example: `/c-python/` → `/courses/python/`

## B2. Admin Portal (admin.craftsoft.co.in)

| Path | Page |
|------|------|
| `/` | Login |
| `/dashboard/` | Dashboard |
| `/students/` | Student Records |
| `/clients/` | Client Records |
| `/courses/` | Course Management |
| `/services/` | Service Management |
| `/inquiries/` | Inquiry Management |
| `/tutors/` | Tutor Management |
| `/upload-materials/` | Upload Learning Materials |
| `/assignments/` | Assignment Management |
| `/submissions/` | View Submissions |
| `/record-payment/` | Record Payment |
| `/all-payments/` | All Payments |
| `/receipts/` | Receipts |
| `/archived/` | Archived Records |
| `/recently-deleted/` | Recently Deleted |
| `/settings/` | Settings |
| `/version-history/` | Version History |
| `/verify-email.html` | Email Verification |
| `/404/` | 404 Page |

## B3. Student Portal (acs-student.craftsoft.co.in)

| Path | Page |
|------|------|
| `/` | Login |
| `/dashboard/` | Dashboard |
| `/courses/` | My Courses |
| `/materials/` | Learning Materials |
| `/assignments/` | Assignments |
| `/payments/` | Payment History |
| `/profile/` | Profile |
| `/privacy-policy.html` | Privacy Policy |
| `/terms-of-service.html` | Terms of Service |
| `/404/` | 404 Page |

## B4. Signup Portal (signup.craftsoft.co.in)

| Path | Page |
|------|------|
| `/` | Registration Form |
| `/verify-email.html` | Email Verification |
| `/404/` | 404 Page |

---

# SECTION C: NAVIGATION STRUCTURE

## C1. Main Website Navigation

### Desktop Navigation (Left to Right)
| Label | Path | Active When |
|-------|------|-------------|
| Home | `/` | Exact match |
| About | `/about/` | Path starts with /about |
| Courses | `/courses/` | Path starts with /courses |
| Services | `/services/` | Path starts with /services |
| Contact | `/contact/` | Path starts with /contact |

### CTA Button (Right side)
| Label | Action |
|-------|--------|
| Icon: Phone | Links to tel:+917842239090 |

### Mobile Navigation
- Hamburger icon triggers full-screen overlay
- Same links as desktop, stacked vertically
- Close button (X) in top-right
- Additional: "Admin Login" link at bottom

### Footer Navigation

**Quick Links Column:**
| Label | Path |
|-------|------|
| Home | `/` |
| About Us | `/about/` |
| All Courses | `/courses/` |
| Our Services | `/services/` |
| Contact Us | `/contact/` |
| Portfolio | `/portfolio/` |

**Legal Links (Bottom Bar):**
| Label | Path |
|-------|------|
| Privacy Policy | `/privacy-policy/` |
| Terms of Service | `/terms-of-service/` |

## C2. Admin Portal Navigation

### Sidebar Groups

**Main:**
- Dashboard → `/dashboard/`

**People:**
- Students → `/students/`
- Clients → `/clients/`
- Tutors → `/tutors/`

**Offerings:**
- Courses → `/courses/`
- Services → `/services/`

**Academics:**
- Materials → `/upload-materials/`
- Assignments → `/assignments/`
- Submissions → `/submissions/`

**Finance:**
- Record Payment → `/record-payment/`
- All Payments → `/all-payments/`
- Receipts → `/receipts/`

**Communications:**
- Inquiries → `/inquiries/`

**Archive:**
- Archived → `/archived/`
- Recently Deleted → `/recently-deleted/`

**Settings:**
- Settings → `/settings/`
- Version History → `/version-history/`

## C3. Student Portal Navigation

### Sidebar Items
| Label | Path | Icon |
|-------|------|------|
| Dashboard | `/dashboard/` | Grid/Home |
| My Courses | `/courses/` | Book |
| Materials | `/materials/` | Folder |
| Assignments | `/assignments/` | Clipboard |
| Payments | `/payments/` | Credit Card |
| Profile | `/profile/` | User |

---

# SECTION D: TYPOGRAPHY SYSTEM

## D1. Font Families

| Role | Font Name | Fallback |
|------|-----------|----------|
| Headings | Outfit | sans-serif |
| Body | Inter | sans-serif |
| Logo Script | Italianno | cursive |

## D2. Font Weights Used

| Font | Weights |
|------|---------|
| Outfit | 400, 500, 600, 700, 800 |
| Inter | 300, 400, 500, 600, 700, 800 |
| Italianno | 400 |

## D3. Type Scale

| Element | Font | Size | Weight | Line Height | Letter Spacing |
|---------|------|------|--------|-------------|----------------|
| H1 | Outfit | clamp(2.5rem, 5vw, 3.5rem) | 700 | 1.2 | -1px |
| H2 | Outfit | clamp(2rem, 4vw, 2.75rem) | 700 | 1.2 | -0.5px |
| H3 | Outfit | clamp(1.5rem, 3vw, 2rem) | 700 | 1.2 | 0 |
| H4 | Outfit | 1.25rem | 600 | 1.3 | 0 |
| H5 | Outfit | 1.1rem | 600 | 1.3 | 0 |
| H6 | Outfit | 1rem | 600 | 1.3 | 0 |
| Body | Inter | 1rem | 400 | 1.6 | 0 |
| Body Large | Inter | 1.15rem | 400 | 1.8 | 0 |
| Body Small | Inter | 0.875rem | 400 | 1.5 | 0 |
| Caption | Inter | 0.8rem | 500 | 1.4 | 0.5px |
| Button | Inter | 1rem | 600 | 1 | 0 |
| Nav Link | Inter | 0.95rem | 500 | 1 | 0 |
| Section Tag | Inter | 0.875rem | 600 | 1 | 0.5px |

## D4. Text Colors

| Usage | Hex |
|-------|-----|
| Headings | #0f172a |
| Body Text | #334155 |
| Secondary Text | #475569 |
| Muted Text | #64748b |
| Placeholder | #94a3b8 |
| Disabled | #cbd5e1 |
| Link | #2896cd |
| Link Hover | #1a7eb0 |
| Error | #EF4444 |
| Success | #10B981 |

## D5. Text Transformations

| Element | Transform |
|---------|-----------|
| Section Tag | UPPERCASE |
| Stat Labels | UPPERCASE |
| Navigation | None (sentence case) |
| Buttons | None (sentence case) |

---

# SECTION E: COLOR SYSTEM

## E1. Primary Palette

| Level | Hex | RGB |
|-------|-----|-----|
| 50 | #edf6fb | 237, 246, 251 |
| 100 | #d4eaf5 | 212, 234, 245 |
| 200 | #a9d5eb | 169, 213, 235 |
| 300 | #7ec0e1 | 126, 192, 225 |
| 400 | #53abd7 | 83, 171, 215 |
| 500 | #2896cd | 40, 150, 205 |
| 600 | #1a7eb0 | 26, 126, 176 |
| 700 | #156691 | 21, 102, 145 |
| 800 | #104e72 | 16, 78, 114 |
| 900 | #0b3653 | 11, 54, 83 |

## E2. Secondary Palette (Purple)

| Level | Hex |
|-------|-----|
| Light | #A29BFE |
| Main | #6C5CE7 |
| Dark | #5B4BC7 |
| Darker | #4A3DB6 |

## E3. Tertiary Palette (Green)

| Level | Hex |
|-------|-----|
| Light | #00CEC9 |
| Main | #00B894 |
| Dark | #059669 |

## E4. Accent Palette (Orange)

| Level | Hex |
|-------|-----|
| Light | #FFBE0B |
| Main | #FF9500 |
| Dark | #D97706 |

## E5. Neutral Palette

| Level | Hex |
|-------|-----|
| White | #ffffff |
| 50 | #f8fafc |
| 100 | #f1f5f9 |
| 200 | #e2e8f0 |
| 300 | #cbd5e1 |
| 400 | #94a3b8 |
| 500 | #64748b |
| 600 | #475569 |
| 700 | #334155 |
| 800 | #1e293b |
| 900 | #0f172a |

## E6. Semantic Colors

| Purpose | Hex | Usage |
|---------|-----|-------|
| Success | #10B981 | Confirmations, completed states |
| Warning | #F59E0B | Warnings, pending states |
| Error | #EF4444 | Errors, destructive actions |
| Info | #3B82F6 | Informational messages |

## E7. Background Colors

| Usage | Value |
|-------|-------|
| Page Background | #f0f7fb |
| Card Background | rgba(40, 150, 205, 0.04) |
| Card Hover | rgba(40, 150, 205, 0.08) |
| Section Alternate | rgba(40, 150, 205, 0.06) |
| Input Background | #f8fafc |
| Modal Overlay | rgba(0, 0, 0, 0.5) |
| Navbar Glass | rgba(232, 244, 252, 0.85) |
| Navbar Scrolled | rgba(232, 244, 252, 0.98) |
| Footer | #0f172a |
| Admin Sidebar | #edf6fb |

## E8. Border Colors

| Usage | Value |
|-------|-------|
| Default | #e2e8f0 |
| Card | rgba(40, 150, 205, 0.12) |
| Input | #e2e8f0 |
| Input Focus | #2896cd |
| Divider | rgba(40, 150, 205, 0.15) |
| Navbar | rgba(40, 150, 205, 0.1) |

---

# SECTION F: GRADIENTS

## F1. Brand Gradients

| Name | Direction | Colors | Usage |
|------|-----------|--------|-------|
| Accent Primary | 135deg | #2896cd → #6C5CE7 | Buttons, badges, CTAs |
| Accent Secondary | 135deg | #00B894 → #00CEC9 | Success highlights |
| Hero Title | 135deg | #2896cd → #6C5CE7 → #00B894 | Hero heading only |

## F2. Button Gradients

| Button | State | Direction | Colors |
|--------|-------|-----------|--------|
| Primary | Default | 135deg | #2896cd → #1a7fc4 |
| Primary | Hover | 135deg | #1a7fc4 → #156ba8 |
| Secondary | Default | 135deg | #6C5CE7 → #5B4BC7 |
| Secondary | Hover | 135deg | #5B4BC7 → #4A3DB6 |

## F3. Background Gradients

| Section | Direction | Colors |
|---------|-----------|--------|
| Hero | 135deg | #f0f9ff (0%) → #ffffff (40%) → #f0f9ff (70%) → #e0f2fe (100%) |
| Section Fade Up | 180deg | #ffffff → #edf6fb |
| Section Fade Down | 180deg | #edf6fb → #ffffff |
| Quiz CTA | 135deg | #6c5ce7 → #a29bfe |
| Admin Sidebar | 180deg | #edf6fb → #e5f3fa |
| Sidebar Active Item | 135deg | #2896cd → #1a7eb0 |

## F4. Decorative Gradients (Hero Shapes)

| Shape | Colors |
|-------|--------|
| Shape 1 | Primary-200 → Primary-100 |
| Shape 2 | rgba(108,92,231,0.3) → rgba(108,92,231,0.1) |
| Shape 3 | rgba(0,184,148,0.25) → rgba(0,184,148,0.1) |

---

# SECTION G: SPACING SYSTEM

## G1. Base Scale

| Token | rem | px |
|-------|-----|-----|
| xs | 0.25 | 4 |
| sm | 0.5 | 8 |
| md | 1 | 16 |
| lg | 1.5 | 24 |
| xl | 2 | 32 |
| 2xl | 3 | 48 |
| 3xl | 4 | 64 |
| 4xl | 6 | 96 |
| 5xl | 8 | 128 |

## G2. Component Spacing

| Component | Property | Value |
|-----------|----------|-------|
| Button | Padding | 1rem 2rem |
| Button Small | Padding | 0.75rem 1.5rem |
| Card | Padding | 1.5rem - 2rem |
| Input | Padding | 0.75rem 1rem |
| Section | Top/Bottom | 100px (desktop), 70px (tablet), 50px (mobile) |
| Container | Side Padding | 2.5rem (desktop), 1.25rem (mobile) |
| Navbar | Height | 75px |
| Gap (Cards Grid) | Gap | 1.5rem - 2rem |
| Gap (Buttons) | Gap | 1rem |

## G3. Container

| Property | Value |
|----------|-------|
| Max Width | 1240px |
| Padding Desktop | 0 2.5rem |
| Padding Mobile | 0 1.25rem |
| Centering | margin: 0 auto |

---

# SECTION H: BORDER RADIUS

| Token | Value | Usage |
|-------|-------|-------|
| sm | 6px | Small inputs, chips |
| md | 8px | Buttons, tags |
| lg | 12px | Cards, inputs |
| xl | 16px | Feature cards |
| 2xl | 24px | Large sections, modals |
| full | 9999px | Pills, avatar, circular buttons |

---

# SECTION I: SHADOWS

## I1. Elevation Scale

| Level | Value |
|-------|-------|
| None | none |
| sm | 0 1px 2px rgba(0,0,0,0.05) |
| md | 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06) |
| lg | 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05) |
| xl | 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04) |
| 2xl | 0 25px 50px -12px rgba(0,0,0,0.25) |

## I2. Special Shadows

| Name | Value | Usage |
|------|-------|-------|
| Glow | 0 0 40px rgba(40,150,205,0.15) | Hero elements |
| Card Hover | 0 8px 30px rgba(40,150,205,0.15) | Cards on hover |
| Navbar Scrolled | 0 4px 30px rgba(40,150,205,0.08) | Navbar after scroll |
| Button Primary | 0 4px 15px rgba(40,150,205,0.3) | Primary buttons |
| Button Primary Hover | 0 8px 25px rgba(40,150,205,0.4) | Primary buttons hover |
| Button Secondary | 0 4px 15px rgba(108,92,231,0.3) | Secondary buttons |
| Focus Ring | 0 0 0 3px rgba(40,150,205,0.15) | Input focus |

---

# SECTION J: TRANSITIONS & ANIMATIONS

## J1. Transition Durations

| Speed | Duration |
|-------|----------|
| Fast | 150ms |
| Base | 300ms |
| Slow | 500ms |

## J2. Easing Functions

| Name | Value | Usage |
|------|-------|-------|
| Default | ease | Most transitions |
| Smooth | cubic-bezier(0.4, 0, 0.2, 1) | Page transitions |
| Bounce | cubic-bezier(0.175, 0.885, 0.32, 1.275) | Playful interactions |
| Step | step-end | Cursor blink |

## J3. Animation Definitions

| Name | Behavior | Duration | Iteration |
|------|----------|----------|-----------|
| fadeInUp | translateY(30px→0), opacity(0→1) | 600ms | Once |
| fadeIn | opacity(0→1) | 300-800ms | Once |
| float | translateY(0↔-15px) | 4-5s | Infinite |
| pulse | scale(1↔1.1), opacity(0.6↔0.4) | 8s | Infinite |
| blink | opacity(1↔0) | 1s | Infinite |
| spin | rotate(0→360deg) | 800ms | Infinite |
| bounceDown | translateY oscillates | 2s | Infinite |
| rotateGlow | rotate(0→360deg) | 15-20s | Infinite |

## J4. Staggered Animations

For lists/grids, delay each item:
- Item 1: 0ms
- Item 2: 100ms
- Item 3: 150ms
- Item 4: 200ms
- Continue pattern...

---

# SECTION K: COMPONENT SPECIFICATIONS

## K1. Navbar

| Property | Value |
|----------|-------|
| Position | Fixed, top |
| Height | 75px |
| Background Default | rgba(232, 244, 252, 0.85) |
| Background Scrolled | rgba(232, 244, 252, 0.98) |
| Backdrop Filter | blur(12px) |
| Border Bottom | 1px solid rgba(40,150,205,0.1) |
| Shadow (scrolled) | 0 4px 30px rgba(40,150,205,0.08) |
| Z-Index | 1000 |
| Transition | all 400ms cubic-bezier(0.4, 0, 0.2, 1) |

### Nav Link States
| State | Color | Underline |
|-------|-------|-----------|
| Default | #475569 | None |
| Hover | #1a7eb0 | Full width, gradient |
| Active | #1a7eb0 | Full width, gradient |

## K2. Buttons

### Primary Button
| Property | Default | Hover |
|----------|---------|-------|
| Background | gradient #2896cd→#6C5CE7 | gradient #1a7fc4→#5B4BC7 |
| Color | #ffffff | #ffffff |
| Padding | 1rem 2rem | - |
| Border Radius | 12px | - |
| Shadow | 0 4px 15px rgba(...0.3) | 0 8px 25px rgba(...0.4) |
| Transform | none | translateY(-3px) |

### Secondary Button
| Property | Default | Hover |
|----------|---------|-------|
| Background | #ffffff | #ffffff |
| Color | #334155 | #1a7eb0 |
| Border | 2px solid #e2e8f0 | 2px solid #2896cd |
| Padding | 1rem 2rem | - |
| Border Radius | 12px | - |
| Transform | none | translateY(-3px) |

### WhatsApp Button
| Property | Value |
|----------|-------|
| Background | #25D366 |
| Hover Background | #20BA5A |
| Color | #ffffff |

### Button with Icon
- Icon on left, 8px gap from text
- Icon size: 1rem

## K3. Cards

### Standard Card
| Property | Default | Hover |
|----------|---------|-------|
| Background | gradient #edf6fb→#ffffff | same |
| Border | 1px solid rgba(40,150,205,0.12) | border color intensifies |
| Border Radius | 16px | - |
| Padding | 24px | - |
| Shadow | md level | xl level |
| Transform | none | translateY(-5px to -8px) |

### Card Icon Container
| Property | Value |
|----------|-------|
| Size | 60-70px |
| Background | #ffffff |
| Border Radius | 12px |
| Shadow | md level |
| Icon Size | 1.5-1.75rem |
| Icon Color | #2896cd |

## K4. Form Inputs

| Property | Default | Focus |
|----------|---------|-------|
| Background | #f8fafc | #ffffff |
| Border | 1px solid #e2e8f0 | 2px solid #2896cd |
| Border Radius | 12px | - |
| Padding | 12px 16px | - |
| Shadow | none | 0 0 0 3px rgba(40,150,205,0.15) |

### Input Error State
| Property | Value |
|----------|-------|
| Border Color | #EF4444 |
| Shadow | 0 0 0 3px rgba(239,68,68,0.15) |
| Error Text Color | #EF4444 |
| Error Text Size | 0.85rem |

### Input Labels
| Property | Value |
|----------|-------|
| Font Size | 0.9rem |
| Font Weight | 600 |
| Color | #334155 |
| Margin Bottom | 8px |

## K5. Footer

| Property | Value |
|----------|-------|
| Background | #0f172a |
| Text Color | #94a3b8 |
| Heading Color | #ffffff |
| Link Hover Color | #53abd7 |
| Border Divider | rgba(255,255,255,0.1) |
| Padding | 64px 0 32px |

### Footer Grid (Desktop)
- 4 columns: 1.5fr 1fr 1fr 1fr
- Gap: 48px

### Footer Dynamic Content
- Courses column: Random 4 from course list
- Services column: Random 4 from service list
- Randomize on each page load

## K6. Chat Widget

| Property | Value |
|----------|-------|
| Position | Fixed, bottom-right |
| Offset | 30px from edges |
| Z-Index | 1000 |

### Toggle Button
| Property | Value |
|----------|-------|
| Size | 60×60px |
| Shape | Circle |
| Background | gradient #0984e3→#6c5ce7 |
| Icon | Headset (fa-headset) |
| Shadow | 0 4px 20px rgba(9,132,227,0.4) |

### Chat Panel
| Property | Value |
|----------|-------|
| Width | 350px |
| Border Radius | 20px |
| Background | #ffffff |
| Shadow | 0 10px 40px rgba(0,0,0,0.15) |
| Animation | slide up + fade in |

### Chat Options
| Option | Icon Color |
|--------|------------|
| WhatsApp | #25D366 |
| Phone | #0984e3 |
| Email | #6c5ce7 |

## K7. Section Header Pattern

| Element | Specs |
|---------|-------|
| Tag | Uppercase, small, pill-shaped, primary-50 bg, primary-600 text |
| Title | H2, centered |
| Description | Gray-500, max-width 600px, centered |
| Spacing | Tag mb-16px, Title mb-16px, Description mb-64px |

## K8. Stat Items (Hero)

| Element | Specs |
|---------|-------|
| Number | 2.5rem, weight 800, gradient text |
| Suffix (+) | Same as number |
| Label | 0.8rem, uppercase, gray-500, 0.5px letter-spacing |
| Divider | 1px × 50px, gray-200 |

---

# SECTION L: ICONS

## L1. Icon Library
Font Awesome 6.5.1 (Free)
CDN: cdnjs.cloudflare.com

## L2. Common Icons Used

| Purpose | Icon Class |
|---------|------------|
| Phone | fa-phone |
| Email | fa-envelope |
| Location | fa-location-dot |
| WhatsApp | fa-whatsapp (brands) |
| LinkedIn | fa-linkedin (brands) |
| Instagram | fa-instagram (brands) |
| Menu | fa-bars |
| Close | fa-xmark |
| Arrow Right | fa-arrow-right |
| Arrow Left | fa-arrow-left |
| Check | fa-check |
| Clock | fa-clock |
| Calendar | fa-calendar |
| User | fa-user |
| Users | fa-users |
| Book | fa-book |
| Graduation | fa-graduation-cap |
| Code | fa-code |
| Cloud | fa-cloud |
| Database | fa-database |
| Shield | fa-shield-halved |
| Rocket | fa-rocket |
| Star | fa-star |
| Quote | fa-quote-left |
| Play | fa-play |
| Download | fa-download |
| Upload | fa-upload |
| Search | fa-search |
| Filter | fa-filter |
| Edit | fa-pen |
| Delete | fa-trash |
| Settings | fa-gear |
| Dashboard | fa-chart-line |
| Headset | fa-headset |
| Paper Plane | fa-paper-plane |
| Eye | fa-eye |
| Eye Slash | fa-eye-slash |

---

# SECTION M: STATES

## M1. Loading States

### Page Loading
- Full-screen overlay, white background 95% opacity
- Centered spinner (50×50px)
- Spinner: 4px border, primary color, spinning

### Button Loading
- Text becomes invisible (not removed)
- Spinner appears centered in button
- Pointer events disabled

### Skeleton Loading
- Gray shimmer animation
- Matches shape of expected content
- 1.5s animation cycle

## M2. Empty States

| Context | Message Pattern |
|---------|-----------------|
| No Results | "No [items] found" + suggestion |
| No Data | Illustration + "Nothing here yet" |
| Search Empty | "No matches for '[query]'" |

## M3. Error States

### Form Field Error
- Red border (#EF4444)
- Red glow ring
- Error message below (red text, 0.85rem)

### Page Error
- Centered message
- Retry button
- Support contact option

### Toast Notifications
| Type | Background | Icon |
|------|------------|------|
| Success | #10B981 | fa-check-circle |
| Error | #EF4444 | fa-times-circle |
| Warning | #F59E0B | fa-exclamation-triangle |
| Info | #3B82F6 | fa-info-circle |

---

# SECTION N: FORMS SPECIFICATION

## N1. Contact Form (Main Website)

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | text | Yes | Min 2 chars |
| Email | email | Yes | Valid email format |
| Phone | tel | No | 10 digits (Indian) |
| Inquiry Type | select | Yes | Course/Service/General |
| Service Interest | select | Conditional | If type=Service |
| Course Interest | select | Conditional | If type=Course |
| Message | textarea | No | Max 1000 chars |

## N2. Admin Login Form

| Field | Type | Required | Accepts |
|-------|------|----------|---------|
| Identifier | text | Yes | Email OR Admin ID (ACS-XX) OR Phone |
| Password | password | Yes | Min 8 chars |

## N3. Admin Signup Form

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | text | Yes | Min 2 chars |
| Email | email | Yes | Valid email, unique |
| Phone | tel | No | 10 digits |
| Password | password | Yes | Min 8 chars |
| Confirm Password | password | Yes | Must match password |

## N4. Student Login Form

| Field | Type | Required | Accepts |
|-------|------|----------|---------|
| Identifier | text | Yes | Student ID (CS-XXXX) OR Email OR Phone |

Then OTP step:
| Field | Type | Required |
|-------|------|----------|
| OTP | 6 digits | Yes |

---

# SECTION O: Z-INDEX HIERARCHY

| Element | Z-Index |
|---------|---------|
| Base Content | 1 |
| Floating Cards | 10 |
| Sticky Elements | 100 |
| Chat Widget | 1000 |
| Navbar | 1000 |
| Mobile Menu Overlay | 998 |
| Mobile Menu | 999 |
| Dropdown | 9001 |
| Modal Backdrop | 10000 |
| Modal | 10001 |
| Toast | 11000 |
| Spotlight/Search | 12000 |

---

# SECTION P: RESPONSIVE BREAKPOINTS

| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | >1024px | Full layout, 4-column grids |
| Tablet | 768-1024px | 2-column grids, reduced padding |
| Mobile | <768px | Single column, hamburger menu |
| Small Mobile | <480px | Further reduced spacing |

## P1. Key Responsive Adjustments

### At <1024px
- Hero: Single column, image hidden
- Course grid: 2 columns
- Feature grid: 2 columns
- Founder section: Stacked
- Footer: 2×2 grid

### At <768px
- Navigation: Hamburger menu
- All grids: Single column
- Section padding: 50px
- Container padding: 1.25rem
- Footer: Single column
- Stats: Horizontal, smaller

### At <480px
- H1: Reduced size
- Buttons: Full width
- Stat numbers: 2rem

---

# SECTION Q: SEO REQUIREMENTS

## Q1. Meta Tags (Every Page)

| Tag | Required |
|-----|----------|
| title | Yes |
| meta description | Yes |
| meta viewport | Yes |
| canonical | Yes |
| og:title | Yes |
| og:description | Yes |
| og:type | Yes |
| og:url | Yes |
| og:image | Yes |
| twitter:card | Yes |

## Q2. Heading Structure

- One H1 per page
- Logical H2→H3→H4 hierarchy
- No skipped levels

## Q3. Image Requirements

| Attribute | Required |
|-----------|----------|
| alt | Yes, descriptive |
| loading | "lazy" for below-fold |
| width/height | Recommended |

---

# SECTION R: ACCESSIBILITY

## R1. Focus States
- All interactive elements must have visible focus
- Focus ring: 2-3px, primary color glow

## R2. ARIA Labels
- All icon-only buttons need aria-label
- Form inputs linked to labels
- Modal has role="dialog"

## R3. Color Contrast
- Text on backgrounds: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio

## R4. Keyboard Navigation
- Tab order follows visual order
- Escape closes modals
- Enter activates buttons

---

# SECTION S: CONTACT INFORMATION

**Never modify these values:**

| Field | Value |
|-------|-------|
| Phone | +91 7842239090 |
| Phone (Display) | +91 78422 39090 |
| Email | team.craftsoft@gmail.com |
| WhatsApp Link | https://wa.me/917842239090 |
| Address Line 1 | Plot No. 163, Vijayasree Colony |
| Address Line 2 | Vanasthalipuram, Hyderabad |
| Pincode | 500070 |
| State | Telangana |
| Country | India |
| Instagram | @craftsoft_ |
| Instagram URL | https://instagram.com/craftsoft_ |
| LinkedIn | /company/abhis-craftsoft |
| LinkedIn URL | https://linkedin.com/company/abhis-craftsoft |
| Google Maps Coordinates | 17.3215, 78.5519 |

---

# SECTION T: WHATSAPP MESSAGE TEMPLATES

| Context | Pre-filled Message |
|---------|-------------------|
| General Inquiry | "Hi! I'd like to know more about your courses." |
| Course Inquiry | "Hi! I'm interested in the [Course Name] course." |
| Service Inquiry | "Hi! I'd like to discuss [Service Name] services." |
| Student Support | "Hi! I need help with my Student Portal." |
| Portfolio | "Hi! I'd like to discuss a project." |

URL Format: `https://wa.me/917842239090?text={encoded_message}`

---

# SECTION U: DATA FORMATS

## U1. ID Formats

| Entity | Format | Example |
|--------|--------|---------|
| Admin ID | ACS-XX | ACS-01, ACS-15 |
| Student ID | CS-XXXX | CS-0001, CS-0256 |

## U2. Phone Format

| Stage | Format |
|-------|--------|
| Display | +91 78422 39090 |
| Storage | 7842239090 (10 digits only) |
| Link | tel:+917842239090 |

## U3. Date Formats

| Context | Format |
|---------|--------|
| Display | DD MMM YYYY (e.g., 29 Jan 2026) |
| Relative | "2 hours ago", "Yesterday" |

## U4. Currency Format

| Format | Example |
|--------|---------|
| Display | ₹XX,XXX |
| Symbol | ₹ (Unicode: ₹ or &#8377;) |
| Thousands | Indian numbering (12,34,567) |

---

# SECTION V: EXTERNAL SERVICES

## V1. Authentication Provider
- Supabase Auth
- Email + Password for Admin
- Magic Link (OTP) for Student

## V2. Database
- Supabase (PostgreSQL)
- Row Level Security enabled

## V3. Hosting
- Cloudflare Pages

## V4. CDN
- Cloudflare

## V5. Fonts
- Google Fonts

## V6. Icons
- Font Awesome 6.5.1 Free

---

# SECTION W: QUALITY CHECKLIST

Before marking any page complete:

## Visual
- [ ] All fonts load correctly
- [ ] Gradient text renders in all browsers
- [ ] Logo appears exactly as live site
- [ ] Navbar glass effect works
- [ ] All colors match hex values
- [ ] Shadows appear correctly
- [ ] Border radius consistent

## Interaction
- [ ] Hover states on all interactive elements
- [ ] Focus states visible
- [ ] Transitions smooth (no jank)
- [ ] Click/tap targets minimum 44×44px
- [ ] Forms validate correctly
- [ ] Error states display properly

## Responsive
- [ ] Desktop layout correct
- [ ] Tablet layout correct
- [ ] Mobile layout correct
- [ ] Mobile menu works
- [ ] No horizontal scroll

## Functionality
- [ ] All links work
- [ ] Forms submit correctly
- [ ] Authentication flows complete
- [ ] Dynamic content loads

## Performance
- [ ] Page loads under 3 seconds
- [ ] No layout shift
- [ ] Images optimized

---

**FINAL INSTRUCTION:**
Your implementation must be visually indistinguishable from the live websites. Use this document for exact values. When a specification is unclear, open the live URL and match it precisely.

---

*End of Specification*
