// Experts Page Logic - Manage Service Providers
// Features: List, Add, Edit, Filter, Delete, Message, Pagination, Multi-select

let allExperts = [];
let currentExperts = []; // For filtering and pagination
let itemsPerPage = 10;
let currentPage = 1;
let selectedExpertIds = new Set();

// Update user info
auth.onAuthStateChanged((user) => {
    if (user) {
        const initial = user.email.charAt(0).toUpperCase();
        const avatar = document.getElementById('userAvatar');
        if (avatar) avatar.textContent = initial;
    }
});

// ------------ LOAD DATA ------------
async function loadExperts() {
    try {
        if (typeof showCardSkeleton === 'function') showCardSkeleton('expertsTable', 4, 'expertsMobileCards');
        else showLoadingState();

        const snapshot = await db.collection('experts').orderBy('createdAt', 'desc').get();

        allExperts = [];
        let activeCount = 0;
        let busyCount = 0;

        snapshot.forEach(doc => {
            const expert = { id: doc.id, ...doc.data() };
            allExperts.push(expert);

            if (expert.status === 'active') activeCount++;
            if (expert.status === 'busy') busyCount++;
        });

        // Update stats
        setTextContent('totalExperts', allExperts.length);
        setTextContent('activeExperts', activeCount);
        setTextContent('busyExperts', busyCount);

        // Reset Pagination
        currentPage = 1;
        applyFilters();

    } catch (error) {
        console.error('Error loading experts:', error);
        showToast('Error loading experts', 'error');
    }
}

function showLoadingState() {
    const table = document.getElementById('expertsTable');
    if (table) table.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px;">Loading...</td></tr>';
}

function setTextContent(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}


// ------------ FILTER & RENDER ------------
function applyFilters() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const skill = document.getElementById('skillFilter').value;
    const status = document.getElementById('statusFilter').value;

    currentExperts = allExperts.filter(expert => {
        const matchesSearch = !search ||
            expert.name.toLowerCase().includes(search) ||
            (expert.phone && expert.phone.includes(search)) ||
            (expert.skills && expert.skills.some(s => s.toLowerCase().includes(search)));

        const matchesSkill = !skill || (expert.skills && expert.skills.includes(skill));
        const matchesStatus = !status || expert.status === status;

        return matchesSearch && matchesSkill && matchesStatus;
    });

    renderExperts();
    updatePaginationControls();
}

