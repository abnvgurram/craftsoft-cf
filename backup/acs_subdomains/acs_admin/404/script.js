// Admin 404 - Smart Navigation Logic
document.addEventListener('DOMContentLoaded', function () {
    const primaryBtn = document.getElementById('primary-btn');
    const referrer = document.referrer;
    const hostname = window.location.hostname;

    // Check for Supabase session in localStorage
    const supabaseKey = Object.keys(localStorage).find(key =>
        key.startsWith('sb-') && key.endsWith('-auth-token')
    );
    const isLoggedIn = supabaseKey && localStorage.getItem(supabaseKey);

    // Intelligence: Determine where they came from
    if (referrer && referrer.includes(hostname)) {
        try {
            const url = new URL(referrer);
            const pathParts = url.pathname.split('/').filter(p => p && p !== 'acs_admin');

            // Find the most relevant module name
            let moduleName = 'Previous Page';
            if (pathParts.length > 0) {
                // Get the last significant part of the path
                const rawModule = pathParts[pathParts.length - 1];

                // Format it: "record-payment" -> "Record Payment"
                moduleName = rawModule
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                // Specific overrides for better UX
                if (rawModule.toLowerCase() === 'acs_admin' || rawModule === '') moduleName = 'Dashboard';
                if (rawModule.toLowerCase() === 'login') moduleName = 'Sign In';
            }

            primaryBtn.innerHTML = `<i class="fas fa-arrow-left"></i> Back to ${moduleName}`;
            primaryBtn.href = referrer;
            return;
        } catch (e) {
            console.error('Error parsing referrer:', e);
        }
    }

    // Fallback logic if no valid referrer
    if (isLoggedIn) {
        primaryBtn.innerHTML = '<i class="fas fa-th-large"></i> Back to Dashboard';
        primaryBtn.href = '/dashboard/';
    } else {
        primaryBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Back to Sign In';
        primaryBtn.href = '/';
    }
});
