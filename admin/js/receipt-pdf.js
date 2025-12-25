/* ============================================
   RECEIPT PDF GENERATION - Phase 5
   Uses jsPDF for generation and QRCode.js for verification
   ============================================ */

const { jsPDF } = window.jspdf;

/**
 * Generates a unique Receipt ID
 * Format: {sequence}-ACS-{Initials}{CourseCode}{PaymentNo}
 */
async function generateReceiptId(payment) {
    try {
        // 1. Get student initials
        const initials = payment.students.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

        // 2. Get course code (e.g., 01, 05)
        const courseCode = payment.student_enrollments.courses.code || '00';

        // 3. Get payment number for this specific enrollment
        const { count, error: countError } = await supabase
            .from('fee_payments')
            .select('*', { count: 'exact', head: true })
            .eq('enrollment_id', payment.enrollment_id)
            .lte('created_at', payment.created_at);

        if (countError) throw countError;
        const paymentNo = String(count || 1).padStart(2, '0');

        // 4. Get global sequence number for receipts
        // For now, we can use the primary key id or a count of all payments
        const { count: sequence, error: seqError } = await supabase
            .from('fee_payments')
            .select('*', { count: 'exact', head: true })
            .lte('created_at', payment.created_at);

        if (seqError) throw seqError;

        return `${sequence}-ACS-${initials}${courseCode}${paymentNo}`;
    } catch (error) {
        console.error('Error generating receipt ID:', error);
        return `ACS-TEMP-${Date.now()}`;
    }
}

/**
 * Main function to generate and download Receipt PDF
 */
