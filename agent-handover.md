# Craftsoft React Migration — Complete Technical Handover

**Document Version:** 3.0  
**Last Updated:** January 29, 2026  
**Purpose:** Complete conversion reference for migrating static HTML/CSS/JS to React + Material UI

---

## 🎯 Source of Truth

**IMPORTANT:** When in doubt, always refer to the LIVE websites. They are the final authority on visual appearance, behavior, and interactions.

| Portal | Live URL | Purpose |
|--------|----------|---------|
| **Main Website** | https://www.craftsoft.co.in | Public-facing marketing site with courses, services, contact |
| **Admin Portal** | https://admin.craftsoft.co.in | Staff management dashboard |
| **Student Portal** | https://acs-student.craftsoft.co.in | Student login & learning portal |
| **Signup Portal** | https://signup.craftsoft.co.in | Admin account registration |

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Design Tokens (CSS Variables)](#2-design-tokens-css-variables)
3. [Typography System](#3-typography-system)
4. [Color Palette](#4-color-palette)
5. [Spacing & Layout](#5-spacing--layout)
6. [Shadows & Effects](#6-shadows--effects)
7. [Animation Patterns](#7-animation-patterns)
8. [Component Library](#8-component-library)
9. [Page Structure & Routing](#9-page-structure--routing)
10. [Authentication Flows](#10-authentication-flows)
11. [Database Schema](#11-database-schema)
12. [API Integration](#12-api-integration)
13. [Material UI Mapping](#13-material-ui-mapping)
14. [Critical Implementation Notes](#14-critical-implementation-notes)

---

## 1. Brand Identity

### Brand Name
**Abhi's Craftsoft**

### Tagline
*"Your career transformation starts here"*

### Logo Structure
The logo consists of TWO parts with DIFFERENT fonts:
```
[Abhi's]  [Craftsoft]
  ↓           ↓
Italianno  Outfit (gradient text)
(cursive)  (bold, accent-gradient)
```

### Logo Implementation (React Component)
```jsx
// LogoSignature.jsx
const LogoSignature = ({ link = '/', variant = 'default' }) => {
  return (
    <a href={link} className="logo-component">
      <span className="logo-sig">Abhi's</span>
      <span className="logo-accent">Craftsoft</span>
    </a>
  );
};
```

### Logo CSS (MUST replicate exactly)
```css
.logo-sig {
  font-family: 'Italianno', cursive;
  font-weight: 400;
  font-size: 1.6em;      /* NOT rem, must be em for scaling */
  letter-spacing: 1px;
  color: #0f172a;        /* --gray-900 */
}

.logo-accent {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #2896cd 0%, #6C5CE7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 2. Design Tokens (CSS Variables)

All colors, spacing, and styling MUST use these exact tokens. When converting to Material UI theme, map these precisely.

### Primary Colors (Brand Blue)
```javascript
const primaryPalette = {
  50:  '#edf6fb',
  100: '#d4eaf5',
  200: '#a9d5eb',
  300: '#7ec0e1',
  400: '#53abd7',
  500: '#2896cd',  // ★ MAIN BRAND COLOR
  600: '#1a7eb0',
  700: '#156691',
  800: '#104e72',
  900: '#0b3653',
};
```

### Accent Colors (Secondary Purple & Green)
```javascript
const accentColors = {
  purple: {
    main: '#6C5CE7',
    light: '#A29BFE',
    dark: '#5B4BC7',
  },
  green: {
    main: '#00B894',
    secondary: '#00CEC9',
    dark: '#059669',
  },
  orange: {
    main: '#FF9500',
    light: '#FFBE0B',
    dark: '#D97706',
  }
};
```

### Neutral Colors (Grayscale)
```javascript
const grayPalette = {
  50:  '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',  // Default muted text
  600: '#475569',  // Secondary text
  700: '#334155',  // Body text
  800: '#1e293b',
  900: '#0f172a',  // ★ Headings, dark elements
};
```

### Semantic Colors
```javascript
const semanticColors = {
  success: '#10B981',
  warning: '#F59E0B',
  error:   '#EF4444',
  info:    '#3B82F6',
};
```

### Gradients (EXACT VALUES - DO NOT MODIFY)
```javascript
const gradients = {
  // Primary accent gradient - used for buttons, badges, text highlights
  accent: 'linear-gradient(135deg, #2896cd 0%, #6C5CE7 100%)',
  
  // Secondary accent - used for success states, highlights
  accent2: 'linear-gradient(135deg, #00B894 0%, #00CEC9 100%)',
  
  // Hero title gradient - three-color blend
  heroTitle: 'linear-gradient(135deg, #2896cd 0%, #6C5CE7 50%, #00B894 100%)',
  
  // Button gradients
  btnPrimary: 'linear-gradient(135deg, #2896cd 0%, #1a7fc4 100%)',
  btnPrimaryHover: 'linear-gradient(135deg, #1a7fc4 0%, #156ba8 100%)',
  btnSecondary: 'linear-gradient(135deg, #6C5CE7 0%, #5B4BC7 100%)',
  btnSecondaryHover: 'linear-gradient(135deg, #5B4BC7 0%, #4A3DB6 100%)',
  
  // Page backgrounds
  heroBg: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 40%, #f0f9ff 70%, #e0f2fe 100%)',
  sectionBg: 'linear-gradient(180deg, #edf6fb 0%, #ffffff 100%)',
  
  // Sidebar (Admin/Student)
  sidebar: 'linear-gradient(180deg, #edf6fb 0%, #e5f3fa 100%)',
  sidebarActive: 'linear-gradient(135deg, #2896cd 0%, #1a7eb0 100%)',
  
  // Quiz CTA
  quizCta: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
};
```

### Background Colors
```javascript
const backgrounds = {
  page: '#f0f7fb',              // Light blue tinted page background
  card: 'rgba(40, 150, 205, 0.04)',
  cardHover: 'rgba(40, 150, 205, 0.08)',
  section: 'rgba(40, 150, 205, 0.06)',
  cardBorder: 'rgba(40, 150, 205, 0.12)',
  divider: 'rgba(40, 150, 205, 0.15)',
  
  // Admin-specific
  adminBg: '#edf6fb',
  adminCard: 'rgba(237, 246, 251, 0.85)',
  
  // Navbar glass effect
  navbarDefault: 'rgba(232, 244, 252, 0.85)',  // WITH blur
  navbarScrolled: 'rgba(232, 244, 252, 0.98)', // More opaque
};
```

---

## 3. Typography System

### Font Stack
```javascript
const typography = {
  fontFamilyPrimary: "'Outfit', sans-serif",    // Headings
  fontFamilySecondary: "'Inter', sans-serif",   // Body text
  fontFamilyLogo: "'Italianno', cursive",       // Logo "Abhi's" only
};
```

### Font Loading (Add to index.html or use `@fontsource`)
```html
<link href="https://fonts.googleapis.com/css2?family=Italianno&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Heading Styles
```javascript
const headingStyles = {
  // All headings use Outfit font
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 700,
  color: '#0f172a',  // gray-900
  lineHeight: 1.2,
};

// Responsive sizes (use clamp for fluid scaling)
const headingSizes = {
  h1: 'clamp(2.5rem, 5vw, 3.5rem)',      // Page titles
  h2: 'clamp(2rem, 4vw, 2.75rem)',        // Section titles
  h3: 'clamp(1.5rem, 3vw, 2rem)',         // Subsection titles
  h4: '1.25rem',                           // Card titles
  h5: '1.1rem',                            // Small titles
  h6: '1rem',                              // Labels
};
```

### Body Text
```javascript
const bodyText = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '1rem',       // 16px base
  lineHeight: 1.6,
  color: '#334155',       // gray-700
};

const mutedText = {
  color: '#64748b',       // gray-500
  fontSize: '0.95rem',
};
```

### Gradient Text Pattern
Used for highlighted text, hero titles, stat numbers:
```css
.gradient-text {
  background: linear-gradient(135deg, #2896cd 0%, #6C5CE7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 4. Color Palette

### Complete Color Reference
```javascript
// Material UI Theme Configuration
export const theme = createTheme({
  palette: {
    primary: {
      main: '#2896cd',
      light: '#53abd7',
      dark: '#1a7eb0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6C5CE7',
      light: '#A29BFE',
      dark: '#5B4BC7',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    background: {
      default: '#f0f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      disabled: '#94a3b8',
    },
  },
});
```

---

## 5. Spacing & Layout

### Spacing Scale
```javascript
const spacing = {
  xs:   '0.25rem',   // 4px
  sm:   '0.5rem',    // 8px
  md:   '1rem',      // 16px
  lg:   '1.5rem',    // 24px
  xl:   '2rem',      // 32px
  '2xl': '3rem',     // 48px
  '3xl': '4rem',     // 64px
  '4xl': '6rem',     // 96px
  '5xl': '8rem',     // 128px
};
```

### Section Padding (Responsive)
```javascript
const sectionPadding = {
  desktop: '100px',  // Top and bottom
  tablet: '70px',
  mobile: '50px',
};
```

### Container
```javascript
const container = {
  maxWidth: '1240px',
  padding: '2.5rem',    // Side padding
  // On mobile, reduce to 1.25rem
};
```

### Border Radius
```javascript
const borderRadius = {
  sm:   '0.375rem',  // 6px - Inputs, small elements
  md:   '0.5rem',    // 8px - Cards, buttons
  lg:   '0.75rem',   // 12px - Larger cards
  xl:   '1rem',      // 16px - Feature cards
  '2xl': '1.5rem',   // 24px - Large sections
  full: '9999px',    // Pills, round buttons
};
```

---

## 6. Shadows & Effects

### Box Shadows
```javascript
const shadows = {
  sm:   '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md:   '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg:   '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl:   '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 40px rgba(40, 150, 205, 0.15)',
  
  // Button shadows
  btnPrimary: '0 4px 15px rgba(40, 150, 205, 0.3)',
  btnPrimaryHover: '0 8px 25px rgba(40, 150, 205, 0.4)',
  btnSecondary: '0 4px 15px rgba(108, 92, 231, 0.3)',
  btnSecondaryHover: '0 8px 25px rgba(108, 92, 231, 0.4)',
  
  // Card hover
  cardHover: '0 8px 30px rgba(40, 150, 205, 0.15)',
};
```

### Glassmorphism Effects
```javascript
// Navbar glass effect
const glassNavbar = {
  background: 'rgba(232, 244, 252, 0.85)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(40, 150, 205, 0.1)',
};

// Card glass effect
const glassCard = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
};
```

---

## 7. Animation Patterns

### Transition Timing
```javascript
const transitions = {
  fast: '150ms ease',
  base: '300ms ease',
  slow: '500ms ease',
  
  // Specific cubic-bezier for interactions
  smooth: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};
```

### Common Animations (Keyframes)
```css
/* Fade in from bottom - used for staggered content */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Fade in only */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Float effect - used for hero floating cards */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Pulse - hero background shapes */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.4; }
}

/* Rotate - decorative circles */
@keyframes rotateGlow {
  from { transform: translate(-50%, -50%) rotate(0); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Blink - cursor effects */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Bounce down - scroll indicator */
@keyframes bounceDown {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(8px); }
  60% { transform: translateY(4px); }
}
```

### Hover Patterns
```javascript
// Button hover
const buttonHover = {
  transform: 'translateY(-3px)',
  boxShadow: '0 8px 25px rgba(40, 150, 205, 0.4)',
};

// Card hover
const cardHover = {
  transform: 'translateY(-5px)',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
};

// Link underline grow
const navLinkHover = {
  // Uses ::after pseudo-element with width transition
  // from: width: 0, to: width: 100%
};
```

---

## 8. Component Library

### 8.1 Buttons

#### Primary Button
```jsx
// MUI Button customization
<Button
  variant="contained"
  sx={{
    background: 'linear-gradient(135deg, #2896cd 0%, #6C5CE7 100%)',
    color: '#fff',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    fontWeight: 600,
    fontSize: '1rem',
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(40, 150, 205, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #1a7fc4 0%, #5B4BC7 100%)',
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 25px rgba(40, 150, 205, 0.4)',
    },
  }}
>
  <Icon sx={{ mr: 1 }} /> Button Text
</Button>
```

#### Secondary Button (Outlined)
```jsx
<Button
  variant="outlined"
  sx={{
    background: '#fff',
    color: '#334155',
    border: '2px solid #e2e8f0',
    borderRadius: '0.75rem',
    padding: '1rem 2rem',
    fontWeight: 600,
    textTransform: 'none',
    '&:hover': {
      borderColor: '#2896cd',
      color: '#1a7eb0',
      background: '#fff',
      transform: 'translateY(-3px)',
    },
  }}
>
  Secondary
</Button>
```

#### WhatsApp Button (Green)
```jsx
<Button
  sx={{
    background: '#25D366',
    color: '#fff',
    '&:hover': {
      background: '#20BA5A',
    },
  }}
>
  <WhatsAppIcon /> Chat on WhatsApp
</Button>
```

### 8.2 Cards

#### Feature Card Pattern
```jsx
<Card
  sx={{
    background: 'linear-gradient(135deg, #edf6fb 0%, #ffffff 100%)',
    border: '1px solid rgba(40, 150, 205, 0.12)',
    borderRadius: '1rem',
    padding: '1.5rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
      borderColor: 'rgba(40, 150, 205, 0.2)',
    },
  }}
>
  <Box sx={{ 
    width: 60, 
    height: 60, 
    background: '#fff',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    mb: 2,
  }}>
    <Icon sx={{ color: '#2896cd', fontSize: '1.5rem' }} />
  </Box>
  <Typography variant="h4">{title}</Typography>
  <Typography color="text.secondary">{description}</Typography>
</Card>
```

### 8.3 Navbar

#### Key Properties
- **Fixed position** at top
- **Height:** 75px
- **Glassmorphism:** `rgba(232, 244, 252, 0.85)` + backdrop-blur(12px)
- **On scroll:** Background becomes more opaque, add shadow
- **Mobile:** Hamburger menu with slide-down drawer

```jsx
<AppBar
  position="fixed"
  sx={{
    background: scrolled ? 'rgba(232, 244, 252, 0.98)' : 'rgba(232, 244, 252, 0.85)',
    backdropFilter: 'blur(12px)',
    boxShadow: scrolled ? '0 4px 30px rgba(40, 150, 205, 0.08)' : 'none',
    borderBottom: '1px solid rgba(40, 150, 205, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }}
>
  <Toolbar sx={{ height: 75 }}>
    <LogoSignature />
    <NavLinks />
    <CTAButton />
  </Toolbar>
</AppBar>
```

### 8.4 Footer

#### Structure
```
┌────────────────────────────────────────────────────────────┐
│ Footer (dark: #0f172a)                                      │
├────────────────────────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│ │ Brand    │  │ Courses  │  │ Services │  │ Contact Info │ │
│ │ Logo     │  │ (random  │  │ (links)  │  │ Address      │ │
│ │          │  │  4 shown)│  │          │  │ Phone        │ │
│ │ Description│ │          │  │          │  │ Email        │ │
│ └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │
├────────────────────────────────────────────────────────────┤
│ © 2026 Abhi's Craftsoft  |  Privacy | Terms  | Made with ❤ │
└────────────────────────────────────────────────────────────┘
```

#### Dynamic Footer Content
The footer randomly shows 4 courses and 4 services on each page load from these lists:

```javascript
const allCourses = [
  { name: 'Python Full Stack', url: '/courses/python' },
  { name: 'Full Stack MERN', url: '/courses/full-stack' },
  { name: 'Graphic Design', url: '/courses/graphic-design' },
  { name: 'UI/UX Design', url: '/courses/ui-ux' },
  { name: 'Cloud & DevOps', url: '/courses/devops' },
  { name: 'Cyber Security', url: '/courses/cyber-security' },
  { name: 'Data Analytics', url: '/courses/data-analytics' },
  { name: 'Salesforce Developer', url: '/courses/salesforce-developer' },
  { name: 'ServiceNow Admin', url: '/courses/service-now' },
  { name: 'Java Full Stack', url: '/courses/java' },
];

const allServices = [
  { name: 'Graphic Design', url: '/services/graphic-design' },
  { name: 'UI/UX Design', url: '/services/ui-ux-design' },
  { name: 'Web Development', url: '/services/web-development' },
  { name: 'Brand Identity', url: '/services/branding' },
  { name: 'Cloud Solutions', url: '/services/cloud-devops' },
  { name: 'Career Services', url: '/services/career-services' },
];
```

### 8.5 Chat Widget (Floating)

Fixed position bottom-right, circular toggle button with popup panel.

```
Position: fixed, bottom: 30px, right: 30px
Toggle Button: 60x60px circle, gradient background
Panel: 350px wide, rounded corners, slide-up animation

Options shown:
- WhatsApp (green icon)
- Call Us (blue icon)
- Email (purple icon)
```

### 8.6 Form Inputs

```jsx
<TextField
  fullWidth
  variant="outlined"
  sx={{
    '& .MuiOutlinedInput-root': {
      borderRadius: '0.75rem',
      background: '#f8fafc', // gray-50
      '& fieldset': {
        borderColor: '#e2e8f0', // gray-200
      },
      '&:hover fieldset': {
        borderColor: '#94a3b8', // gray-400
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2896cd',
        borderWidth: '2px',
      },
    },
    '& .MuiInputBase-input': {
      padding: '12px 16px',
    },
  }}
/>
```

---

## 9. Page Structure & Routing

### Main Website Routes
```javascript
const mainRoutes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '/courses', component: CoursesListPage },
  { path: '/courses/:slug', component: CourseDetailPage },
  { path: '/services', component: ServicesPage },
  { path: '/services/:slug', component: ServiceDetailPage },
  { path: '/contact', component: ContactPage },
  { path: '/portfolio', component: PortfolioPage },
  { path: '/privacy-policy', component: PrivacyPage },
  { path: '/terms-of-service', component: TermsPage },
  { path: '/verify', component: EmailVerifyPage },
  { path: '*', component: NotFoundPage },
];
```

### Course Slugs (for routing)
```javascript
const courseSlugs = [
  // Design
  'graphic-design', 'ui-ux',
  // Software Development  
  'full-stack', 'python', 'java', 'react', 'dsa', 'sql',
  // Cloud & Security
  'devops', 'aws', 'azure', 'cyber-security', 'devsecops',
  // Salesforce & Enterprise
  'salesforce', 'salesforce-developer', 'salesforce-marketing-cloud', 
  'oracle-fusion-cloud', 'service-now',
  // Data & AI
  'ai-ml', 'data-analytics',
  // Soft Skills
  'spoken-english', 'soft-skills', 'resume-interview', 'handwriting',
];
```

### Service Slugs
```javascript
const serviceSlugs = [
  'web-development', 'ui-ux-design', 'graphic-design',
  'branding', 'cloud-devops', 'career-services',
];
```

### URL Short Links (Implement as redirects)
```javascript
// Course aliases: /c-{slug} → /courses/{slug}
// Service aliases: /s-{slug} → /services/{slug}
// Example: /c-python → /courses/python
```

---

## 10. Authentication Flows

### 10.1 Admin Portal Authentication

#### Login Flow
```
1. User enters: Email OR Admin ID (ACS-XX) OR Phone Number + Password
2. If Admin ID → Fetch email from 'admins' table by admin_id
3. If Phone → Fetch email from 'admins' table by phone
4. Sign in with Supabase Auth using email + password
5. Check admin status in 'admins' table:
   - If status !== 'ACTIVE' → Redirect to verification
   - If status === 'ACTIVE' → Redirect to dashboard
```

#### Admin ID Format
```
Pattern: ACS-XX (e.g., ACS-01, ACS-02)
Case-insensitive (acs-01 → ACS-01)
```

#### Session Storage
```javascript
// Admin uses sessionStorage for per-tab sessions
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: window.sessionStorage,
    storageKey: 'sb-auth-token',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

### 10.2 Student Portal Authentication

#### Login Flow (OTP-based)
```
1. Student enters: Student ID OR Email OR Phone
2. System fetches email from 'students' table
3. Send OTP to email via Supabase Magic Link
4. Student enters 6-digit OTP
5. Verify OTP with Supabase
6. Redirect to student dashboard
```

#### Student ID Format
```
Pattern: CS-XXXX (e.g., CS-0001, CS-0256)
```

### 10.3 Admin Signup Flow

```
1. User fills: Full Name, Email, Phone, Password
2. Create user in Supabase Auth
3. Create record in 'admins' table with status: 'PENDING'
4. Send verification email
5. User clicks verification link
6. Update status to 'ACTIVE' and assign admin_id (ACS-XX)
```

---

## 11. Database Schema

### Supabase Configuration
```javascript
const SUPABASE_URL = 'https://afocbygdakyqtmmrjvmy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
// Full key available in supabase-config.js files
```

### Key Tables

#### `admins` Table
```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  admin_id VARCHAR(10) UNIQUE,  -- Format: ACS-XX
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15),
  status VARCHAR(20) DEFAULT 'PENDING',  -- PENDING | ACTIVE | SUSPENDED
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### `students` Table
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  student_id VARCHAR(10) UNIQUE,  -- Format: CS-XXXX
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  enrolled_courses JSONB,
  created_at TIMESTAMP DEFAULT now()
);
```

#### `inquiries` Table (Contact Form Submissions)
```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  inquiry_type VARCHAR(50),  -- 'course' | 'service' | 'general'
  message TEXT,
  status VARCHAR(20) DEFAULT 'NEW',  -- NEW | CONTACTED | CLOSED
  created_at TIMESTAMP DEFAULT now()
);
```

---

## 12. API Integration

### Supabase Client Setup (React)
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Auth Hooks Pattern
```javascript
// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Data Fetching Pattern
```javascript
// Example: Fetch courses
const fetchCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
```

---

## 13. Material UI Mapping

### Theme Configuration
```javascript
// src/theme/index.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2896cd',
      light: '#53abd7',
      dark: '#1a7eb0',
    },
    secondary: {
      main: '#6C5CE7',
      light: '#A29BFE',
      dark: '#5B4BC7',
    },
    // ... (see Color Palette section above)
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 700,
      fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 700,
      fontSize: 'clamp(2rem, 4vw, 2.75rem)',
    },
    h3: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 700,
      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    },
    h4: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8, // Default, override per component
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    // ... customize all 25 shadow levels
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2896cd 0%, #6C5CE7 100%)',
          boxShadow: '0 4px 15px rgba(40, 150, 205, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1a7fc4 0%, #5B4BC7 100%)',
            boxShadow: '0 8px 25px rgba(40, 150, 205, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.75rem',
          },
        },
      },
    },
  },
});
```

---

## 14. Critical Implementation Notes

### ⚠️ MUST DO

1. **Font Loading**: Ensure `Italianno`, `Inter`, and `Outfit` fonts are loaded BEFORE app renders
2. **Gradient Text**: Use `-webkit-background-clip: text` for all gradient text (browser support required)
3. **Navbar Glass Effect**: Must include `backdrop-filter: blur(12px)` AND `-webkit-backdrop-filter`
4. **Form Validation**: Replicate exact validation patterns from original
5. **Error States**: Use exact same colors (red: #EF4444) and animation patterns
6. **Mobile Responsiveness**: Test at 768px and 576px breakpoints specifically
7. **WhatsApp Links**: Format: `https://wa.me/917842239090?text={encoded_message}`

### ⚠️ DO NOT CHANGE

1. **Contact Phone**: +91 7842239090
2. **Contact Email**: team.craftsoft@gmail.com
3. **Address**: Plot No. 163, Vijayasree Colony, Vanasthalipuram, Hyderabad - 500070
4. **Social Links**: 
   - Instagram: @craftsoft_
   - LinkedIn: /company/abhis-craftsoft
5. **Logo Font Sizes**: Keep exact em/rem ratios

### ⚠️ GOTCHAS

1. **Admin ID Lookup**: Case-insensitive (ACS-01 = acs-01)
2. **Phone Input**: Strip +91 prefix before database lookup
3. **Session Storage**: Admin portal uses sessionStorage, NOT localStorage
4. **Footer Randomization**: Happens on every page load, not on route change
5. **Scroll Behavior**: Navbar becomes more opaque on scroll (add scroll listener)

---

## Quick Reference Cheat Sheet

| What | Value |
|------|-------|
| Primary Color | `#2896cd` |
| Secondary Color | `#6C5CE7` |
| Success Green | `#10B981` |
| Error Red | `#EF4444` |
| Dark Text | `#0f172a` |
| Muted Text | `#64748b` |
| Heading Font | `Outfit` |
| Body Font | `Inter` |
| Logo Script Font | `Italianno` |
| Container Width | `1240px` |
| Navbar Height | `75px` |
| Border Radius (Cards) | `1rem` |
| Border Radius (Buttons) | `0.75rem` |
| Transition Speed | `300ms ease` |

---

## Final Checklist Before Launch

- [ ] All fonts loading correctly
- [ ] Logo renders with gradient text
- [ ] Navbar glass effect visible
- [ ] All gradients match original exactly
- [ ] Forms submit to Supabase correctly
- [ ] Auth flows work for Admin/Student
- [ ] Mobile menu functions properly
- [ ] Footer renders with random courses/services
- [ ] WhatsApp links open correctly
- [ ] All page routes accessible
- [ ] 404 page styled correctly
- [ ] No console errors
- [ ] Performance acceptable (Lighthouse > 90)

---

*End of Handover Document*

**Remember:** When in doubt, ALWAYS reference the live site: https://www.craftsoft.co.in
