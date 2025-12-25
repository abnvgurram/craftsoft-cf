/* ============================================
   STUDENT PROFILE - JavaScript
   ============================================ */

// Global state
let currentStudent = null;
let currentEnrollments = [];
let currentPayments = [];

// Initialize page
document.addEventListener('DOMContentLoaded', initProfilePage);

async function initProfilePage() {
    // Check auth
    const session = await requireAuth();
    if (!session) return;

    // Show layout
    document.getElementById('adminLayout').style.display = 'flex';

    // Setup sidebar
    setupSidebar();

    // Get student ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id');

    if (!studentId) {
        showToast('No student ID provided', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    // Load data
    await loadStudentProfile(studentId);
}

// ============================================
// SIDEBAR
// ============================================
function setupSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const toggle = document.getElementById('sidebarToggle');
    const close = document.getElementById('sidebarClose');
    const overlay = document.getElementById('sidebarOverlay');

    toggle.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.add('show');
    });

    close.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    }
}

// ============================================
// DATA LOADING
// ============================================
async function loadStudentProfile(studentId) {
    try {
        // 1. Fetch Student Core Info
        const { data: student, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('id', studentId)
            .single();

        if (studentError) throw studentError;
        currentStudent = student;

        // 2. Fetch Enrollments
        const { data: enrollments, error: enrollError } = await supabase
            .from('student_enrollments')
            .select(`
                *,
                courses (name, code)
            `)
            .eq('student_id', studentId);

        if (enrollError) throw enrollError;
        currentEnrollments = enrollments || [];

        // 3. Fetch Payments
        const { data: payments, error: payError } = await supabase
            .from('fee_payments')
            .select('*')
            .eq('student_id', studentId)
            .order('payment_date', { ascending: false });

        if (payError) throw payError;
        currentPayments = payments || [];

        // 4. Populate UI
        renderProfile();

    } catch (error) {
        console.error('Error loading profile:', error);
        showToast('Failed to load student profile', 'error');
    }
}

function renderProfile() {
    if (!currentStudent) return;

    // Header
    document.getElementById('profileAvatar').textContent = getInitials(currentStudent.name);
    document.getElementById('profileName').textContent = currentStudent.name;
    const statusBadge = document.getElementById('profileStatus');
    statusBadge.textContent = capitalizeFirst(currentStudent.status);
    statusBadge.className = `status-badge status-${currentStudent.status}`;

    // Action buttons
    document.getElementById('editProfileBtn').href = `add.html?id=${currentStudent.id}`;

    // Contact buttons
    document.getElementById('phoneBtn').href = `tel:${currentStudent.phone}`;
    document.getElementById('dispPhone').textContent = `+91 ${currentStudent.phone}`;
    document.getElementById('emailBtn').href = currentStudent.email ? `mailto:${currentStudent.email}` : '#';
    document.getElementById('dispEmail').textContent = currentStudent.email || 'Not Provided';
    document.getElementById('whatsappBtn').href = `https://wa.me/91${currentStudent.phone.replace(/\D/g, '')}`;

    // Personal Details
    document.getElementById('dispDob').textContent = currentStudent.date_of_birth ? formatDate(currentStudent.date_of_birth) : '-';
    document.getElementById('dispAddress').textContent = currentStudent.address || '-';
    document.getElementById('dispGuardianName').textContent = currentStudent.guardian_name || '-';
    document.getElementById('dispGuardianPhone').textContent = currentStudent.guardian_phone || '-';
    document.getElementById('dispJoinedDate').textContent = formatDate(currentStudent.created_at);

    // Academic summary
    document.getElementById('totalEnrollments').textContent = currentEnrollments.length;
    document.getElementById('completedCourses').textContent = currentEnrollments.filter(e => e.status === 'completed').length;
    document.getElementById('academicStatus').textContent = currentEnrollments.some(e => e.status === 'ongoing') ? 'Currently Studying' : 'Batch Completed';

    // Enrollments table
    const enrollTbody = document.getElementById('enrollmentsTableBody');
    enrollTbody.innerHTML = currentEnrollments.map(e => `
        <tr>
            <td>
                <div style="font-weight: 600; color: var(--gray-900);">${e.courses?.name}</div>
                <small style="color: var(--gray-400);">${e.courses?.code}</small>
            </td>
            <td>${e.tutor_name || '-'}</td>
            <td>₹${formatCurrency(e.base_fee)}</td>
            <td class="text-success">-${formatCurrency(e.discount_amount)}</td>
            <td style="font-weight: 600;">₹${formatCurrency(e.final_fee)}</td>
            <td><span class="status-badge status-${e.status}">${capitalizeFirst(e.status)}</span></td>
        </tr>
    `).join('');

    // Payments table
    const payTbody = document.getElementById('paymentsTableBody');
    if (currentPayments.length === 0) {
        payTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--gray-400); padding: 24px;">No payments recorded yet</td></tr>';
    } else {
        payTbody.innerHTML = currentPayments.map(p => `
            <tr>
                <td>${formatDate(p.payment_date)}</td>
                <td class="text-success" style="font-weight: 600;">₹${formatCurrency(p.amount)}</td>
                <td><span class="mode-badge mode-${p.payment_mode}">${capitalizeFirst(p.payment_mode)}</span></td>
                <td><small>${p.reference_id || '-'}</small></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="downloadReceipt('${p.id}')">
                        <i class="fas fa-file-invoice"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Ledger summary
    const totalFee = currentEnrollments.reduce((sum, e) => sum + parseFloat(e.final_fee), 0);
    const totalPaid = currentPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const balance = totalFee - totalPaid;

    document.getElementById('sumTotalFee').textContent = `₹${formatCurrency(totalFee)}`;
    document.getElementById('sumTotalPaid').textContent = `₹${formatCurrency(totalPaid)}`;
    document.getElementById('sumBalance').textContent = balance > 0 ? `₹${formatCurrency(balance)}` : '✓ Paid';
}

// ============================================
// PAYMENT MODAL (REUSED LOGIC)
// ============================================
let currentPaymentStudent = null;

window.showPaymentModalFromProfile = async function () {
    if (!currentStudent) return;

    currentPaymentStudent = currentStudent;

    // Populate student info
    document.getElementById('paymentStudentAvatar').textContent = getInitials(currentStudent.name);
    document.getElementById('paymentStudentName').textContent = currentStudent.name;
    document.getElementById('paymentStudentPhone').textContent = `+91 ${currentStudent.phone}`;

    // Load enrollments with payment info
    await loadPaymentEnrollments(currentStudent.id);

    // Set default date to today
    document.getElementById('paymentDate').valueAsDate = new Date();

    // Show modal
    document.getElementById('paymentModal').classList.add('show');
};

async function loadPaymentEnrollments(studentId) {
    try {
        const { data: enrollments, error } = await supabase
            .from('student_enrollments')
            .select(`
                id,
                course_id,
                final_fee,
                courses (name, code)
            `)
            .eq('student_id', studentId);

        if (error) throw error;

        // Group payments by enrollment
        const paymentsByEnrollment = {};
        currentPayments.forEach(p => {
            if (!paymentsByEnrollment[p.enrollment_id]) {
                paymentsByEnrollment[p.enrollment_id] = 0;
            }
            paymentsByEnrollment[p.enrollment_id] += parseFloat(p.amount);
        });

        const tbody = document.getElementById('paymentEnrollmentsBody');
        const courseSelect = document.getElementById('paymentCourse');

        tbody.innerHTML = '';
        courseSelect.innerHTML = '<option value="">Choose course...</option>';

        (enrollments || []).forEach(e => {
            const total = parseFloat(e.final_fee);
            const paid = paymentsByEnrollment[e.id] || 0;
            const balance = total - paid;

            tbody.innerHTML += `
                <tr>
                    <td>${e.courses?.name || 'Unknown'}</td>
                    <td>₹${formatCurrency(total)}</td>
                    <td class="text-success">₹${formatCurrency(paid)}</td>
                    <td class="${balance > 0 ? 'text-danger' : 'text-success'}">
                        ${balance > 0 ? '₹' + formatCurrency(balance) : '✓ Paid'}
                    </td>
                </tr>
            `;

            if (balance > 0) {
                const option = document.createElement('option');
                option.value = e.id;
                option.textContent = `${e.courses?.name} (Balance: ₹${formatCurrency(balance)})`;
                courseSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading payment enrollments:', error);
    }
}

function hidePaymentModal() {
    document.getElementById('paymentModal').classList.remove('show');
    document.getElementById('paymentForm').reset();
    currentPaymentStudent = null;
}

window.submitPaymentFromProfile = async function () {
    const enrollmentId = document.getElementById('paymentCourse').value;
    const amount = parseFloat(document.getElementById('paymentAmount').value);
    const mode = document.getElementById('paymentMode').value;
    const reference = document.getElementById('paymentReference').value.trim();
    const paymentDate = document.getElementById('paymentDate').value;

    if (!enrollmentId) {
        showToast('Please select a course', 'error');
        return;
    }
    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }

    try {
        const { error } = await supabase
            .from('fee_payments')
            .insert({
                student_id: currentStudent.id,
                enrollment_id: enrollmentId,
                amount: amount,
                payment_mode: mode,
                reference_id: reference || null,
                payment_date: paymentDate || new Date().toISOString().split('T')[0]
            });

        if (error) throw error;

        showToast('Payment recorded successfully!', 'success');
        hidePaymentModal();

        // Reload all data to refresh profile
        await loadStudentProfile(currentStudent.id);

    } catch (error) {
        console.error('Error recording payment:', error);
        showToast('Failed to record payment', 'error');
    }
};

// ============================================
// LOGOUT & UTILS
// ============================================
function showLogoutModal() {
    document.getElementById('logoutModal').classList.add('show');
}

function hideLogoutModal() {
    document.getElementById('logoutModal').classList.remove('show');
}

async function confirmLogout() {
    await signOut();
}

function getInitials(name) {
    if (!name) return '..';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Global modal handlers (for compatibility)
window.hidePaymentModal = hidePaymentModal;
window.showLogoutModal = showLogoutModal;
window.hideLogoutModal = hideLogoutModal;
window.confirmLogout = confirmLogout;
