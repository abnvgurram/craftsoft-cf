document.addEventListener('DOMContentLoaded', () => {
    initServices();
});

let allServices = [];

async function initServices() {
    // Initialize Sidebar
    if (window.AdminSidebar) {
        window.AdminSidebar.init('acs_services', '../');
    }

    await loadServices();
    bindEvents();
}

async function loadServices() {
    const { Toast } = window.AdminUtils;
    const container = document.getElementById('services-table-container');

    try {
        const { data, error } = await window.supabaseClient
            .from('services')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        allServices = data || [];
        renderServicesTable(allServices);
        updateStats(allServices);

    } catch (err) {
        console.error('Error loading services:', err);
        Toast.error('Error', 'Failed to load services data');
        container.innerHTML = '<div class="error-state">Failed to load services. Please try again.</div>';
    }
}

function renderServicesTable(services) {
    const container = document.getElementById('services-table-container');

    if (services.length === 0) {
        container.innerHTML = '<div class="empty-state">No services found. Add your first service!</div>';
        return;
    }

    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Service Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${services.map(srv => `
                    <tr>
                        <td><span class="service-id-badge">${srv.service_id || 'SRV-X'}</span></td>
                        <td style="font-weight: 500;">${srv.name}</td>
                        <td><span class="category-tag category-${srv.category.toLowerCase()}">${srv.category}</span></td>
                        <td><span class="status-badge status-${srv.status.toLowerCase()}">${srv.status}</span></td>
                        <td>
                            <div class="action-btns">
                                <button class="action-btn edit-btn" onclick="openModal(true, ${srv.id})" title="Edit">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="action-btn delete-btn" onclick="deleteService(${srv.id})" title="Delete">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function updateStats(services) {
    document.getElementById('total-services').textContent = services.length;
    document.getElementById('active-services').textContent = services.filter(s => s.status === 'Active').length;
}

function bindEvents() {
    document.getElementById('add-service-btn').addEventListener('click', () => openModal(false));
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('service-form').addEventListener('submit', handleFormSubmit);

    // Search & Filter
    document.getElementById('service-search').addEventListener('input', filterData);
    document.getElementById('category-filter').addEventListener('change', filterData);
}

function openModal(isEdit = false, id = null) {
    const modal = document.getElementById('service-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('service-form');

    form.reset();
    document.getElementById('edit-service-id').value = '';

    if (isEdit) {
        const service = allServices.find(s => s.id === id);
        if (service) {
            title.textContent = 'Edit Service';
            document.getElementById('edit-service-id').value = service.id;
            document.getElementById('service-name').value = service.name;
            document.getElementById('service-category').value = service.category;
            document.getElementById('service-status').value = service.status;
            document.getElementById('service-description').value = service.description || '';
        }
    } else {
        title.textContent = 'Add New Service';
    }

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('service-modal').classList.remove('active');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const { Toast } = window.AdminUtils;
    const saveBtn = document.getElementById('save-service-btn');

    const id = document.getElementById('edit-service-id').value;
    const name = document.getElementById('service-name').value;
    const category = document.getElementById('service-category').value;
    const status = document.getElementById('service-status').value;
    const description = document.getElementById('service-description').value;

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
        const serviceData = { name, category, status, description };

        if (id) {
            // Update
            const { error } = await window.supabaseClient.from('services').update(serviceData).eq('id', id);
            if (error) throw error;
            Toast.success('Updated', 'Service updated successfully');
        } else {
            // New ID generation (SRV-001 format)
            const { data: maxSrv } = await window.supabaseClient.from('services').select('service_id').order('service_id', { ascending: false }).limit(1);
            let nextNum = 1;
            if (maxSrv?.length > 0) {
                const match = maxSrv[0].service_id.match(/SRV-(\d+)/);
                if (match) nextNum = parseInt(match[1]) + 1;
            }
            const service_id = `SRV-${String(nextNum).padStart(3, '0')}`;

            const { error } = await window.supabaseClient.from('services').insert({ ...serviceData, service_id });
            if (error) throw error;
            Toast.success('Created', 'New service added');
        }

        closeModal();
        await loadServices();
    } catch (err) {
        console.error('Error saving service:', err);
        Toast.error('Error', err.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Save Service';
    }
}

async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    const { Toast } = window.AdminUtils;

    try {
        const { error } = await window.supabaseClient.from('services').delete().eq('id', id);
        if (error) throw error;
        Toast.success('Deleted', 'Service removed');
        await loadServices();
    } catch (err) {
        Toast.error('Error', 'Failed to delete service');
    }
}

function filterData() {
    const searchTerm = document.getElementById('service-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;

    const filtered = allServices.filter(srv => {
        const matchesSearch = srv.name.toLowerCase().includes(searchTerm) ||
            (srv.service_id && srv.service_id.toLowerCase().includes(searchTerm));
        const matchesCategory = categoryFilter === 'all' || srv.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    renderServicesTable(filtered);
}
