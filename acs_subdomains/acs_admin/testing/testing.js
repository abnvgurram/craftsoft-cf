/* ============================================
   Student Testing Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialise Sidebar and Login Security
    const session = await window.supabaseConfig.getSession();
    if (!session) {
        window.location.href = '../login.html';
        return;
    }

    AdminSidebar.init('student-testing');

    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = AdminHeader.render('Student Testing');
    }

    const admin = await window.Auth.getCurrentAdmin();
    await AdminSidebar.renderAccountPanel(session, admin);

    // 2. Initialise Features
    initStudentSearch();
});

function initStudentSearch() {
    const searchInput = document.getElementById('student-search-input');
    const resultsList = document.getElementById('search-results-list');
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 2) {
            resultsList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-microscope"></i>
                    <p>Ready to analyze. Enter a name to begin.</p>
                </div>
            `;
            return;
        }

        debounceTimer = setTimeout(() => performSearch(query), 300);
    });
}

async function performSearch(query) {
    const resultsList = document.getElementById('search-results-list');

    resultsList.innerHTML = `
        <div class="text-center py-5">
            <i class="fa-solid fa-circle-notch fa-spin fa-2x text-primary opacity-50"></i>
        </div>
    `;

    try {
        const { data, error } = await window.supabaseClient
            .from('students')
            .select('id, student_id, first_name, last_name, email, status')
            .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,student_id.ilike.%${query}%,email.ilike.%${query}%`)
            .eq('status', 'ACTIVE')
            .is('deleted_at', null)
            .limit(10);

        if (error) throw error;

        if (!data || data.length === 0) {
            resultsList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-user-slash"></i>
                    <p>No active students matching "${query}"</p>
                </div>
            `;
            return;
        }

        resultsList.innerHTML = data.map(s => `
            <div class="student-search-item" onclick="loadPortalPreview('${s.id}', this)">
                <div class="avatar">${s.first_name[0]}${s.last_name ? s.last_name[0] : ''}</div>
                <div class="info">
                    <span class="name">${s.first_name} ${s.last_name || ''}</span>
                    <span class="meta">${s.student_id} • ${s.email || 'No email'}</span>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Search error:', error);
        resultsList.innerHTML = `<div class="p-3 text-center text-danger">Search failed. Try again.</div>`;
    }
}

async function loadPortalPreview(studentId, element) {
    const previewContainer = document.getElementById('preview-container');
    const statFee = document.getElementById('stat-fee');
    const statPaid = document.getElementById('stat-paid');
    const statBalance = document.getElementById('stat-balance');

    // Update active state in list
    document.querySelectorAll('.student-search-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    // Loading overlay
    previewContainer.innerHTML = `
        <div class="analysis-placeholder">
            <div class="placeholder-content">
                <i class="fa-solid fa-circle-notch fa-spin fa-2x text-primary"></i>
                <h3>Synchronizing Live Portal Data...</h3>
            </div>
        </div>
    `;

    try {
        // Fetch student data and last 5 payments
        const [studentRes, paymentsRes] = await Promise.all([
            window.supabaseClient.from('students').select('*').eq('id', studentId).single(),
            window.supabaseClient.from('payments').select('*').eq('student_id', studentId).order('payment_date', { ascending: false }).limit(5)
        ]);

        if (studentRes.error) throw studentRes.error;
        const student = studentRes.data;
        const payments = paymentsRes.data || [];

        // Fetch courses
        let courses = [];
        if (student.courses && student.courses.length > 0) {
            const { data: coursesData } = await window.supabaseClient
                .from('courses')
                .select('course_code, course_name')
                .in('course_code', student.courses);
            courses = coursesData || [];
        }

        const totalPaid = payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
        const finalFee = student.final_fee || (student.fee - student.discount) || 0;
        const feeDue = finalFee - totalPaid;

        // Populate Admin Stats Bar
        statFee.innerText = `₹${finalFee.toLocaleString()}`;
        statPaid.innerText = `₹${totalPaid.toLocaleString()}`;
        statBalance.innerText = `₹${feeDue.toLocaleString()}`;
        statBalance.style.color = feeDue > 0 ? '#ef4444' : '#10b981';

        // Mirror the Student Portal View
        previewContainer.innerHTML = `
            <div class="portal-mirror-view" style="animation: fadeIn 0.4s ease;">
                <div class="mirror-header" style="background: var(--accent-gradient); padding: 1.5rem; border-radius: 16px; color: white; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 style="margin:0; font-size: 1.4rem;">Hello, ${student.first_name}! 👋</h2>
                        <p style="margin: 5px 0 0; opacity: 0.9; font-size: 0.9rem;">This is how the student sees their dashboard.</p>
                    </div>
                    <i class="fa-solid fa-user-graduate" style="font-size: 2.5rem; opacity: 0.3;"></i>
                </div>

                <div class="mirror-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <!-- Student View Stats -->
                    <div class="analysis-card" style="grid-column: span 2; display: flex; gap: 2rem; justify-content: space-around; text-align: center;">
                        <div>
                            <small style="color: var(--admin-text-muted); display: block; margin-bottom: 5px;">Total Paid</small>
                            <span style="font-size: 1.2rem; font-weight: 700; color: #10b981;">₹${totalPaid.toLocaleString()}</span>
                        </div>
                        <div style="width: 1px; background: var(--admin-card-border);"></div>
                        <div>
                            <small style="color: var(--admin-text-muted); display: block; margin-bottom: 5px;">Balance Due</small>
                            <span style="font-size: 1.2rem; font-weight: 700; color: ${feeDue > 0 ? '#ef4444' : '#10b981'};">₹${feeDue.toLocaleString()}</span>
                        </div>
                    </div>

                    <!-- Course Mirror -->
                    <div class="analysis-card">
                        <div class="card-label"><i class="fa-solid fa-book"></i> Enrolled Courses</div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            ${courses.length > 0 ? courses.map(c => `
                                <div style="display: flex; align-items: center; gap: 10px; background: var(--admin-bg); padding: 10px; border-radius: 8px;">
                                    <i class="fa-solid fa-bookmark" style="color: #2896cd;"></i>
                                    <span style="font-weight: 600; font-size: 0.85rem;">${c.course_name}</span>
                                </div>
                            `).join('') : '<p style="color: var(--admin-text-muted);">No active enrollments</p>'}
                        </div>
                    </div>

                    <!-- Payment Mirror -->
                    <div class="analysis-card">
                        <div class="card-label"><i class="fa-solid fa-clock-rotate-left"></i> Quick History</div>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            ${payments.length > 0 ? payments.map(p => `
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 5px 0; border-bottom: 1px dashed var(--admin-card-border);">
                                    <span>${new Date(p.payment_date).toLocaleDateString()}</span>
                                    <span style="font-weight: 700;">₹${(p.amount_paid || 0).toLocaleString()}</span>
                                </div>
                            `).join('') : '<p style="color: var(--admin-text-muted);">No payment history</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Mirror Sync error:', error);
        previewContainer.innerHTML = `<div class="p-5 text-center text-danger">Mirror sync failed. Error: ${error.message}</div>`;
    }
}
