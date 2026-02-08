import './Analytics.css'
import Charts from '../components/Charts'
import StatsCards from '../components/StatsCards'

const Analytics: React.FC = () => {
  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Comprehensive insights into your stock management</p>
        </div>
        <div className="page-actions">
          <button className="action-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2V18M2 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="analytics-content">
        <div className="analytics-stats-section">
          <StatsCards />
        </div>

        <div className="analytics-charts-section">
          <Charts />
        </div>

        <div className="analytics-insights">
          <div className="insight-card">
            <h3>Key Insights</h3>
            <ul className="insights-list">
              <li>
                <span className="insight-icon positive">↑</span>
                <div className="insight-content">
                  <span className="insight-title">Stock levels are healthy</span>
                  <span className="insight-desc">Most items are above threshold</span>
                </div>
              </li>
              <li>
                <span className="insight-icon warning">⚠</span>
                <div className="insight-content">
                  <span className="insight-title">3 items running low</span>
                  <span className="insight-desc">Consider restocking soon</span>
                </div>
              </li>
              <li>
                <span className="insight-icon positive">↑</span>
                <div className="insight-content">
                  <span className="insight-title">Monthly inflow increased</span>
                  <span className="insight-desc">0.5% increase from last month</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="insight-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon stock-in">IN</div>
                <div className="activity-content">
                  <span className="activity-title">Stock In: Ibirayi</span>
                  <span className="activity-time">2 hours ago</span>
                </div>
                <span className="activity-amount">+300 kg</span>
              </div>
              <div className="activity-item">
                <div className="activity-icon stock-out">OUT</div>
                <div className="activity-content">
                  <span className="activity-title">Stock Out: Umunyu</span>
                  <span className="activity-time">5 hours ago</span>
                </div>
                <span className="activity-amount">-50 kg</span>
              </div>
              <div className="activity-item">
                <div className="activity-icon stock-in">IN</div>
                <div className="activity-content">
                  <span className="activity-title">Stock In: Gaz</span>
                  <span className="activity-time">1 day ago</span>
                </div>
                <span className="activity-amount">+100 kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics

