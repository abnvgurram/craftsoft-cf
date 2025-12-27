/* =====================================================
   ADMIN PANEL - Core JavaScript
   Handles sidebar, auth, and common functionality
   ===================================================== */

(async function () {
    'use strict';

    // =========================================
    // DOM Elements
    // =========================================
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminAvatar = document.getElementById('adminAvatar');
    const adminName = document.getElementById('adminName');
    const adminId = document.getElementById('adminId');

    // =========================================
    // Sidebar Toggle (Mobile)
    // =========================================
    function openSidebar() {
        sidebar?.classList.add('open');
        sidebarOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar?.classList.remove('open');
        sidebarOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuBtn?.addEventListener('click', openSidebar);
    mobileCloseBtn?.addEventListener('click', closeSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);

    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });

    // =========================================
    // Load Admin Info
    // =========================================
    async function loadAdminInfo() {
        try {
            const { data: { session } } = await window.supabaseClient.auth.getSession();
            if (!session) return;

            const { data: admin } = await window.supabaseClient
                .from('admins')
                .select('full_name, admin_id')
                .eq('id', session.user.id)
                .single();

            if (admin) {
                if (adminName) adminName.textContent = admin.full_name;
                if (adminId) adminId.textContent = admin.admin_id;
                if (adminAvatar) adminAvatar.textContent = admin.full_name.charAt(0).toUpperCase();
            }
        } catch (error) {
            console.error('Error loading admin info:', error);
        }
    }

    // =========================================
    // Logout
    // =========================================
    logoutBtn?.addEventListener('click', async () => {
        try {
            await window.supabaseClient.auth.signOut();
            window.location.href = 'signin.html';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = 'signin.html';
        }
    });

    // =========================================
    // Set Active Nav Item
    // =========================================
    function setActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // =========================================
    // Prevent Back Navigation After Logout
    // =========================================
    function preventBackNavigation() {
        history.pushState(null, null, location.href);
        window.addEventListener('popstate', function () {
            history.pushState(null, null, location.href);
        });
    }

    // =========================================
    // Initialize
    // =========================================
    setActiveNav();
    preventBackNavigation();
    await loadAdminInfo();

})();
