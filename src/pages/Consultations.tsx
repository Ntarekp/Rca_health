import './Consultations.css'

const Consultations: React.FC = () => {
  const consultations = [
    {
      id: '101',
      date: '2024-02-08',
      time: '08:30 AM',
      student: 'Keza Sarah',
      complaint: 'Severe Headache',
      diagnosis: 'Migraine',
      treatment: 'Paracetamol 500mg',
      disposition: 'Returned to Class',
      handledBy: 'Nurse Jane',
      status: 'completed'
    },
    {
      id: '102',
      date: '2024-02-08',
      time: '09:15 AM',
      student: 'Manzi David',
      complaint: 'High Fever (39°C)',
      diagnosis: 'Malaria Suspect',
      treatment: 'Antipyretics given',
      disposition: 'Sent Home',
      handledBy: 'Dr. John',
      status: 'pending-lab'
    },
    {
      id: '103',
      date: '2024-02-08',
      time: '10:00 AM',
      student: 'Mutesi Joy',
      complaint: 'Sports Injury',
      diagnosis: 'Sprained Ankle',
      treatment: 'Ice pack, Rest',
      disposition: 'Transferred',
      handledBy: 'Nurse Jane',
      status: 'completed'
    },
    {
      id: '104',
      date: '2024-02-07',
      time: '02:20 PM',
      student: 'Hirwa Peter',
      complaint: 'Stomach Pain',
      diagnosis: 'Gastritis',
      treatment: 'Antacids',
      disposition: 'Returned to Class',
      handledBy: 'Dr. John',
      status: 'completed'
    },
    {
      id: '105',
      date: '2024-02-07',
      time: '11:00 AM',
      student: 'Uwase Aline',
      complaint: 'Dizziness',
      diagnosis: 'Dehydration',
      treatment: 'ORS given',
      disposition: 'Returned to Class',
      handledBy: 'Nurse Jane',
      status: 'completed'
    }
  ]

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Consultations</h1>
          <p className="page-subtitle">View and manage all student consultations</p>
        </div>
        <div className="page-actions">
          <button className="action-button primary">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
              <path d="M10.5 3.5V17.5M3.5 10.5H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>New Consultation</span>
          </button>
        </div>
      </div>

      <div className="transactions-table-container">
        <div className="table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Student</th>
                <th>Complaint</th>
                <th>Diagnosis</th>
                <th>Disposition</th>
                <th>Handled By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((consultation) => (
                <tr key={consultation.id}>
                  <td>
                    <div className="date-time-cell">
                      <span className="date">{consultation.date}</span>
                      <span className="time">{consultation.time}</span>
                    </div>
                  </td>
                  <td className="font-medium text-[var(--color-primary)]">{consultation.student}</td>
                  <td>{consultation.complaint}</td>
                  <td>{consultation.diagnosis}</td>
                  <td>
                    <span className={`type-badge ${consultation.disposition === 'Returned to Class' ? 'stock-in' :
                      consultation.disposition === 'Sent Home' ? 'stock-out' : 'stock-out'
                      }`}>
                      {consultation.disposition}
                    </span>
                  </td>
                  <td>{consultation.handledBy}</td>
                  <td>
                    <span className={`status-badge ${consultation.status}`}>
                      {consultation.status === 'pending-lab' ? 'In Lab' : consultation.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-button" title="View">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 3C4.667 3 2 5.667 2 9C2 12.333 4.667 15 8 15C11.333 15 14 12.333 14 9C14 5.667 11.333 3 8 3ZM8 13C6.343 13 5 11.657 5 10C5 8.343 6.343 7 8 7C9.657 7 11 8.343 11 10C11 11.657 9.657 13 8 13Z" fill="currentColor" />
                        </svg>
                      </button>
                      <button className="icon-button" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M11.333 2.667C11.508 2.492 11.716 2.404 11.956 2.404C12.196 2.404 12.404 2.492 12.579 2.667C12.754 2.842 12.842 3.05 12.842 3.29C12.842 3.53 12.754 3.738 12.579 3.913L5.246 11.246L2 12L2.754 8.754L11.333 2.667Z" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Consultations

