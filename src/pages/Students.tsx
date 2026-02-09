import { useNavigate } from 'react-router-dom'
import { LayoutGrid, List } from 'lucide-react'
import './Students.css'
import { useState } from 'react'

const Students: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const students = [
    {
      id: '1',
      name: 'Keza Sarah',
      code: 'RCA-2024-001',
      class: 'S4 MPC',
      age: 16,
      gender: 'Female',
      insurance: 'RAMA',
      status: 'active',
      lastVisit: '2 days ago'
    },
    {
      id: '2',
      name: 'Manzi David',
      code: 'RCA-2024-002',
      class: 'S5 PCB',
      age: 17,
      gender: 'Male',
      insurance: 'MMI',
      status: 'critical',
      lastVisit: 'Today'
    },
    {
      id: '3',
      name: 'Mutesi Joy',
      code: 'RCA-2024-003',
      class: 'S6 MEC',
      age: 18,
      gender: 'Female',
      insurance: 'RSSB',
      status: 'active',
      lastVisit: '1 week ago'
    },
    {
      id: '4',
      name: 'Hirwa Peter',
      code: 'RCA-2024-004',
      class: 'S4 MCB',
      age: 16,
      gender: 'Male',
      insurance: 'Radiant',
      status: 'follow-up',
      lastVisit: 'Yesterday'
    },
    {
      id: '5',
      name: 'Uwase Aline',
      code: 'RCA-2024-005',
      class: 'S5 LKK',
      age: 17,
      gender: 'Female',
      insurance: 'RAMA',
      status: 'active',
      lastVisit: '3 days ago'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'Active', className: 'status-sufficient-green' } // Reusing existing green class
      case 'critical':
        return { text: 'Critical Alert', className: 'status-out' } // Reusing existing red class
      case 'follow-up':
        return { text: 'Follow Up', className: 'status-low' } // Reusing existing yellow class
      default:
        return { text: 'Active', className: 'status-sufficient' }
    }
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="stock-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">Manage student medical profiles</p>
        </div>
        <div className="page-actions">
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1 h-[38px] items-center">
            <button
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>

          <button
            className="action-button primary"
            onClick={() => navigate('/students/new')}
          >
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
              <path d="M10.5 3.5V17.5M3.5 10.5H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="stock-grid">
          {filteredStudents.map((student) => {
            const statusBadge = getStatusBadge(student.status)
            return (
              <div key={student.id} className="stock-card">
                <div className="stock-card-header">
                  <div className="stock-card-title">
                    <h3>{student.name}</h3>
                    <span className="stock-category">{student.class}</span>
                  </div>
                  <span className={`status-badge ${statusBadge.className}`}>
                    {statusBadge.text}
                  </span>
                </div>
                <div className="stock-card-body">
                  <div className="stock-info-item">
                    <span className="label">Student ID:</span>
                    <span className="value">{student.code}</span>
                  </div>
                  <div className="stock-info-item">
                    <span className="label">Age/Gender:</span>
                    <span className="value">{student.age} / {student.gender}</span>
                  </div>
                  <div className="stock-info-item">
                    <span className="label">Insurance:</span>
                    <span className="value">{student.insurance}</span>
                  </div>
                  <div className="stock-info-item">
                    <span className="label">Last Visit:</span>
                    <span className="value">{student.lastVisit}</span>
                  </div>
                </div>
                <div className="stock-card-footer">
                  <button
                    className="card-button"
                    onClick={() => navigate(`/students/${student.id}`)}
                  >
                    View Profile
                  </button>
                  <button className="card-button secondary">Edit</button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>ID Code</th>
                <th>Age / Gender</th>
                <th>Insurance</th>
                <th>Status</th>
                <th>Last Visit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const statusBadge = getStatusBadge(student.status)
                return (
                  <tr key={student.id}>
                    <td className="font-medium">{student.name}</td>
                    <td>{student.class}</td>
                    <td>{student.code}</td>
                    <td>{student.age} / {student.gender}</td>
                    <td>{student.insurance}</td>
                    <td>
                      <span className={`status-badge ${statusBadge.className}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td>{student.lastVisit}</td>
                    <td>
                      <button
                        className="text-[var(--color-primary)] hover:underline text-sm font-medium mr-3"
                        onClick={() => navigate(`/students/${student.id}`)}
                      >
                        View
                      </button>
                      <button className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] text-sm">
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Students
