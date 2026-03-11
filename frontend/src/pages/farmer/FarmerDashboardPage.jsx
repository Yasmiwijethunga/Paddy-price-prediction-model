import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { analysisService } from '../../services/analysisService'
import { predictionService } from '../../services/predictionService'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Lightbulb, CloudRain, Thermometer } from 'lucide-react'

// Utility: derive advice based on trend
function getAdvice(trends, t) {
  if (!trends || trends.length < 2) return { key: 'stable', icon: Minus, color: 'yellow' }
  const last = trends[trends.length - 1]?.paddy_price
  const prev = trends[trends.length - 2]?.paddy_price
  if (!last || !prev) return { key: 'stable', icon: Minus, color: 'yellow' }
  const delta = last - prev
  if (delta > 1) return { key: 'increase', icon: TrendingUp, color: 'green' }
  if (delta < -1) return { key: 'decrease', icon: TrendingDown, color: 'red' }
  return { key: 'stable', icon: Minus, color: 'yellow' }
}

const ADVICE_STYLES = {
  green:  { bg: 'bg-green-50',  border: 'border-green-200', icon: 'text-green-600', title: 'text-green-800', text: 'text-green-700' },
  red:    { bg: 'bg-red-50',    border: 'border-red-200',   icon: 'text-red-600',   title: 'text-red-800',   text: 'text-red-700' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200',icon: 'text-yellow-600',title: 'text-yellow-800',text: 'text-yellow-700' },
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-2 text-sm">
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="font-bold text-amber-600 text-base">Rs. {payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function FarmerDashboardPage() {
  const { t } = useTranslation()
  const [trends, setTrends] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      analysisService.getTrends(),
      predictionService.myHistory(),
    ]).then(([t, p]) => {
      setTrends(t || [])
      if (p && p.length > 0) setPrediction(p[0])
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const last6 = trends.slice(-6).map(item => ({
    name: item.year ? String(item.year) : '',
    price: item.paddy_price ?? 0,
  }))

  const currentPrice = trends.length > 0 ? trends[trends.length - 1]?.paddy_price : null
  const lastClimate  = trends.length > 0 ? trends[trends.length - 1] : null
  const advice = getAdvice(trends, t)
  const adviceStyle = ADVICE_STYLES[advice.color]
  const AdviceIcon = advice.icon

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

      {/* District badge */}
      <div className="text-center pt-1">
        <span className="inline-flex items-center gap-1.5 bg-[#1a2e1e]/10 text-[#1a2e1e] text-xs font-semibold px-3 py-1 rounded-full">
          {t('common.district')} · {t('common.season')}
        </span>
      </div>

      {/* Current Price Card */}
      <div className="bg-gradient-to-br from-[#1a2e1e] to-[#2d5a38] rounded-2xl p-5 text-white shadow-lg">
        <p className="text-white/70 text-sm font-medium mb-1">{t('price.currentTitle')}</p>
        <div className="flex items-end gap-2">
          {currentPrice ? (
            <>
              <span className="text-5xl font-extrabold text-amber-400">
                {Number(currentPrice).toFixed(0)}
              </span>
              <span className="text-white/70 text-lg pb-1">{t('price.unit')}</span>
            </>
          ) : (
            <span className="text-3xl font-bold text-white/50">—</span>
          )}
        </div>
        <p className="text-white/50 text-xs mt-2">{t('price.variety')}</p>
      </div>

      {/* Predicted Price Card */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg">
        <p className="text-white/80 text-sm font-medium mb-1">{t('price.predictedTitle')}</p>
        <div className="flex items-end gap-2">
          {prediction?.predicted_price ? (
            <>
              <span className="text-5xl font-extrabold">
                {Number(prediction.predicted_price).toFixed(0)}
              </span>
              <span className="text-white/80 text-lg pb-1">{t('price.unit')}</span>
            </>
          ) : (
            <span className="text-2xl font-semibold text-white/60">
              {t('prediction.runButton')} →
            </span>
          )}
        </div>
        <p className="text-white/70 text-xs mt-2">{t('price.predictedSub')}</p>
      </div>

      {/* Price Trend Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="mb-3">
          <p className="font-bold text-gray-800">{t('chart.title')}</p>
          <p className="text-xs text-gray-500">{t('chart.subtitle')}</p>
        </div>
        {last6.length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={last6} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fill="url(#priceGrad)"
                dot={{ fill: '#f59e0b', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#d97706' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 text-sm py-6">{t('chart.noData')}</p>
        )}
      </div>

      {/* Advice Card */}
      <div className={`rounded-2xl p-4 border ${adviceStyle.bg} ${adviceStyle.border} shadow-sm`}>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={18} className={adviceStyle.icon} />
          <p className={`font-bold text-sm ${adviceStyle.title}`}>{t('advice.title')}</p>
        </div>
        <p className={`text-sm font-medium leading-relaxed ${adviceStyle.text}`}>
          {t(`advice.${advice.key}`)}
        </p>
        {advice.key !== 'stable' && (
          <p className={`text-xs mt-1.5 ${adviceStyle.text} opacity-80`}>
            {t(`advice.${advice.key}Action`)}
          </p>
        )}
      </div>

      {/* Weather Summary (optional) */}
      {lastClimate && (lastClimate.rainfall || lastClimate.temperature) && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="font-bold text-gray-800 text-sm mb-3">{t('weather.title')}</p>
          <div className="grid grid-cols-2 gap-3">
            {lastClimate.rainfall && (
              <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CloudRain size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('weather.rainfall')}</p>
                  <p className="font-bold text-gray-800">{lastClimate.rainfall} <span className="text-xs font-normal text-gray-500">{t('weather.unit_rain')}</span></p>
                </div>
              </div>
            )}
            {lastClimate.temperature && (
              <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
                <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Thermometer size={18} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('weather.temperature')}</p>
                  <p className="font-bold text-gray-800">{lastClimate.temperature} <span className="text-xs font-normal text-gray-500">{t('weather.unit_temp')}</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
