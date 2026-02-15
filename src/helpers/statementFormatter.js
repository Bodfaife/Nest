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

  const transactionRows = transactions.map(tx => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; color: #666;">${new Date(tx.date).toLocaleDateString('en-NG')}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; color: #333; font-weight: 600;">${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; color: #666;">${tx.paymentSource || 'N/A'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; color: #00875A; font-weight: 600; text-align: right;">₦${tx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; color: #333; font-weight: 600; text-align: right;">₦${(tx.balanceAfter || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; color: #666;">${tx.reference || 'N/A'}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bank Statement - Nest</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #333;
          background: #f5f5f5;
          padding: 20px;
          margin: 0;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #00875A;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo {
          width: 48px;
          height: 48px;
          background: #00875A;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 24px;
        }
        .company-name {
          font-size: 28px;
          font-weight: 700;
          color: #00875A;
        }
        .statement-title {
          text-align: right;
        }
        .statement-title h1 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }
        .statement-title p {
          margin: 4px 0 0 0;
          color: #999;
          font-size: 12px;
        }
        .account-info {
          background: #f9f9f9;
          padding: 24px;
          border-radius: 8px;
          margin-bottom: 32px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-size: 11px;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .info-value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        .balance-highlight {
          color: #00875A;
          font-size: 20px;
          font-weight: 700;
        }
        .transactions-section h2 {
          font-size: 18px;
          color: #333;
          margin: 24px 0 16px 0;
          font-weight: 700;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 32px;
        }
        th {
          background: #f0f0f0;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #e0e0e0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          color: #999;
          font-size: 11px;
        }
        .security-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #e8f5f0;
          border-radius: 20px;
          margin-top: 16px;
          font-size: 11px;
          color: #00875A;
          font-weight: 600;
        }
        @media print {
          body { background: white; }
          .container { box-shadow: none; }
          .security-badge { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-section">
            <div class="logo">🏦</div>
            <div class="company-name">Nest.</div>
          </div>
          <div class="statement-title">
            <h1>Bank Statement</h1>
            <p>Generated on ${timestamp} at ${timestamp_time}</p>
          </div>
        </div>

        <div class="account-info">
          <div class="info-item">
            <span class="info-label">Account Holder</span>
            <span class="info-value">${user?.fullName || 'User'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">${user?.email || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Current Balance</span>
            <span class="info-value balance-highlight">₦${balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div class="transactions-section">
          <h2>Transactions (Last 30 Days)</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
                <th style="text-align: right;">Balance</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              ${transactionRows}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>This is an official statement from Nest Financial Services.</p>
          <p>For security reasons, do not share this document with unauthorized persons.</p>
          <div class="security-badge">
            ✓ Secure & Encrypted
          </div>
          <p style="margin-top: 24px; color: #ccc;">© ${new Date().getFullYear()} Nest Financial Services. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
};

export const downloadPDF = async (html, filename = 'bank_statement.pdf') => {
  // This function requires a PDF library like jsPDF or html2pdf
  // For now, we'll create a print-friendly version
  const printWindow = window.open('', '', 'width=1200,height=800');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};

export const openStatementPreview = (html) => {
  const previewWindow = window.open('', 'statement_preview', 'width=1200,height=800');
  if (previewWindow) {
    previewWindow.document.write(html);
    previewWindow.document.close();
  }
};
