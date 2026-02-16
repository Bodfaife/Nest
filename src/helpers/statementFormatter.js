/**
 * Bank Statement Formatter
 * Generates professional PDF and CSV exports for bank statements
 */

export const formatStatementAsCSV = (transactions, user, balance) => {
  const timestamp = new Date().toLocaleDateString('en-NG');
  const csvHeader = `NEST FINANCIAL SERVICES
Bank Statement Export
Generated: ${timestamp}

Account Holder,${user?.fullName || 'User'}
Email,${user?.email || 'N/A'}
Current Balance,₦${balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}

Transaction Date,Type,Description,Amount,Balance,Status,Reference
`;

  const csvRows = transactions.map(tx => {
    const date = new Date(tx.date).toLocaleDateString('en-NG');
    const type = tx.type.charAt(0).toUpperCase() + tx.type.slice(1);
    const description = `${type} - ${tx.paymentSource || 'N/A'}`;
    const amount = `₦${tx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
    const balanceAfter = `₦${(tx.balanceAfter || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
    const status = tx.status || 'completed';
    const reference = tx.reference || 'N/A';

    return `"${date}","${type}","${description}","${amount}","${balanceAfter}","${status}","${reference}"`;
  }).join('\n');

  const csvFooter = `\n\nStatement Period: Last 30 days\nTotal Transactions,${transactions.length}`;

  return csvHeader + csvRows + csvFooter;
};

export const downloadCSV = (csv, filename = 'bank_statement.csv') => {
  const element = document.createElement('a');
  const file = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  element.click();
};

export const formatStatementAsHTML = (transactions, user, balance) => {
  const timestamp = new Date().toLocaleDateString('en-NG');
  const timestamp_time = new Date().toLocaleTimeString('en-NG');
  const statementDate = new Date();
  const periodStart = new Date(statementDate.getFullYear(), statementDate.getMonth(), 1);
  const periodEnd = new Date(statementDate.getFullYear(), statementDate.getMonth() + 1, 0);

  // Calculate summary statistics
  const totalDebits = transactions
    .filter(tx => tx.type === 'withdraw')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalCredits = transactions
    .filter(tx => tx.type === 'deposit')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const transactionRows = transactions.map((tx, idx) => {
    const typeLabel = tx.type.charAt(0).toUpperCase() + tx.type.slice(1);
    const typeClass = tx.type === 'withdraw' ? 'debit' : 'credit';
    const amount = tx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 });
    const balanceAfter = (tx.balanceAfter || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 });
    const date = new Date(tx.date).toLocaleDateString('en-NG');
    
    return `
      <tr class="${typeClass}">
        <td class="date-cell">${date}</td>
        <td class="type-cell">
          <span class="type-badge ${typeClass}">${typeLabel}</span>
        </td>
        <td class="amount-cell ${typeClass}">₦${amount}</td>
        <td class="balance-cell">₦${balanceAfter}</td>
        <td class="status-cell">
          <span class="status-badge ${tx.status || 'completed'}">${tx.status ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1) : 'Completed'}</span>
        </td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bank Statement - Nest</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1a1a1a;
          background: #f8fafb;
          padding: 0;
          line-height: 1.6;
        }

        .page-wrapper {
          max-width: 210mm;
          height: 297mm;
          margin: 20px auto;
          background: white;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 120px;
          font-weight: 700;
          color: rgba(0, 135, 90, 0.03);
          white-space: nowrap;
          pointer-events: none;
          z-index: 0;
        }

        .content {
          padding: 40px 50px;
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .header-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 3px solid #00875A;
        }

        .logo-company {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #00875A 0%, #006d49 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 32px;
          box-shadow: 0 4px 15px rgba(0, 135, 90, 0.2);
        }

        .company-info h1 {
          font-size: 32px;
          font-weight: 800;
          color: #00875A;
          margin: 0;
          line-height: 1;
        }

        .company-info p {
          font-size: 12px;
          color: #666;
          margin: 4px 0 0 0;
          letter-spacing: 0.5px;
        }

        .statement-header {
          text-align: right;
        }

        .statement-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .statement-header p {
          margin: 4px 0;
          font-size: 13px;
          color: #666;
        }

        .statement-date {
          background: #f0f8f5;
          padding: 8px 16px;
          border-radius: 6px;
          margin-top: 8px;
          font-weight: 600;
          color: #00875A;
          display: inline-block;
          font-size: 12px;
        }

        .account-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-bottom: 35px;
          padding: 24px;
          background: linear-gradient(135deg, #f0f8f5 0%, #fafbf8 100%);
          border-radius: 15px;
          border-left: 4px solid #00875A;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 10px;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .detail-value {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .balance-value {
          color: #00875A;
          font-size: 24px;
          font-weight: 800;
        }

        .summary-section {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-box {
          padding: 16px;
          border-radius: 10px;
          border-left: 4px solid;
        }

        .summary-box.credits {
          background: #f0f8f5;
          border-left-color: #00875A;
        }

        .summary-box.debits {
          background: #fef5f5;
          border-left-color: #e74c3c;
        }

        .summary-box-label {
          font-size: 11px;
          font-weight: 700;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .summary-box-value {
          font-size: 18px;
          font-weight: 700;
        }

        .summary-box.credits .summary-box-value {
          color: #00875A;
        }

        .summary-box.debits .summary-box-value {
          color: #e74c3c;
        }

        .transactions-heading {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
          margin-top: 25px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e0e0e0;
        }

        table {
          width: 100%;
          margin-bottom: 30px;
          border-collapse: collapse;
          font-size: 13px;
        }

        thead {
          background: #f5f7fa;
        }

        th {
          padding: 12px 10px;
          text-align: left;
          font-weight: 700;
          color: #666;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #ddd;
        }

        td {
          padding: 14px 10px;
          border-bottom: 1px solid #f0f0f0;
        }

        tr.debit:hover {
          background: #faf9f9;
        }

        tr.credit:hover {
          background: #f9faf8;
        }

        .date-cell {
          font-weight: 500;
          color: #666;
          width: 20%;
        }

        .type-cell {
          width: 20%;
        }

        .type-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .type-badge.credit {
          color: #006d49;
        }

        .type-badge.debit {
          color: #c0392b;
        }

        .amount-cell.credit {
          color: #00875A;
        }

        .amount-cell.debit {
          color: #e74c3c;
        }

        .balance-cell {
          text-align: right;
          color: #666;
          font-weight: 600;
          width: 20%;
        }

        .status-cell {
          width: 20%;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.completed {
          color: #2e7d32;
        }

        .status-badge.pending {
          color: #f57f17;
        }

        .footer-section {
          margin-top: auto;
          padding-top: 24px;
          border-top: 2px solid #eee;
          font-size: 11px;
          color: #999;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .security-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #f0f8f5;
          border-radius: 8px;
          font-weight: 600;
          color: #00875A;
        }

        .security-info::before {
          content: "✓";
          font-weight: 700;
        }

        .footer-disclaimer {
          text-align: center;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #eee;
          line-height: 1.4;
        }

        .footer-disclaimer p {
          margin: 4px 0;
        }

        .copyright {
          text-align: center;
          font-size: 10px;
          color: #ccc;
          margin-top: 12px;
        }

        @media print {
          body {
            background: white;
            padding: 0;
          }
          .page-wrapper {
            margin: 0;
            box-shadow: none;
            max-width: 100%;
            height: auto;
            page-break-after: auto;
          }
          .content {
            padding: 40px;
          }
          table {
            page-break-inside: auto;
          }
          tbody {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }

        @media screen and (max-width: 768px) {
          .page-wrapper {
            margin: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          }
          .content {
            padding: 30px;
          }
          .header-section {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .account-details {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .summary-section {
            grid-template-columns: 1fr;
          }
          table {
            font-size: 12px;
          }
          th, td {
            padding: 10px 6px;
          }
        }
      </style>
    </head>
    <body>
      <div class="page-wrapper">
        <div class="watermark">NEST</div>
        <div class="content">
          <!-- Header Section -->
          <div class="header-section">
            <div class="logo-company">
              <div class="logo">🏦</div>
              <div class="company-info">
                <h1>Nest.</h1>
                <p>Financial Services</p>
              </div>
            </div>
            <div class="statement-header">
              <h2>Account Statement</h2>
              <p>${periodStart.toLocaleDateString('en-NG')} to ${periodEnd.toLocaleDateString('en-NG')}</p>
              <div class="statement-date">Generated: ${timestamp}</div>
            </div>
          </div>

          <!-- Account Details -->
          <div class="account-details">
            <div class="detail-item">
              <span class="detail-label">Account Holder</span>
              <span class="detail-value">${user?.fullName || 'Account Owner'}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Email Address</span>
              <span class="detail-value">${user?.email || 'Not Available'}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Current Balance</span>
              <span class="detail-value balance-value">₦${balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <!-- Summary Section -->
          <div class="summary-section">
            <div class="summary-box credits">
              <div class="summary-box-label">Total Deposits</div>
              <div class="summary-box-value">₦${totalCredits.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="summary-box debits">
              <div class="summary-box-label">Total Withdrawals</div>
              <div class="summary-box-value">₦${totalDebits.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          <!-- Transactions Table -->
          <h3 class="transactions-heading">Transaction History</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th style="text-align: right;">Amount</th>
                <th style="text-align: right;">Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${transactionRows}
            </tbody>
          </table>

          <!-- Footer Section -->
          <div class="footer-section">
            <div class="footer-content">
              <div class="security-info">Secure & Encrypted</div>
              <div style="text-align: right; font-size: 12px; color: #666;">
                Generated: ${timestamp_time}
              </div>
            </div>
            <div class="footer-disclaimer">
              <p><strong>Disclaimer:</strong> This is an official statement from Nest Financial Services. For security reasons, do not share this document with unauthorized persons.</p>
              <p>All transactions are processed in Nigerian Naira (₦) and may be subject to applicable fees and charges.</p>
            </div>
            <div class="copyright">
              <p>© ${new Date().getFullYear()} Nest Financial Services. All rights reserved. | Confidential & Proprietary</p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
};

export const downloadPDF = async (html, filename = 'bank_statement.pdf') => {
  try {
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    // Create a container element
    const container = document.createElement('div');
    container.innerHTML = html;
    
    // Style it for rendering
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '210mm';
    container.style.height = 'auto';
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    container.style.zIndex = '-9999';
    container.style.backgroundColor = '#ffffff';
    container.style.padding = '0';
    container.style.margin = '0';
    
    document.body.appendChild(container);

    // Wait for all content to render
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get all elements and ensure they're visible
    const allElements = container.querySelectorAll('*');
    allElements.forEach(el => {
      el.style.display = el.style.display || 'block';
      el.style.visibility = el.style.visibility || 'visible';
      el.style.opacity = el.style.opacity || '1';
    });

    // Convert to canvas with high quality
    const canvas = await html2canvas(container, {
      allowTaint: true,
      useCORS: true,
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      windowHeight: container.scrollHeight,
    });

    // Calculate PDF dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add image to PDF, handling multiple pages
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(filename);

    // Clean up
    document.body.removeChild(container);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF: ' + error.message);
  }
};

export const openStatementPreview = (html) => {
  const previewWindow = window.open('', 'statement_preview', 'width=1200,height=800');
  if (previewWindow) {
    previewWindow.document.write(html);
    previewWindow.document.close();
  }
};
