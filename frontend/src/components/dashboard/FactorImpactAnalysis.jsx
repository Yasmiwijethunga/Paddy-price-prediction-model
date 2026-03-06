import { Sprout, DollarSign, CloudRain, Users, FileText } from 'lucide-react'

const defaultFactors = [
  { icon: Sprout,     label: 'Production Volume', sub: 'Higher production lowers price',  pct: -32, color: 'bg-green-500' },
  { icon: DollarSign, label: 'Input Costs',        sub: 'Fertilizer, seeds, agro...',      pct: +28, color: 'bg-red-500'   },
  { icon: CloudRain,  label: 'Climate Factors',    sub: 'Rainfall and temperature...',     pct: +18, color: 'bg-red-500'   },
  { icon: Users,      label: 'Consumption Demand', sub: 'Per capita and seasonal d...',    pct: +15, color: 'bg-red-500'   },
  { icon: FileText,   label: 'Government Policy',  sub: 'Guaranteed price influence',      pct: +7,  color: 'bg-red-500'   },
]

export default function FactorImpactAnalysis({ correlations }) {
  return (
    <div className="card">
      <h3 className="font-bold text-gray-900 text-lg mb-0.5">Factor Impact Analysis</h3>
      <p className="text-xs text-gray-500 mb-5">Contribution of each factor to price prediction</p>
      <div className="space-y-4">
        {defaultFactors.map(({ icon: Icon, label, sub, pct, color }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-800 truncate">{label}</p>
                <span className={`text-xs font-bold ml-2 flex-shrink-0 ${pct < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {pct > 0 ? '+' : ''}{pct}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${Math.abs(pct)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
