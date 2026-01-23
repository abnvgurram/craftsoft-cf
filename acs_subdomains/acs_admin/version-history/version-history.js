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
    AdminSidebar.init('v-history', '../');

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
    const container = document.getElementById('v-history-body'); // Still need this for legacy if anyone references it
    const parentContainer = document.querySelector('.table-container');
    if (!parentContainer) return;

    try {
        const { data, error } = await window.supabaseClient
            .from('version_history')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            parentContainer.innerHTML = '<div style="text-align:center; padding: 2rem;">No version history records found.</div>';
            return;
        }

        // Render Table and Cards
        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 100px;">Version</th>
                        <th style="width: 180px;">Focus</th>
                        <th>Core Milestones</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(ver => `
                        <tr>
                            <td><span class="v-badge">${ver.version}</span></td>
                            <td><span class="milestone-focus">${ver.focus}</span></td>
                            <td><div class="milestone-desc">${ver.milestones}</div></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        const cardsHTML = `
            <div class="data-cards">
                ${data.map(ver => `
                    <div class="premium-card">
                        <div class="card-header">
                            <span class="card-id-badge">${ver.version}</span>
                        </div>
                        <div class="card-body">
                            <h4 class="card-name" style="color: var(--admin-input-focus);">${ver.focus}</h4>
                            <div class="card-info-row">
                                <div class="card-info-item">
                                    <i class="fa-solid fa-list-check"></i>
                                    <div class="milestone-desc">${ver.milestones}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Update the main container
        parentContainer.innerHTML = tableHTML + cardsHTML;

    } catch (err) {
        console.error('Error fetching version history:', err);
        parentContainer.innerHTML = '<div style="text-align:center; color: red; padding: 2rem;">Error loading version history.</div>';
    }
}

window.handleLogout = async () => {
    const { Modal } = window.AdminUtils || {};
    if (Modal) {
        Modal.confirm('Sign Out', 'Are you sure you want to sign out?', async () => {
            await window.Auth.signOut();
        });
    }
};
