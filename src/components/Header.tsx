import './Header.css'

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-container">
          <div className="logo-placeholder" />
          <div className="logo-text">
            <span>Rwanda Coding</span>
            <span>Academy</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="search-container">
          <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input type="text" placeholder="Search" className="search-input" />
        </div>
      </div>

      <div className="header-right">
        <button className="header-icon-button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 2C10.5523 2 11 2.44772 11 3V4H15C15.5523 4 16 4.44772 16 5C16 5.55228 15.5523 6 15 6H5C4.44772 6 4 5.55228 4 5C4 4.44772 4.44772 4 5 4H9V3C9 2.44772 9.44772 2 10 2Z"/>
            <path d="M5 8H15L14.4 16.2C14.3 17.2 13.5 18 12.5 18H7.5C6.5 18 5.7 17.2 5.6 16.2L5 8Z"/>
          </svg>
        </button>
        <button className="header-icon-button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z"/>
            <path d="M10 4C10.5523 4 11 3.55228 11 3C11 2.44772 10.5523 2 10 2C9.44772 2 9 2.44772 9 3C9 3.55228 9.44772 4 10 4Z"/>
            <path d="M10 18C10.5523 18 11 17.5523 11 17C11 16.4477 10.5523 16 10 16C9.44772 16 9 16.4477 9 17C9 17.5523 9.44772 18 10 18Z"/>
            <path d="M4 10C4 10.5523 3.55228 11 3 11C2.44772 11 2 10.5523 2 10C2 9.44772 2.44772 9 3 9C3.55228 9 4 9.44772 4 10Z"/>
            <path d="M18 10C18 10.5523 17.5523 11 17 11C16.4477 11 16 10.5523 16 10C16 9.44772 16.4477 9 17 9C17.5523 9 18 9.44772 18 10Z"/>
          </svg>
        </button>
        <button className="header-icon-button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="10" cy="7" r="4"/>
            <path d="M5 18C5 15.2386 7.23858 13 10 13C12.7614 13 15 15.2386 15 18"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header

