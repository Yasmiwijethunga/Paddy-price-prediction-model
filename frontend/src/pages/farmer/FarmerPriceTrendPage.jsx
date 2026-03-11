import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { analysisService } from '../../services/analysisService'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="text-gray-500 text-xs mb-1">{label}</p>
        <p className="font-bold text-amber-600 text-xl">Rs. {payload[0].value}</p>
        <p className="text-gray-400 text-xs">per kg</p>
      </div>
    )
  }
  return null
}

export default function FarmerPriceTrendPage() {
  const { t } = useTranslation()
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analysisService.getTrends()
      .then(data => setTrends(data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const last6 = trends.slice(-6).map(item => ({
    name: item.year ? String(item.year) : '',
    price: item.paddy_price ?? 0,
  }))

  const prices = last6.map(d => d.price).filter(Boolean)
  const maxP = prices.length ? Math.max(...prices) : 0
  const minP = prices.length ? Math.min(...prices) : 0
  const avgP = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(0) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{t('chart.title')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t('chart.subtitle')}</p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Highest', valueKey: maxP, color: 'text-green-600 bg-green-50 border-green-100' },
          { label: 'Average', valueKey: avgP, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Lowest',  valueKey: minP, color: 'text-red-500 bg-red-50 border-red-100' },
        ].map(({ label, valueKey, color }) => (
          <div key={label} className={`rounded-2xl border p-3 text-center ${color.split(' ').slice(1).join(' ')}`}>
            <p className={`text-xl font-extrabold ${color.split(' ')[0]}`}>
              {valueKey ? `Rs.${valueKey}` : '—'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        {last6.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={last6} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradFull" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              {avgP > 0 && (
                <ReferenceLine
                  y={Number(avgP)}
                  stroke="#d97706"
                  strokeDasharray="5 5"
                  label={{ value: `Avg Rs.${avgP}`, position: 'insideTopRight', fontSize: 10, fill: '#d97706' }}
                />
              )}
              <Area
                type="monotone"
                dataKey="price"
                stroke="#f59e0b"
                strokeWidth={3}
                fill="url(#priceGradFull)"
                dot={{ fill: '#f59e0b', r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7, fill: '#d97706', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 text-sm py-10">{t('chart.noData')}</p>
        )}
      </div>

      {/* Data table — simple */}
      {last6.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-700 text-sm">Year-by-Year Prices</p>
          </div>
          {[...last6].reverse().map((item, i) => (
            <div
              key={item.name}
              className={`flex items-center justify-between px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <span className="text-gray-600 text-sm font-medium">{item.name}</span>
              <span className="font-bold text-gray-800">Rs. {item.price} <span className="text-xs font-normal text-gray-400">/ kg</span></span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
