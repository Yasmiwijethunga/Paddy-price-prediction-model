import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { analysisService } from '../../services/analysisService'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import { BarChart2, TrendingUp, TrendingDown, Minus } from 'lucide-react'

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="text-gray-500 text-xs mb-1 font-semibold">{label}</p>
        <p className="font-bold text-amber-600 text-xl">Rs. {payload[0].value?.toLocaleString()}<span className="text-xs font-normal text-gray-400 ml-1">/ kg</span></p>
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
  const maxP   = prices.length ? Math.max(...prices) : 0
  const minP   = prices.length ? Math.min(...prices) : 0
  const avgP   = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0

  const tableData = [...last6].reverse().map((item, i, arr) => {
    const prev = arr[i + 1]
    const change = prev ? +(item.price - prev.price).toFixed(0) : null
    return { ...item, change }
  })

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
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <BarChart2 size={24} className="text-amber-500" />
          {t('chart.title')}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">{t('chart.subtitle')}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { labelKey: 'chart.highest', value: maxP, colorBg: 'bg-green-50 border-green-100', colorText: 'text-green-600', Icon: TrendingUp },
          { labelKey: 'chart.average', value: avgP, colorBg: 'bg-amber-50 border-amber-100', colorText: 'text-amber-600', Icon: Minus },
          { labelKey: 'chart.lowest',  value: minP, colorBg: 'bg-red-50 border-red-100',     colorText: 'text-red-500',   Icon: TrendingDown },
        ].map(({ labelKey, value, colorBg, colorText, Icon }) => (
          <div key={labelKey} className={`rounded-2xl border p-3 shadow-sm ${colorBg}`}>
            <Icon size={14} className={`${colorText} mb-1`} />
            <p className={`text-lg md:text-xl font-extrabold ${colorText}`}>
              {value ? `Rs.${value.toLocaleString()}` : '—'}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">{t(labelKey)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-[0px_4px_16px_rgba(0,0,0,0.07)] border border-gray-100">
        <p className="font-semibold text-gray-700 text-sm mb-3">{t('chart.title')} — {t('price.unit')}</p>
        {last6.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={last6} margin={{ top: 10, right: 8, left: -5, bottom: 0 }}>
              <defs>
                <linearGradient id="pgFull" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              {avgP > 0 && (
                <ReferenceLine
                  y={avgP} stroke="#d97706" strokeDasharray="5 4"
                  label={{ value: `${t('chart.avgLabel')} Rs.${avgP.toLocaleString()}`, position: 'insideTopRight', fontSize: 10, fill: '#d97706' }}
                />
              )}
              <Area
                type="monotone" dataKey="price" name={t('chart.actual')}
                stroke="#f59e0b" strokeWidth={3}
                fill="url(#pgFull)"
                dot={{ fill: '#f59e0b', r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7, fill: '#d97706', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 text-sm py-10">{t('chart.noData')}</p>
        )}
      </div>

      {tableData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-700 text-sm">{t('chart.yearByYear')}</p>
          </div>
          {tableData.map((item, i) => (
            <div
              key={item.name}
              className={`flex items-center justify-between px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}
            >
              <span className="text-gray-600 text-sm font-semibold">{item.name}</span>
              <div className="flex items-center gap-3">
                {item.change !== null && (
                  <span className={`flex items-center gap-0.5 text-xs font-bold
                    ${item.change > 0 ? 'text-green-600' : item.change < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    {item.change > 0 ? <TrendingUp size={11} /> : item.change < 0 ? <TrendingDown size={11} /> : <Minus size={11} />}
                    {item.change > 0 ? '+' : ''}{item.change}
                  </span>
                )}
                <span className="font-bold text-gray-800">
                  Rs. {item.price.toLocaleString()} <span className="text-xs font-normal text-gray-400">/ kg</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
