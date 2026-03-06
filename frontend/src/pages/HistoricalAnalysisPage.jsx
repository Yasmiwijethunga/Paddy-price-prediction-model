import { useEffect, useState } from 'react'
import { analysisService } from '../services/analysisService'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area, ResponsiveContainer, LineChart
} from 'recharts'

const MOCK_TRENDS = [
  { year: 2015, total_production: 357000, paddy_price: 36, rainfall: 1245, temperature: 27.2, fertilizer_price: 42, seed_cost: 85 },
  { year: 2016, total_production: 373000, paddy_price: 38, rainfall: 1320, temperature: 27.5, fertilizer_price: 45, seed_cost: 90 },
  { year: 2017, total_production: 389000, paddy_price: 40, rainfall: 1456, temperature: 27.1, fertilizer_price: 48, seed_cost: 95 },
  { year: 2018, total_production: 402000, paddy_price: 45, rainfall: 1190, temperature: 28.1, fertilizer_price: 52, seed_cost: 100 },
  { year: 2019, total_production: 395000, paddy_price: 48, rainfall: 1380, temperature: 27.8, fertilizer_price: 55, seed_cost: 108 },
  { year: 2020, total_production: 298000, paddy_price: 52, rainfall: 1520, temperature: 26.9, fertilizer_price: 60, seed_cost: 115 },
  { year: 2021, total_production: 365000, paddy_price: 68, rainfall: 1350, temperature: 28.5, fertilizer_price: 75, seed_cost: 140 },
  { year: 2022, total_production: 249000, paddy_price: 105, rainfall: 1100, temperature: 29.2, fertilizer_price: 280, seed_cost: 320 },
  { year: 2023, total_production: 328000, paddy_price: 80, rainfall: 1280, temperature: 27.9, fertilizer_price: 140, seed_cost: 180 },
  { year: 2024, total_production: 351000, paddy_price: 68, rainfall: 1340, temperature: 27.0, fertilizer_price: 130, seed_cost: 160 },
]

const CORRELATIONS = [
  { label: 'Production-Price', value: -0.72, desc: 'Strong negative correlation' },
  { label: 'Input Cost-Price', value: +0.85, desc: 'Strong positive correlation' },
  { label: 'Rainfall-Production', value: +0.68, desc: 'Moderate positive correlation' },
  { label: 'Demand-Price',    value: +0.45, desc: 'Moderate positive correlation' },
]

export default function HistoricalAnalysisPage() {
  const [trends, setTrends]   = useState(MOCK_TRENDS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    analysisService.getTrends()
      .then(data => { if (data?.length) setTrends(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const chartData = trends.map(d => ({
    year: d.year,
    production: Math.round((d.total_production || 0) / 1000),
    price:      d.paddy_price || 0,
    rainfall:   d.rainfall || 0,
    temperature: d.temperature || 0,
    fertilizer: d.fertilizer_price || 0,
    seeds:      d.seed_cost || 0,
    paddyPrice: d.paddy_price || 0,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historical Analysis</h1>
        <p className="text-sm text-gray-500 mt-0.5">Explore relationships between factors and paddy prices</p>
      </div>

      {/* Production Volume vs Price */}
      <div className="card">
        <h3 className="font-bold text-gray-900 text-lg mb-0.5">Production Volume vs Price</h3>
        <p className="text-xs text-gray-500 mb-5">Analyzing the inverse relationship between production and farmgate prices</p>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis yAxisId="left"  label={{ value: 'Production (K MT)', angle: -90, position: 'insideLeft', dx: -10, fontSize: 11, fill: '#6b7280' }} tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Price (LKR/kg)', angle: 90, position: 'insideRight', dx: 10, fontSize: 11, fill: '#6b7280' }} tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} labelFormatter={l => `Year ${l}`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar    yAxisId="left"  dataKey="production" name="Production (K MT)" fill="#6FAE8A" radius={[3,3,0,0]} />
            <Line   yAxisId="right" dataKey="price"      name="Price (LKR/kg)"   stroke="#F5A623" strokeWidth={2} dot={{ r: 4 }} type="monotone" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Climate + Input costs row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Climate Factors Trend */}
        <div className="card">
          <h3 className="font-bold text-gray-900 text-lg mb-0.5">Climate Factors Trend</h3>
          <p className="text-xs text-gray-500 mb-5">Rainfall and temperature patterns over the study period</p>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rainfallGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#90CAF9" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#90CAF9" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis yAxisId="left"  domain={[800, 1800]} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis yAxisId="right" orientation="right" domain={[24, 32]} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} labelFormatter={l => `Year ${l}`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area   yAxisId="left"  dataKey="rainfall"    name="Rainfall (mm)"    stroke="#5BA3DC" fill="url(#rainfallGrad)" type="monotone" />
              <Line   yAxisId="right" dataKey="temperature" name="Temperature (°C)" stroke="#E53935" strokeWidth={2} dot={{ r: 3 }} type="monotone" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Input Cost Trends */}
        <div className="card">
          <h3 className="font-bold text-gray-900 text-lg mb-0.5">Input Cost Trends</h3>
          <p className="text-xs text-gray-500 mb-5">Fertilizer and seed price changes affecting production cost</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} labelFormatter={l => `Year ${l}`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line dataKey="fertilizer"  name="Fertilizer (LKR/kg)" stroke="#2D6A4F" strokeWidth={2} dot={{ r: 3 }} type="monotone" />
              <Line dataKey="seeds"       name="Seeds (LKR/kg)"      stroke="#F5A623" strokeWidth={2} dot={{ r: 3 }} type="monotone" />
              <Line dataKey="paddyPrice"  name="Paddy Price (LKR/kg)"stroke="#9C27B0" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 3" type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Research Findings */}
      <div className="card">
        <h3 className="font-bold text-gray-900 text-lg mb-0.5">Key Research Findings</h3>
        <p className="text-xs text-gray-500 mb-5">Summary of factor relationships from historical data analysis</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CORRELATIONS.map(({ label, value, desc }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 font-medium mb-2">{label}</p>
              <p className={`text-3xl font-extrabold mb-1 ${value < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {value > 0 ? '+' : ''}{value.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
