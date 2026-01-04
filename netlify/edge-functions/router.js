export default async (request, context) => {
    const url = new URL(request.url);
    const host = request.headers.get("host");

    // Log for debugging (visible in Netlify Edge Function logs)
    console.log(`Routing request for host: ${host}, path: ${url.pathname}`);

    // 1. Signup Subdomain
    if (host === "signup.craftsoft.co.in") {
        if (url.pathname === "/") {
            return context.rewrite("/subdomains/acs_admin/signup/index.html");
        }
        if (!url.pathname.startsWith("/subdomains/")) {
            return context.rewrite(`/subdomains/acs_admin/signup${url.pathname}`);
        }
    }

    // 2. Admin Subdomain
    if (host === "admin.craftsoft.co.in") {
        if (url.pathname === "/") {
            return context.rewrite("/subdomains/acs_admin/index.html");
        }
        if (url.pathname === "/login") {
            return context.rewrite("/subdomains/acs_admin/login.html");
        }
        // Specific maps for admin folders
        const adminPaths = ["/dashboard", "/inquiries", "/students", "/clients", "/courses", "/services", "/payments", "/settings"];
        if (adminPaths.some(path => url.pathname.startsWith(path))) {
            // Check if it's a directory call without .html
            if (!url.pathname.includes(".") && !url.pathname.endsWith("/")) {
                return context.rewrite(`/subdomains/acs_admin${url.pathname}/index.html`);
            }
            if (url.pathname.endsWith("/")) {
                return context.rewrite(`/subdomains/acs_admin${url.pathname}index.html`);
            }
            return context.rewrite(`/subdomains/acs_admin${url.pathname}`);
        }

        // Fallback for admin assets/files if not already caught
        if (!url.pathname.startsWith("/subdomains/") && !url.pathname.startsWith("/assets/") && !url.pathname.startsWith("/shared/")) {
            return context.rewrite(`/subdomains/acs_admin${url.pathname}`);
        }
    }

    // 3. Main Website (craftsoft.co.in, www.craftsoft.co.in)
    // Default behavior is to serve the file as is. 
    // We just need to handle legacy redirects or specific 404s if needed, 
    // but standard Netlify behavior will handle this if we return nothing.

    return; // Continue to next handler (static files)
};

export const config = { path: "/*" };
