/**
 * Cloudflare Pages Worker
 * Handles subdomain routing for craftsoft.co.in
 */

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const hostname = url.hostname.toLowerCase();
        const pathname = url.pathname;

        // ============================================
        // 1. STUDENT PORTAL (acs-student.craftsoft.co.in)
        // ============================================
        if (hostname.includes("acs-student.craftsoft")) {
            // Shared assets from root
            if (pathname.startsWith("/assets/admin/") ||
                pathname.startsWith("/assets/components/") ||
                pathname.startsWith("/assets/images/")) {
                return env.ASSETS.fetch(request);
            }

            // Student-specific assets
            if (pathname.startsWith("/assets/")) {
                return env.ASSETS.fetch(new Request(
                    new URL(`/acs_subdomains/acs_students${pathname}`, url),
                    request
                ));
            }

            // Root → login page
            if (pathname === "/" || pathname === "") {
                return env.ASSETS.fetch(new Request(
                    new URL("/acs_subdomains/acs_students/index.html", url),
                    request
                ));
            }

            // Add trailing slash for directories
            if (!pathname.includes(".") && !pathname.endsWith("/")) {
                return Response.redirect(`${url.origin}${pathname}/`, 301);
            }

            // Rewrite to student folder
            let targetPath = `/acs_subdomains/acs_students${pathname}`;
            if (targetPath.endsWith("/")) targetPath += "index.html";

            const response = await env.ASSETS.fetch(new Request(
                new URL(targetPath, url),
                request
            ));

            if (response.status === 404) {
                return env.ASSETS.fetch(new Request(
                    new URL("/acs_subdomains/acs_students/404/index.html", url),
                    request
                ));
            }
            return response;
        }

        // ============================================
        // 2. SIGNUP SUBDOMAIN (signup.craftsoft.co.in)
        // ============================================
        if (hostname.includes("signup.craftsoft")) {
            if (pathname === "/" || pathname === "") {
                return env.ASSETS.fetch(new Request(
                    new URL("/acs_subdomains/acs_signup/index.html", url),
                    request
                ));
            }

            if (!pathname.includes(".") && !pathname.endsWith("/")) {
                return Response.redirect(`${url.origin}${pathname}/`, 301);
            }

            let targetPath = `/acs_subdomains/acs_signup${pathname}`;
            if (targetPath.endsWith("/")) targetPath += "index.html";

            const response = await env.ASSETS.fetch(new Request(
                new URL(targetPath, url),
                request
            ));

            if (response.status === 404) {
                return env.ASSETS.fetch(new Request(
                    new URL("/acs_subdomains/acs_signup/404/index.html", url),
                    request
                ));
            }
            return response;
        }

        // ============================================
        // 3. ADMIN SUBDOMAIN (admin.craftsoft.co.in)
        // ============================================
        if (hostname.includes("admin.craftsoft")) {
            // Block signup paths on admin
            if (pathname.startsWith("/signup")) {
                return env.ASSETS.fetch(new Request(
                    new URL("/acs_subdomains/acs_admin/404/index.html", url),
                    request
                ));
            }

            // Admin assets rewrite
            if (pathname.startsWith("/assets/admin/")) {
                const assetPath = pathname.replace("/assets/admin/", "/acs_subdomains/acs_admin/assets/");
                return env.ASSETS.fetch(new Request(
                    new URL(assetPath, url),
                    request
                ));
            }

            // Shared root assets passthrough
            if (pathname.startsWith("/assets/") || pathname.startsWith("/shared/")) {
                return env.ASSETS.fetch(request);
            }

            // Root or login → admin index
            if (pathname === "/" || pathname === "" || pathname === "/login") {
                return env.ASSETS.fetch(new Request(
                    new URL("/acs_subdomains/acs_admin/index.html", url),
                    request
                ));
            }

            // Legacy redirects (301)
            if (pathname.startsWith("/v-history") || pathname.startsWith("/vhistory")) {
                const newPath = pathname.replace(/^\/(v-history|vhistory)/, "/version-history");
                return Response.redirect(`${url.origin}${newPath}`, 301);
            }

            // Short URL mappings
            let targetPath = pathname;
            const mappings = [
                // Students & Clients
                { from: "/students", to: "/students-clients/students" },
                { from: "/clients", to: "/students-clients/clients" },
                // Courses & Services
                { from: "/courses", to: "/courses-services/courses" },
                { from: "/services", to: "/courses-services/services" },
                // Payments
                { from: "/record-payment", to: "/payments/record-payment" },
                { from: "/all-payments", to: "/payments/all-payments" },
                { from: "/payment-receipts", to: "/payments/receipts" },
                { from: "/receipts", to: "/payments/receipts" },
                // Academics
                { from: "/upload-materials", to: "/academics/upload-materials" },
                { from: "/assignments", to: "/academics/assignments" },
                { from: "/submissions", to: "/academics/submissions" },
                // Records
                { from: "/archived-records", to: "/records/archived" },
                { from: "/archived", to: "/records/archived" },
                { from: "/recently-deleted", to: "/records/recently-deleted" }
            ];

            // Skip mapping if already using full path
            const skipPrefixes = ["/students-clients/", "/courses-services/", "/payments/", "/academics/", "/records/"];
            if (!skipPrefixes.some(prefix => pathname.startsWith(prefix))) {
                for (const map of mappings) {
                    if (pathname === map.from || pathname === map.from + "/" || pathname.startsWith(map.from + "/")) {
                        targetPath = pathname.replace(map.from, map.to);
                        break;
                    }
                }
            }

            // Trailing slash for directories
            const adminFolders = [
                "/dashboard", "/inquiries", "/students", "/clients", 
                "/courses", "/services", "/payments", "/tutors", 
                "/settings", "/version-history", "/archived", "/recently-deleted",
                "/record-payment", "/all-payments", "/receipts", "/payment-receipts",
                "/upload-materials", "/assignments", "/submissions", "/archived-records"
            ];
            if (adminFolders.some(folder => pathname === folder)) {
                return Response.redirect(`${url.origin}${pathname}/`, 301);
            }

            // Final rewrite
            let finalPath = `/acs_subdomains/acs_admin${targetPath}`;
            if (finalPath.endsWith("/")) finalPath += "index.html";

            const response = await env.ASSETS.fetch(new Request(
                new URL(finalPath, url),
                request
            ));

            if (response.status === 404) {
                return env.ASSETS.fetch(new Request(
                    new URL("/acs_subdomains/acs_admin/404/index.html", url),
                    request
                ));
            }
            return response;
        }

        // ============================================
        // 4. MAIN WEBSITE (craftsoft.co.in)
        // ============================================
        return env.ASSETS.fetch(request);
    }
};