async function downloadReceipt(paymentId) {
    try {
        showToast('Preparing your receipt...', 'info');

        // 1. Fetch full payment details
        const { data: payment, error } = await supabase
            .from('fee_payments')
            .select(`
                *,
                students (*),
                student_enrollments (
                    *,
                    courses (*)
                )
            `)
            .eq('id', paymentId)
            .single();

        if (error) throw error;

        // 2. Generate Receipt ID
        const receiptId = await generateReceiptId(payment);

        // 3. Calculate Fee Details
        const totalFee = parseFloat(payment.student_enrollments.final_fee);

        // Get total paid for this enrollment up to this point
        const { data: allPayments, error: payError } = await supabase
            .from('fee_payments')
            .select('amount')
            .eq('enrollment_id', payment.enrollment_id)
            .lte('created_at', payment.created_at);

        if (payError) throw payError;

        const totalPaidSoFar = allPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        const balanceDue = totalFee - totalPaidSoFar;
        const isPartial = balanceDue > 0;

        // 4. Create PDF Document
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- THEME COLORS ---
        const colorPrimary = [40, 150, 205]; // #2896CD
        const colorSuccess = [39, 174, 96]; // #27AE60
        const colorDanger = [231, 76, 60];  // #E74C3C
        const colorGray = [108, 117, 125];  // #6C757D
        const colorDark = [33, 37, 41];     // #212529

        // --- HEADER ---
        doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text("Abhi's Craft Soft", 20, 25);

        doc.setDrawColor(230, 230, 230);
        doc.line(20, 32, pageWidth - 20, 32);

        // --- RECEIPT TITLE & ID ---
        doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
        doc.setFontSize(22);
        doc.text("Payment Receipt", 20, 45);

        doc.setFontSize(10);
        doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
        doc.text(`Receipt ID: ${receiptId}`, pageWidth - 20, 42, { align: 'right' });
        doc.setFontSize(14);
        doc.text(receiptId, 20, 52);

        doc.setFontSize(10);
        doc.text(`This is a payment receipt for your enrollment in ${payment.student_enrollments.courses.name}.`, 20, 60);

        // --- STATUS BADGE ---
        if (isPartial) {
            doc.setFillColor(52, 152, 219, 0.1); // Light blue
            doc.rect(20, 68, 45, 10, 'F');
            doc.setTextColor(52, 152, 219);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text("PARTIAL PAYMENT", 24, 75);
        } else {
            doc.setFillColor(colorSuccess[0], colorSuccess[1], colorSuccess[2], 0.1);
            doc.rect(20, 68, 38, 10, 'F');
            doc.setTextColor(colorSuccess[0], colorSuccess[1], colorSuccess[2]);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text("FULL PAYMENT", 24, 75);
        }

        // --- AMOUNT PAID SECTION ---
        doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text("AMOUNT PAID", 20, 88);

        doc.setDrawColor(colorSuccess[0], colorSuccess[1], colorSuccess[2]);
        doc.setLineWidth(1.5);
        doc.line(20, 91, 45, 91);

        doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
        doc.setFontSize(32);
        doc.setFont('helvetica', 'bold');
        doc.text(`Rs. ${formatNumber(payment.amount)}`, 20, 105);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
        doc.text(`via ${capitalizeFirst(payment.payment_mode)}`, 20, 112);

        // --- ISSUED TO & DATE ---
        doc.setDrawColor(240, 240, 240);
        doc.setLineWidth(0.1);
        doc.line(20, 122, pageWidth - 20, 122);

        doc.setFontSize(10);
        doc.text("ISSUED TO", 20, 132);
        doc.text("PAID ON", pageWidth / 2 + 10, 132);

        doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(payment.students.name, 20, 140);
        doc.text(formatDate(payment.payment_date), pageWidth / 2 + 10, 140);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
        doc.text(`+91 ${payment.students.phone}`, 20, 146);

        // --- TABLE HEADER ---
        doc.setFillColor(252, 252, 252);
        doc.rect(20, 158, pageWidth - 40, 10, 'F');
        doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text("NAME OF THE COURSE", 24, 164);
        doc.text("MODE OF PAYMENT", 100, 164);
        doc.text("AMOUNT PAID", pageWidth - 24, 164, { align: 'right' });

        doc.setDrawColor(240, 240, 240);
        doc.line(20, 168, pageWidth - 20, 168);

        // --- TABLE ROW ---
        doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
        doc.setFontSize(11);
        doc.text(payment.student_enrollments.courses.name, 24, 178);
        doc.text(capitalizeFirst(payment.payment_mode), 100, 178);
        doc.setTextColor(colorSuccess[0], colorSuccess[1], colorSuccess[2]);
        doc.text(`Rs. ${formatNumber(payment.amount)}`, pageWidth - 24, 178, { align: 'right' });

        doc.line(20, 185, pageWidth - 20, 185);

        // --- SUMMARY BOX ---
        const summaryX = pageWidth - 100;
        const summaryY = 195;
        doc.setFillColor(250, 250, 250);
        doc.rect(summaryX, summaryY, 80, 35, 'F');

        doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text("Total Fee", summaryX + 5, summaryY + 10);
        doc.text("Amount Paid", summaryX + 5, summaryY + 18);
        doc.setFont('helvetica', 'bold');
        doc.text("Balance Due", summaryX + 5, summaryY + 28);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
        doc.text(`Rs. ${formatNumber(totalFee)}`, summaryX + 75, summaryY + 10, { align: 'right' });
        doc.setTextColor(colorSuccess[0], colorSuccess[1], colorSuccess[2]);
        doc.text(`Rs. ${formatNumber(totalPaidSoFar)}`, summaryX + 75, summaryY + 18, { align: 'right' });
        doc.setTextColor(colorDanger[0], colorDanger[1], colorDanger[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(`Rs. ${formatNumber(balanceDue)}`, summaryX + 75, summaryY + 28, { align: 'right' });

        // --- FOOTER & QR ---
        const footerY = 245;
        doc.setDrawColor(230, 230, 230);
        doc.line(20, footerY, pageWidth - 20, footerY);

        doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("Abhi's Craft Soft", 20, footerY + 10);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
        doc.text("Plot No. 163, Vijayasree Colony,", 20, footerY + 16);
        doc.text("Vanasthalipuram, Hyderabad 500070", 20, footerY + 21);
        doc.text("Phone: +91 7842230900 | Email: team.craftsoft@gmail.com", 20, footerY + 26);

        // QR Code Generation
        const qrContainer = document.createElement('div');
        const qrCode = new QRCode(qrContainer, {
            text: `https://craftsoft.co.in/verify?id=${receiptId}`,
            width: 60,
            height: 60
        });

        // Wait for QR to render
        setTimeout(() => {
            const qrCanvas = qrContainer.querySelector('canvas');
            if (qrCanvas) {
                const qrImage = qrCanvas.toDataURL('image/png');
                doc.addImage(qrImage, 'PNG', pageWidth - 45, footerY + 5, 25, 25);
            }

            // Text next to QR
            doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
            doc.setFontSize(8);
            doc.text("Scan to verify or visit", pageWidth - 80, footerY + 10);
            doc.setTextColor(colorSuccess[0], colorSuccess[1], colorSuccess[2]);
            doc.setFont('helvetica', 'bold');
            doc.text("craftsoft.co.in/verify", pageWidth - 80, footerY + 16);
            doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
            doc.setFont('helvetica', 'normal');
            doc.text("and enter Receipt ID", pageWidth - 80, footerY + 22);

            // System info
            doc.setDrawColor(245, 245, 245);
            doc.line(20, footerY + 40, pageWidth - 20, footerY + 40);
            doc.setFontSize(7);
            doc.text("This is a system-generated receipt and does not require a signature.", 20, footerY + 45);
            doc.text(`Version: ${new Date().toLocaleString('en-IN')}`, pageWidth - 20, footerY + 45, { align: 'right' });

            // 5. Download the PDF
            doc.save(`Receipt-${receiptId}.pdf`);
            showToast('Receipt downloaded successfully!', 'success');

            // 6. Save the receipt record to DB
            saveReceiptRecord(paymentId, receiptId);
        }, 100);

    } catch (error) {
        console.error('Error generating PDF:', error);
        showToast('Failed to generate receipt: ' + error.message, 'error');
    }
}

/**
 * Saves the receipt number back to the payment or a records table
 */
async function saveReceiptRecord(paymentId, receiptId) {
    try {
        const { error } = await supabase
            .from('fee_payments')
            .update({ receipt_number: receiptId }) // Ensure this column exists in DB
            .eq('id', paymentId);

        if (error) console.warn('Could not save receipt ID to DB:', error.message);
    } catch (e) {
        console.error(e);
    }
}

// Utility: Format Number for Currency
function formatNumber(num) {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

// Utility: Format Date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Utility: Capitalize
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
