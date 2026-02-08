import './LabAndHistory.css'
import { useState } from 'react'

const LabAndHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const records = [
    {
      id: '1',
      student: 'Keza Sarah',
      type: 'Laboratory',
      date: '2024-02-08',
      result: 'Malaria Test: Negative',
      doctor: 'Lab Tech Jean',
      tags: ['Malaria', 'Blood Test'],
      status: 'completed',
      priority: 'high'
    },
    {
      id: '2',
      student: 'Manzi David',
      type: 'Medical History',
      date: '2024-01-15',
      result: 'Asthma Attack History',
      doctor: 'Dr. John',
      tags: ['Chronic', 'Respiratory'],
      status: 'active',
      priority: 'medium'
    },
    {
      id: '3',
      student: 'Mutesi Joy',
      type: 'Laboratory',
      date: '2024-02-07',
      result: 'Stool Analysis: Pending',
      doctor: 'Lab Tech Jean',
      tags: ['Stool', 'Infection'],
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '4',
      student: 'Hirwa Peter',
      type: 'Medical History',
      date: '2023-11-20',
      result: 'Allergy: Penicillin',
      doctor: 'Dr. John',
      tags: ['Allergy', 'Critical'],
      status: 'active',
      priority: 'high'
    }
  ]

  const filteredRecords = records.filter(record =>
    record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.result.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'active'; // Green
      case 'pending': return 'inactive'; // Red/Warning (using inactive style for now or I can add a new one)
      case 'active': return 'active';
      default: return 'active';
    }
  }

  return (
    <div className="suppliers-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Medical History & Lab</h1>
          <p className="page-subtitle">Manage laboratory requests and patient history</p>
        </div>
        <div className="page-actions">
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="action-button primary">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
              <path d="M10.5 3.5V17.5M3.5 10.5H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>New Lab Request</span>
          </button>
        </div>
      </div>

      <div className="suppliers-grid">
        {filteredRecords.map((record) => (
          <div key={record.id} className="supplier-card">
            <div className="supplier-card-header">
              <div className="supplier-info">
                <h3>{record.student}</h3>
                <span className={`status-badge ${getStatusClass(record.status)}`}>
                  {record.status}
                </span>
              </div>
            </div>
            <div className="supplier-card-body">
              <div className="supplier-detail">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{record.type}</span>
              </div>
              <div className="supplier-detail">
                <span className="detail-label">Result/Condition:</span>
                <span className="detail-value">{record.result}</span>
              </div>
              <div className="supplier-detail">
                <span className="detail-label">Doctor/Tech:</span>
                <span className="detail-value">{record.doctor}</span>
              </div>
              <div className="supplier-detail">
                <span className="detail-label">Tags:</span>
                <div className="items-tags">
                  {record.tags.map((tag, index) => (
                    <span key={index} className="item-tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="supplier-detail">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{record.date}</span>
              </div>
            </div>
            <div className="supplier-card-footer">
              <button className="card-button">View Report</button>
              <button className="card-button secondary">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LabAndHistory

