import './Sidebar.css'

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="nav-section">
          <a href="#" className="nav-item active">
            <svg className="nav-icon" width="25" height="25" viewBox="0 0 25 25" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            <span>Dashboard</span>
          </a>
          
          <a href="#" className="nav-item">
            <svg className="nav-icon" width="25" height="25" viewBox="0 0 25 25" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="6" width="18" height="15" rx="2"/>
              <path d="M3 10H21"/>
            </svg>
            <span>Stock</span>
          </a>
          
          <a href="#" className="nav-item">
            <svg className="nav-icon" width="25" height="26" viewBox="0 0 25 26" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4H20V20H4V4Z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 10H20" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 4V20" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Transactions</span>
          </a>
          
          <a href="#" className="nav-item">
            <svg className="nav-icon" width="25" height="25" viewBox="0 0 25 25" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3V21H21" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 16L12 11L16 15L21 10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Analytics</span>
          </a>
          
          <a href="#" className="nav-item">
            <svg className="nav-icon" width="25" height="25" viewBox="0 0 25 25" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Report</span>
          </a>
          
          <a href="#" className="nav-item">
            <svg className="nav-icon" width="25" height="25" viewBox="0 0 25 25" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12.5 2.5L3 7.5V12.5C3 17.5 6.5 22 12.5 24.5C18.5 22 22 17.5 22 12.5V7.5L12.5 2.5Z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Suppliers</span>
          </a>
          
          <a href="#" className="nav-item">
            <svg className="nav-icon" width="25" height="25" viewBox="0 0 25 25" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12.5" cy="12.5" r="3"/>
              <path d="M12.5 1V5M12.5 20V24M5 12.5H1M24 12.5H20M4.22 4.22L7.05 7.05M17.95 17.95L20.78 20.78M1 12.5L4.22 4.22M20.78 20.78L24 12.5M20.78 4.22L17.95 7.05M7.05 17.95L4.22 20.78"/>
            </svg>
            <span>Settings</span>
          </a>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar

