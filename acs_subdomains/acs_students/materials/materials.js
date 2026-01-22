/* ============================================
   Materials Page Logic
   Craft Soft - Student Module
   ============================================ */

(function () {
    'use strict';

    let studentData = null;

    async function checkAuth() {
        const token = localStorage.getItem('acs_student_token');
        if (!token) { window.location.replace('../'); return; }

        const { data: session, error } = await window.supabaseClient
            .from('student_sessions')
            .select('*')
            .eq('token', token)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (error || !session) {
            window.location.replace('../');
            return;
        }

        const metadata = session.metadata;
        studentData = {
            id: session.student_db_id,
            name: metadata.name,
            student_id: metadata.student_id,
            email: metadata.email,
            phone: metadata.phone
        };
        initPage();
    }

    function initPage() {
        // Render Header
        const header = document.getElementById('header-container');
        if (header && window.StudentHeader) {
            header.innerHTML = window.StudentHeader.render(
                'Study Materials',
                'Access notes and learning resources',
                'fa-book-skull'
            );
        }

        // Init Sidebar
        if (window.StudentSidebar) {
            window.StudentSidebar.init('materials');
            window.StudentSidebar.renderAccountPanel(studentData);
        }
    }

    // Logout handler
    window.handleLogout = function () {
        if (window.StudentSidebar && window.StudentSidebar.closeMobileNav) {
            window.StudentSidebar.closeMobileNav();
        }

        const token = localStorage.getItem('acs_student_token');
        if (token) {
            window.supabaseClient.from('student_sessions').delete().eq('token', token).then(() => {
                localStorage.removeItem('acs_student_token');
                window.location.replace('../');
            });
        } else {
            window.location.replace('../');
        }
    };

    checkAuth();
})();
