// Dashboard Module - Real-time with Notification Bell

document.addEventListener('DOMContentLoaded', async () => {
    const session = await window.supabaseConfig.getSession();
    if (!session) {
        window.location.href = '../login.html';
        return;
    }

    AdminSidebar.init('dashboard');

    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = AdminHeader.render('Dashboard');
    }

    const admin = await window.Auth.getCurrentAdmin();
    await AdminSidebar.renderAccountPanel(session, admin);

    // Show skeleton loading
    showSkeletonLoading();

    // Load Dashboard Data
    await loadStats();

    // Bind navigation to stat cards
    bindStatCardLinks();
});

function bindStatCardLinks() {
    document.getElementById('stat-students')?.addEventListener('click', () => {
        window.location.href = '../students-clients/students/';
    });
    document.getElementById('stat-courses')?.addEventListener('click', () => {
        window.location.href = '../courses-services/courses/';
    });
    document.getElementById('stat-tutors')?.addEventListener('click', () => {
        window.location.href = '../tutors/';
    });
    document.getElementById('stat-services')?.addEventListener('click', () => {
        window.location.href = '../courses-services/services/';
    });
    document.getElementById('stat-clients')?.addEventListener('click', () => {
        window.location.href = '../students-clients/clients/';
    });
}

// =====================
// Skeleton Loading
// =====================
function showSkeletonLoading() {
    const statElements = ['total-students', 'total-courses', 'total-tutors', 'total-services', 'total-clients'];
    statElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = '<span class="skeleton skeleton-text" style="width:40px;height:28px;display:inline-block;"></span>';
        }
    });
}

// =====================
// Count-Up Animation
// =====================
function animateCount(element, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// =====================
// Stats Loading
// =====================
async function loadStats() {
    try {
        // Total Students
        const { count: studentCount } = await window.supabaseClient
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'ACTIVE');
        const studentsEl = document.getElementById('total-students');
        studentsEl.textContent = '0';
        animateCount(studentsEl, studentCount || 0);

        // Active Courses
        const { count: courseCount } = await window.supabaseClient
            .from('courses')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'ACTIVE');
        const coursesEl = document.getElementById('total-courses');
        coursesEl.textContent = '0';
        animateCount(coursesEl, courseCount || 0);

        // Total Tutors
        const { count: tutorCount } = await window.supabaseClient
            .from('tutors')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'ACTIVE');
        const tutorsEl = document.getElementById('total-tutors');
        tutorsEl.textContent = '0';
        animateCount(tutorsEl, tutorCount || 0);

        // Active Services (Master Table)
        const { count: serviceCount } = await window.supabaseClient
            .from('services')
            .select('*', { count: 'exact', head: true });
        const servicesEl = document.getElementById('total-services');
        servicesEl.textContent = '0';
        animateCount(servicesEl, serviceCount || 0);

        // Total Clients
        const { count: clientCount } = await window.supabaseClient
            .from('clients')
            .select('*', { count: 'exact', head: true });
        const clientsEl = document.getElementById('total-clients');
        clientsEl.textContent = '0';
        animateCount(clientsEl, clientCount || 0);

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Export addActivity for other modules
window.DashboardActivities = {
    add: (type, name, link) => window.AdminUtils.Activity.add(type, name, link)
};
