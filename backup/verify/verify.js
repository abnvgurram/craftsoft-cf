/**
 * Verify Receipt Logic - Multiple Receipts Support
 * Abhi's Craft Soft
 */

document.addEventListener('DOMContentLoaded', () => {
    const findBtn = document.getElementById('find-receipt-btn');
    const verifyIdInput = document.getElementById('verify-id');
    const loadingState = document.getElementById('verify-loading');
    const placeholder = document.getElementById('verify-placeholder');
    const resultContainer = document.getElementById('receipt-result');
    const receiptsList = document.getElementById('receipts-list');
    const receiptsTitle = document.getElementById('receipts-title');
    const receiptsCount = document.getElementById('receipts-count');
    const noPaymentsState = document.getElementById('no-payments-state');
    const noPaymentsName = document.getElementById('no-payments-name');
    const errorModal = document.getElementById('error-modal');
    const closeErrorBtn = document.getElementById('close-error-modal');

    // Sample Data for local testing (multiple receipts per student)
    const demoData = {
        'ST-ACS-505': [
            {
                receiptNo: '#RCT-ACS-102',
                name: 'Kamsani Srujana',
                date: 'Jan 07, 2026',
                course: 'Python Full Stack Development',
                clientId: 'ST-ACS-505',
                total: '₹ 50,000.00',
                paid: '₹ 35,000.00',
                due: '₹ 15,000.00',
                status: 'PARTIAL'
            },
            {
                receiptNo: '#RCT-ACS-088',
                name: 'Kamsani Srujana',
                date: 'Dec 15, 2025',
                course: 'UI/UX Design Mastery',
                clientId: 'ST-ACS-505',
                total: '₹ 15,000.00',
                paid: '₹ 15,000.00',
                due: '₹ 0.00',
                status: 'FULLY PAID'
            }
        ],
        'STU-12345': [
            {
                receiptNo: '#RCT-ACS-882',
                name: 'John Doe',
                date: 'Jan 08, 2026',
                course: 'UI/UX Design Mastery',
                clientId: 'STU-12345',
                total: '₹ 15,000.00',
                paid: '₹ 15,000.00',
                due: '₹ 0.00',
                status: 'FULLY PAID'
            }
        ]
    };

    // Button loading state helpers
    const setButtonLoading = (loading) => {
        if (loading) {
            findBtn.disabled = true;
            findBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        } else {
            findBtn.disabled = false;
            findBtn.innerHTML = '<span class="btn-text">Find Receipt</span>';
        }
    };

    // Generate receipt card HTML
    const createReceiptCard = (receipt) => {
        const isPaid = receipt.status === 'FULLY PAID' || (receipt.due && !receipt.due.match(/[1-9]/));
        const statusClass = isPaid ? 'paid' : 'partial';
        const statusText = isPaid ? 'FULLY PAID' : 'PARTIAL';
        const statusStyle = isPaid ? '' : 'background: #e0f2fe; color: #0369a1;';

        return `
            <div class="mini-receipt">
                <div class="verified-badge">
                    <i class="fas fa-check-circle"></i> Verified
                </div>
                <div class="receipt-header">
                    <div class="receipt-logo">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Abhi's Craft Soft</span>
                    </div>
                    <div class="receipt-id">
                        <span class="label">Receipt No</span>
                        <strong>${receipt.receiptNo}</strong>
                    </div>
                </div>
                <div class="receipt-body">
                    <div class="receipt-details">
                        <div class="detail-row">
                            <span>Course / Service</span>
                            <strong>${receipt.course}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Date</span>
                            <strong>${receipt.date}</strong>
                        </div>
                    </div>
                    <div class="payment-summary">
                        <div class="summary-line">
                            <span>Total Amount</span>
                            <span>${receipt.total}</span>
                        </div>
                        <div class="summary-line highlight">
                            <span>Amount Paid</span>
                            <span>${receipt.paid}</span>
                        </div>
                        <div class="summary-line due">
                            <span>Balance Due</span>
                            <span>${receipt.due}</span>
                        </div>
                    </div>
                </div>
                <div class="receipt-footer">
                    <div class="status-pill ${statusClass}" style="${statusStyle}">${statusText}</div>
                </div>
            </div>
        `;
    };

    // Close modal handler
    closeErrorBtn.addEventListener('click', () => {
        errorModal.classList.add('hidden');
        placeholder.classList.remove('hidden');
        verifyIdInput.focus();
        verifyIdInput.select();
    });

    // Click outside modal to close
    errorModal.addEventListener('click', (e) => {
        if (e.target === errorModal) {
            errorModal.classList.add('hidden');
            placeholder.classList.remove('hidden');
        }
    });

    const findReceipt = async () => {
        const inputVal = verifyIdInput.value.trim();
        if (!inputVal) {
            verifyIdInput.focus();
            return;
        }

        const query = inputVal;
        console.log("%c🔍 Verification Search Started", "color: #2896cd; font-weight: bold;", { query });

        placeholder.classList.add('hidden');
        resultContainer.classList.add('hidden');
        noPaymentsState.classList.add('hidden');
        errorModal.classList.add('hidden');
        loadingState.classList.remove('hidden');
        setButtonLoading(true);

        let records = [];
        let entityName = null;
        let entityId = null;
        let entityFound = null;

        if (window.supabaseClient) {
            try {
                // STAGE 1: Exact Receipt ID - returns single receipt
                const { data: recById } = await window.supabaseClient
                    .from('receipts')
                    .select('*, student:student_id(*), client:client_id(*), course:course_id(*), service:service_id(*)')
                    .eq('receipt_id', query)
                    .maybeSingle();

                if (recById) {
                    records = [recById];
                    const entity = recById.student || recById.client;
                    entityName = `${entity?.first_name || ''} ${entity?.last_name || ''}`.trim();
                    entityId = entity?.student_id || entity?.client_id;
                }

                // STAGE 2: Student ID - returns ALL receipts
                if (records.length === 0) {
                    const { data: student } = await window.supabaseClient
                        .from('students')
                        .select('id, student_id, first_name, last_name')
                        .eq('student_id', query)
                        .maybeSingle();

                    if (student) {
                        entityName = `${student.first_name || ''} ${student.last_name || ''}`.trim();
                        entityId = student.student_id;
                        entityFound = { name: entityName, id: entityId };

                        const { data: recByStudent } = await window.supabaseClient
                            .from('receipts')
                            .select('*, student:student_id(*), course:course_id(*)')
                            .eq('student_id', student.id)
                            .order('created_at', { ascending: false });

                        if (recByStudent && recByStudent.length > 0) {
                            records = recByStudent;
                            entityFound = null;
                        }
                    }
                }

                // STAGE 3: Client ID - returns ALL receipts
                if (records.length === 0) {
                    const { data: client, error: clientError } = await window.supabaseClient
                        .from('clients')
                        .select('id, client_id, first_name, last_name')
                        .eq('client_id', query)
                        .maybeSingle();

                    console.log("Client lookup:", { client, error: clientError });

                    if (client) {
                        entityName = `${client.first_name || ''} ${client.last_name || ''}`.trim();
                        entityId = client.client_id;
                        entityFound = { name: entityName, id: entityId };

                        const { data: recByClient } = await window.supabaseClient
                            .from('receipts')
                            .select('*, client:client_id(*), service:service_id(*)')
                            .eq('client_id', client.id)
                            .order('created_at', { ascending: false });

                        if (recByClient && recByClient.length > 0) {
                            records = recByClient;
                            entityFound = null;
                        }
                    } else if (clientError) {
                        console.error("Client lookup error (RLS?):", clientError.message);
                    }
                }

                // Transform Live Data
                if (records.length > 0) {
                    records = records.map(rec => {
                        const entity = rec.student || rec.client;
                        const item = rec.course || rec.service;
                        return {
                            receiptNo: rec.receipt_id,
                            name: `${entity?.first_name || ''} ${entity?.last_name || ''}`.trim() || 'N/A',
                            date: rec.payment_date ? new Date(rec.payment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
                            course: item?.course_name || item?.name || 'N/A',
                            clientId: entity?.student_id || entity?.client_id || 'N/A',
                            total: `₹ ${(rec.amount_paid + (rec.balance_due || 0)).toLocaleString('en-IN')}`,
                            paid: `₹ ${rec.amount_paid.toLocaleString('en-IN')}`,
                            due: `₹ ${(rec.balance_due || 0).toLocaleString('en-IN')}`,
                            status: rec.balance_due <= 0 ? 'FULLY PAID' : 'PARTIAL'
                        };
                    });
                    if (records.length > 0) {
                        entityName = records[0].name;
                        entityId = records[0].clientId;
                    }
                }
            } catch (err) {
                console.error("Supabase Error:", err);
            }
        }

        // Demo Fallback
        if (records.length === 0 && !entityFound) {
            const queryUpper = query.toUpperCase();
            records = demoData[queryUpper] || demoData[Object.keys(demoData).find(k => k.includes(queryUpper))] || [];
            if (records.length > 0) {
                entityName = records[0].name;
                entityId = records[0].clientId;
            }
        }

        // UI Update
        setTimeout(() => {
            loadingState.classList.add('hidden');
            setButtonLoading(false);

            if (records.length > 0) {
                console.log(`%c✅ Found ${records.length} receipt(s)`, "color: #10b981; font-weight: bold;", records);

                // Update header
                receiptsTitle.textContent = entityName || 'Receipts';
                receiptsCount.textContent = `${records.length} receipt${records.length > 1 ? 's' : ''}`;

                // Render all receipt cards
                receiptsList.innerHTML = records.map(r => createReceiptCard(r)).join('');

                resultContainer.classList.remove('hidden');
            } else if (entityFound) {
                // Student/Client found but no payments
                console.log(`%c⚠️ ID Found but No Payments`, "color: #f59e0b; font-weight: bold;", entityFound);
                noPaymentsName.textContent = entityFound.name ? `${entityFound.name} (${entityFound.id})` : entityFound.id;
                noPaymentsState.classList.remove('hidden');
            } else {
                // Show error modal
                errorModal.classList.remove('hidden');
            }
        }, 400);
    };

    findBtn.addEventListener('click', findReceipt);
    verifyIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') findReceipt();
    });

    // Security: Prevent right-click on receipt
    resultContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // Security: Block copy/print keyboard shortcuts when receipt is visible
    document.addEventListener('keydown', (e) => {
        if (!resultContainer.classList.contains('hidden')) {
            if ((e.ctrlKey && (e.key === 'c' || e.key === 'p' || e.key === 's')) || e.key === 'PrintScreen') {
                e.preventDefault();
                console.log('%c⚠️ Security: This action is disabled for receipts.', 'color: #ef4444; font-weight: bold;');
                return false;
            }
        }
    });
});
