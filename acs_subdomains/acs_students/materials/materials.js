/* ============================================
   Materials Page Logic
   Craft Soft - Student Module
   ============================================ */

(function () {
    'use strict';

    // Initialize sidebar and header
    if (window.StudentSidebar) {
        window.StudentSidebar.init('materials');
    }

    const header = document.getElementById('header-container');
    if (header && window.StudentHeader) {
        header.innerHTML = window.StudentHeader.render('Materials');
    }

    // Logout handler
    window.handleLogout = function () {
        if (window.StudentSidebar && window.StudentSidebar.closeMobileNav) {
            window.StudentSidebar.closeMobileNav();
        }

        // Terminate custom session
        const token = sessionStorage.getItem('acs_student_token');
        if (token) {
            window.supabaseClient.from('student_sessions').delete().eq('token', token).then(() => {
                sessionStorage.removeItem('acs_student_token');
                window.location.replace('../');
            });
        } else {
            window.location.replace('../');
        }
    };

})();
