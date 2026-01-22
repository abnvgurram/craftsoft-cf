/* ============================================
   Admin Testing Mode - Student Impersonation
   Craft Soft - Student Module
   ============================================ */

(function () {
    'use strict';

    let allStudents = [];
    let selectedStudent = null;

    const searchInput = document.getElementById('student-search');
    const dropdown = document.getElementById('student-dropdown');
    const selectedDisplay = document.getElementById('selected-display');
    const selectedContainer = document.getElementById('selected-student');
    const btnLoginAs = document.getElementById('btn-login-as');

    // Toast utility
    function showToast(msg, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.className = `toast show ${type}`;
        setTimeout(() => toast.className = 'toast', 3000);
    }

    // Check if admin is logged in
    async function checkAdminAuth() {
        try {
            // Wait for supabase to be ready
            if (!window.supabaseConfig || !window.supabaseClient) {
                console.error('Supabase not initialized');
                showToast('System not ready. Please refresh.', 'error');
                return false;
            }

            const session = await window.supabaseConfig.getSession();
            console.log('Session check:', session ? 'Found' : 'Not found');

            if (!session) {
                showToast('Please login to admin panel first', 'error');
                setTimeout(() => {
                    window.location.href = '/'; // Redirect to admin login
                }, 2000);
                return false;
            }

            // Check if user is an active admin
            const { data: admin, error } = await window.supabaseClient
                .from('admins')
                .select('id, full_name, status')
                .eq('id', session.user.id)
                .maybeSingle(); // Use maybeSingle to avoid error when not found

            console.log('Admin check:', admin, error);

            if (error) {
                console.error('Admin lookup error:', error);
                showToast('Admin verification failed', 'error');
                setTimeout(() => {
                    window.location.href = '../';
                }, 2000);
                return false;
            }

            if (!admin) {
                showToast('You are not registered as an admin', 'error');
                setTimeout(() => {
                    window.location.href = '../';
                }, 2000);
                return false;
            }

            if (admin.status !== 'ACTIVE') {
                showToast('Your admin account is not active', 'error');
                setTimeout(() => {
                    window.location.href = '../';
                }, 2000);
                return false;
            }

            console.log('Admin authenticated:', admin.full_name);
            return true;

        } catch (e) {
            console.error('Auth check failed:', e);
            showToast('Authentication error. Please try again.', 'error');
            setTimeout(() => {
                window.location.href = '../';
            }, 2000);
            return false;
        }
    }

    // Load all students
    async function loadStudents() {
        try {
            const { data, error } = await window.supabaseClient
                .from('students')
                .select('id, student_id, first_name, last_name, email, phone')
                .eq('status', 'ACTIVE')
                .is('deleted_at', null)
                .order('first_name');

            if (error) throw error;
            allStudents = data || [];
        } catch (e) {
            console.error('Failed to load students:', e);
            showToast('Failed to load students', 'error');
        }
    }

    // Render dropdown
    function renderDropdown(students) {
        if (students.length === 0) {
            dropdown.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No students found</p>
                </div>
            `;
        } else {
            dropdown.innerHTML = students.map(s => {
                const initials = `${s.first_name?.[0] || ''}${s.last_name?.[0] || ''}`.toUpperCase();
                return `
                    <div class="student-option" data-id="${s.id}">
                        <div class="avatar">${initials}</div>
                        <div class="info">
                            <div class="name">${s.first_name} ${s.last_name || ''}</div>
                            <div class="id">${s.student_id} • ${s.email || s.phone || 'No contact'}</div>
                        </div>
                    </div>
                `;
            }).join('');

            // Bind click events
            dropdown.querySelectorAll('.student-option').forEach(opt => {
                opt.addEventListener('click', () => selectStudent(opt.dataset.id));
            });
        }
        dropdown.classList.add('open');
    }

    // Select a student
    function selectStudent(id) {
        selectedStudent = allStudents.find(s => s.id === id);
        if (!selectedStudent) return;

        const initials = `${selectedStudent.first_name?.[0] || ''}${selectedStudent.last_name?.[0] || ''}`.toUpperCase();
        selectedDisplay.innerHTML = `
            <div class="avatar">${initials}</div>
            <div class="info">
                <div class="name">${selectedStudent.first_name} ${selectedStudent.last_name || ''}</div>
                <div class="id">${selectedStudent.student_id} • ${selectedStudent.email || selectedStudent.phone || 'No contact'}</div>
            </div>
        `;

        selectedContainer.style.display = 'block';
        dropdown.classList.remove('open');
        searchInput.value = '';
        btnLoginAs.disabled = false;
    }

    // Handle search input
    searchInput.addEventListener('focus', () => {
        const query = searchInput.value.toLowerCase();
        const filtered = allStudents.filter(s => {
            const fullName = `${s.first_name} ${s.last_name || ''}`.toLowerCase();
            return fullName.includes(query) || s.student_id.toLowerCase().includes(query);
        });
        renderDropdown(filtered.slice(0, 10));
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filtered = allStudents.filter(s => {
            const fullName = `${s.first_name} ${s.last_name || ''}`.toLowerCase();
            return fullName.includes(query) || s.student_id.toLowerCase().includes(query);
        });
        renderDropdown(filtered.slice(0, 10));
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.student-search-container')) {
            dropdown.classList.remove('open');
        }
    });

    // Login as student
    btnLoginAs.addEventListener('click', async () => {
        if (!selectedStudent) return;

        btnLoginAs.disabled = true;
        btnLoginAs.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Logging in...</span>';

        try {
            // Store admin session info in localStorage
            localStorage.setItem('craftsoft_student_session', JSON.stringify({
                id: selectedStudent.id,
                student_id: selectedStudent.student_id,
                email: selectedStudent.email,
                loginTime: new Date().toISOString(),
                isAdminMode: true // Flag for admin impersonation
            }));

            // Log this activity
            try {
                await window.supabaseClient.from('activities').insert({
                    activity_type: 'admin_impersonation',
                    activity_name: `Logged in as ${selectedStudent.first_name} ${selectedStudent.last_name || ''} (${selectedStudent.student_id})`,
                    activity_link: '/students/',
                    created_at: new Date().toISOString()
                });
            } catch (e) {
                console.warn('Activity logging skipped:', e.message);
            }

            showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = '../dashboard/';
            }, 800);

        } catch (e) {
            console.error('Login failed:', e);
            showToast('Login failed', 'error');
            btnLoginAs.disabled = false;
            btnLoginAs.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Login as Student</span>';
        }
    });

    // Initialize
    async function init() {
        const isAdmin = await checkAdminAuth();
        if (isAdmin) {
            await loadStudents();
        }
    }

    init();

})();
