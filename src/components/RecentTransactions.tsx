import './RecentTransactions.css'

interface Transaction {
  id: string
  date: string
  item: string
  type: 'in' | 'out'
  reason?: string
  handledBy?: string
}

const RecentTransactions: React.FC = () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2 Iminsi ishize',
      item: '7500 kg by\'umuceri',
      type: 'in'
    },
    {
      id: '2',
      date: '2 Iminsi ishize',
      item: '7500 kg by\'umuceri',
      type: 'out',
      reason: 'Impamvu: Guteka ku mugoroba',
      handledBy: 'Ubitwaye: Ferdinand'
    },
    {
      id: '3',
      date: '2 Iminsi ishize',
      item: '7500 kg by\'umuceri',
      type: 'in'
    },
    {
      id: '4',
      date: '2 Iminsi ishize',
      item: '7500 kg by\'umuceri',
      type: 'out',
      reason: 'Impamvu: Guteka ku mugoroba',
      handledBy: 'Ubitwaye: Ferdinand'
    }
  ]

  return (
    <div className="recent-transactions">
      <div className="transactions-header">
        <h2 className="transactions-title">Ibyakozwe Biheruka</h2>
        <button className="view-more-button">
          <span>Reba Ibindi</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="transactions-list">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-content">
              <div className="transaction-date-badge">
                {transaction.date}
              </div>
              <div className="transaction-details">
                <div className="transaction-item-name">{transaction.item}</div>
                {transaction.reason && (
                  <div className="transaction-reason">{transaction.reason}</div>
                )}
                {transaction.handledBy && (
                  <div className="transaction-handler">{transaction.handledBy}</div>
                )}
              </div>
            </div>
            <div className={`transaction-type-badge ${transaction.type}`}>
              {transaction.type === 'in' ? 'Kwinjira' : 'Gusohoka'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTransactions

