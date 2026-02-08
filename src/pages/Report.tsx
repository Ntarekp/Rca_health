import './Report.css'
import { useState } from 'react'

const Report: React.FC = () => {
  const [reportType, setReportType] = useState('monthly')
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31'
  })

  // Mock Data for Health System
  const reportData = {
    summary: {
      totalStudents: 1245,
      criticalCases: 12,
      referrals: 8,
      consultations: 450,
      prescriptions: 320,
      newAdmissions: 45,
      discharges: 42
    },
    topDiagnoses: [
      { name: 'Malaria', cases: 145, percentage: '32%' },
      { name: 'Flu/Cold', cases: 120, percentage: '26%' },
      { name: 'Headache', cases: 85, percentage: '18%' },
      { name: 'Sports Injury', cases: 45, percentage: '10%' }
    ],
    trends: [
      { month: 'Jan', consultations: 180, referrals: 2 },
      { month: 'Feb', consultations: 250, referrals: 5 },
      { month: 'Mar', consultations: 160, referrals: 1 }
    ]
  }

  return (
    <div className="report-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Health Reports</h1>
          <p className="page-subtitle">Generate and view detailed health system reports</p>
        </div>
        <div className="page-actions">
          <select
            className="report-select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="yearly">Yearly Report</option>
          </select>
          <input
            type="date"
            className="date-input"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <input
            type="date"
            className="date-input"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
          <button className="action-button primary">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2V18M2 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Generate Report</span>
          </button>
          <button className="action-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 15V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19H15C15.5304 19 16.0391 18.7893 16.4142 18.4142C16.7893 18.0391 17 17.5304 17 17V15M13 7L10 4M10 4L7 7M10 4V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="report-content">
        <div className="report-summary">
          <div className="summary-card">
            <h3>Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Total Consultations</span>
                <span className="summary-value">{reportData.summary.consultations}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Critical Cases</span>
                <span className="summary-value warning">{reportData.summary.criticalCases}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Referrals</span>
                <span className="summary-value error">{reportData.summary.referrals}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Prescriptions</span>
                <span className="summary-value">{reportData.summary.prescriptions}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">New Admissions</span>
                <span className="summary-value success">{reportData.summary.newAdmissions}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Discharges</span>
                <span className="summary-value">{reportData.summary.discharges}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="report-sections">
          <div className="report-section">
            <h3>Top Diagnoses</h3>
            <div className="items-table">
              <table>
                <thead>
                  <tr>
                    <th>Diagnosis</th>
                    <th>Cases</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.topDiagnoses.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.cases}</td>
                      <td>{item.percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="report-section">
            <h3>Consultation Trends</h3>
            <div className="trends-table">
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Consultations</th>
                    <th>Referrals</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.trends.map((trend, index) => (
                    <tr key={index}>
                      <td>{trend.month}</td>
                      <td className="success-text">{trend.consultations}</td>
                      <td className="error-text">{trend.referrals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Report

