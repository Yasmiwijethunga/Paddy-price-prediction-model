import { useState } from 'react'
import { CheckCircle, Info } from 'lucide-react'

const MODEL_INFO = {
  name: 'Ridge Regression (Optimised)',
  version: '2.1.0',
  accuracy: '92.2%',
  r2: '0.89',
  mae: '4.25 LKR/kg',
  mape: '7.8%',
  training_range: '2000–2023',
  last_trained: '2024-12-01',
  features: [
    { label: 'Total Production',    weight: 0.72 },
    { label: 'Fertilizer Price',    weight: 0.85 },
    { label: 'Annual Rainfall',     weight: 0.68 },
    { label: 'Domestic Consumption', weight: 0.45 },
    { label: 'Seed Cost',           weight: 0.38 },
    { label: 'Temperature',         weight: 0.22 },
  ],
}

export default function ModelSettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Model Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">View configuration and performance metrics of the prediction model</p>
      </div>

      {/* Model info */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-5 text-lg">Model Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {[
            ['Model Name',     MODEL_INFO.name],
            ['Version',        MODEL_INFO.version],
            ['Accuracy',       MODEL_INFO.accuracy],
            ['R² Score',       MODEL_INFO.r2],
            ['MAE',            MODEL_INFO.mae],
            ['MAPE',           MODEL_INFO.mape],
            ['Training Range', MODEL_INFO.training_range],
            ['Last Trained',   MODEL_INFO.last_trained],
          ].map(([k, v]) => (
            <div key={k} className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{k}</p>
              <p className="font-semibold text-gray-900 text-sm break-words">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature weights */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-5 text-lg">Feature Weights</h2>
        <div className="space-y-4">
          {MODEL_INFO.features.map(({ label, weight }) => (
            <div key={label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">{label}</span>
                <span className="text-sm font-semibold text-primary-700">{(weight * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${weight * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data range config (read-only display with note) */}
      <div className="card">
        <div className="flex items-start gap-3 mb-5">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">Data Configuration</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              These settings control which records are used during model training. Retraining requires admin access.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Start Year</label>
            <input
              type="number"
              defaultValue={2000}
              className="input-field"
              min={1990}
              max={2020}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">End Year</label>
            <input
              type="number"
              defaultValue={2023}
              className="input-field"
              min={2000}
              max={2025}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            {saved
              ? <><CheckCircle className="w-4 h-4" /> Saved!</>
              : 'Save Settings'
            }
          </button>
          <button className="btn-secondary">Reset to Defaults</button>
        </div>
      </div>
    </div>
  )
}
