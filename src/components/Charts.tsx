import './Charts.css'

const Charts: React.FC = () => {
  // Bar chart data - representing monthly stock in/out
  const barChartData = [
    { month: 'Jan', in: 39, out: 76, damaged: 17 },
    { month: 'Feb', in: 227, out: 158, damaged: 17 },
    { month: 'Mar', in: 137, out: 39, damaged: 17 },
    { month: 'Apr', in: 139, out: 39, damaged: 17 },
    { month: 'May', in: 39, out: 76, damaged: 17 },
    { month: 'Jun', in: 163, out: 110, damaged: 17 },
    { month: 'Jul', in: 99, out: 64, damaged: 17 },
    { month: 'Aug', in: 121, out: 39, damaged: 17 },
    { month: 'Sep', in: 115, out: 39, damaged: 17 },
    { month: 'Oct', in: 119, out: 39, damaged: 17 },
    { month: 'Nov', in: 84, out: 39, damaged: 17 },
    { month: 'Dec', in: 39, out: 76, damaged: 17 }
  ]

  const maxValue = 227
  const chartHeight = 227

  return (
    <div className="charts-container">
      <div className="bar-chart-section">
        <div className="chart-header">
          <div className="chart-title-section">
            <svg className="chart-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3V21H21" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 16L12 11L16 15L21 10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="chart-time-selector">
              <button className="time-button active">This Month</button>
            </div>
          </div>
        </div>

        <div className="bar-chart-container">
          <div className="chart-y-axis">
            {[6, 5, 4, 3, 2, 1, 0].map((value) => (
              <div key={value} className="y-axis-label">{value}</div>
            ))}
          </div>

          <div className="chart-content">
            <div className="chart-grid">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="grid-line" style={{ top: `${(i * 45)}px` }} />
              ))}
            </div>

            <div className="bar-chart-bars">
              {barChartData.map((data, index) => {
                const inHeight = (data.in / maxValue) * chartHeight
                const outHeight = (data.out / maxValue) * chartHeight
                const damagedHeight = (data.damaged / maxValue) * chartHeight

                return (
                  <div key={data.month} className="bar-group" style={{ left: `${index * 65}px` }}>
                    <div className="bar-wrapper">
                      <div 
                        className="bar bar-in" 
                        style={{ height: `${inHeight}px`, bottom: `${chartHeight - inHeight}px` }}
                      />
                      <div 
                        className="bar bar-out" 
                        style={{ height: `${outHeight}px`, bottom: `${chartHeight - outHeight}px` }}
                      />
                      <div 
                        className="bar bar-damaged" 
                        style={{ height: `${damagedHeight}px`, bottom: `${chartHeight - damagedHeight}px` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="chart-x-axis">
            {barChartData.map((data) => (
              <div key={data.month} className="x-axis-label">{data.month}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="pie-chart-section">
        <div className="pie-chart-header">
          <h3 className="pie-chart-title">Dashboard</h3>
          <button className="view-details-button-pie">
            <span>View Details</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="pie-chart-container">
          <div className="pie-chart-visual">
            <div className="pie-circle">
              <div className="pie-center">
                <div className="pie-center-label">Total Stock</div>
                <div className="pie-center-value">35</div>
                <div className="pie-center-percentage">7%</div>
                <div className="pie-center-items">3 items</div>
              </div>
            </div>
          </div>

          <div className="pie-chart-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#1a264a' }} />
              <span>Stock In</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#9d2c34' }} />
              <span>Stock Out</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#133dbd' }} />
              <span>Damaged Items</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#924b66' }} />
              <span>Low-items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Charts

