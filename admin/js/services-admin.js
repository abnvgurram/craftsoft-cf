// Services Admin Logic - Manage Service/Project Requests

let allServices = [];
let currentServices = [];
let itemsPerPage = 10;
let currentPage = 1;
let selectedServiceIds = new Set();

auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('userAvatar').textContent = user.email.charAt(0).toUpperCase();
    }
});

// ------------ LOAD DATA ------------
async function loadServices() {
    try {
        if (typeof showCardSkeleton === 'function') showCardSkeleton('servicesTable', 4, 'servicesMobileCards');

        // Fetch inquiries where type is 'service' OR 'project' (handling legacy)
        // Note: Firestore limited queries might need index. simpler to fetch all inquiries and filter in JS for now as dataset is small.
        // If dataset grows, we should add 'type' index and query .where('type', '==', 'service')
        const snapshot = await db.collection('inquiries').orderBy('createdAt', 'desc').get();

        allServices = [];
        let newCount = 0;
        let progressCount = 0;
        let completeCount = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            // Check if it's a service. 
            // We'll update main.js to add 'type'='service'. 
            // Also check 'service' field existence as fallback for previous entries.
            const isService = data.type === 'service' || data.service || (data.course && ['Graphic Design', 'Web Development'].includes(data.course) && !data.course.includes('Core'));

            // For now, let's assume if it has 'service' field (from new form) it is a service.
            // Or if we check the new 'type' field.
            if (data.type === 'service' || data.service) {
                const item = { id: doc.id, ...data };
                allServices.push(item);

                if (!item.status || item.status === 'new') newCount++;
                if (item.status === 'in-progress') progressCount++;
                if (item.status === 'completed') completeCount++;
            }
        });

        // Update stats
        setTextContent('newRequests', newCount);
        setTextContent('inProgress', progressCount);
        setTextContent('completedProjects', completeCount);

        applyFilters();

    } catch (error) {
        console.error('Error loading services:', error);
        showToast('Error loading services', 'error');
    }
}

function setTextContent(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }

// ------------ FILTER & RENDER ------------
function applyFilters() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;

    currentServices = allServices.filter(item => {
        const name = item.name || '';
        const service = item.service || item.course || ''; // Fallback

        const matchesSearch = !search ||
            name.toLowerCase().includes(search) ||
            service.toLowerCase().includes(search);

        const matchesStatus = !status || item.status === status || (status === 'new' && !item.status);

        return matchesSearch && matchesStatus;
    });

    currentPage = 1;
    renderServices();
    updatePaginationControls();
}

