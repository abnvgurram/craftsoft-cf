# Cloudflare Subdomain Setup Guide

## Problem
Cloudflare Pages doesn't support `_worker.js` for subdomain-based routing. The file is ignored.

## Solution Options

### Option 1: Separate Pages Projects (Recommended for Simplicity)
Create 4 separate Cloudflare Pages projects, each with its own custom domain:

1. **Main Site** (already working)
   - Project: `craftsoft-cf`
   - Domain: `www.craftsoft.co.in`
   - Root: `/` (entire repo)

2. **Admin Portal**
   - Create new project: `craftsoft-admin`
   - Domain: `admin.craftsoft.co.in`
   - Root: `acs_subdomains/acs_admin`

3. **Signup Portal**
   - Create new project: `craftsoft-signup`
   - Domain: `signup.craftsoft.co.in`
   - Root: `acs_subdomains/acs_signup`

4. **Student Portal**
   - Create new project: `craftsoft-students`
   - Domain: `acs-student.craftsoft.co.in`
   - Root: `acs_subdomains/acs_students`

**How to set root directory in Cloudflare Pages:**
- Go to your Pages project > Settings > Build configuration
- Set "Root directory (advanced)" to the subdomain folder path

---

### Option 2: Use Cloudflare Workers (More Control)
Create a Cloudflare Worker (separate from Pages) that:
1. Intercepts all requests to *.craftsoft.co.in
2. Routes to the appropriate path on your Pages deployment
3. Serves content from the correct folder

**Steps:**
1. Go to Cloudflare Dashboard > Workers & Pages > Create Worker
2. Create a new Worker named `craftsoft-router`
3. Paste the routing code (see below)
4. Add route: `*.craftsoft.co.in/*` → `craftsoft-router`

**Worker Code:**
```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();
    
    // Base URL of your Pages deployment
    const pagesUrl = "https://craftsoft-cf.pages.dev";
    
    // Subdomain routing
    let targetPath = url.pathname;
    
    if (hostname.includes("acs-student")) {
      targetPath = `/acs_subdomains/acs_students${url.pathname}`;
    } else if (hostname.includes("signup")) {
      targetPath = `/acs_subdomains/acs_signup${url.pathname}`;
    } else if (hostname.includes("admin")) {
      targetPath = `/acs_subdomains/acs_admin${url.pathname}`;
    }
    
    // Handle trailing slash and index.html
    if (!targetPath.includes(".") && !targetPath.endsWith("/")) {
      targetPath += "/";
    }
    if (targetPath.endsWith("/")) {
      targetPath += "index.html";
    }
    
    // Fetch from Pages
    const newUrl = new URL(targetPath, pagesUrl);
    return fetch(new Request(newUrl, request));
  }
}
```

4. In Cloudflare DNS, set up routes:
   - `admin.craftsoft.co.in/*` → Worker
   - `signup.craftsoft.co.in/*` → Worker
   - `acs-student.craftsoft.co.in/*` → Worker

---

### Option 3: Keep Netlify for Subdomains
Since Netlify already has edge functions working:
- Use Cloudflare for: `www.craftsoft.co.in` (main site)
- Use Netlify for: `admin`, `signup`, `acs-student` subdomains

This hybrid approach leverages the best of both platforms.

---

## Recommended: Option 1 (Separate Projects)

This is the cleanest approach for Cloudflare Pages:
1. Go to Cloudflare Dashboard
2. Create new Pages project for admin
3. Connect same repo: `craftsoft-cf`
4. Set root directory: `acs_subdomains/acs_admin`
5. Add custom domain: `admin.craftsoft.co.in`
6. Repeat for signup and students

Each subdomain becomes an independent deployment with its own build.
