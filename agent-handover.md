# Craftsoft — Design System & React Migration Guide

**Version:** 4.0  
**Date:** January 29, 2026  
**Purpose:** Design specifications for converting static website to React + Material UI

---

## Source of Truth

**Always refer to the LIVE websites for visual accuracy. This document provides exact values to replicate them.**

| Portal | URL | Description |
|--------|-----|-------------|
| Main Website | https://www.craftsoft.co.in | Public marketing site |
| Admin Portal | https://admin.craftsoft.co.in | Staff management dashboard |
| Student Portal | https://acs-student.craftsoft.co.in | Student learning portal |
| Signup Portal | https://signup.craftsoft.co.in | Admin registration |

---

## 1. Brand Identity

### Brand Name
**Abhi's Craftsoft**

### Tagline
*"Your career transformation starts here"*

### Logo Composition
The logo consists of two distinct parts:
- **"Abhi's"** — Cursive script font (Italianno), regular weight, slightly larger
- **"Craftsoft"** — Modern sans-serif (Outfit), bold, gradient colored

When rendered, "Abhi's" appears in dark text, and "Craftsoft" displays with the brand gradient.

### Logo Colors
- "Abhi's" text: Dark (#0f172a)
- "Craftsoft" text: Gradient from #2896cd to #6C5CE7

---

## 2. Typography

### Font Families

| Usage | Font | Weight Range |
|-------|------|--------------|
| Headings | Outfit | 500–800 |
| Body Text | Inter | 300–700 |
| Logo Script | Italianno | 400 |

### Font Loading
Load from Google Fonts: `Italianno`, `Inter`, and `Outfit`

### Heading Hierarchy

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Page Title) | 2.5rem – 3.5rem (fluid) | 700 | 1.2 |
| H2 (Section Title) | 2rem – 2.75rem (fluid) | 700 | 1.2 |
| H3 (Subsection) | 1.5rem – 2rem (fluid) | 700 | 1.2 |
| H4 (Card Title) | 1.25rem | 600 | 1.3 |
| H5 | 1.1rem | 600 | 1.3 |
| H6 | 1rem | 600 | 1.3 |

### Body Text
- Font: Inter
- Size: 1rem (16px base)
- Line Height: 1.6
- Color: #334155

### Muted/Secondary Text
- Color: #64748b
- Size: 0.95rem

---

## 3. Color Palette

### Primary Colors (Brand Blue)

| Token | Hex Value | Usage |
|-------|-----------|-------|
| Primary 50 | #edf6fb | Lightest backgrounds |
| Primary 100 | #d4eaf5 | Light tints |
| Primary 200 | #a9d5eb | Subtle accents |
| Primary 300 | #7ec0e1 | Hover states |
| Primary 400 | #53abd7 | Active elements |
| **Primary 500** | **#2896cd** | **Main brand color** |
| Primary 600 | #1a7eb0 | Dark accent |
| Primary 700 | #156691 | Darker accent |
| Primary 800 | #104e72 | Very dark |
| Primary 900 | #0b3653 | Darkest |

### Secondary Colors (Accent Purple)

| Token | Hex Value |
|-------|-----------|
| Purple Light | #A29BFE |
| Purple Main | #6C5CE7 |
| Purple Dark | #5B4BC7 |

### Tertiary Colors (Green Accent)

| Token | Hex Value |
|-------|-----------|
| Green Main | #00B894 |
| Green Secondary | #00CEC9 |
| Green Dark | #059669 |

### Neutral Colors (Grayscale)

| Token | Hex Value | Usage |
|-------|-----------|-------|
| Gray 50 | #f8fafc | Input backgrounds |
| Gray 100 | #f1f5f9 | Section backgrounds |
| Gray 200 | #e2e8f0 | Borders, dividers |
| Gray 300 | #cbd5e1 | Disabled states |
| Gray 400 | #94a3b8 | Placeholder text |
| Gray 500 | #64748b | Muted text |
| Gray 600 | #475569 | Secondary text |
| Gray 700 | #334155 | Body text |
| Gray 800 | #1e293b | Dark elements |
| Gray 900 | #0f172a | Headings, dark backgrounds |

### Semantic Colors

| Purpose | Hex Value |
|---------|-----------|
| Success | #10B981 |
| Warning | #F59E0B |
| Error | #EF4444 |
| Info | #3B82F6 |

---

## 4. Gradients

### Primary Accent Gradient
- Direction: 135 degrees
- Start: #2896cd (0%)
- End: #6C5CE7 (100%)
- Usage: Buttons, badges, highlighted text, CTAs

