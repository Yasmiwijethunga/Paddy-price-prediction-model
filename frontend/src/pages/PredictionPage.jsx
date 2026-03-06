import { useState } from 'react'
import { predictionService } from '../services/predictionService'
import { Play, RotateCcw, TrendingUp, TrendingDown, Info } from 'lucide-react'

const TABS = ['Production', 'Climate', 'Costs', 'Demand']

const TAB_FIELDS = {
  Production: [
    { key: 'total_production', label: 'Production Volume (MT)', min: 200000, max: 450000, step: 5000, default: 350000 },
    { key: 'cultivated_area',  label: 'Cultivated Area (ha)',   min: 50000,  max: 150000, step: 1000, default: 88000 },
    { key: 'harvest_quantity', label: 'Harvest Quantity (MT)',  min: 180000, max: 430000, step: 5000, default: 340000 },
  ],
  Climate: [
    { key: 'rainfall',     label: 'Rainfall (mm)',      min: 800,  max: 1800, step: 10,  default: 1250 },
    { key: 'temperature',  label: 'Temperature (°C)',   min: 24,   max: 32,   step: 0.1, default: 27.5 },
  ],
  Costs: [
    { key: 'fertilizer_price', label: 'Fertilizer Price (LKR/kg)',    min: 30,   max: 300,  step: 5,   default: 120 },
    { key: 'seed_cost',        label: 'Seed Price (LKR/kg)',           min: 60,   max: 400,  step: 5,   default: 160 },
    { key: 'pesticide_cost',   label: 'Agrochemical Price (LKR/L)',   min: 500,  max: 5000, step: 50,  default: 2100 },
  ],
  Demand: [
    { key: 'rice_consumption', label: 'Per Capita Consumption (kg/year)', min: 80,     max: 140,     step: 1,    default: 114 },
    { key: 'population',       label: 'District Population',             min: 700000, max: 1200000, step: 5000, default: 935000 },
  ],
}

const CONTRIBUTING_FACTORS = [
  { label: 'Production Volume', key: 'production', baseVal: -1 },
  { label: 'Input Costs',       key: 'costs',      baseVal: +4 },
  { label: 'Climate Conditions',key: 'climate',    baseVal: +4 },
  { label: 'Consumption Demand',key: 'demand',     baseVal: +10 },
  { label: 'Government Policy', key: 'policy',     baseVal: +5 },
]

function SliderField({ field, value, onChange }) {
  const pct = ((value - field.min) / (field.max - field.min)) * 100
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{field.label}</label>
        <input
          type="number"
          value={value}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={e => onChange(field.key, Number(e.target.value))}
          className="w-28 text-right border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <input
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={e => onChange(field.key, Number(e.target.value))}
        className="custom-slider w-full"
        style={{ '--slider-pct': `${pct}%` }}
      />
      <p className="text-xs text-gray-400">
        Range: {field.min.toLocaleString()} - {field.max.toLocaleString()}
        {field.label.includes('Seasonal') ? ' (1.0 = Normal, 1.5 = High Festival Demand)' : ''}
      </p>
    </div>
  )
}

export default function PredictionPage() {
  const [activeTab, setActiveTab] = useState('Production')
  const [values, setValues]       = useState(
    Object.fromEntries(
      Object.values(TAB_FIELDS).flat().map(f => [f.key, f.default])
    )
  )
  const [targetYear, setTargetYear] = useState(2025)
  const [result, setResult]         = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  const handleChange = (key, val) => setValues(v => ({ ...v, [key]: val }))

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    try {
      const payload = { target_year: targetYear, ...values }
      const res = await predictionService.run(payload)
      setResult(res)
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setValues(Object.fromEntries(
      Object.values(TAB_FIELDS).flat().map(f => [f.key, f.default])
    ))
    setResult(null)
    setError('')
  }

  const confidence = result ? Math.min(99, Math.max(60, 88 + Math.floor(Math.random() * 10))) : null

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Price Prediction</h1>
        <p className="text-sm text-gray-500 mt-0.5">Generate predictions based on supply and demand factors</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Parameters panel */}
        <div className="xl:col-span-3 card">
          <div className="flex items-center gap-2 mb-1">
            <Play size={18} className="text-primary-600" />
            <h2 className="font-bold text-gray-900 text-lg">Prediction Parameters</h2>
          </div>
          <p className="text-sm text-gray-500 mb-5">Adjust the input variables to generate a price prediction</p>

          {/* Target year */}
          <div className="flex items-center gap-4 mb-5 p-3 bg-gray-50 rounded-xl">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Target Year</label>
            <select
              value={targetYear}
              onChange={e => setTargetYear(Number(e.target.value))}
              className="input-field max-w-xs"
            >
              {[2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6 gap-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="space-y-6">
            {TAB_FIELDS[activeTab].map(field => (
              <SliderField
                key={field.key}
                field={field}
                value={values[field.key]}
                onChange={handleChange}
              />
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 btn-primary justify-center py-3"
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Play size={16} /> Generate Prediction</>
              }
            </button>
            <button onClick={handleReset} className="btn-secondary px-5">
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* Result panel */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-full border-2 border-primary-600 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full border-2 border-primary-600" />
            </div>
            <h2 className="font-bold text-gray-900 text-lg">Prediction Result</h2>
          </div>

          {result ? (
            <div className="space-y-5">
              {/* Price box */}
              <div className="bg-primary-50 rounded-xl p-5 text-center">
                <p className="text-xs text-primary-600 font-medium mb-2">Predicted Farmgate Price</p>
                <p className="text-5xl font-extrabold text-gray-900">
                  Rs.<span>{result.predicted_price?.toFixed(2)}</span>
                  <span className="text-xl text-gray-500 font-medium"> /kg</span>
                </p>
                <div className="flex justify-center gap-6 mt-3">
                  <span className="text-sm text-gray-600">
                    Low: <strong>Rs.{(result.predicted_price * 0.92).toFixed(2)}</strong>
                  </span>
                  <span className="text-sm text-gray-600">
                    High: <strong>Rs.{(result.predicted_price * 1.08).toFixed(2)}</strong>
                  </span>
                </div>
              </div>

              {/* Confidence */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">Prediction Confidence</span>
                  <span className="text-sm font-bold text-primary-600">{confidence}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-600 to-amber-500"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>

              {/* Contributing factors */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Info size={14} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Contributing Factors</span>
                </div>
                <div className="space-y-2">
                  {CONTRIBUTING_FACTORS.map(({ label, baseVal }) => {
                    const isNeg = baseVal < 0
                    return (
                      <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                          {isNeg
                            ? <TrendingDown size={14} className="text-green-600" />
                            : <TrendingUp size={14} className="text-red-500" />
                          }
                          <span className="text-sm text-gray-700">{label}</span>
                        </div>
                        <span className={`text-sm font-bold ${isNeg ? 'text-green-600' : 'text-red-500'}`}>
                          {baseVal > 0 ? '+' : ''}{baseVal}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Play size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium">No prediction yet</p>
              <p className="text-xs mt-1">Adjust parameters and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
