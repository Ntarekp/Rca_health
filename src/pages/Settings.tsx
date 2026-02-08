import './Settings.css'
import { useState } from 'react'

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    lowStockAlert: true,
    autoReorder: false,
    language: 'en',
    timezone: 'Africa/Kigali'
  })

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your application settings and preferences</p>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2 className="section-title">Notifications</h2>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Enable Notifications</span>
                <span className="setting-desc">Receive notifications for important events</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Email Alerts</span>
                <span className="setting-desc">Receive email notifications for stock alerts</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Low Stock Alerts</span>
                <span className="setting-desc">Get notified when items are running low</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.lowStockAlert}
                  onChange={(e) => handleSettingChange('lowStockAlert', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">Stock Management</h2>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Auto Reorder</span>
                <span className="setting-desc">Automatically create purchase orders when stock is low</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoReorder}
                  onChange={(e) => handleSettingChange('autoReorder', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">Preferences</h2>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Language</span>
                <span className="setting-desc">Select your preferred language</span>
              </div>
              <select
                className="setting-select"
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="rw">Kinyarwanda</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Timezone</span>
                <span className="setting-desc">Set your timezone for accurate timestamps</span>
              </div>
              <select
                className="setting-select"
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
              >
                <option value="Africa/Kigali">Africa/Kigali (GMT+2)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="action-button primary">Save Changes</button>
          <button className="action-button">Reset to Default</button>
        </div>
      </div>
    </div>
  )
}

export default Settings