### Secondary Accent Gradient
- Direction: 135 degrees
- Start: #00B894 (0%)
- End: #00CEC9 (100%)
- Usage: Success states, feature highlights

### Hero Title Gradient (Three-Color)
- Direction: 135 degrees
- Colors: #2896cd (0%) → #6C5CE7 (50%) → #00B894 (100%)
- Usage: Main hero heading text only

### Button Gradients
**Primary Button:**
- Normal: #2896cd → #1a7fc4 (135deg)
- Hover: #1a7fc4 → #156ba8 (135deg)

**Secondary Button:**
- Normal: #6C5CE7 → #5B4BC7 (135deg)
- Hover: #5B4BC7 → #4A3DB6 (135deg)

### Background Gradients
**Hero Section:**
- 135deg, #f0f9ff (0%) → #ffffff (40%) → #f0f9ff (70%) → #e0f2fe (100%)

**Section Fade:**
- 180deg, #edf6fb (0%) → #ffffff (100%)

**Admin/Student Sidebar:**
- 180deg, #edf6fb (0%) → #e5f3fa (100%)

**Quiz CTA Card:**
- 135deg, #6c5ce7 (0%) → #a29bfe (100%)

---

## 5. Spacing System

### Base Scale

| Token | Value | Pixels |
|-------|-------|--------|
| xs | 0.25rem | 4px |
| sm | 0.5rem | 8px |
| md | 1rem | 16px |
| lg | 1.5rem | 24px |
| xl | 2rem | 32px |
| 2xl | 3rem | 48px |
| 3xl | 4rem | 64px |
| 4xl | 6rem | 96px |
| 5xl | 8rem | 128px |

### Section Padding

| Breakpoint | Top/Bottom Padding |
|------------|-------------------|
| Desktop (>1024px) | 100px |
| Tablet (768–1024px) | 70px |
| Mobile (<768px) | 50px |

### Container

| Property | Value |
|----------|-------|
| Max Width | 1240px |
| Side Padding (Desktop) | 2.5rem |
| Side Padding (Mobile) | 1.25rem |

---

## 6. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 6px | Inputs, small chips |
| md | 8px | Buttons, tags |
| lg | 12px | Cards, larger buttons |
| xl | 16px | Feature cards, modals |
| 2xl | 24px | Large sections |
| full | 9999px | Pills, circular buttons |

---

## 7. Shadows

### Standard Shadows

| Level | Value | Usage |
|-------|-------|-------|
| sm | 0 1px 2px rgba(0,0,0,0.05) | Subtle depth |
| md | 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06) | Cards |
| lg | 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05) | Elevated cards |
| xl | 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04) | Modals |
| 2xl | 0 25px 50px -12px rgba(0,0,0,0.25) | Hero elements |

### Brand Glow
- 0 0 40px rgba(40, 150, 205, 0.15)
- Usage: Feature highlights, hero elements

### Button Shadows

| State | Value |
|-------|-------|
| Primary Default | 0 4px 15px rgba(40, 150, 205, 0.3) |
| Primary Hover | 0 8px 25px rgba(40, 150, 205, 0.4) |
| Secondary Default | 0 4px 15px rgba(108, 92, 231, 0.3) |
| Secondary Hover | 0 8px 25px rgba(108, 92, 231, 0.4) |

---

## 8. Transitions & Animations

### Transition Speeds

| Speed | Duration | Easing |
|-------|----------|--------|
| Fast | 150ms | ease |
| Base | 300ms | ease |
| Slow | 500ms | ease |
| Smooth | 400ms | cubic-bezier(0.4, 0, 0.2, 1) |

### Common Animations

| Animation | Behavior | Duration |
|-----------|----------|----------|
| Fade In Up | Opacity 0→1, translateY 30px→0 | 600ms |
| Float | translateY oscillates 0↔-15px | 4–5s loop |
| Pulse | scale 1↔1.1, opacity 0.6↔0.4 | 8s loop |
| Blink | opacity toggles 0↔1 | 1s step |
| Spin | rotate 0→360deg | 800ms loop |

### Hover Behaviors

| Element | Transform | Shadow Change |
|---------|-----------|---------------|
| Primary Button | translateY(-3px) | Increase spread |
| Card | translateY(-5px) to (-8px) | Add depth |
| Nav Link | Underline grows from center | None |
| Logo | scale(1.02) | None |

---

## 9. Component Specifications

### Navbar
- **Position:** Fixed, top
- **Height:** 75px
- **Background:** Glass effect (rgba with blur)
- **Default:** rgba(232, 244, 252, 0.85) + backdrop-blur(12px)
- **On Scroll:** rgba(232, 244, 252, 0.98) + shadow
- **Border:** 1px solid rgba(40, 150, 205, 0.1)
- **Mobile:** Hamburger → full-screen overlay menu

