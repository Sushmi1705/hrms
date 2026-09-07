import type { ExecutiveDashboardDto } from '../api/reportApi';
import { formatCurrencyValue } from './currencyFormatter';

export interface ExportPdfOptions {
  companyName?: string;
  title?: string;
  dateRange?: string;
  currency?: string;
}

export const generateExecutivePdfReport = (
  data: ExecutiveDashboardDto,
  options: ExportPdfOptions = {}
) => {
  const company = options.companyName || 'Enterprise HRMS SaaS';
  const title = options.title || 'Executive HR Analytics & BI Report';
  const dateRange = options.dateRange || 'Last 6 Months';
  const currency = options.currency || 'RM';
  const now = new Date().toLocaleString();

  const grossFormatted = formatCurrencyValue(data.grossPayroll || data.payrollCost, currency);
  const netFormatted = formatCurrencyValue(data.netPayroll, currency);
  const benefitsFormatted = formatCurrencyValue(data.benefitsCost, currency);
  const travelFormatted = formatCurrencyValue(data.travelSpend, currency);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate the PDF report.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - ${company}</title>
        <style>
          @page { size: A4 portrait; margin: 16mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 12px; font-size: 12px; line-height: 1.4; }
          .header { border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; }
          .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
          .meta { text-align: right; font-size: 10px; color: #64748b; }
          .section-title { font-size: 13px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin: 18px 0 10px 0; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
          .kpi-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; }
          .kpi-label { font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; }
          .kpi-value { font-size: 18px; font-weight: 700; color: #0f172a; margin: 4px 0 2px 0; }
          .kpi-sub { font-size: 9px; color: #10b981; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }
          th { background: #f1f5f9; text-align: left; padding: 8px; font-weight: 600; color: #475569; border-bottom: 1px solid #cbd5e1; }
          td { padding: 8px; border-bottom: 1px solid #f1f5f9; color: #334155; }
          .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${title}</h1>
            <div class="subtitle">${company} • Scope: Executive SaaS HRMS Intelligence</div>
          </div>
          <div class="meta">
            <div><strong>Reporting Period:</strong> ${dateRange}</div>
            <div><strong>Generated:</strong> ${now}</div>
            <div><strong>Status:</strong> Confidential Executive Document</div>
          </div>
        </div>

        <div class="section-title">1. Executive Workforce & Operational Health</div>
        <div class="grid">
          <div class="kpi-box">
            <div class="kpi-label">Total Employees</div>
            <div class="kpi-value">${data.totalEmployees}</div>
            <div class="kpi-sub">${data.activeEmployees} active staff</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">New Hires</div>
            <div class="kpi-value">${data.newHires}</div>
            <div class="kpi-sub">This cycle</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Turnover Rate</div>
            <div class="kpi-value">${data.turnoverRate}%</div>
            <div class="kpi-sub">${data.exits} recorded exits</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Attendance Rate</div>
            <div class="kpi-value">${data.attendanceRate}%</div>
            <div class="kpi-sub">${data.lateCheckIns} late arrivals</div>
          </div>
        </div>

        <div class="section-title">2. Financial & ATS Recruitment Metrics</div>
        <div class="grid">
          <div class="kpi-box">
            <div class="kpi-label">Monthly Gross Payroll</div>
            <div class="kpi-value">${grossFormatted.formatted}</div>
            <div class="kpi-sub">Exact: ${grossFormatted.exact}</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Net Payroll Disbursed</div>
            <div class="kpi-value">${netFormatted.formatted}</div>
            <div class="kpi-sub">Exact: ${netFormatted.exact}</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Benefits Investment</div>
            <div class="kpi-value">${benefitsFormatted.formatted}</div>
            <div class="kpi-sub">Monthly subsidy</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Open Positions / ATS</div>
            <div class="kpi-value">${data.openPositions}</div>
            <div class="kpi-sub">${data.applicants} candidates evaluated</div>
          </div>
        </div>

        <div class="section-title">3. Headcount Distribution by Department</div>
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Headcount</th>
              <th>Workforce Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${(data.departmentDistribution || [])
              .map(
                (d) => `
              <tr>
                <td><strong>${d.category}</strong></td>
                <td>${d.value}</td>
                <td>${data.totalEmployees > 0 ? ((d.value / data.totalEmployees) * 100).toFixed(1) : 0}%</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="section-title">4. Strategic HR Insights & Required Actions</div>
        <table>
          <thead>
            <tr>
              <th>Priority Item</th>
              <th>Category</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            ${(data.actionItems || [])
              .map(
                (item) => `
              <tr>
                <td><strong>${item.title}</strong><br/><span style="color:#64748b; font-size:10px;">${item.description}</span></td>
                <td>${item.category}</td>
                <td><span style="color:${item.priority === 'High' ? '#e11d48' : '#6366f1'}; font-weight:700;">${item.count} Items (${item.priority})</span></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          <div>Generated securely via Enterprise HRMS SaaS Platform. ISO/IEC 27001 Certified Tenant Isolation.</div>
          <div>Page 1 of 1</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
