import './StatsCards.css'

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  isPrimary?: boolean
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, isPrimary = false }) => {
  return (
    <div className={`stat-card ${isPrimary ? 'primary' : ''}`}>
      <div className="stat-card-header">
        <button className="view-details-button">
          <span>View Details</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="stat-card-body">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-card-footer">
        <svg className="stat-trend-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 10L5 6L9 10L13 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className={`stat-change ${changeType}`}>
          <span className="change-value">{change}</span>
          <span className="change-label">vs last month</span>
        </div>
      </div>
    </div>
  )
}

const StatsCards: React.FC = () => {
  return (
    <div className="stats-cards">
      <StatCard
        title="Stock Items"
        value="23"
        change="0.5%"
        changeType="positive"
        isPrimary={true}
      />
      <StatCard
        title="Low Items"
        value="7"
        change="0.5%"
        changeType="positive"
      />
      <StatCard
        title="Damaged"
        value="24"
        change="0.5%"
        changeType="positive"
      />
      <StatCard
        title="Monthly inflow"
        value="23"
        change="0.5%"
        changeType="negative"
      />
    </div>
  )
}

export default StatsCards

