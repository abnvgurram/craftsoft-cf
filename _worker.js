/**
 * Cloudflare Pages Worker
 * Handles subdomain routing for craftsoft.co.in
 * Version: 3.0 - Complete rewrite matching Netlify behavior
 */

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const hostname = url.hostname.toLowerCase();
        const pathname = url.pathname;

        // 🚫 DO NOT TOUCH REAL FILES (serve as-is)
        if (
            pathname.endsWith('.js') ||
            pathname.endsWith('.css') ||
            pathname.endsWith('.map') ||
            pathname.endsWith('.json') ||
            pathname.endsWith('.svg') ||
            pathname.endsWith('.png') ||
            pathname.endsWith('.jpg') ||
            pathname.endsWith('.jpeg') ||
            pathname.endsWith('.gif') ||
            pathname.endsWith('.woff') ||
            pathname.endsWith('.woff2') ||
            pathname.endsWith('.ttf') ||
            pathname.endsWith('.eot')
        ) {
            return fetch(request);
        }

        // ============================================
        // 1. ADMIN SUBDOMAIN (admin.craftsoft.co.in)
        // ============================================
        if (hostname.includes("admin")) {


            // 1. /assets/admin/* → /acs_subdomains/acs_admin/assets/:splat
            if (pathname.startsWith('/assets/admin/')) {
                const assetPath = `/acs_subdomains/acs_admin/assets/${pathname.replace('/assets/admin/', '')}`;
                const newUrl = new URL(assetPath, url);
                return fetchWithMimeType(request, newUrl, env);
            }

            // 2. /assets/* → /assets/:splat (shared root assets)
            if (pathname.startsWith('/assets/')) {
                const assetPath = `/assets/${pathname.replace('/assets/', '')}`;
                const newUrl = new URL(assetPath, url);
                return fetchWithMimeType(request, newUrl, env);
            }



            // Netlify parity: /signup/* always returns admin 404
            if (pathname.startsWith("/signup/")) {
                const newUrl = new URL("/acs_subdomains/acs_admin/404/index.html", url);
                return env.ASSETS.fetch(new Request(newUrl, request));
            }



            // Root or /login → admin login page
            if (pathname === "/" || pathname === "" || pathname === "/login" || pathname === "/login/") {
                const newUrl = new URL("/acs_subdomains/acs_admin/index.html", url);
                return env.ASSETS.fetch(new Request(newUrl, request));
            }


            // 3. Exact-match and subfolder rewrites for all admin subpages
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
                { web: '/version-history', fs: '/acs_subdomains/acs_admin/version-history' },
            ];
            for (const route of adminFolders) {
                // /page or /page/ → /fs/index.html
                if (pathname === route.web || pathname === route.web + '/') {
                    const newUrl = new URL(route.fs + '/index.html', url);
                    return env.ASSETS.fetch(new Request(newUrl, request));
                }
                // /page/* → /fs/:splat if file exists, else index.html
                if (pathname.startsWith(route.web + '/')) {
                    const rest = pathname.substring((route.web + '/').length);
                    const fileUrl = new URL(route.fs + '/' + rest, url);
                    const fileRes = await env.ASSETS.fetch(new Request(fileUrl, request));
                    if (fileRes.status === 200) {
                        return fileRes;
                    } else {
                        // fallback to index.html for any non-existent file or folder
                        const newUrl = new URL(route.fs + '/index.html', url);
                        return env.ASSETS.fetch(new Request(newUrl, request));
                    }
                }
            }

            // Admin catch-all: serve /acs_subdomains/acs_admin/:splat for any other path
            if (hostname.includes('admin')) {
                if (pathname.startsWith('/acs_subdomains/acs_admin/')) {
                    const newUrl = new URL(pathname, url);
                    return env.ASSETS.fetch(new Request(newUrl, request));
                }
                // Serve 404 for anything not matched above
                const notFoundUrl = new URL('/acs_subdomains/acs_admin/404/index.html', url);
                return env.ASSETS.fetch(new Request(notFoundUrl, request));
            }

            // 5. If already inside /acs_subdomains/acs_admin/, serve directly (prevent recursion)
            if (pathname.startsWith('/acs_subdomains/acs_admin/')) {
                const newUrl = new URL(pathname, url);
                return env.ASSETS.fetch(new Request(newUrl, request));
            }

            // 6. All other paths → admin 404
            const notFoundUrl = new URL('/acs_subdomains/acs_admin/404/index.html', url);
            return env.ASSETS.fetch(new Request(notFoundUrl, request));
        }
// Helper to set correct headers for CSS/JS assets
function setAssetHeaders(assetPath, origHeaders) {
    const headers = new Headers(origHeaders);
    if (assetPath.endsWith('.css')) {
        headers.set('Content-Type', 'text/css');
        headers.set('X-Content-Type-Options', 'nosniff');
    } else if (assetPath.endsWith('.js')) {
        headers.set('Content-Type', 'application/javascript');
        headers.set('X-Content-Type-Options', 'nosniff');
    }
    return headers;
}

        // ============================================
        // 2. STUDENT PORTAL (acs-student.craftsoft.co.in)
        // ============================================
        if (hostname.includes("acs-student")) {
            
            // ALL /assets/* requests → serve from students assets folder
            if (pathname.startsWith("/assets/")) {
                const assetPath = `/acs_subdomains/acs_students${pathname}`;
                const newUrl = new URL(assetPath, url);
                return env.ASSETS.fetch(new Request(newUrl, request));
            }

            // Root → login page
            if (pathname === "/" || pathname === "") {
                const newUrl = new URL("/acs_subdomains/acs_students/index.html", url);
                return env.ASSETS.fetch(new Request(newUrl, request));
            }

            // All other paths
            let finalPath = `/acs_subdomains/acs_students${pathname}`;
            if (!pathname.includes(".") && !pathname.endsWith("/")) {
                finalPath += "/";
            }
            if (finalPath.endsWith("/")) {
                finalPath += "index.html";
            }
            
            const newUrl = new URL(finalPath, url);
            return env.ASSETS.fetch(new Request(newUrl, request));
        }

        // ============================================
        // 3. SIGNUP SUBDOMAIN (signup.craftsoft.co.in)
        // ============================================
        if (hostname.includes("signup")) {
            
            // Root → signup page
            if (pathname === "/" || pathname === "") {
                const newUrl = new URL("/acs_subdomains/acs_signup/index.html", url);
                return env.ASSETS.fetch(new Request(newUrl, request));
            }

            // All other paths
            let finalPath = `/acs_subdomains/acs_signup${pathname}`;
            if (!pathname.includes(".") && !pathname.endsWith("/")) {
                finalPath += "/";
            }
            if (finalPath.endsWith("/")) {
                finalPath += "index.html";
            }
            
            const newUrl = new URL(finalPath, url);
            return env.ASSETS.fetch(new Request(newUrl, request));
        }

        // ============================================
        // 4. MAIN WEBSITE (craftsoft.co.in / www)
        // ============================================
        return env.ASSETS.fetch(request);
    }
};

// Update the fetch logic to ensure proper MIME type handling for missing files
async function fetchWithMimeType(request, assetPath, env) {
    const res = await env.ASSETS.fetch(new Request(assetPath, request));

    if (res.status === 404) {
        return new Response('File not found', {
            status: 404,
            headers: {
                'Content-Type': 'application/javascript',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    }

    return new Response(res.body, {
        status: res.status,
        headers: setAssetHeaders(assetPath, res.headers),
    });
}
