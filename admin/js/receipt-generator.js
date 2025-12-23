/**
 * Payment Receipt PDF Generator v3.0
 * Matches the final approved HTML design
 * Clean, Professional, Unified Output
 */

class ReceiptGenerator {
    constructor() {
        this.pageWidth = 210; // A4 width in mm
        this.pageHeight = 297; // A4 height in mm
        this.margin = 25;
        this.contentWidth = this.pageWidth - (this.margin * 2);

        // Colors matching the HTML design
        this.colors = {
            primary: [31, 122, 92],      // #1f7a5c - teal green
            textDark: [15, 23, 42],      // #0f172a - dark text
            textMuted: [100, 116, 139],  // #64748b - muted gray
            border: [229, 231, 235],     // #e5e7eb - light border
            bgLight: [248, 250, 252],    // #f8fafc - light background
            badgeBlue: [37, 99, 235],    // #2563eb - blue badge
            badgeOrange: [234, 88, 12],  // #ea580c - orange badge
            white: [255, 255, 255]
        };
    }

    async generate(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        // Add metadata
        doc.setProperties({
            title: 'Payment Receipt - ' + data.receiptId,
            subject: 'Payment Receipt for ' + data.studentName,
            author: "Abhi's Craft Soft",
            creator: "Abhi's Craft Soft Receipt System"
        });

        let y = this.margin;

        // === HEADER ===
        y = this.drawHeader(doc, y, data);

        // === TITLE & SUBTITLE ===
        y = this.drawTitle(doc, y, data);

        // === PAYMENT BADGE ===
        y = this.drawBadge(doc, y, data);

        // === AMOUNT SECTION ===
        y = this.drawAmount(doc, y, data);

        // === ISSUED TO / PAID ON ===
        y = this.drawRecipient(doc, y, data);

        // === PAYMENT TABLE ===
        y = this.drawTable(doc, y, data);

        // === SUMMARY BOX ===
        y = this.drawSummary(doc, y, data);

        // === FOOTER ===
        await this.drawFooter(doc, data.receiptId);

        // Save with correct filename
        const fileName = 'Receipt_' + data.receiptId + '.pdf';
        doc.save(fileName);

        return fileName;
    }

    drawHeader(doc, y, data) {
        // Brand name - Left
        doc.setFontSize(18);
        doc.setTextColor(...this.colors.primary);
        doc.setFont('helvetica', 'bold');
        doc.text("Abhi's Craft Soft", this.margin, y);

        // Receipt ID - Right
        doc.setFontSize(10);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('Receipt ID', this.pageWidth - this.margin, y - 3, { align: 'right' });

        doc.setFontSize(11);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text(data.receiptId, this.pageWidth - this.margin, y + 3, { align: 'right' });

        y += 12;

        // Header border
        doc.setDrawColor(...this.colors.border);
        doc.setLineWidth(0.3);
        doc.line(this.margin, y, this.pageWidth - this.margin, y);

        y += 20;

        return y;
    }

    drawTitle(doc, y, data) {
        // Payment Receipt - Large title
        doc.setFontSize(28);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text('Payment Receipt', this.margin, y);

        y += 8;

        // Subtitle
        doc.setFontSize(11);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('This is a payment receipt for your enrollment in ' + data.courseName + '.', this.margin, y);

        y += 12;

        return y;
    }

    drawBadge(doc, y, data) {
        // Calculate payment status
        const historicalTotal = (data.paymentHistory || []).reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalPaid = historicalTotal + data.currentPayment;
        const isFullPayment = totalPaid >= data.totalFee;

        const badgeColor = isFullPayment ? this.colors.primary : this.colors.badgeBlue;
        const badgeText = isFullPayment ? 'FULL PAYMENT' : 'PARTIAL PAYMENT';

        // Draw badge
        doc.setFillColor(...badgeColor);
        doc.roundedRect(this.margin, y, 42, 8, 4, 4, 'F');

        doc.setFontSize(9);
        doc.setTextColor(...this.colors.white);
        doc.setFont('helvetica', 'bold');
        doc.text(badgeText, this.margin + 21, y + 5.5, { align: 'center' });

        y += 18;

        return y;
    }

