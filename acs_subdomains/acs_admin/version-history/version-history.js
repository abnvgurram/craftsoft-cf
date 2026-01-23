/* ============================================
   Version History - Data & Initialization
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
    // Auth Check
    const session = await window.supabaseConfig.getSession();
    if (!session) {
        window.location.href = '/login';
        return;
    }

    // Init Sidebar & Header
    AdminSidebar.init('version-history', '../');

    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = AdminHeader.render('v-History');
    }

    // Render Account Panel (same pattern as dashboard.js)
    const admin = await window.Auth.getCurrentAdmin();
    await AdminSidebar.renderAccountPanel(session, admin);

    await fetchAndRenderTable();
});

async function fetchAndRenderTable() {
    const tableBody = document.getElementById('v-history-body');
    const cardsContainer = document.getElementById('v-history-cards');
    const tableContainer = document.querySelector('.table-container');

    if (!tableBody || !cardsContainer) return;

    try {
        const { data, error } = await window.supabaseClient
            .from('version_history')
            .select('*')
            .order('id', { ascending: false }); // Show newest first

        if (error) throw error;

        if (!data || data.length === 0) {
            const emptyMsg = '<div style="text-align:center; padding: 2rem;">No version history records found.</div>';
            tableContainer.innerHTML = emptyMsg;
            cardsContainer.innerHTML = emptyMsg;
            return;
        }

        // Render Table
        tableBody.innerHTML = data.map(ver => `
            <tr>
                <td><span class="v-badge">${ver.version}</span></td>
                <td><span class="milestone-focus">${ver.focus}</span></td>
                <td><div class="milestone-desc">${ver.milestones.replace(/\n/g, '<br>')}</div></td>
            </tr>
        `).join('');

        // Render Cards
        cardsContainer.innerHTML = data.map(ver => `
            <div class="premium-card">
                <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="card-id-badge">${ver.version}</span>
                    <span class="milestone-focus" style="font-size: 0.9rem;">${ver.focus}</span>
                </div>
                <div class="card-body" style="padding-top: 0.75rem; border-top: 1px solid var(--admin-input-border); margin-top: 0.75rem;">
                    <div class="card-info-row">
                        <div class="card-info-item">
                            <i class="fa-solid fa-list-check"></i>
                            <div class="milestone-desc">${ver.milestones.replace(/\n/g, '<br>')}</div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.error('Error fetching version history:', err);
        tableContainer.innerHTML = '<div style="text-align:center; color: red; padding: 2rem;">Error loading version history.</div>';
    }
}

window.handleLogout = async () => {
    const { Modal } = window.AdminUtils || {};
    if (Modal) {
        Modal.confirm('Sign Out', 'Are you sure you want to sign out?', async () => {
            await window.Auth.logout();
        });
    }
};
