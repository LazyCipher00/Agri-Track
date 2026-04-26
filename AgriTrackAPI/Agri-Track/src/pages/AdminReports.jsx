import { useState } from 'react';
import { Icon, icons } from '../components/Icon';
import { reportsAPI } from '../services/api';

function AdminReports({ notify }) {
  const [reportType, setReportType] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
 
  const generateReport = async () => {
    setLoading(true);
    try {
      let blob;
      let filename;

      switch (reportType) {
        case 'monthly':
          blob = await reportsAPI.getMonthlyReport(year, month);
          filename = `Monthly_Report_${year}_${month}.xlsx`;
          break;
        case 'annual':
          blob = await reportsAPI.getAnnualReport(year);
          filename = `Annual_Report_${year}.xlsx`;
          break;
        case 'users':
          blob = await reportsAPI.getUserReport();
          filename = `User_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        default:
          throw new Error('Invalid report type');
      }

      // Download file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      notify('Report generated successfully!', 'success');
    } catch (error) {
      notify(error.message || 'Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <style>{`
        .report-card {
          background: #fff;
          border: 1px solid #e8e0d0;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 1.5rem;
        }
        .report-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1ddd4;
          border-radius: 10px;
          font-size: 14px;
          background: #fff;
          color: #0f2d1a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .report-select:focus {
          border-color: #2d7a3a;
          box-shadow: 0 0 0 3px rgba(45,122,58,0.12);
        }
        .generate-btn {
          background: linear-gradient(135deg, #1a4a22 0%, #2d7a3a 100%);
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          padding: 14px 28px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(26,74,34,0.3);
          width: 100%;
        }
        .generate-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #0d2410 0%, #1a4a22 100%);
          box-shadow: 0 6px 24px rgba(26,74,34,0.4);
          transform: translateY(-1px);
        }
        .generate-btn:disabled {
          background: #7aab82;
          box-shadow: none;
          cursor: not-allowed;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      `}</style>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: '#0d2410', marginBottom: '0.5rem' }}>
          Generate Reports
        </h2>
        <p style={{ fontSize: 14, color: '#5a7060' }}>
          Export system data to Excel for analysis
        </p>
      </div>

      <div className="report-card">
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: '1.5rem' }}>Report Type</h3>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <select
            className="report-select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="monthly">Monthly Sales Report</option>
            <option value="annual">Annual Summary Report</option>
            <option value="users">User Activity Report</option>
          </select>
        </div>

        {(reportType === 'monthly' || reportType === 'annual') && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#2d4a34', display: 'block', marginBottom: '0.5rem' }}>
              Year
            </label>
            <select
              className="report-select"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        )}

        {reportType === 'monthly' && (
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#2d4a34', display: 'block', marginBottom: '0.5rem' }}>
              Month
            </label>
            <select
              className="report-select"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {months.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
        )}

        <button className="generate-btn" onClick={generateReport} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              Generating Report...
            </>
          ) : (
            <>
              <Icon path={icons.sales} size={16} />
              Generate Excel Report
            </>
          )}
        </button>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0faf3', borderRadius: 8, border: '1px solid #d1fae5' }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: '#1a4a22', marginBottom: '0.5rem' }}>Report Information</h4>
          <ul style={{ fontSize: 12, color: '#5a7060', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
            <li>Monthly reports include sales data, activities, and crop summaries</li>
            <li>Annual reports provide year-over-year comparisons</li>
            <li>User reports show activity metrics for all registered farmers</li>
            <li>All reports are exported in Excel (.xlsx) format</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;