import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { analysisService } from '../../services/analysisService'
import { predictionService } from '../../services/predictionService'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, TrendingDown, Minus, Lightbulb,
  CloudRain, Thermometer, BarChart2,
  CheckCircle, AlertTriangle, XCircle, ChevronDown, Calculator,
  Calendar, Sprout
} from 'lucide-react'

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    if (!target) { setVal(0); return }
    const start = performance.now()
    const diff = target
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(diff * e))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])
  return val
}

function getSignal(trends) {
  if (!trends || trends.length < 2) return 'wait'
  const last = trends[trends.length - 1]?.paddy_price
  const prev = trends[trends.length - 2]?.paddy_price
  if (!last || !prev) return 'wait'
  const pct = ((last - prev) / prev) * 100
  if (pct > 3) return 'good'
  if (pct < -3) return 'risk'
  return 'wait'
}

const SIGNAL_CONFIG = {
  good: { dot: 'bg-green-500', bg: 'bg-green-50 border-green-200', text: 'text-green-700', Icon: CheckCircle, iconColor: 'text-green-600' },
  wait: { dot: 'bg-yellow-400', bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', Icon: AlertTriangle, iconColor: 'text-yellow-600' },
  risk: { dot: 'bg-red-500', bg: 'bg-red-50 border-red-200', text: 'text-red-700', Icon: XCircle, iconColor: 'text-red-500' },
}

const ADVICE_STYLES = {
  increase: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', title: 'text-green-800', text: 'text-green-700' },
  decrease: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', title: 'text-red-800', text: 'text-red-700' },
  stable:   { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: 'text-yellow-600', title: 'text-yellow-800', text: 'text-yellow-700' },
}

function getAdviceKey(trends) {
  if (!trends || trends.length < 2) return 'stable'
  const last = trends[trends.length - 1]?.paddy_price
  const prev = trends[trends.length - 2]?.paddy_price
  if (!last || !prev) return 'stable'
  const delta = last - prev
  if (delta > 1) return 'increase'
  if (delta < -1) return 'decrease'
  return 'stable'
}

const VARIETIES = ['Nadu', 'Samba', 'Kekulu']

function PaddySVG({ className = '' }) {
  return (
    <svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <line x1="50" y1="128" x2="50" y2="45" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="28" y1="128" x2="28" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="72" y1="128" x2="72" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="14" y1="128" x2="14" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="86" y1="128" x2="86" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="50" cy="37" rx="5" ry="9" fill="#fbbf24" opacity="0.9"/>
      <ellipse cx="44" cy="44" rx="4" ry="7.5" fill="#fbbf24" opacity="0.85" transform="rotate(-22 44 44)"/>
      <ellipse cx="56" cy="44" rx="4" ry="7.5" fill="#fbbf24" opacity="0.85" transform="rotate(22 56 44)"/>
      <ellipse cx="47" cy="52" rx="3.5" ry="6.5" fill="#fbbf24" opacity="0.75" transform="rotate(-12 47 52)"/>
      <ellipse cx="53" cy="52" rx="3.5" ry="6.5" fill="#fbbf24" opacity="0.75" transform="rotate(12 53 52)"/>
      <ellipse cx="28" cy="54" rx="3.5" ry="7" fill="#fbbf24" opacity="0.75"/>
      <ellipse cx="23" cy="61" rx="3" ry="5.5" fill="#fbbf24" opacity="0.65" transform="rotate(-18 23 61)"/>
      <ellipse cx="33" cy="61" rx="3" ry="5.5" fill="#fbbf24" opacity="0.65" transform="rotate(18 33 61)"/>
      <ellipse cx="72" cy="54" rx="3.5" ry="7" fill="#fbbf24" opacity="0.75"/>
      <ellipse cx="67" cy="61" rx="3" ry="5.5" fill="#fbbf24" opacity="0.65" transform="rotate(-18 67 61)"/>
      <ellipse cx="77" cy="61" rx="3" ry="5.5" fill="#fbbf24" opacity="0.65" transform="rotate(18 77 61)"/>
      <ellipse cx="14" cy="72" rx="2.5" ry="5" fill="#fbbf24" opacity="0.5"/>
      <ellipse cx="10" cy="78" rx="2" ry="4" fill="#fbbf24" opacity="0.4" transform="rotate(-20 10 78)"/>
      <ellipse cx="18" cy="78" rx="2" ry="4" fill="#fbbf24" opacity="0.4" transform="rotate(20 18 78)"/>
      <ellipse cx="86" cy="72" rx="2.5" ry="5" fill="#fbbf24" opacity="0.5"/>
      <ellipse cx="82" cy="78" rx="2" ry="4" fill="#fbbf24" opacity="0.4" transform="rotate(-20 82 78)"/>
      <ellipse cx="90" cy="78" rx="2" ry="4" fill="#fbbf24" opacity="0.4" transform="rotate(20 90 78)"/>
      <path d="M50 85 Q32 70 20 65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M50 72 Q68 57 80 52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M28 96 Q14 84 7 79" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M72 96 Q86 84 93 79" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  )
}

function getGreetingKey() {
  const h = new Date().getHours()
  if (h < 12) return 'greeting.morning'
  if (h < 17) return 'greeting.afternoon'
  if (h < 21) return 'greeting.evening'
  return 'greeting.night'
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-2 text-sm">
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="font-bold text-amber-600 text-base">Rs. {payload[0].value?.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function FarmerDashboardPage() {
  const { t } = useTranslation()
  const [trends, setTrends]           = useState([])
  const [prediction, setPrediction]   = useState(null)
  const [loading, setLoading]         = useState(true)
  const [variety, setVariety]         = useState('Nadu')
  const [quantity, setQuantity]       = useState(1000)
  const [showVariety, setShowVariety] = useState(false)

  useEffect(() => {
    Promise.all([
      analysisService.getTrends(),
      predictionService.myHistory(),
    ]).then(([tr, p]) => {
      setTrends(tr || [])
      if (p && p.length > 0) setPrediction(p[0])
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const last6 = trends.slice(-6).map(item => ({
    name: item.year ? String(item.year) : '',
    price: item.paddy_price ?? 0,
  }))

  const currentPrice   = trends.length ? trends[trends.length - 1]?.paddy_price : null
  const prevPrice      = trends.length > 1 ? trends[trends.length - 2]?.paddy_price : null
  const priceChange    = currentPrice && prevPrice ? +(currentPrice - prevPrice).toFixed(0) : null
  const lastYear       = trends.length ? trends[trends.length - 1]?.year : null
  const lastClimate    = trends.length ? trends[trends.length - 1] : null
  const predictedPrice = prediction?.predicted_price
  const confidence     = prediction?.confidence_score

  const signal      = getSignal(trends)
  const adviceKey   = getAdviceKey(trends)
  const signalCfg   = SIGNAL_CONFIG[signal]
  const adviceStyle = ADVICE_STYLES[adviceKey]
  const SignalIcon  = signalCfg.Icon

  const estimatedIncome = predictedPrice ? Math.round(predictedPrice * quantity) : null

  const animCurrent   = useCountUp(currentPrice ? Math.round(currentPrice) : 0)
  const animPredicted = useCountUp(predictedPrice ? Math.round(predictedPrice) : 0)

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
    <div className="space-y-4 dash-stagger">

      {/* Variety selector */}
      {/* <div className="relative">
        <button
          onClick={() => setShowVariety(v => !v)}
          className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{t('variety.label')}</span>
            <span className="text-sm font-bold text-gray-800">{variety}</span>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${showVariety ? 'rotate-180' : ''}`} />
        </button>
        {showVariety && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden">
            {VARIETIES.map(v => (
              <button
                key={v}
                onClick={() => { setVariety(v); setShowVariety(false) }}
                className={`w-full text-left px-5 py-3 text-sm font-medium hover:bg-amber-50 transition-colors
                  ${v === variety ? 'text-amber-600 font-bold bg-amber-50' : 'text-gray-700'}`}
              >
                {t(`variety.${v.toLowerCase()}`, v)}
              </button>
            ))}
          </div>
        )}
      </div> */}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2e1e] via-[#2a5535] to-[#163022] p-5 text-white shadow-[0px_8px_28px_rgba(0,0,0,0.22)]">
        <div className="absolute top-0 right-4 w-44 h-44 bg-white/5 rounded-full -translate-y-16 animate-float-orb pointer-events-none" />
        <div className="absolute bottom-0 left-4 w-28 h-28 bg-amber-400/10 rounded-full translate-y-10 animate-float-orb pointer-events-none" style={{ animationDelay: '2.2s' }} />
        <div className="absolute bottom-0 right-0 pointer-events-none opacity-[0.22] text-white">
          <PaddySVG className="w-36 h-40" />
        </div>
        <div className="relative z-10">
          <p className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.18em]">{t(getGreetingKey())}</p>
          <h2 className="text-xl font-extrabold mt-1 leading-snug">{t('nav.appName')}</h2>
          <p className="text-white/50 text-xs mt-0.5">{t('nav.appSub')}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
              <Calendar size={10} className="text-white/60" />
              <span className="text-white/70 text-[10px]">
                {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-400/20 rounded-full px-3 py-1">
              <Sprout size={10} className="text-amber-400" />
              <span className="text-amber-300 text-[10px] font-semibold">{t('common.season')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Signal Banner */}
      <div className={`rounded-2xl border px-4 py-3 flex items-center gap-3 shadow-sm ${signalCfg.bg}`}>
        <div className={`w-3 h-3 rounded-full ${signalCfg.dot} animate-pulse flex-shrink-0`} />
        <SignalIcon size={20} className={`${signalCfg.iconColor} flex-shrink-0`} />
        <div>
          <p className={`text-[18px] font-semibold uppercase tracking-widest ${signalCfg.text} opacity-70`}>
            {t('signal.title')}
          </p>
          <p className={`text-sm font-extrabold ${signalCfg.text}`}>
            {t(`signal.${signal}`)}
          </p>
        </div>
      </div>

      {/* Current Price Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a2e1e] to-[#2d5a38] rounded-2xl p-5 text-white shadow-[0px_6px_20px_rgba(0,0,0,0.15)]">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -translate-y-12 translate-x-12 animate-float-orb pointer-events-none" />
        <div className="absolute -bottom-4 right-14 w-16 h-16 bg-amber-400/10 rounded-full animate-float-orb pointer-events-none" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-0 right-2 pointer-events-none opacity-[0.07] text-white">
          <PaddySVG className="w-14 h-18" />
        </div>
        <p className="text-white/65 text-xs font-semibold uppercase tracking-wider mb-2">{t('price.currentTitle')}</p>
        <div className="flex items-end gap-2 mb-1">
          <span className="text-5xl md:text-6xl font-extrabold text-amber-400 tabular-nums">
            {currentPrice ? animCurrent.toLocaleString() : '—'}
          </span>
          <span className="text-white/60 text-base pb-1.5">{t('price.unit')}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-white/40 text-xs">{t('variety.nadu')} · {t('common.district')}</p>
          {priceChange !== null && (
            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full
              ${priceChange > 0 ? 'bg-green-500/20 text-green-400' : priceChange < 0 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/50'}`}>
              {priceChange > 0 ? <TrendingUp size={11} /> : priceChange < 0 ? <TrendingDown size={11} /> : <Minus size={11} />}
              {priceChange > 0 ? '+' : ''}{priceChange} {t('price.change')}
            </span>
          )}
        </div>
        {lastYear && (
          <p className="text-white/30 text-[10px] mt-2">{t('price.lastUpdated')}: {lastYear} {t('common.season')}</p>
        )}
      </div>

      {/* Predicted Price Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-[0px_6px_20px_rgba(245,158,11,0.3)]">
        <div className="absolute inset-y-0 w-20 bg-white/10 animate-shimmer-sweep pointer-events-none" />
        <div className="absolute top-2 right-2 w-28 h-28 bg-white/5 rounded-full animate-float-orb pointer-events-none" style={{ animationDelay: '1s' }} />
        <p className="text-white/75 text-xs font-semibold uppercase tracking-wider mb-2">{t('price.predictedTitle')}</p>
        <div className="flex items-end gap-2 mb-2">
          {predictedPrice ? (
            <>
              <span className="text-5xl md:text-6xl font-extrabold tabular-nums">{animPredicted.toLocaleString()}</span>
              <span className="text-white/75 text-base pb-1.5">{t('price.unit')}</span>
            </>
          ) : (
            <span className="text-xl font-semibold text-white/60">—</span>
          )}
        </div>
        {confidence && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/70 text-xs">{t('prediction.confidence')}</p>
              <p className="text-white text-xs font-bold">{(confidence * 100).toFixed(1)}%</p>
            </div>
            <div className="h-2 bg-white/25 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${Math.min(confidence * 100, 100)}%` }} />
            </div>
          </div>
        )}
        <p className="text-white/55 text-[10px] mt-2">{t('price.predictedSub')}</p>
      </div>

      {/* Price Trend Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-[0px_4px_16px_rgba(0,0,0,0.07)] border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 size={16} className="text-amber-500" />
          <div>
            <p className="font-bold text-gray-800 text-sm">{t('chart.title')}</p>
            <p className="text-xs text-gray-400">{t('chart.subtitle')}</p>
          </div>
        </div>
        {last6.length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={last6} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="price"
                stroke="#f59e0b" strokeWidth={2.5}
                fill="url(#priceGradDash)"
                dot={{ fill: '#f59e0b', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#d97706', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 text-sm py-6">{t('chart.noData')}</p>
        )}
      </div>

      {/* Advice Card */}
      <div className={`rounded-2xl p-4 border shadow-sm ${adviceStyle.bg} ${adviceStyle.border}`}>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={18} className={adviceStyle.icon} />
          <p className={`font-bold text-sm ${adviceStyle.title}`}>{t('advice.title')}</p>
        </div>
        <p className={`text-sm font-medium leading-relaxed ${adviceStyle.text}`}>{t(`advice.${adviceKey}`)}</p>
        {adviceKey !== 'stable' && (
          <p className={`text-xs mt-1.5 ${adviceStyle.text} opacity-80`}>{t(`advice.${adviceKey}Action`)}</p>
        )}
      </div>

      {/* Profit Estimator */}
      <div className="bg-white rounded-2xl p-4 shadow-[0px_4px_16px_rgba(0,0,0,0.07)] border border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <Calculator size={18} className="text-[#1a2e1e]" />
          <p className="font-bold text-gray-800">{t('profit.title')}</p>
        </div>
        <p className="text-xs text-gray-500 mb-3">{t('profit.subtitle')}</p>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t('profit.inputLabel')}</label>
        <input
          type="number" min={1} step={100} value={quantity}
          onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 mb-3"
          placeholder={t('profit.inputPlaceholder')}
        />
        {estimatedIncome ? (
          <div className="bg-[#1a2e1e]/5 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500 mb-0.5">{t('profit.result')}</p>
            <p className="text-2xl font-extrabold text-[#1a2e1e]">Rs. {estimatedIncome.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{t('profit.basedOn')}: Rs.{Math.round(predictedPrice)} × {quantity.toLocaleString()} kg</p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-center">
            <p className="text-xs text-gray-400">{t('dashboard.noPrediction')}</p>
          </div>
        )}
      </div>

      {/* Weather Summary */}
      {lastClimate && (lastClimate.rainfall || lastClimate.temperature) && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
            <CloudRain size={16} className="text-blue-500" />
            {t('weather.title')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {lastClimate.rainfall && (
              <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CloudRain size={17} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('weather.rainfall')}</p>
                  <p className="font-bold text-gray-800 text-sm">{lastClimate.rainfall} <span className="text-xs font-normal text-gray-400">{t('weather.unit_rain')}</span></p>
                </div>
              </div>
            )}
            {lastClimate.temperature && (
              <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
                <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Thermometer size={17} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('weather.temperature')}</p>
                  <p className="font-bold text-gray-800 text-sm">{lastClimate.temperature} <span className="text-xs font-normal text-gray-400">{t('weather.unit_temp')}</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
