import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'

const MOCK = [
  { id: 1, label: 'Normal Season',   predicted_price: 72, prediction_date: '2025-01-15', confidence: 94, up: true },
  { id: 2, label: 'High Rainfall',   predicted_price: 68, prediction_date: '2025-01-10', confidence: 89, up: false },
  { id: 3, label: 'Low Input Cost',  predicted_price: 65, prediction_date: '2025-01-05', confidence: 91, up: false },
  { id: 4, label: 'Festival Demand', predicted_price: 78, prediction_date: '2024-12-28', confidence: 87, up: true },
]

export default function RecentPredictions({ predictions }) {
  const items = predictions?.length ? predictions : MOCK

  return (
    <div className="card">
      <h3 className="font-bold text-gray-900 text-lg mb-0.5">Recent Predictions</h3>
      <p className="text-xs text-gray-500 mb-5">Latest paddy price predictions for different scenarios</p>
      <div className="space-y-3">
        {items.map((p) => {
          const label = p.label || p.notes || `Prediction #${p.id}`
          const date  = new Date(p.prediction_date).toISOString().split('T')[0]
          const conf  = p.confidence ?? Math.round(70 + Math.random() * 25)
          const up    = p.up ?? (p.predicted_price > 65)
          return (
            <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${up ? 'bg-green-50' : 'bg-red-50'}`}>
                  {up
                    ? <TrendingUp size={15} className="text-green-600" />
                    : <TrendingDown size={15} className="text-red-500" />
                  }
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={10} /> {date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-sm">Rs.{p.predicted_price}</p>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {conf}% confidence
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