function renderExperts() {
    const tableBody = document.getElementById('expertsTable');
    const mobileContainer = document.getElementById('expertsMobileCards');

    // Pagination Slice
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = currentExperts.slice(start, end);

    if (pageData.length === 0) {
        const emptyHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <span class="material-icons" style="font-size: 48px; color: #cbd5e1;">engineering</span>
                    <h3 style="margin-top: 10px; color: #64748b;">No experts found</h3>
                    <p style="color: #94a3b8;">Try adjusting filters or add a new expert</p>
                </td>
            </tr>
        `;
        if (tableBody) tableBody.innerHTML = emptyHTML;
        if (mobileContainer) mobileContainer.innerHTML = '<div style="text-align:center; padding:20px;">No experts found</div>';
        return;
    }

    // Render Table
    if (tableBody) {
        tableBody.innerHTML = pageData.map(expert => {
            const statusClass = expert.status === 'active' ? 'status-green' : (expert.status === 'busy' ? 'status-orange' : 'status-gray');
            const statusLabel = expert.status === 'active' ? 'Available' : (expert.status === 'busy' ? 'Busy' : 'Inactive');
            const skillsStr = expert.skills ? expert.skills.slice(0, 3).join(', ') + (expert.skills.length > 3 ? ` +${expert.skills.length - 3}` : '') : '-';
            const isSelected = selectedExpertIds.has(expert.id);

            return `
                <tr class="${isSelected ? 'selected-row' : ''}">
                    <td><input type="checkbox" onchange="toggleSelect('${expert.id}')" ${isSelected ? 'checked' : ''}></td>
                    <td>
                        <div style="font-weight: 500;">${expert.name}</div>
                        <div style="font-size: 0.85rem; color: #64748b;">${expert.phone}</div>
                    </td>
                    <td>${skillsStr}</td>
                    <td>${expert.experience ? expert.experience + ' Yrs' : '-'}</td>
                    <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                    <td>
                        <div class="row-actions">
                            <button class="btn-icon" onclick="openMessageModal('${expert.phone}', '${expert.email}', '${expert.name}')" title="Message">
                                <span class="material-icons" style="color:#25D366;">chat</span>
                            </button>
                            <button class="btn-icon" onclick="openEditExpertModal('${expert.id}')" title="Edit">
                                <span class="material-icons">edit</span>
                            </button>
                            <button class="btn-icon" onclick="deleteExpert('${expert.id}')" title="Delete" style="color: #EF4444;">
                                <span class="material-icons">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Render Mobile Cards
    if (mobileContainer) {
        mobileContainer.innerHTML = pageData.map(expert => {
            const statusClass = expert.status === 'active' ? 'status-green' : (expert.status === 'busy' ? 'status-orange' : 'status-gray');
            const statusLabel = expert.status === 'active' ? 'Available' : (expert.status === 'busy' ? 'Busy' : 'Inactive');
            const skillsStr = expert.skills ? expert.skills.join(', ') : '-';

            return `
                <div class="mobile-card">
                    <div class="mobile-card-header">
                        <div>
                            <div class="mobile-card-title">${expert.name}</div>
                            <div class="mobile-card-subtitle">${expert.phone}</div>
                        </div>
                        <span class="status-badge ${statusClass}">${statusLabel}</span>
                    </div>
                    <div class="mobile-card-body">
                        <div class="mobile-data-row">
                            <span class="label">Skills</span>
                            <span class="value">${skillsStr}</span>
                        </div>
                        <div class="mobile-data-row">
                            <span class="label">Exp</span>
                            <span class="value">${expert.experience || '0'} Years</span>
                        </div>
                    </div>
                    <div class="mobile-card-actions">
                        <button class="btn btn-outline btn-sm" onclick="openMessageModal('${expert.phone}', '${expert.email}', '${expert.name}')">
                            <span class="material-icons" style="color:#25D366; font-size:18px;">chat</span> Message
                        </button>
                         <button class="btn btn-outline btn-sm" onclick="openEditExpertModal('${expert.id}')">Edit</button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// ------------ PAGINATION ------------
function updatePaginationControls() {
    const totalPages = Math.ceil(currentExperts.length / itemsPerPage);
    const prevBtn = document.getElementById('prevPageTop');
    const nextBtn = document.getElementById('nextPageTop');
    const indicator = document.getElementById('pageIndicator');

    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderExperts(); updatePaginationControls(); } };
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages || totalPages === 0;
        nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderExperts(); updatePaginationControls(); } };
    }

    if (indicator) {
        indicator.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    }
}


// ------------ EVENT LISTENERS ------------
document.getElementById('searchInput').addEventListener('input', () => { currentPage = 1; applyFilters(); });
document.getElementById('skillFilter').addEventListener('change', () => { currentPage = 1; applyFilters(); });
document.getElementById('statusFilter').addEventListener('change', () => { currentPage = 1; applyFilters(); });


// ------------ CRUD ------------

// Add Expert
document.getElementById('addExpertForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('expertName').value.trim();
    const phone = document.getElementById('expertPhone').value.trim();
    const email = document.getElementById('expertEmail').value.trim();
    const experience = document.getElementById('expertExperience').value;
    const portfolio = document.getElementById('expertPortfolio').value.trim();
    const status = document.getElementById('expertStatus').value;
    const notes = document.getElementById('expertNotes').value.trim();

    // Get Multi-select values
    const skills = getMultiSelectValues('expertSkillsDropdown');

    try {
        await db.collection('experts').add({
            name, phone, email, skills, experience, portfolio, status, notes,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast('Expert added successfully', 'success');
        closeModal('addExpertModal');
        loadExperts();
    } catch (error) {
        console.error('Error adding expert:', error);
        showToast('Error adding expert', 'error');
    }
});

// Open Add Modal
function openAddExpertModal() {
    document.getElementById('addExpertForm').reset();
    resetMultiSelect('expertSkillsDropdown');
    document.getElementById('addExpertModal').classList.add('active');
}

// Edit Expert
async function openEditExpertModal(id) {
    const expert = allExperts.find(e => e.id === id);
    if (!expert) return;

    document.getElementById('editExpertId').value = id;
    document.getElementById('editExpertName').value = expert.name;
    document.getElementById('editExpertPhone').value = expert.phone;
    document.getElementById('editExpertEmail').value = expert.email || '';
    document.getElementById('editExpertExperience').value = expert.experience || '';
    document.getElementById('editExpertPortfolio').value = expert.portfolio || '';
    document.getElementById('editExpertStatus').value = expert.status;
    document.getElementById('editExpertNotes').value = expert.notes || '';

    setMultiSelectValues('editExpertSkillsDropdown', expert.skills || []);

    document.getElementById('editExpertModal').classList.add('active');
}

document.getElementById('editExpertForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editExpertId').value;

    const updates = {
        name: document.getElementById('editExpertName').value.trim(),
        phone: document.getElementById('editExpertPhone').value.trim(),
        email: document.getElementById('editExpertEmail').value.trim(),
        skills: getMultiSelectValues('editExpertSkillsDropdown'),
        experience: document.getElementById('editExpertExperience').value,
        portfolio: document.getElementById('editExpertPortfolio').value.trim(),
        status: document.getElementById('editExpertStatus').value,
        notes: document.getElementById('editExpertNotes').value.trim()
    };

    try {
        await db.collection('experts').doc(id).update(updates);
        showToast('Expert updated', 'success');
        closeModal('editExpertModal');
        loadExperts();
    } catch (error) {
        console.error('Error updating:', error);
        showToast('Error updating expert', 'error');
    }
});

// Delete Expert
async function deleteExpert(id) {
    if (!confirm('Are you sure you want to delete this expert?')) return;
    try {
        await db.collection('experts').doc(id).delete();
        showToast('Expert deleted', 'success');
        loadExperts();
    } catch (error) {
        showToast('Error deleting expert', 'error');
    }
}

// ------------ HELPERS ------------

function openMessageModal(phone, email, name) {
    // Simple direct action for now
    const msg = `Hi ${name}, reaching out regarding a project opportunity at Craft Soft.`;
    const wa = `https://wa.me/${phone.replace(/\+/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(wa, '_blank');
}


// ------------ MULTI-SELECT LOGIC ------------
// (Reused from tutors but defined here for independence)
function toggleMultiSelect(id) {
    const el = document.getElementById(id);
    // Close others
    document.querySelectorAll('.multi-select-dropdown').forEach(d => {
        if (d.id !== id) d.classList.remove('open');
    });
    el.classList.toggle('open');
}

function getMultiSelectValues(id) {
    const el = document.getElementById(id);
    const inputs = el.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(inputs).map(i => i.value);
}

function setMultiSelectValues(id, values) {
    const el = document.getElementById(id);
    const inputs = el.querySelectorAll('input[type="checkbox"]');
    let display = [];
    inputs.forEach(input => {
        input.checked = values.includes(input.value);
        if (input.checked) display.push(input.value);
    });
    updateMultiSelectDisplay(id);
}

function resetMultiSelect(id) {
    const el = document.getElementById(id);
    el.querySelectorAll('input').forEach(i => i.checked = false);
    updateMultiSelectDisplay(id);
}

function updateMultiSelectDisplay(id) {
    const el = document.getElementById(id);
    const inputs = el.querySelectorAll('input[type="checkbox"]:checked');
    const textSpan = el.querySelector('.selected-text');

    if (inputs.length === 0) {
        textSpan.textContent = "Select options...";
        textSpan.classList.remove('has-value');
    } else {
        textSpan.textContent = `${inputs.length} selected`;
        textSpan.classList.add('has-value');
    }
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.multi-select-dropdown')) {
        document.querySelectorAll('.multi-select-dropdown').forEach(el => el.classList.remove('open'));
    }
});

// Update display on checkbox change
document.querySelectorAll('.multi-select-options input').forEach(input => {
    input.addEventListener('change', (e) => {
        const dropdown = e.target.closest('.multi-select-dropdown');
        updateMultiSelectDisplay(dropdown.id);
    });
});


// ------------ BULK ACTIONS ------------
function toggleSelectAll() {
    const newState = document.getElementById('selectAll').checked;
    const checkboxes = document.querySelectorAll('#expertsTable input[type="checkbox"]');

    currentExperts.forEach(e => {
        if (newState) selectedExpertIds.add(e.id);
        else selectedExpertIds.delete(e.id);
    });

    renderExperts(); // Re-render to update UI state
    updateBulkActionUI();
}

function toggleSelect(id) {
    if (selectedExpertIds.has(id)) selectedExpertIds.delete(id);
    else selectedExpertIds.add(id);

    updateBulkActionUI();
    // highlight row
    const checkbox = document.querySelector(`input[onchange="toggleSelect('${id}')"]`);
    if (checkbox) {
        const row = checkbox.closest('tr');
        if (selectedExpertIds.has(id)) row.classList.add('selected-row');
        else row.classList.remove('selected-row');
    }
}

function updateBulkActionUI() {
    const bar = document.getElementById('bulkActions');
    const count = document.getElementById('selectedCount');
    const selectAll = document.getElementById('selectAll');

    if (selectedExpertIds.size > 0) {
        bar.style.display = 'flex';
        count.textContent = `${selectedExpertIds.size} selected`;
    } else {
        bar.style.display = 'none';
        if (selectAll) selectAll.checked = false;
    }
}

async function bulkDelete() {
    if (!confirm(`Delete ${selectedExpertIds.size} experts?`)) return;

    const ids = Array.from(selectedExpertIds);
    // Firestore batch is limited to 500, unlikely to hit here but good practice
    const batch = db.batch();
    ids.forEach(id => {
        const ref = db.collection('experts').doc(id);
        batch.delete(ref);
    });

    try {
        await batch.commit();
        showToast('Deleted successfully', 'success');
        selectedExpertIds.clear();
        updateBulkActionUI();
        loadExperts();
    } catch (e) {
        showToast('Error deleting', 'error');
    }
}

function bulkEmail() {
    const emails = allExperts.filter(e => selectedExpertIds.has(e.id) && e.email).map(e => e.email);
    if (emails.length === 0) { showToast('No emails found', 'info'); return; }
    window.location.href = `mailto:?bcc=${emails.join(',')}`;
}


// Init
document.addEventListener('DOMContentLoaded', loadExperts);

// Toast Helper
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="material-icons">${type === 'success' ? 'check_circle' : 'error'}</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}