### Buttons
- **Padding:** 1rem vertical, 2rem horizontal
- **Border Radius:** 12px (lg)
- **Font Weight:** 600
- **Primary:** Gradient background, white text
- **Secondary:** White background, gray border, dark text
- **Hover:** Lift up 3px, increase shadow

### Cards
- **Background:** Gradient from #edf6fb to white
- **Border:** 1px solid rgba(40, 150, 205, 0.12)
- **Border Radius:** 16px (xl)
- **Padding:** 24px–32px
- **Hover:** Lift 5–8px, increase shadow, border color intensifies

### Form Inputs
- **Background:** #f8fafc (gray-50)
- **Border:** 1px solid #e2e8f0
- **Border Radius:** 12px
- **Padding:** 12px 16px
- **Focus:** Border color #2896cd, add glow ring

### Footer
- **Background:** #0f172a (gray-900)
- **Text Color:** #94a3b8 (gray-400)
- **Link Hover:** #53abd7 (primary-400)
- **Structure:** 4-column grid on desktop, stacked on mobile
- **Columns:** Brand | Trending Courses (random 4) | Services (random 4) | Contact

### Chat Widget
- **Position:** Fixed, bottom-right, 30px offset
- **Toggle Button:** 60×60px circle, gradient, headset icon
- **Panel Width:** 350px
- **Animation:** Slide up + fade in

---

## 10. Page Structure

### Main Website Pages
- Homepage
- About Us
- Courses (listing)
- Course Detail (per course)
- Services (listing)
- Service Detail (per service)
- Contact
- Portfolio
- Privacy Policy
- Terms of Service
- 404

### Admin Portal Pages
- Login
- Dashboard
- Student Records
- Client Records
- Course Management
- Service Management
- Inquiries
- Tutor Management
- Learning Materials Upload
- Assignments
- Submissions
- Record Payment
- All Payments
- Receipts
- Archived Records
- Recently Deleted
- Settings
- Version History

### Student Portal Pages
- Login (OTP-based)
- Dashboard
- My Courses
- Learning Materials
- Assignments
- Payment History
- Profile

### Signup Portal
- Registration Form
- Email Verification

---

## 11. Authentication Patterns

### Admin Login
- Accepts: Email, Admin ID (format: ACS-XX), or Phone Number
- Authentication: Password-based
- Redirect: Dashboard on success

### Student Login
- Accepts: Student ID (format: CS-XXXX), Email, or Phone
- Authentication: OTP sent to email (magic link)
- 6-digit code entry
- Redirect: Dashboard on success

### Admin Signup
1. User fills: Full Name, Email, Phone, Password
2. Email verification required
3. Account pending until email verified
4. Admin ID assigned after verification

---

## 12. Responsive Breakpoints

| Breakpoint | Width | Adjustments |
|------------|-------|-------------|
| Desktop | >1024px | Full layout |
| Tablet | 768–1024px | 2-column grids, reduced padding |
| Mobile | <768px | Single column, hamburger menu, stacked elements |
| Small Mobile | <480px | Further reduced spacing, full-width buttons |

---

## 13. Contact Information

**DO NOT MODIFY these values:**

| Field | Value |
|-------|-------|
| Phone | +91 7842239090 |
| Email | team.craftsoft@gmail.com |
| Address | Plot No. 163, Vijayasree Colony, Vanasthalipuram, Hyderabad - 500070 |
| WhatsApp | wa.me/917842239090 |
| Instagram | @craftsoft_ |
| LinkedIn | /company/abhis-craftsoft |

---

## 14. Quality Checklist

Before considering any page complete:

- [ ] Fonts render correctly (Italianno for logo, Outfit for headings, Inter for body)
- [ ] Gradient text displays properly in all browsers
- [ ] Navbar has glass effect with blur
- [ ] All hover states match the live site
- [ ] Buttons have correct gradients and shadows
- [ ] Cards lift on hover with shadow increase
- [ ] Mobile menu functions correctly
- [ ] Footer randomizes courses and services
- [ ] Forms validate and show error states correctly
- [ ] Page loads without layout shift
- [ ] No visual differences from live site at any breakpoint

---

## Final Note

**Your goal:** A user should not be able to distinguish between the current static site and your React implementation. Every pixel, every animation, every interaction must match.

**When in doubt:** Open the live site and match it exactly.

---

*Document prepared for Craftsoft React Migration*
