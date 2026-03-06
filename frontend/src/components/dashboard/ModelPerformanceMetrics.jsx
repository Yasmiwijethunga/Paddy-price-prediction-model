import { CheckCircle, Target, TrendingUp, Percent } from 'lucide-react'

const metrics = [
  { icon: CheckCircle, label: 'Model Accuracy',                  sub: 'Overall prediction accuracy',   value: 92.2, max: 100,  unit: '%',   color: 'bg-primary-600' },
  { icon: Target,      label: 'R² Score',                        sub: 'Coefficient of determination',  value: 89.0, max: 100,  unit: '',    color: 'bg-primary-600' },
  { icon: TrendingUp,  label: 'MAE',                             sub: 'Mean Absolute Error',           value: 4.25, max: 20,   unit: ' LKR',color: 'bg-primary-600' },
  { icon: Percent,     label: 'MAPE',                            sub: 'Mean Absolute Percentage Error',value: 7.8,  max: 20,   unit: '%',   color: 'bg-primary-600' },
]

export default function ModelPerformanceMetrics() {
  return (
    <div className="card">
      <h3 className="font-bold text-gray-900 text-lg mb-0.5">Model Performance Metrics</h3>
      <p className="text-xs text-gray-500 mb-5">Evaluation metrics for the paddy price prediction model</p>
      <div className="space-y-5">
        {metrics.map(({ icon: Icon, label, sub, value, max, unit, color }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Icon size={15} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
              <span className="font-bold text-gray-900 text-sm">{value}{unit}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${color}`}
                style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