    drawAmount(doc, y, data) {
        // AMOUNT PAID label
        doc.setFontSize(10);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('AMOUNT PAID', this.margin, y);

        y += 12;

        // Large amount
        doc.setFontSize(36);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text('Rs. ' + this.formatCurrency(data.currentPayment), this.margin, y);

        y += 8;

        // Payment method
        doc.setFontSize(11);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('via ' + data.paymentMode, this.margin, y);

        y += 18;

        return y;
    }

    drawRecipient(doc, y, data) {
        // Top border
        doc.setDrawColor(...this.colors.border);
        doc.setLineWidth(0.3);
        doc.line(this.margin, y, this.pageWidth - this.margin, y);

        y += 12;

        const col2X = 110;

        // ISSUED TO label
        doc.setFontSize(10);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('ISSUED TO', this.margin, y);
        doc.text('PAID ON', col2X, y);

        y += 8;

        // Name and Date values
        doc.setFontSize(14);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text(data.studentName, this.margin, y);
        doc.text(data.paymentDate, col2X, y);

        y += 6;

        // Phone
        doc.setFontSize(11);
        doc.setTextColor(...this.colors.primary);
        doc.setFont('helvetica', 'normal');
        doc.text(data.phone || '', this.margin, y);

        y += 18;

        return y;
    }

    drawTable(doc, y, data) {
        // Border
        doc.setDrawColor(...this.colors.border);
        doc.setLineWidth(0.3);
        doc.line(this.margin, y, this.pageWidth - this.margin, y);

        y += 10;

        const col1X = this.margin;
        const col2X = 100;
        const col3X = this.pageWidth - this.margin;

        // Table header
        doc.setFontSize(9);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('NAME OF THE COURSE', col1X, y);
        doc.text('MODE OF PAYMENT', col2X, y);
        doc.text('AMOUNT PAID', col3X, y, { align: 'right' });

        y += 10;

        // Border under header
        doc.line(this.margin, y, this.pageWidth - this.margin, y);

        y += 10;

        // Table row
        doc.setFontSize(12);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'normal');
        doc.text(data.courseName, col1X, y);
        doc.text(data.paymentMode, col2X, y);

        doc.setTextColor(...this.colors.primary);
        doc.setFont('helvetica', 'bold');
        doc.text('Rs. ' + this.formatCurrency(data.currentPayment), col3X, y, { align: 'right' });

        y += 20;

        return y;
    }

    drawSummary(doc, y, data) {
        // Calculate totals
        const historicalTotal = (data.paymentHistory || []).reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalPaid = historicalTotal + data.currentPayment;
        const balanceDue = data.totalFee - totalPaid;

        // Summary box - right aligned
        const boxWidth = 75;
        const boxX = this.pageWidth - this.margin - boxWidth;
        const boxHeight = 45;

        // Background
        doc.setFillColor(...this.colors.bgLight);
        doc.roundedRect(boxX, y, boxWidth, boxHeight, 3, 3, 'F');

        // Border
        doc.setDrawColor(...this.colors.border);
        doc.setLineWidth(0.3);
        doc.roundedRect(boxX, y, boxWidth, boxHeight, 3, 3);

        let innerY = y + 10;

        // Total Fee
        doc.setFontSize(10);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('Total Fee', boxX + 5, innerY);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text('Rs. ' + this.formatCurrency(data.totalFee), boxX + boxWidth - 5, innerY, { align: 'right' });

        innerY += 10;

        // Amount Paid
        doc.setTextColor(...this.colors.primary);
        doc.setFont('helvetica', 'normal');
        doc.text('Amount Paid', boxX + 5, innerY);
        doc.text('Rs. ' + this.formatCurrency(totalPaid), boxX + boxWidth - 5, innerY, { align: 'right' });

        innerY += 12;

        // Divider
        doc.setDrawColor(...this.colors.border);
        doc.line(boxX + 5, innerY - 4, boxX + boxWidth - 5, innerY - 4);

        // Balance Due
        if (balanceDue > 0) {
            doc.setTextColor(220, 38, 38); // Red
            doc.setFont('helvetica', 'bold');
            doc.text('Balance Due', boxX + 5, innerY);
            doc.text('Rs. ' + this.formatCurrency(balanceDue), boxX + boxWidth - 5, innerY, { align: 'right' });
        } else {
            doc.setTextColor(...this.colors.primary);
            doc.setFont('helvetica', 'bold');
            doc.text('Fully Paid', boxX + 5, innerY);
            doc.text('Rs. 0.00', boxX + boxWidth - 5, innerY, { align: 'right' });
        }

        y += boxHeight + 30;

        return y;
    }

    async drawFooter(doc, receiptId) {
        const footerY = this.pageHeight - 55;

        // Top border
        doc.setDrawColor(...this.colors.border);
        doc.setLineWidth(0.3);
        doc.line(this.margin, footerY, this.pageWidth - this.margin, footerY);

        // Left column - Company info
        doc.setFontSize(10);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text("Abhi's Craft Soft", this.margin, footerY + 10);

        doc.setFontSize(9);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('Plot No. 163, Vijayasree Colony,', this.margin, footerY + 16);
        doc.text('Vanasthalipuram, Hyderabad 500070', this.margin, footerY + 22);
        doc.text('Phone: +91 7842239090', this.margin, footerY + 28);
        doc.text('Email: team.craftsoft@gmail.com', this.margin, footerY + 34);

        // Right column - Verify info
        doc.setFontSize(9);
        doc.setTextColor(...this.colors.textMuted);
        doc.text('Scan to verify', this.pageWidth - this.margin - 30, footerY + 10, { align: 'center' });

        doc.setTextColor(...this.colors.primary);
        doc.setFont('helvetica', 'bold');
        doc.text('craftsoft.co.in/verify', this.pageWidth - this.margin - 30, footerY + 16, { align: 'center' });

        // QR Code
        if (receiptId && typeof QRCode !== 'undefined') {
            const qrUrl = 'https://craftsoft.co.in/pages/verify.html?id=' + receiptId;

            const qrContainer = document.createElement('div');
            qrContainer.style.cssText = 'position:absolute;left:-9999px;';
            document.body.appendChild(qrContainer);

            new QRCode(qrContainer, {
                text: qrUrl,
                width: 200,
                height: 200,
                colorDark: '#1f7a5c',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });

            await new Promise(resolve => setTimeout(resolve, 100));

            const qrCanvas = qrContainer.querySelector('canvas');
            if (qrCanvas) {
                const qrDataUrl = qrCanvas.toDataURL('image/png');
                doc.addImage(qrDataUrl, 'PNG', this.pageWidth - this.margin - 45, footerY + 20, 28, 28);
            }

            document.body.removeChild(qrContainer);
        }

        // Disclaimer
        doc.setFontSize(8);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('This is a system-generated receipt and does not require a signature.', this.margin, this.pageHeight - 15);
    }

    formatCurrency(amount) {
        if (amount === undefined || amount === null || isNaN(amount)) return '0.00';
        return Number(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    static generateReceiptId() {
        const year = new Date().getFullYear();
        const random = Math.floor(1000 + Math.random() * 9000);
        return 'RCPT-' + year + '-' + random;
    }

    static formatDate(date) {
        if (!date) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const d = date instanceof Date ? date : (date.toDate ? date.toDate() : new Date(date));
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
}

// Global instance
window.receiptGenerator = new ReceiptGenerator();

// Quick generate function
window.generateReceipt = async function (student, payment) {
    const receiptData = {
        receiptId: payment.receiptNumber || ReceiptGenerator.generateReceiptId(),
        studentName: student.name || student.studentName || '',
        phone: student.phone || student.phoneNumber || '',
        courseName: student.course || student.courseName || '',
        totalFee: student.totalFee || 0,
        currentPayment: payment.amount || 0,
        paymentMode: payment.mode || 'Cash',
        paymentDate: ReceiptGenerator.formatDate(payment.date || new Date()),
        paymentHistory: (student.paymentHistory || []).map(p => ({
            amount: p.amount || 0,
            mode: p.mode || 'Cash',
            date: ReceiptGenerator.formatDate(p.date)
        }))
    };
    return await window.receiptGenerator.generate(receiptData);
};

console.log('Receipt Generator v3.0 loaded - Unified Design');
