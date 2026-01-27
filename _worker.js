/**
 * Cloudflare Pages Worker
 * Handles subdomain routing for craftsoft.co.in
 * Version: 3.2 - Robust routing with MIME type fixes
 */

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const hostname = url.hostname.toLowerCase();
        const pathname = url.pathname;

        // ============================================
        // GLOBAL ASSET ROUTING (Remap virtual paths to physical folders)
        // ============================================

        // 1. /assets/admin/* → /acs_subdomains/acs_admin/assets/:splat
        if (pathname.startsWith('/assets/admin/')) {
            const assetPath = `/acs_subdomains/acs_admin/assets/${pathname.replace('/assets/admin/', '')}`;
            const newUrl = new URL(assetPath, url);
            return fetchWithMimeType(request, newUrl, env);
        }

        // 2. /assets/student/* → /acs_subdomains/acs_students/assets/:splat
        if (pathname.startsWith('/assets/student/')) {
            const assetPath = `/acs_subdomains/acs_students/assets/${pathname.replace('/assets/student/', '')}`;
            const newUrl = new URL(assetPath, url);
            return fetchWithMimeType(request, newUrl, env);
        }

        // 3. /assets/* → /assets/:splat (Shared root assets)
        if (pathname.startsWith('/assets/')) {
            const assetPath = `/assets/${pathname.replace('/assets/', '')}`;
            const newUrl = new URL(assetPath, url);
            return fetchWithMimeType(request, newUrl, env);
        }

        // 🚫 DO NOT TOUCH REAL FILES (serve as-is from assets if path exists)
        const staticExtensions = [
            '.js', '.css', '.map', '.json', '.svg', '.png', '.jpg', '.jpeg', '.gif',
            '.woff', '.woff2', '.ttf', '.eot', '.ico'
        ];
        if (staticExtensions.some(ext => pathname.endsWith(ext))) {
            return env.ASSETS.fetch(request);
        }

        // ============================================
        // 1. ADMIN SUBDOMAIN (admin.craftsoft.co.in)
        // ============================================
        if (hostname.includes("admin")) {
            // Root or login → admin index
            if (pathname === "/" || pathname === "" || pathname === "/login" || pathname === "/login/") {
                const newUrl = new URL("/acs_subdomains/acs_admin/index.html", url);
                return env.ASSETS.fetch(new Request(newUrl, request));
            }

            // Virtual folder remappings for Admin
            const adminFolders = [
                { web: '/dashboard', fs: '/acs_subdomains/acs_admin/dashboard' },
                { web: '/archived', fs: '/acs_subdomains/acs_admin/records/archived' },
                { web: '/recently-deleted', fs: '/acs_subdomains/acs_admin/records/recently-deleted' },
                { web: '/students', fs: '/acs_subdomains/acs_admin/students-clients/students' },
                { web: '/clients', fs: '/acs_subdomains/acs_admin/students-clients/clients' },
                { web: '/courses', fs: '/acs_subdomains/acs_admin/courses-services/courses' },
                { web: '/services', fs: '/acs_subdomains/acs_admin/courses-services/services' },
                { web: '/upload-materials', fs: '/acs_subdomains/acs_admin/academics/upload-materials' },
                { web: '/assignments', fs: '/acs_subdomains/acs_admin/academics/assignments' },
                { web: '/submissions', fs: '/acs_subdomains/acs_admin/academics/submissions' },
                { web: '/record-payment', fs: '/acs_subdomains/acs_admin/payments/record-payment' },
                { web: '/all-payments', fs: '/acs_subdomains/acs_admin/payments/all-payments' },
                { web: '/payment-receipts', fs: '/acs_subdomains/acs_admin/payments/receipts' },
                { web: '/receipts', fs: '/acs_subdomains/acs_admin/payments/receipts' },
                { web: '/tutors', fs: '/acs_subdomains/acs_admin/tutors' },
                { web: '/inquiries', fs: '/acs_subdomains/acs_admin/inquiries' },
                { web: '/settings', fs: '/acs_subdomains/acs_admin/settings' },
                { web: '/version-history', fs: '/acs_subdomains/acs_admin/version-history' }
            ];

            for (const route of adminFolders) {
                if (pathname === route.web || pathname === route.web + '/') {
                    const newUrl = new URL(route.fs + '/index.html', url);
                    return env.ASSETS.fetch(new Request(newUrl, request));
                }
                if (pathname.startsWith(route.web + '/')) {
                    const rest = pathname.substring((route.web + '/').length);
                    const fileUrl = new URL(route.fs + '/' + rest, url);
                    const fileRes = await env.ASSETS.fetch(new Request(fileUrl, request));
                    if (fileRes.status === 200) return fileRes;
                    const newUrl = new URL(route.fs + '/index.html', url);
                    return env.ASSETS.fetch(new Request(newUrl, request));
                }
            }

            // Admin catch-all 404
            const notFoundUrl = new URL('/acs_subdomains/acs_admin/404/index.html', url);
            return env.ASSETS.fetch(new Request(notFoundUrl, request));
        }

        // ============================================
        // 2. STUDENT PORTAL (acs-student.craftsoft.co.in)
        // ============================================
        if (hostname.includes("acs-student")) {
            if (pathname === "/" || pathname === "") {
                const newUrl = new URL("/acs_subdomains/acs_students/index.html", url);
                return env.ASSETS.fetch(new Request(newUrl, request));
            }
            let finalPath = `/acs_subdomains/acs_students${pathname}`;
            if (!pathname.includes(".") && !pathname.endsWith("/")) finalPath += "/";
            if (finalPath.endsWith("/")) finalPath += "index.html";
            const newUrl = new URL(finalPath, url);
            return env.ASSETS.fetch(new Request(newUrl, request));
        }

        // ============================================
        // 3. SIGNUP SUBDOMAIN (signup.craftsoft.co.in)
        // ============================================
        if (hostname.includes("signup")) {
            if (pathname === "/" || pathname === "") {
                const newUrl = new URL("/acs_subdomains/acs_signup/index.html", url);
                return env.ASSETS.fetch(new Request(newUrl, request));
            }
            let finalPath = `/acs_subdomains/acs_signup${pathname}`;
            if (!pathname.includes(".") && !pathname.endsWith("/")) finalPath += "/";
            if (finalPath.endsWith("/")) finalPath += "index.html";
            const newUrl = new URL(finalPath, url);
            return env.ASSETS.fetch(new Request(newUrl, request));
        }

        // Default: Main Website
        return env.ASSETS.fetch(request);
    }
};

/**
 * Ensures proper MIME types for virtual asset paths
 */
async function fetchWithMimeType(request, assetPath, env) {
    const res = await env.ASSETS.fetch(new Request(assetPath, request));
    if (res.status === 404) {
        return new Response('File not found', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
    const headers = new Headers(res.headers);
    const pathStr = assetPath.toString();
    if (pathStr.endsWith('.css')) headers.set('Content-Type', 'text/css');
    else if (pathStr.endsWith('.js')) headers.set('Content-Type', 'application/javascript');
    headers.set('X-Content-Type-Options', 'nosniff');
    return new Response(res.body, { status: res.status, headers });
}
