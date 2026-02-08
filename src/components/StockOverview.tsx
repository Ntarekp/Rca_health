import './StockOverview.css'

interface StockItem {
  id: string
  name: string
  unit: string
  totalIn: number
  remaining: number
  threshold: number
  status: 'sufficient' | 'sufficient-green' | 'low' | 'out'
  lastOut: string
}

const StockOverview: React.FC = () => {
  const stockItems: StockItem[] = [
    {
      id: '1',
      name: 'Ibirayi',
      unit: 'kilogarama',
      totalIn: 300,
      remaining: 210,
      threshold: 90,
      status: 'sufficient',
      lastOut: 'Iminota 2 ishize'
    },
    {
      id: '2',
      name: 'Ibirayi',
      unit: 'kilogarama',
      totalIn: 300,
      remaining: 210,
      threshold: 90,
      status: 'sufficient',
      lastOut: 'Iminota 2 ishize'
    },
    {
      id: '3',
      name: 'Ibijumba',
      unit: 'kilogarama',
      totalIn: 300,
      remaining: 210,
      threshold: 90,
      status: 'low',
      lastOut: 'Iminsi 4 ishize'
    },
    {
      id: '4',
      name: 'Umunyu',
      unit: 'kilogarama',
      totalIn: 300,
      remaining: 210,
      threshold: 90,
      status: 'out',
      lastOut: 'Iminota 2 ishize'
    },
    {
      id: '5',
      name: 'Umunyu',
      unit: 'kilogarama',
      totalIn: 300,
      remaining: 210,
      threshold: 90,
      status: 'out',
      lastOut: 'Iminota 2 ishize'
    },
    {
      id: '6',
      name: 'Gaz',
      unit: 'kilogarama',
      totalIn: 3000,
      remaining: 50,
      threshold: 300,
      status: 'sufficient-green',
      lastOut: 'Iminota 2 ishize'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sufficient':
        return { text: 'Birahagije', className: 'status-sufficient' }
      case 'sufficient-green':
        return { text: 'Birahagije', className: 'status-sufficient-green' }
      case 'low':
        return { text: 'Hafi gushira', className: 'status-low' }
      case 'out':
        return { text: 'Byashize', className: 'status-out' }
      default:
        return { text: 'Birahagije', className: 'status-sufficient' }
    }
  }

  return (
    <div className="stock-overview">
      <div className="stock-overview-header">
        <h2 className="stock-overview-title">Imbonerahamwe y'ububiko</h2>
        <button className="view-more-link">Reba ibindi</button>
      </div>

      <div className="stock-overview-table">
        <div className="table-header">
          <div className="table-cell">Izina</div>
          <div className="table-cell">Igipimo fatizo</div>
          <div className="table-cell">Ingano y'ibinjiye</div>
          <div className="table-cell">Ingano y'ibisigaye</div>
          <div className="table-cell">Ingano ntarengwa</div>
          <div className="table-cell">Imitere</div>
          <div className="table-cell">Gusohoka biheruka</div>
        </div>

        {stockItems.map((item, index) => {
          const statusBadge = getStatusBadge(item.status)
          return (
            <div key={item.id} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
              <div className="table-cell">{item.name}</div>
              <div className="table-cell">{item.unit}</div>
              <div className="table-cell">{item.totalIn}</div>
              <div className="table-cell">{item.remaining}</div>
              <div className="table-cell">{item.threshold}</div>
              <div className="table-cell">
                <span className={`status-badge ${statusBadge.className}`}>
                  {statusBadge.text}
                </span>
              </div>
              <div className="table-cell">{item.lastOut}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StockOverview

