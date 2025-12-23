/**
 * Payment Receipt PDF Generator v3.1
 * Optimized layout with proper spacing
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
            white: [255, 255, 255]
        };
    }

    async generate(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

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
        doc.setFontSize(9);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('Receipt ID', this.pageWidth - this.margin, y - 2, { align: 'right' });

        doc.setFontSize(10);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text(data.receiptId, this.pageWidth - this.margin, y + 4, { align: 'right' });

        y += 12;

        // Header border
        doc.setDrawColor(...this.colors.border);
        doc.setLineWidth(0.3);
        doc.line(this.margin, y, this.pageWidth - this.margin, y);

        y += 15;

        return y;
    }

    drawTitle(doc, y, data) {
        // Payment Receipt - Large title
        doc.setFontSize(24);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text('Payment Receipt', this.margin, y);

        y += 6;

        // Subtitle
        doc.setFontSize(10);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('This is a payment receipt for your enrollment in ' + data.courseName + '.', this.margin, y);

        y += 10;

        return y;
    }

    drawBadge(doc, y, data) {
        const historicalTotal = (data.paymentHistory || []).reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalPaid = historicalTotal + data.currentPayment;
        const isFullPayment = totalPaid >= data.totalFee;

        const badgeColor = isFullPayment ? this.colors.primary : this.colors.badgeBlue;
        const badgeText = isFullPayment ? 'FULL PAYMENT' : 'PARTIAL PAYMENT';

        doc.setFillColor(...badgeColor);
        doc.roundedRect(this.margin, y, 38, 7, 3, 3, 'F');

        doc.setFontSize(8);
        doc.setTextColor(...this.colors.white);
        doc.setFont('helvetica', 'bold');
        doc.text(badgeText, this.margin + 19, y + 5, { align: 'center' });

        y += 14;

        return y;
    }

    drawAmount(doc, y, data) {
        // AMOUNT PAID label
        doc.setFontSize(9);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('AMOUNT PAID', this.margin, y);

        y += 10;

        // Large amount - optimized size
        doc.setFontSize(28);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text('Rs. ' + this.formatCurrency(data.currentPayment), this.margin, y);

        y += 6;

        // Payment method
        doc.setFontSize(10);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('via ' + data.paymentMode, this.margin, y);

        y += 14;

        return y;
    }

    drawRecipient(doc, y, data) {
        // Top border
        doc.setDrawColor(...this.colors.border);
        doc.setLineWidth(0.3);
        doc.line(this.margin, y, this.pageWidth - this.margin, y);

        y += 10;

        const col2X = 110;

        // Labels
        doc.setFontSize(9);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('ISSUED TO', this.margin, y);
        doc.text('PAID ON', col2X, y);

        y += 6;

        // Values
        doc.setFontSize(12);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text(data.studentName, this.margin, y);
        doc.text(data.paymentDate, col2X, y);

        y += 5;

        // Phone
        doc.setFontSize(10);
        doc.setTextColor(...this.colors.primary);
        doc.setFont('helvetica', 'normal');
        doc.text(data.phone || '', this.margin, y);

        y += 14;

        return y;
    }

    drawTable(doc, y, data) {
        // Border
        doc.setDrawColor(...this.colors.border);
        doc.setLineWidth(0.3);
        doc.line(this.margin, y, this.pageWidth - this.margin, y);

        y += 8;

        const col1X = this.margin;
        const col2X = 100;
        const col3X = this.pageWidth - this.margin;

        // Table header
        doc.setFontSize(8);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('NAME OF THE COURSE', col1X, y);
        doc.text('MODE OF PAYMENT', col2X, y);
        doc.text('AMOUNT PAID', col3X, y, { align: 'right' });

        y += 8;

        // Border under header
        doc.line(this.margin, y, this.pageWidth - this.margin, y);

        y += 8;

        // Table row
        doc.setFontSize(11);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'normal');
        doc.text(data.courseName, col1X, y);
        doc.text(data.paymentMode, col2X, y);

        doc.setTextColor(...this.colors.primary);
        doc.setFont('helvetica', 'bold');
        doc.text('Rs. ' + this.formatCurrency(data.currentPayment), col3X, y, { align: 'right' });

        y += 16;

        return y;
    }

    drawSummary(doc, y, data) {
        const historicalTotal = (data.paymentHistory || []).reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalPaid = historicalTotal + data.currentPayment;
        const balanceDue = data.totalFee - totalPaid;

        // Summary box - right aligned
        const boxWidth = 70;
        const boxX = this.pageWidth - this.margin - boxWidth;
        const boxHeight = 38;

        // Background
        doc.setFillColor(...this.colors.bgLight);
        doc.roundedRect(boxX, y, boxWidth, boxHeight, 2, 2, 'F');

        // Border
        doc.setDrawColor(...this.colors.border);
        doc.setLineWidth(0.3);
        doc.roundedRect(boxX, y, boxWidth, boxHeight, 2, 2);

        let innerY = y + 8;

        // Total Fee
        doc.setFontSize(9);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('Total Fee', boxX + 4, innerY);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text('Rs. ' + this.formatCurrency(data.totalFee), boxX + boxWidth - 4, innerY, { align: 'right' });

        innerY += 8;

        // Amount Paid
        doc.setTextColor(...this.colors.primary);
        doc.setFont('helvetica', 'normal');
        doc.text('Amount Paid', boxX + 4, innerY);
        doc.text('Rs. ' + this.formatCurrency(totalPaid), boxX + boxWidth - 4, innerY, { align: 'right' });

        innerY += 10;

        // Divider
        doc.setDrawColor(...this.colors.border);
        doc.line(boxX + 4, innerY - 3, boxX + boxWidth - 4, innerY - 3);

        // Balance Due
        if (balanceDue > 0) {
            doc.setTextColor(220, 38, 38);
            doc.setFont('helvetica', 'bold');
            doc.text('Balance Due', boxX + 4, innerY);
            doc.text('Rs. ' + this.formatCurrency(balanceDue), boxX + boxWidth - 4, innerY, { align: 'right' });
        } else {
            doc.setTextColor(...this.colors.primary);
            doc.setFont('helvetica', 'bold');
            doc.text('Fully Paid', boxX + 4, innerY);
            doc.text('Rs. 0.00', boxX + boxWidth - 4, innerY, { align: 'right' });
        }

        y += boxHeight + 10;

        return y;
    }

    async drawFooter(doc, receiptId) {
        const footerY = this.pageHeight - 50;

        // Top border
        doc.setDrawColor(...this.colors.border);
        doc.setLineWidth(0.3);
        doc.line(this.margin, footerY, this.pageWidth - this.margin, footerY);

        // Left column - Company info
        doc.setFontSize(9);
        doc.setTextColor(...this.colors.textDark);
        doc.setFont('helvetica', 'bold');
        doc.text("Abhi's Craft Soft", this.margin, footerY + 8);

        doc.setFontSize(8);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('Plot No. 163, Vijayasree Colony,', this.margin, footerY + 13);
        doc.text('Vanasthalipuram, Hyderabad 500070', this.margin, footerY + 18);
        doc.text('Phone: +91 7842239090', this.margin, footerY + 23);
        doc.text('Email: team.craftsoft@gmail.com', this.margin, footerY + 28);

        // Center column - Verify info
        const centerX = 115;
        doc.setFontSize(8);
        doc.setTextColor(...this.colors.textMuted);
        doc.text('Scan to verify', centerX, footerY + 8);

        doc.setTextColor(...this.colors.primary);
        doc.setFont('helvetica', 'bold');
        doc.text('craftsoft.co.in/verify', centerX, footerY + 13);

        // QR Code - Right side
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
                doc.addImage(qrDataUrl, 'PNG', this.pageWidth - this.margin - 25, footerY + 5, 22, 22);
            }

            document.body.removeChild(qrContainer);
        }

        // Disclaimer at very bottom
        doc.setFontSize(7);
        doc.setTextColor(...this.colors.textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text('This is a system-generated receipt and does not require a signature.', this.margin, this.pageHeight - 12);
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

console.log('Receipt Generator v3.1 loaded - Optimized Layout');
