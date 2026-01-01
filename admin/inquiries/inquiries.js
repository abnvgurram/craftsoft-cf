// Inquiries Module
let allCoursesForInquiries = [];
let allServicesForInquiries = [];
let inquiryToDelete = null;

document.addEventListener('DOMContentLoaded', async () => {
    const session = await window.supabaseConfig.getSession();
    if (!session) {
        window.location.href = '../login.html';
        return;
    }

    AdminSidebar.init('inquiries');

    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = window.AdminHeader.render('Inquiries');
    }

    const admin = await window.Auth.getCurrentAdmin();
    await AdminSidebar.renderAccountPanel(session, admin);

    // Load master data
    await loadCourses();
    await loadServices();

    // Load inquiries
    await loadInquiries();

    // Bind events
    bindFormEvents();
    bindDeleteEvents();
    bindSearchEvents();
    bindTypeToggle();
});

// =====================
// Load Master Data
// =====================
async function loadCourses() {
    try {
        const { data, error } = await window.supabaseClient
            .from('courses')
            .select('course_code, course_name')
            .eq('status', 'ACTIVE')
            .order('course_code');

        if (error) throw error;
        allCoursesForInquiries = data || [];
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function loadServices() {
    try {
        const { data, error } = await window.supabaseClient
            .from('services')
            .select('service_code, name')
            .order('service_code');

        if (error) throw error;
        allServicesForInquiries = data || [];
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// =====================
// Load Inquiries
// =====================
async function loadInquiries() {
    const { Skeleton } = window.AdminUtils;
    const content = document.getElementById('inquiries-content');

    if (Skeleton) Skeleton.show('inquiries-content', 'table', 5);

    try {
        const { data, error } = await window.supabaseClient
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            content.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-phone-volume"></i>
                    <p>No inquiries yet</p>
                </div>`;
            return;
        }

        renderInquiries(data);
    } catch (error) {
        console.error('Error loading inquiries:', error);
        content.innerHTML = '<p class="text-muted">Error loading inquiries</p>';
    }
}

function renderInquiries(inquiries) {
    const content = document.getElementById('inquiries-content');

    const tableHTML = `
        <div class="data-table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Inquiry ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Interests</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${inquiries.map(inq => `
                        <tr>
                            <td><span class="badge badge-primary">${inq.inquiry_id}</span></td>
                            <td><strong>${inq.name}</strong></td>
                            <td>${inq.phone}</td>
                            <td>
                                <div class="inquiry-courses">
                                    ${(inq.courses || []).map(c => `<span class="badge badge-outline">${c}</span>`).join('')}
                                </div>
                            </td>
                            <td>${getStatusBadge(inq.status || 'New')}</td>
                            <td>
                                <div class="action-btns">
                                    <button class="btn-icon edit-btn" data-id="${inq.id}"><i class="fa-solid fa-pen"></i></button>
                                    <button class="btn-icon whatsapp" data-phone="${inq.phone}"><i class="fa-brands fa-whatsapp"></i></button>
                                    <button class="btn-icon convert" data-id="${inq.id}"><i class="fa-solid fa-repeat"></i></button>
                                    <button class="btn-icon delete" data-id="${inq.id}" data-name="${inq.name}"><i class="fa-solid fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    const cardsHTML = `
        <div class="data-cards">
            ${inquiries.map(inq => `
                <div class="data-card">
                    <div class="data-card-header">
                        <span class="badge badge-primary">${inq.inquiry_id}</span>
                        ${getStatusBadge(inq.status || 'New')}
                    </div>
                    <div class="data-card-body">
                        <h4 class="data-card-title">${inq.name}</h4>
                        <div class="data-card-info">
                            <p><i class="fa-solid fa-phone"></i> ${inq.phone}</p>
                            <div class="badge-list">
                                ${(inq.courses || []).map(c => `<span class="badge badge-outline">${c}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="data-card-actions">
                        <button class="btn-icon edit-btn" data-id="${inq.id}"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon whatsapp" data-phone="${inq.phone}"><i class="fa-brands fa-whatsapp"></i></button>
                        <button class="btn-icon convert" data-id="${inq.id}"><i class="fa-solid fa-repeat"></i></button>
                        <button class="btn-icon delete" data-id="${inq.id}" data-name="${inq.name}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    content.innerHTML = tableHTML + cardsHTML;
    bindActionButtons();
}

function getStatusBadge(status) {
    if (!status) return `<span class="badge badge-secondary">New</span>`;
    const classes = {
        'New': 'badge-secondary',
        'Contacted': 'badge-info',
        'Demo Scheduled': 'badge-warning',
        'Converted': 'badge-success',
        'Closed': 'badge-danger'
    };
    return `<span class="badge ${classes[status] || 'badge-secondary'}">${status}</span>`;
}

function bindActionButtons() {
    document.querySelectorAll('.edit-btn').forEach(btn => btn.onclick = () => openForm(true, btn.dataset.id));
    document.querySelectorAll('.whatsapp').forEach(btn => btn.onclick = () => window.open(`https://wa.me/91${btn.dataset.phone}`, '_blank'));
    document.querySelectorAll('.convert').forEach(btn => btn.onclick = () => convertToStudent(btn.dataset.id));
    document.querySelectorAll('.delete').forEach(btn => btn.onclick = () => showDeleteConfirm(btn.dataset.id, btn.dataset.name));
}

// =====================
// Form Handling
// =====================
function bindTypeToggle() {
    document.querySelectorAll('input[name="inquiry-type"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const isService = radio.value === 'service';
            const label = document.getElementById('interest-label');
            const courseFields = document.getElementById('course-only-fields');

            label.innerHTML = isService ? 'Interested Services <span class="required">*</span>' : 'Interested Courses <span class="required">*</span>';
            courseFields.style.display = isService ? 'none' : 'block';

            renderCheckboxes(isService ? allServicesForInquiries : allCoursesForInquiries, isService);
        });
    });
}

function renderCheckboxes(items, isService = false, selected = []) {
    const container = document.getElementById('inquiry-courses-list');
    if (!items.length) {
        container.innerHTML = `<p class="text-muted">No ${isService ? 'services' : 'courses'} available</p>`;
        return;
    }

    container.innerHTML = items.map(item => {
        const code = isService ? item.service_code : item.course_code;
        const isChecked = selected.includes(code);
        return `
            <label class="checkbox-item ${isChecked ? 'checked' : ''}">
                <input type="checkbox" name="inquiry-interests" value="${code}" ${isChecked ? 'checked' : ''}>
                <i class="fa-solid fa-check"></i>
                <span>${code}</span>
            </label>
        `;
    }).join('');

    container.querySelectorAll('input').forEach(cb => {
        cb.onchange = () => cb.closest('.checkbox-item').classList.toggle('checked', cb.checked);
    });
}

function bindFormEvents() {
    document.getElementById('add-inquiry-btn')?.addEventListener('click', () => openForm(false));
    document.getElementById('close-form-btn')?.addEventListener('click', closeForm);
    document.getElementById('cancel-form-btn')?.addEventListener('click', closeForm);
    document.getElementById('save-inquiry-btn')?.addEventListener('click', saveInquiry);

    document.querySelectorAll('input[name="demo-required"]').forEach(radio => {
        radio.onchange = () => document.querySelector('.demo-fields').style.display = radio.value === 'yes' ? 'block' : 'none';
    });
}

async function openForm(isEdit = false, id = null) {
    const container = document.getElementById('inquiry-form-container');
    const typeLabel = document.getElementById('interest-label');
    const courseFields = document.getElementById('course-only-fields');

    // Reset Form
    document.getElementById('edit-inquiry-id').value = '';
    document.getElementById('inquiry-name').value = '';
    document.getElementById('inquiry-phone').value = '';
    document.getElementById('inquiry-email').value = '';
    document.getElementById('inquiry-notes').value = '';
    document.querySelector('input[name="inquiry-type"][value="course"]').checked = true;
    document.querySelector('input[name="demo-required"][value="no"]').checked = true;
    document.querySelector('.demo-fields').style.display = 'none';

    typeLabel.innerHTML = 'Interested Courses <span class="required">*</span>';
    courseFields.style.display = 'block';

    let selected = [];
    if (isEdit) {
        const { data, error } = await window.supabaseClient.from('inquiries').select('*').eq('id', id).single();
        if (data) {
            document.getElementById('edit-inquiry-id').value = data.id;
            document.getElementById('inquiry-name').value = data.name;
            document.getElementById('inquiry-phone').value = data.phone;
            document.getElementById('inquiry-email').value = data.email || '';
            document.getElementById('inquiry-notes').value = data.notes || '';
            selected = data.courses || [];

            // If it has services (identified by inquiry_id prefix or presence in services list)
            // Simplified: we'll check if the saved codes exist in the services list
            const foundInServices = selected.some(code => allServicesForInquiries.some(s => s.service_code === code));
            if (foundInServices) {
                document.querySelector('input[name="inquiry-type"][value="service"]').checked = true;
                typeLabel.innerHTML = 'Interested Services <span class="required">*</span>';
                courseFields.style.display = 'none';
                renderCheckboxes(allServicesForInquiries, true, selected);
            } else {
                renderCheckboxes(allCoursesForInquiries, false, selected);
            }
        }
    } else {
        renderCheckboxes(allCoursesForInquiries, false);
    }

    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
}

function closeForm() {
    document.getElementById('inquiry-form-container').style.display = 'none';
}

async function saveInquiry() {
    const { Toast } = window.AdminUtils;
    const btn = document.getElementById('save-inquiry-btn');
    const editId = document.getElementById('edit-inquiry-id').value;
    const isService = document.querySelector('input[name="inquiry-type"]:checked').value === 'service';

    const name = document.getElementById('inquiry-name').value.trim();
    const phone = document.getElementById('inquiry-phone').value.trim();
    const interests = Array.from(document.querySelectorAll('input[name="inquiry-interests"]:checked')).map(cb => cb.value);

    if (!name || !phone || interests.length === 0) {
        Toast.error('Validation', 'Please fill all required fields');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
        const payload = {
            name,
            phone,
            email: document.getElementById('inquiry-email').value.trim() || null,
            courses: interests,
            notes: document.getElementById('inquiry-notes').value.trim() || null,
            source: isService ? 'Walk-in' : document.getElementById('inquiry-source').value,
            status: isService ? 'New' : document.getElementById('inquiry-status').value,
            demo_required: isService ? false : (document.querySelector('input[name="demo-required"]:checked').value === 'yes'),
            demo_date: isService ? null : (document.getElementById('inquiry-demo-date').value || null),
            demo_time: isService ? null : (document.getElementById('inquiry-demo-time').value || null)
        };

        if (editId) {
            const { error } = await window.supabaseClient.from('inquiries').update(payload).eq('id', editId);
            if (error) throw error;
        } else {
            // New Inquiry ID: Sr-ACS-XXX
            const { data: max } = await window.supabaseClient.from('inquiries').select('inquiry_id').order('inquiry_id', { ascending: false }).limit(1);
            let next = 1;
            if (max?.[0]?.inquiry_id) {
                const match = max[0].inquiry_id.match(/Sr-ACS-(\d+)/);
                if (match) next = parseInt(match[1]) + 1;
            }
            payload.inquiry_id = `Sr-ACS-${String(next).padStart(3, '0')}`;

            const { error } = await window.supabaseClient.from('inquiries').insert(payload);
            if (error) throw error;
        }

        Toast.success('Success', `Inquiry ${editId ? 'updated' : 'added'}`);
        closeForm();
        await loadInquiries();
    } catch (err) {
        Toast.error('Save error', err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Save Inquiry';
    }
}

// ... Rest of the helper functions from original file ...
async function convertToStudent(id) {
    const { data } = await window.supabaseClient.from('inquiries').select('*').eq('id', id).single();
    if (data) {
        const params = new URLSearchParams({ prefill: '1', name: data.name, phone: data.phone, email: data.email || '', interests: data.courses.join(',') });
        window.location.href = `../students/?${params.toString()}`;
    }
}
function showDeleteConfirm(id, name) {
    inquiryToDelete = id;
    document.getElementById('delete-name').textContent = name;
    document.getElementById('delete-overlay').style.display = 'flex';
}
function hideDeleteConfirm() {
    document.getElementById('delete-overlay').style.display = 'none';
}
async function confirmDelete() {
    await window.supabaseClient.from('inquiries').delete().eq('id', inquiryToDelete);
    hideDeleteConfirm();
    loadInquiries();
}
function bindDeleteEvents() {
    document.getElementById('cancel-delete-btn')?.onclick = hideDeleteConfirm;
    document.getElementById('confirm-delete-btn')?.onclick = confirmDelete;
}
function bindSearchEvents() {
    document.getElementById('inquiry-search')?.oninput = (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.data-table tbody tr, .data-card').forEach(el => {
            el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
    }
}
