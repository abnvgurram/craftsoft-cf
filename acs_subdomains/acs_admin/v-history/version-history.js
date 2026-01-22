/* ============================================
   Version History - Data & Initialization
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
    // Auth Check
    const session = await window.supabaseConfig.getSession();
    if (!session) {
        window.location.href = '../login.html';
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
    const container = document.getElementById('v-history-body');
    if (!container) return;

    try {
        const { data, error } = await window.supabaseClient
            .from('version_history')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 2rem;">No version history records found in database.</td></tr>';
            return;
        }

        container.innerHTML = data.map(ver => `
            <tr>
                <td><span class="v-badge">${ver.version}</span></td>
                <td><span class="milestone-focus">${ver.focus}</span></td>
                <td><div class="milestone-desc">${ver.milestones}</div></td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error fetching version history:', err);
        container.innerHTML = '<tr><td colspan="3" style="text-align:center; color: red; padding: 2rem;">Error loading version history.</td></tr>';
    }
}
