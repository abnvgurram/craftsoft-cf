# Abhi's Craftsoft — Agent Handover Document
**Version:** 2.1  
**Last Updated:** January 29, 2026  
**Domain:** [craftsoft.co.in](https://www.craftsoft.co.in)  
**Analysis Date:** January 29, 2026

---

## Table of Contents
1. [Brand Overview](#1-brand-overview)
2. [Visual Identity & Design Tokens](#2-visual-identity--design-tokens)
3. [Typography](#3-typography)
4. [Site Architecture & Sitemap](#4-site-architecture--sitemap)
5. [Subdomain Structure](#5-subdomain-structure)
6. [URL Aliases & Redirects](#6-url-aliases--redirects)
7. [Edge Worker Routing Logic](#7-edge-worker-routing-logic)
8. [Key Components & Patterns](#8-key-components--patterns)
9. [JavaScript Initializers](#9-javascript-initializers)
10. [Backend & Integrations](#10-backend--integrations)
11. [Deployment & Hosting](#11-deployment--hosting)
12. [Security Notes](#12-security-notes)
13. [Operational Runbook](#13-operational-runbook)
14. [Contact & Support](#14-contact--support)

---

## 1. Brand Overview

### Brand Name
**Abhi's Craftsoft**

### Tagline
*"Your career transformation starts here"*

### Brand Description
Abhi's Craftsoft is a premier IT training institute located in Hyderabad, India. The organization offers comprehensive courses in software development, cloud computing, data analytics, and professional skills, alongside design and development services for businesses.

### Primary Business Offerings
- **IT Training Courses** — Full Stack Development, DevOps, Cloud (AWS/Azure), Salesforce, Data Analytics, Graphic Design, UI/UX, and more.
- **Professional Services** — Website Development, UI/UX Design, Graphic Design, Branding, Cloud & DevOps Solutions.

### Contact Information
- **Address:** Plot No. 163, Vijayasree Colony, Vanasthalipuram, Hyderabad, India - 500070
- **Phone:** +91-7842239090
- **Email:** team.craftsoft@gmail.com
- **WhatsApp:** +91-7842239090
- **Social:** [@craftsoft_](https://www.instagram.com/craftsoft_) (Instagram), [LinkedIn](https://www.linkedin.com/company/abhis-craftsoft)

### Business Hours
- **Training Center:** Monday to Saturday, 9:00 AM - 7:00 PM
- **Online Support:** 24/7 via WhatsApp and Email

### Founding Information
- **Founded:** 2019
- **Founder:** Abhinav Gurram
- **Student Count:** 100+ (as of Jan 2026)
- **Course Offerings:** 25+ courses
- **Average Rating:** 4.9/5.0

---

## 2. Visual Identity & Design Tokens

### Primary Color Palette

| Token               | Value                                      | Usage                     |
|---------------------|---------------------------------------------|---------------------------|
| `--primary-50`      | `#edf6fb`                                   | Lightest tint             |
| `--primary-100`     | `#d4eaf5`                                   | Light tint                |
| `--primary-200`     | `#a9d5eb`                                   | Subtle backgrounds        |
| `--primary-300`     | `#7ec0e1`                                   | Hover states              |
| `--primary-400`     | `#53abd7`                                   | Active elements           |
| `--primary-500`     | `#2896cd`                                   | **Main brand color**      |
| `--primary-600`     | `#1a7eb0`                                   | Dark accent               |
| `--primary-700`     | `#156691`                                   | Darker accent             |
| `--primary-800`     | `#104e72`                                   | Very dark                 |
| `--primary-900`     | `#0b3653`                                   | Darkest                   |

### Accent Gradients

| Token                 | Value                                                    |
|-----------------------|----------------------------------------------------------|
| `--accent-gradient`   | `linear-gradient(135deg, #2896cd 0%, #6C5CE7 100%)`      |
| `--accent-gradient-2` | `linear-gradient(135deg, #00B894 0%, #00CEC9 100%)`      |

### Neutral/Grayscale

| Token          | Value       |
|----------------|-------------|
| `--white`      | `#ffffff`   |
| `--gray-50`    | `#f8fafc`   |
| `--gray-100`   | `#f1f5f9`   |
| `--gray-200`   | `#e2e8f0`   |
| `--gray-300`   | `#cbd5e1`   |
| `--gray-400`   | `#94a3b8`   |
| `--gray-500`   | `#64748b`   |
| `--gray-600`   | `#475569`   |
| `--gray-700`   | `#334155`   |
| `--gray-800`   | `#1e293b`   |
| `--gray-900`   | `#0f172a`   |

### Page & Card Backgrounds

| Token              | Value                          |
|--------------------|--------------------------------|
| `--page-bg`        | `#f0f7fb`                      |
| `--card-bg`        | `rgba(40, 150, 205, 0.04)`     |
| `--card-bg-hover`  | `rgba(40, 150, 205, 0.08)`     |
| `--section-bg`     | `rgba(40, 150, 205, 0.06)`     |
| `--card-border`    | `rgba(40, 150, 205, 0.12)`     |
| `--divider-color`  | `rgba(40, 150, 205, 0.15)`     |

### Semantic Colors

| Token        | Value       | Usage              |
|--------------|-------------|--------------------|
| `--success`  | `#10B981`   | Success states     |
| `--warning`  | `#F59E0B`   | Warnings           |
| `--error`    | `#EF4444`   | Errors/Destructive |
| `--info`     | `#3B82F6`   | Informational      |

### Spacing Scale

| Token              | Value       |
|--------------------|-------------|
| `--spacing-xs`     | `0.25rem`   |
| `--spacing-sm`     | `0.5rem`    |
| `--spacing-md`     | `1rem`      |
| `--spacing-lg`     | `1.5rem`    |
| `--spacing-xl`     | `2rem`      |
| `--spacing-2xl`    | `3rem`      |
| `--spacing-3xl`    | `4rem`      |
| `--spacing-4xl`    | `6rem`      |
| `--spacing-5xl`    | `8rem`      |

### Section Padding

| Token                        | Value    |
|------------------------------|----------|
| `--section-padding-desktop`  | `100px`  |
| `--section-padding-tablet`   | `70px`   |
| `--section-padding-mobile`   | `50px`   |

### Border Radius

| Token            | Value       |
|------------------|-------------|
| `--radius-sm`    | `0.375rem`  |
| `--radius-md`    | `0.5rem`    |
| `--radius-lg`    | `0.75rem`   |
| `--radius-xl`    | `1rem`      |
| `--radius-2xl`   | `1.5rem`    |
| `--radius-full`  | `9999px`    |

### Shadows

| Token           | Value                                                                    |
|-----------------|--------------------------------------------------------------------------|
| `--shadow-sm`   | `0 1px 2px 0 rgba(0, 0, 0, 0.05)`                                        |
| `--shadow-md`   | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)`        |
| `--shadow-lg`   | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)`      |
| `--shadow-xl`   | `0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)`    |
| `--shadow-2xl`  | `0 25px 50px -12px rgba(0,0,0,0.25)`                                     |
| `--shadow-glow` | `0 0 40px rgba(40, 150, 205, 0.15)`                                      |

### Transitions

| Token               | Value       |
|---------------------|-------------|
| `--transition-fast` | `150ms ease`|
| `--transition-base` | `300ms ease`|
| `--transition-slow` | `500ms ease`|

### Container

| Token                 | Value       |
|-----------------------|-------------|
| `--container-max`     | `1240px`    |
| `--container-padding` | `2.5rem`    |

---

## 3. Typography

### Font Families

| Role            | Font Family               | Fallback       |
|-----------------|---------------------------|----------------|
| **Primary**     | `Outfit`                  | `sans-serif`   |
| **Secondary**   | `Inter`                   | `sans-serif`   |
| **Logo Script** | `Italianno`               | `cursive`      |

### Font Loading
Fonts are loaded from **Google Fonts**:
```html
<link href="https://fonts.googleapis.com/css2?family=Italianno&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Font Weight Mapping
| Font Family | Weights Available | Usage Context |
|-------------|-------------------|---------------|
| **Outfit**  | 400, 500, 600, 700, 800 | Headings (h1-h6), Hero text, Section titles |
| **Inter**   | 300, 400, 500, 600, 700, 800 | Body text, Paragraphs, Labels, UI elements |
| **Italianno**| Regular | Logo signature "Abhi's" portion only |

### Typography Scale
| Element | Font Family | Size | Weight | Line Height |
|---------|-------------|------|--------|-------------|
| **H1** | Outfit | 2.5rem - 4rem | 700-800 | 1.1-1.2 |
| **H2** | Outfit | 2rem - 3rem | 700 | 1.2 |
| **H3** | Outfit | 1.5rem - 2rem | 600-700 | 1.2 |
| **H4** | Outfit | 1.25rem - 1.5rem | 600 | 1.3 |
| **Body** | Inter | 1rem | 400 | 1.6 |
| **Small** | Inter | 0.875rem | 400 | 1.5 |

### Text Utilities
| Class | Purpose |
|-------|---------|
| `.gradient-text` | Applies primary gradient to text |
| `.highlight` | Uses primary-600 color for emphasis |
| `.logo-signature` | Special styling for "Abhi's" cursive text |

---

## 4. Site Architecture & Sitemap

### Main Website (craftsoft.co.in)

| URL Path                          | Description                              |
|-----------------------------------|------------------------------------------|
| `/`                               | Homepage                                 |
| `/about/`                         | About Us page                            |
| `/courses/`                       | Courses listing page                     |
| `/courses/python/`                | Python Full Stack Development            |
| `/courses/java/`                  | Java Full Stack Development              |
| `/courses/full-stack/`            | MERN Full Stack Development              |
| `/courses/react/`                 | React JS                                 |
| `/courses/devops/`                | DevOps Engineering                       |
| `/courses/devsecops/`             | DevSecOps                                |
| `/courses/aws/`                   | AWS Cloud Excellence                     |
| `/courses/azure/`                 | Microsoft Azure                          |
| `/courses/salesforce/`            | Salesforce Administration                |
| `/courses/salesforce-developer/`  | Salesforce Developer                     |
| `/courses/salesforce-marketing-cloud/` | Salesforce Marketing Cloud          |
| `/courses/data-analytics/`        | Data Analytics                           |
| `/courses/ai-ml/`                 | AI & Machine Learning                    |
| `/courses/sql/`                   | SQL & Databases                          |
| `/courses/dsa/`                   | Data Structures & Algorithms             |
| `/courses/git-github/`            | Git & GitHub                             |
| `/courses/automation-python/`     | Automation with Python                   |
| `/courses/python-programming/`    | Python Programming                       |
| `/courses/cyber-security/`        | Cyber Security                           |
| `/courses/oracle-fusion-cloud/`   | Oracle Fusion Cloud                      |
| `/courses/service-now/`           | ServiceNow                               |
| `/courses/ui-ux/`                 | UI/UX Design                             |
| `/courses/graphic-design/`        | Graphic Design                           |
| `/courses/soft-skills/`           | Soft Skills Training                     |
| `/courses/spoken-english/`        | Spoken English                           |
| `/courses/handwriting/`           | Handwriting Improvement                  |
| `/courses/resume-interview/`      | Resume & Interview Prep                  |
| `/services/`                      | Services landing page                    |
| `/services/web-development/`      | Website Development service              |
| `/services/ui-ux-design/`         | UI/UX Design service                     |
| `/services/graphic-design/`       | Graphic Design service                   |
| `/services/branding/`             | Branding & Marketing service             |
| `/services/cloud-devops/`         | Cloud & DevOps Solutions                 |
| `/services/career-services/`      | Career & Placement Services              |
| `/contact/`                       | Contact Us page                          |
| `/portfolio/`                     | Portfolio / Case Studies                 |
| `/privacy-policy/`                | Privacy Policy                           |
| `/terms-of-service/`              | Terms of Service                         |
| `/verify/`                        | Email verification page                  |
| `/404.html`                       | Custom 404 page                          |

---

## 5. Subdomain Structure

### Overview

| Subdomain                          | Purpose                                |
|------------------------------------|----------------------------------------|
| `www.craftsoft.co.in`              | Main public website                    |
| `admin.craftsoft.co.in`            | Staff/Admin portal                     |
| `students.craftsoft.co.in`         | Student portal                         |
| `signup.craftsoft.co.in`           | Registration & enrollment              |

---

### Admin Portal (`admin.craftsoft.co.in`)

| URL Path                    | Description                          |
|-----------------------------|--------------------------------------|
| `/`                         | Login page                           |
| `/dashboard/`               | Admin dashboard                      |
| `/students/`                | Student records management           |
| `/clients/`                 | Client records management            |
| `/courses/`                 | Course management                    |
| `/services/`                | Service offerings management         |
| `/inquiries/`               | Inquiry/lead management              |
| `/tutors/`                  | Tutor/instructor management          |
| `/upload-materials/`        | Upload learning materials            |
| `/assignments/`             | Assignment management                |
| `/submissions/`             | View student submissions             |
| `/record-payment/`          | Record a new payment                 |
| `/all-payments/`            | View all payment records             |
| `/receipts/`                | Payment receipts                     |
| `/archived/`                | Archived records                     |
| `/recently-deleted/`        | Recently deleted records             |
| `/settings/`                | Admin settings                       |
| `/version-history/`         | Platform version history             |
| `/verify-email.html`        | Email verification                   |
| `/404/`                     | Admin-specific 404 page              |

---

### Student Portal (`students.craftsoft.co.in`)

| URL Path                | Description                        |
|-------------------------|------------------------------------|
| `/`                     | Login page                         |
| `/dashboard/`           | Student dashboard                  |
| `/courses/`             | Enrolled courses                   |
| `/materials/`           | Learning materials                 |
| `/assignments/`         | View and submit assignments        |
| `/payments/`            | Payment history                    |
| `/profile/`             | Student profile                    |
| `/privacy-policy.html`  | Privacy policy                     |
| `/terms-of-service.html`| Terms of service                   |
| `/404/`                 | Student-specific 404 page          |

---

### Signup Portal (`signup.craftsoft.co.in`)

| URL Path              | Description                          |
|-----------------------|--------------------------------------|
| `/`                   | Registration form                    |
| `/verify-email.html`  | Email verification                   |
| `/404/`               | Signup-specific 404 page             |

---

## 6. URL Aliases & Redirects

### Course Short Links (Internal Rewrite)

| Short URL                | Resolves To                              |
|--------------------------|------------------------------------------|
| `/c-python/`             | `/courses/python/`                       |
| `/c-java/`               | `/courses/java/`                         |
| `/c-full-stack/`         | `/courses/full-stack/`                   |
| `/c-react/`              | `/courses/react/`                        |
| `/c-devops/`             | `/courses/devops/`                       |
| `/c-devsecops/`          | `/courses/devsecops/`                    |
| `/c-aws/`                | `/courses/aws/`                          |
| `/c-azure/`              | `/courses/azure/`                        |
| `/c-salesforce/`         | `/courses/salesforce/`                   |
| `/c-salesforce-developer/` | `/courses/salesforce-developer/`       |
| `/c-salesforce-marketing-cloud/` | `/courses/salesforce-marketing-cloud/` |
| `/c-data-analytics/`     | `/courses/data-analytics/`               |
| `/c-ai-ml/`              | `/courses/ai-ml/`                        |
| `/c-sql/`                | `/courses/sql/`                          |
| `/c-dsa/`                | `/courses/dsa/`                          |
| `/c-git-github/`         | `/courses/git-github/`                   |
| `/c-automation-python/`  | `/courses/automation-python/`            |
| `/c-python-programming/` | `/courses/python-programming/`           |
| `/c-cyber-security/`     | `/courses/cyber-security/`               |
| `/c-oracle-fusion-cloud/`| `/courses/oracle-fusion-cloud/`          |
| `/c-ui-ux/`              | `/courses/ui-ux/`                        |
| `/c-graphic-design/`     | `/courses/graphic-design/`               |
| `/c-soft-skills/`        | `/courses/soft-skills/`                  |
| `/c-spoken-english/`     | `/courses/spoken-english/`               |
| `/c-handwriting/`        | `/courses/handwriting/`                  |
| `/c-resume-interview/`   | `/courses/resume-interview/`             |

### Service Short Links (Internal Rewrite)

| Short URL               | Resolves To                           |
|-------------------------|---------------------------------------|
| `/s-web-development/`   | `/acs_services/web-development/`      |
| `/s-ui-ux-design/`      | `/acs_services/ui-ux-design/`         |
| `/s-branding/`          | `/acs_services/branding/`             |
| `/s-graphic-design/`    | `/acs_services/graphic-design/`       |
| `/s-cloud-devops/`      | `/acs_services/cloud-devops/`         |
| `/s-career-services/`   | `/acs_services/career-services/`      |

### Legacy Redirects (301 Permanent)

| Old Path                  | Redirects To              |
|---------------------------|---------------------------|
| `/about.html`             | `/about/`                 |
| `/contact.html`           | `/contact/`               |
| `/courses.html`           | `/courses/`               |
| `/services.html`          | `/acs_services/`          |
| `/privacy-policy.html`    | `/privacy-policy/`        |
| `/terms-of-service.html`  | `/terms-of-service/`      |

---

## 7. Edge Worker Routing Logic

The site uses a **Cloudflare Pages Worker** (`_worker.js`) for request routing. Here's the high-level logic:

### Routing Priority

1. **Internal Asset Passthrough**: Requests to `/acs_subdomains/` are served directly from the asset store.

2. **Virtual Asset Routing**:
   - `/assets/admin/*` → Rewrites to admin subdomain assets
   - `/assets/student/*` → Rewrites to student portal assets

3. **Shared Assets**: `/assets/`, `/shared/`, `/favicon.ico`, `/favicon.svg` are served directly with correct MIME types.

4. **Subdomain Dispatch**:
   - Hostname contains `admin` → Serve from `acs_admin` folder
   - Hostname contains `signup` → Serve from `acs_signup` folder
   - Hostname contains `student` → Serve from `acs_students` folder

5. **301 Redirects**: Legacy `.html` paths redirect to clean URLs.

6. **Alias Rewrites**: Short links (`/c-python/`, `/s-web-development/`) internally rewrite to canonical paths (200 response, URL stays clean).

7. **Default**: Serve from main website asset store.

### Critical Behavior
- **MIME Types**: `.js` files return `Content-Type: application/javascript`, `.css` files return `Content-Type: text/css`.
- **Security Header**: All assets include `X-Content-Type-Options: nosniff`.
- **SPA Fallback**: For client routes (no file extension), the worker serves `index.html` from the appropriate sub-app.
- **404 Handling**: Each subdomain has its own custom 404 page.

---

## 8. Key Components & Patterns

### Reusable Components

| Component          | Description                                      |
|--------------------|--------------------------------------------------|
| **Logo Signature** | Brand logo with cursive "Abhi's" + "Craftsoft"   |
| **Footer**         | Shared footer loaded dynamically via JS          |
| **Quiz Widget**    | Interactive career quiz                          |
| **Testimonials**   | Customer testimonial cards                       |

### Component Loading Pattern
Components follow a fetch-and-render pattern:
1. Fetch JSON data file (e.g., `testimonials.json`)
2. Render semantic HTML into a container element
3. Call the appropriate global initializer (e.g., `initTestimonials()`)

### Data Schema Examples

**Testimonial Entry:**
```json
{
  "name": "Student Name",
  "role": "Course Attended",
  "text": "Testimonial content...",
  "photo": "optional-photo-url.jpg"
}
```

**FAQ Entry:**
```json
{
  "question": "Question text",
  "answer": "Answer text (HTML allowed)",
  "id": "unique-id",
  "tags": ["optional", "tags"]
}
```

---

## 9. JavaScript Initializers

The main script exposes these global initializer functions:

| Function                  | Purpose                                        |
|---------------------------|------------------------------------------------|
| `initNavbar()`            | Sets active link state and scroll behavior     |
| `initMobileMenu()`        | Toggles mobile hamburger menu                  |
| `initScrollAnimations()`  | Intersection observer-based animations         |
| `initQuiz()`              | Sets up career quiz CTAs and inline flows      |
| `initFooter()`            | Loads and initializes footer component         |
| `initTestimonials()`      | Renders testimonial cards                      |

### Usage
After dynamically injecting HTML, call the appropriate initializer:
```javascript
// After rendering FAQ items
initFAQ();

// After page load
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
});
```

---

## 10. Backend & Integrations

### Supabase (Database & Auth)
- **Service**: Supabase (PostgreSQL + Auth)
- **Purpose**: Student/Admin authentication, enrollment data, payment records
- **Client Config**: Public anon key is exposed to client (safe with RLS)

### WhatsApp Integration
- Contact forms integrate with WhatsApp for direct inquiry flows
- Pattern: Pre-formatted message URLs

### Form Submissions
- Contact form submissions are stored in Supabase
- Optional email notifications via Supabase Edge Functions

---

## 11. Deployment & Hosting

### Infrastructure
| Component         | Provider                 |
|-------------------|--------------------------|
| Hosting           | Cloudflare Pages         |
| CDN               | Cloudflare               |
| DNS               | Cloudflare               |
| Database          | Supabase                 |
| Domain Registrar  | External (configured)    |

### Deployment Workflow
1. Push changes to `main` branch on GitHub
2. Cloudflare Pages automatically builds and deploys
3. Preview deployments available on feature branches

### Cache Busting
- Static assets use long cache headers
- For immediate updates, use query string versioning: `?v=20260129`
- Or purge CDN cache for specific URLs

---

## 12. Security Notes

### Public Keys
- Supabase anon key is intentionally public (client-side auth, enforced by RLS)
- Never commit service-role keys or admin credentials

### Headers
- `X-Content-Type-Options: nosniff` on all assets
- `X-Frame-Options: SAMEORIGIN` on pages
- `X-XSS-Protection: 1; mode=block`

### Best Practices
- Use Row Level Security (RLS) in Supabase for data access control
- Validate all user inputs server-side
- Keep dependencies updated

---

## 13. Operational Runbook

### Common Tasks

#### Update a Course Page
1. Modify the course HTML file
2. Commit and push to `main`
3. Verify deployment on live site

#### Update Pricing/Content
1. Edit the relevant HTML or JSON file
2. If using JSON, bump the version parameter
3. Commit and push

#### Add a New Course
1. Create new folder: `courses/[course-slug]/`
2. Add `index.html` with course content
3. Add short link alias to `_worker.js`
4. Update courses listing page
5. Commit and push

#### Rollback to Previous Version
```bash
git reset --hard <COMMIT_SHA>
git push --force origin main
```

### Troubleshooting

#### JS/CSS Not Loading (MIME Error)
- Check if worker is returning `text/html` instead of correct type
- Verify `serveAsset()` function in `_worker.js`
- Ensure file exists at expected path

#### Subdomain Not Working
- Verify DNS records in Cloudflare
- Check hostname matching in worker
- Test with `curl -I https://subdomain.craftsoft.co.in`

#### 404 on Valid Page
- Check if path is correctly mapped in worker
- Verify file exists
- Check for trailing slash issues

---

## 14. Contact & Support

### Organization
**Abhi's Craftsoft**  
Vanasthalipuram, Hyderabad, India

### Website
[www.craftsoft.co.in](https://www.craftsoft.co.in)

### Admin Portal
[admin.craftsoft.co.in](https://admin.craftsoft.co.in)

### Student Portal
[students.craftsoft.co.in](https://students.craftsoft.co.in)

---

## 15. Technical Implementation Details

### CSS Architecture
The website uses a modular CSS architecture with the following structure:

```
assets/css/
├── master.css              # Main stylesheet that imports all modules
├── main.bundle.css         # Bundled production stylesheet
├── main.bundle.min.css     # Minified production stylesheet
├── base/                   # Base styles and variables
│   ├── variables.css       # CSS custom properties (design tokens)
│   ├── reset.css           # CSS reset styles
│   ├── typography.css      # Typography definitions
│   └── sections.css       # Base section styles
├── components/             # Reusable component styles
│   ├── navbar.css          # Navigation bar styles
│   ├── buttons.css         # Button components
│   ├── testimonials.css    # Testimonial cards
│   ├── faq.css             # FAQ accordion
│   ├── footer.css          # Footer component
│   ├── floating.css        # Floating elements
│   ├── extras.css          # Additional components
│   ├── unified-cards.css   # Card component system
│   └── custom-select.css   # Custom select dropdowns
├── sections/               # Page-specific section styles
│   ├── hero.css            # Hero section
│   ├── about.css           # About section
│   ├── courses.css         # Courses section
│   ├── services.css        # Services section
│   ├── why-choose-us.css   # Why choose us section
│   ├── founder.css         # Founder section
│   └── contact.css         # Contact section
├── pages/                  # Page-specific styles
│   └── all-pages.css       # Shared page styles
└── utilities/              # Utility classes
    ├── animations.css      # Animation keyframes
    └── responsive.css      # Media queries
```

### JavaScript Architecture
The JavaScript is organized into modules and components:

```
assets/js/
├── main.js                 # Main application logic
├── main.min.js            # Minified production version
├── quiz.js                # Career quiz functionality
├── quiz.min.js            # Minified quiz version
├── supabase-website-config.js  # Database configuration
├── custom-select.js       # Custom dropdown functionality
├── inquiry-sync.js        # Form submission handling
├── phone-input-injector.js # Phone number input formatting
├── search-bar.js          # Search functionality
├── skeleton.js            # Loading skeleton management
└── snowflakes.js           # Seasonal animation effects
```

### Component System
The website uses a component-based architecture:

```
assets/components/
├── footer/                # Footer component
│   ├── footer.css         # Footer styles
│   └── footer.js          # Footer functionality
├── logo-signature/        # Logo component
│   ├── logo-signature.css # Logo styles
│   └── logo-signature.js  # Logo rendering
├── quiz/                  # Quiz component
│   └── quiz.css           # Quiz styles
└── testimonials/          # Testimonials component
    ├── testimonials-data.js # Testimonials data
    └── testimonials.js     # Testimonials rendering
```

### Build System
The website uses npm scripts for building:

```json
{
  "scripts": {
    "inject": "node scripts/inject-env.js",
    "build:js": "npx terser assets/js/main.js -o assets/js/main.min.js -c -m && npx terser assets/js/quiz.js -o assets/js/quiz.min.js -c -m",
    "build:css": "npx cleancss -o assets/css/main.bundle.min.css assets/css/main.bundle.css",
    "build": "npm run inject && npm run build:js && npm run build:css",
    "deploy": "npm run build && netlify deploy --prod --dir=."
  }
}
```

### Database Integration
- **Provider:** Supabase (PostgreSQL + Auth)
- **URL:** https://afocbygdakyqtmmrjvmy.supabase.co
- **Authentication:** Row Level Security (RLS) enabled
- **Usage:** Student records, course enrollments, contact forms, payments

### Performance Optimizations
- **Code Splitting:** Separate bundles for main.js and quiz.js
- **CSS Minification:** Using clean-css-cli
- **JavaScript Minification:** Using Terser
- **Asset Caching:** 1-hour cache for assets, immediate for HTML
- **Font Optimization:** Google Fonts with display=swap
- **Image Optimization:** WebP format where supported

### Security Features
- **Content Security Policy:** Comprehensive CSP header
- **X-Frame-Options:** SAMEORIGIN
- **X-XSS-Protection:** Enabled with block mode
- **X-Content-Type-Options:** nosniff
- **Referrer Policy:** strict-origin-when-cross-origin

### SEO Implementation
- **Structured Data:** JSON-LD for organization and courses
- **Meta Tags:** Comprehensive Open Graph and Twitter cards
- **Semantic HTML:** Proper heading hierarchy and semantic elements
- **URL Structure:** Clean, descriptive URLs
- **Sitemap:** Auto-generated sitemap.xml

### Accessibility Features
- **ARIA Labels:** Proper labeling for interactive elements
- **Keyboard Navigation:** Full keyboard accessibility
- **Screen Reader Support:** Semantic HTML and ARIA roles
- **Color Contrast:** WCAG AA compliant color ratios
- **Focus Management:** Visible focus indicators

---

## 16. Content Management System

### Data-Driven Components
Several components are data-driven through JSON files:

#### Testimonials Management
```javascript
// File: assets/components/testimonials/testimonials-data.js
const TESTIMONIALS = [
    {
        stars: 5,
        quote: "Deep curriculum with real-world projects.",
        name: "Rahul Sharma",
        role: "Full Stack Developer"
    }
    // ... more testimonials
];
```

#### Course Data Structure
Each course page follows a consistent structure:
- Course title and description
- Learning outcomes
- Curriculum modules
- Duration and schedule
- Pricing information
- Enrollment CTA

#### Service Pages Structure
Services follow this pattern:
- Service overview
- Key features
- Process workflow
- Portfolio examples
- Contact form

### Dynamic Content Loading
The website uses JavaScript to dynamically load:
- Footer component
- Testimonials wall
- Course listings
- Quiz questions
- Search results

---

## 17. Analytics and Monitoring

### Website Analytics
- **Google Analytics:** Implemented via gtag.js
- **Form Tracking:** Custom event tracking for submissions
- **User Engagement:** Scroll depth and time on page
- **Conversion Tracking:** Course inquiries and signups

### Performance Monitoring
- **Core Web Vitals:** LCP, FID, CLS tracking
- **Error Tracking:** JavaScript error logging
- **Uptime Monitoring:** Cloudflare analytics
- **CDN Performance:** Asset delivery metrics

---

## 18. Development Workflow

### Version Control
- **Repository:** Git-based version control
- **Branching:** Feature branches for development
- **Deployment:** Automatic deployment on main branch push

### Local Development
```bash
# Install dependencies
npm install

# Build for development
npm run build

# Deploy to production
npm run deploy
```

### Code Quality
- **Linting:** ESLint for JavaScript
- **Formatting:** Prettier for code formatting
- **Validation:** HTML5 validation
- **Testing:** Manual testing across browsers

---

## 19. Emergency Procedures

### Website Down
1. Check Cloudflare status
2. Verify deployment logs
3. Check DNS propagation
4. Contact hosting provider if needed

### Database Issues
1. Check Supabase status
2. Verify connection strings
3. Review RLS policies
4. Backup restoration if needed

### Security Incident
1. Review access logs
2. Check for unauthorized changes
3. Update passwords/keys
4. Notify stakeholders

---

*End of Agent Handover Document*