function renderServices() {
    const tableBody = document.getElementById('servicesTable');
    const mobileContainer = document.getElementById('servicesMobileCards');

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = currentServices.slice(start, end);

    if (pageData.length === 0) {
        const emptyHTML = `<tr><td colspan="6" style="text-align:center; padding:40px; color:#64748b;">No service requests found</td></tr>`;
        if (tableBody) tableBody.innerHTML = emptyHTML;
        if (mobileContainer) mobileContainer.innerHTML = '<div style="text-align:center; padding:20px;">No requests found</div>';
        return;
    }

    if (tableBody) {
        tableBody.innerHTML = pageData.map(item => {
            const date = item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : '-';
            const status = item.status || 'new';
            const statusColor = getStatusColor(status);
            const isSelected = selectedServiceIds.has(item.id);

            return `
                <tr class="${isSelected ? 'selected-row' : ''}">
                    <td><input type="checkbox" onchange="toggleSelect('${item.id}')" ${isSelected ? 'checked' : ''}></td>
                    <td>
                        <div style="font-weight:500;">${item.name}</div>
                        <div style="font-size:0.85rem; color:#64748b;">${item.phone}</div>
                    </td>
                    <td><span class="badge badge-blue">${item.service || item.course || 'General'}</span></td>
                    <td>${date}</td>
                    <td><span class="status-badge" style="background:${statusColor.bg}; color:${statusColor.text};">${formatStatus(status)}</span></td>
                    <td>
                        <div class="row-actions">
                            <button class="btn-icon" onclick="openMessageAction('${item.phone}', '${item.name}', '${item.service}')" title="Message">
                                <span class="material-icons" style="color:#25D366;">chat</span>
                            </button>
                            <button class="btn-icon" onclick="openEditModal('${item.id}')" title="Edit">
                                <span class="material-icons">edit</span>
                            </button>
                            <button class="btn-icon" onclick="deleteService('${item.id}')" title="Delete" style="color:#EF4444;">
                                <span class="material-icons">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (mobileContainer) {
        mobileContainer.innerHTML = pageData.map(item => {
            const status = item.status || 'new';
            const statusColor = getStatusColor(status);
            return `
                <div class="mobile-card">
                    <div class="mobile-card-header">
                        <div>
                            <div class="mobile-card-title">${item.name}</div>
                            <div class="mobile-card-subtitle">${item.service || 'Service Request'}</div>
                        </div>
                        <span class="status-badge" style="background:${statusColor.bg}; color:${statusColor.text};">${formatStatus(status)}</span>
                    </div>
                    <div class="mobile-card-actions">
                         <button class="btn btn-outline btn-sm" onclick="openMessageAction('${item.phone}', '${item.name}', '${item.service}')">Message</button>
                         <button class="btn btn-outline btn-sm" onclick="openEditModal('${item.id}')">Edit</button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function getStatusColor(status) {
    switch (status) {
        case 'new': return { bg: '#DBEAFE', text: '#1E40AF' }; // Blue
        case 'contacted': return { bg: '#FEF3C7', text: '#92400E' }; // Amber
        case 'proposal': return { bg: '#E0E7FF', text: '#3730A3' }; // Indigo
        case 'in-progress': return { bg: '#D1FAE5', text: '#065F46' }; // Green
        case 'completed': return { bg: '#ECFCCB', text: '#365314' }; // Lime
        case 'cancelled': return { bg: '#FEE2E2', text: '#991B1B' }; // Red
        default: return { bg: '#F1F5F9', text: '#475569' };
    }
}
function formatStatus(str) {
    return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ------------ ACTIONS ------------
function openAddServiceModal() {
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceId').value = '';
    document.getElementById('modalTitle').innerHTML = '<span class="material-icons">design_services</span> New Request';
    document.getElementById('serviceModal').classList.add('active');
}

async function openEditModal(id) {
    const item = allServices.find(s => s.id === id);
    if (!item) return;

    document.getElementById('serviceId').value = id;
    document.getElementById('clientName').value = item.name;
    document.getElementById('clientPhone').value = item.phone;
    document.getElementById('clientEmail').value = item.email || '';
    document.getElementById('serviceType').value = item.service || item.course || 'Other';
    document.getElementById('serviceStatus').value = item.status || 'new';
    document.getElementById('serviceNotes').value = item.notes || '';

    document.getElementById('modalTitle').innerHTML = '<span class="material-icons">edit</span> Edit Request';
    document.getElementById('serviceModal').classList.add('active');
}

document.getElementById('serviceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('serviceId').value;
    const data = {
        name: document.getElementById('clientName').value,
        phone: document.getElementById('clientPhone').value,
        email: document.getElementById('clientEmail').value,
        service: document.getElementById('serviceType').value,
        status: document.getElementById('serviceStatus').value,
        notes: document.getElementById('serviceNotes').value,
        type: 'service', // Ensure type is set
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        if (id) {
            await db.collection('inquiries').doc(id).update(data);
            showToast('Request updated');
        } else {
            data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('inquiries').add(data);
            showToast('Request created');
        }
        closeModal('serviceModal');
        loadServices();
    } catch (err) {
        console.error(err);
        showToast('Error saving request', 'error');
    }
});

async function deleteService(id) {
    if (!confirm('Delete this request?')) return;
    try {
        await db.collection('inquiries').doc(id).delete();
        showToast('Deleted successfully');
        loadServices();
    } catch (err) {
        showToast('Error deleting', 'error');
    }
}

function openMessageAction(phone, name, service) {
    const msg = `Hi ${name}, I'm contacting you regarding your request for ${service || 'services'} at Abhi's Craft Soft.`;
    window.open(`https://wa.me/${phone.replace(/\+/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
}


// ------------ BULK & PAGINATION ------------
// Reusing similar logic as experts.js
function updatePaginationControls() {
    const totalPages = Math.ceil(currentServices.length / itemsPerPage);
    const prev = document.getElementById('prevPage');
    const next = document.getElementById('nextPage');
    const ind = document.getElementById('pageIndicator');

    if (prev) { prev.disabled = currentPage === 1; prev.onclick = () => { currentPage--; renderServices(); updatePaginationControls(); }; }
    if (next) { next.disabled = currentPage >= totalPages || totalPages === 0; next.onclick = () => { currentPage++; renderServices(); updatePaginationControls(); }; }
    if (ind) ind.textContent = `Page ${currentPage} of ${totalPages || 1}`;
}

function toggleSelectAll() {
    const checked = document.getElementById('selectAll').checked;
    currentServices.forEach(s => checked ? selectedServiceIds.add(s.id) : selectedServiceIds.delete(s.id));
    renderServices(); updateBulkUI();
}
function toggleSelect(id) {
    selectedServiceIds.has(id) ? selectedServiceIds.delete(id) : selectedServiceIds.add(id);
    updateBulkUI();
    // highlight row
    const checkbox = document.querySelector(`input[onchange="toggleSelect('${id}')"]`);
    if (checkbox) {
        const row = checkbox.closest('tr');
        if (selectedServiceIds.has(id)) row.classList.add('selected-row');
        else row.classList.remove('selected-row');
    }
}
function updateBulkUI() {
    const bar = document.getElementById('bulkActions');
    const count = document.getElementById('selectedCount');
    if (selectedServiceIds.size > 0) {
        bar.style.display = 'flex';
        count.textContent = `${selectedServiceIds.size} selected`;
    } else {
        bar.style.display = 'none';
        document.getElementById('selectAll').checked = false;
    }
}
async function bulkDelete() {
    if (!confirm(`Delete ${selectedServiceIds.size} items?`)) return;
    const batch = db.batch();
    selectedServiceIds.forEach(id => { batch.delete(db.collection('inquiries').doc(id)); });
    await batch.commit();
    showToast('Deleted');
    selectedServiceIds.clear();
    loadServices();
}

// Bind Events
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('statusFilter').addEventListener('change', applyFilters);
document.addEventListener('DOMContentLoaded', loadServices);

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function showToast(msg, type = 'success') { /* existing toast logic */
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="material-icons">${type === 'success' ? 'check_circle' : 'error'}</span><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}
