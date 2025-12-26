/* ============================================
   Dashboard Page Logic
   - Auth check
   - Load admin data
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
    // ============================================
    // AUTH CHECK
    // ============================================

    async function checkAuth() {
        try {
            const { data: { session } } = await window.supabaseClient.auth.getSession();

            if (!session || !session.user) {
                window.location.replace('signin.html');
                return null;
            }

            if (!session.user.email_confirmed_at) {
                window.location.replace('signin.html');
                return null;
            }

            return session;
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.replace('signin.html');
            return null;
        }
    }

    const session = await checkAuth();
    if (!session) return;

    // ============================================
    // LOAD ADMIN DATA
    // ============================================

    async function loadAdminData() {
        try {
            const { data: admin, error } = await window.supabaseClient
                .from('admins')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error || !admin) {
                console.error('Failed to load admin data:', error);
                return null;
            }

            return admin;
        } catch (e) {
            console.error('Error loading admin:', e);
            return null;
        }
    }

    const admin = await loadAdminData();

    // Update UI with admin info
    if (admin) {
        const adminNameEl = document.getElementById('adminName');
        const adminIdEl = document.getElementById('adminId');
        const adminAvatarEl = document.getElementById('adminAvatar');
        const welcomeNameEl = document.getElementById('welcomeName');
        const welcomeIdEl = document.getElementById('welcomeAdminId');
        const welcomeEmailEl = document.getElementById('welcomeEmail');

        if (adminNameEl) adminNameEl.textContent = admin.full_name;
        if (adminIdEl) adminIdEl.textContent = admin.admin_id;
        if (adminAvatarEl) adminAvatarEl.textContent = admin.full_name.charAt(0).toUpperCase();
        if (welcomeNameEl) welcomeNameEl.textContent = admin.full_name.split(' ')[0];
        if (welcomeIdEl) welcomeIdEl.textContent = admin.admin_id;
        if (welcomeEmailEl) welcomeEmailEl.textContent = admin.email;
    }

    // ============================================
    // LOAD DASHBOARD STATS
    // ============================================
    function loadDashboardStats() {
        // Load student count from localStorage
        const studentCount = localStorage.getItem('craftsoft_student_count') || 0;
        const statStudents = document.getElementById('statStudents');
        if (statStudents) statStudents.textContent = studentCount;

        // Tutors, Inquiries, Revenue will be added in later phases
        // For now they stay at 0
    }

    loadDashboardStats();

    // Refresh stats when page becomes visible (in case user added students in another tab)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) loadDashboardStats();
    });
});
