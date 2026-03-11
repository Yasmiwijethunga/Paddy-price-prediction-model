import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { predictionService } from '../../services/predictionService'
import { analysisService } from '../../services/analysisService'
import { Sparkles, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react'

const DEFAULT_PAYLOAD = {
  target_year: new Date().getFullYear() + 1,
  total_production: 350000,
  cultivated_area: 88000,
  harvest_quantity: 340000,
  rainfall: 1250,
  temperature: 27.5,
  fertilizer_price: 120,
  seed_cost: 160,
  pesticide_cost: 2100,
  rice_consumption: 114,
  population: 935000,
}

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

export default function FarmerPredictionPage() {
  const { t } = useTranslation()
  const [result, setResult]       = useState(null)
  const [history, setHistory]     = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [currentPrice, setCurrentPrice] = useState(null)

  useEffect(() => {
    Promise.all([
      predictionService.myHistory(),
      analysisService.getTrends(),
    ]).then(([hist, trends]) => {
      if (hist && hist.length > 0) setHistory(hist.slice(0, 4))
      if (trends && trends.length > 0) setCurrentPrice(trends[trends.length - 1]?.paddy_price)
    }).catch(console.error)
  }, [])

  const handlePredict = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await predictionService.run(DEFAULT_PAYLOAD)
      setResult(res)
      const hist = await predictionService.myHistory()
      if (hist) setHistory(hist.slice(0, 4))
    } catch {
      setError(t('prediction.error'))
    } finally {
      setLoading(false)
    }
  }

  const predicted  = result?.predicted_price ?? history[0]?.predicted_price
  const confidence = result?.confidence_score ?? history[0]?.confidence_score
  const animPred   = useCountUp(predicted ? Math.round(predicted) : 0)

  let TrendIcon  = Minus
  let trendColor = 'text-yellow-500'
  let trendBg    = 'bg-yellow-50'
  if (predicted && currentPrice) {
    if (predicted > currentPrice) { TrendIcon = TrendingUp;   trendColor = 'text-green-600'; trendBg = 'bg-green-50' }
    if (predicted < currentPrice) { TrendIcon = TrendingDown; trendColor = 'text-red-500';   trendBg = 'bg-red-50' }
  }

  const confidencePct = confidence ? Math.min(confidence * 100, 100) : null
  const confColor = confidencePct
    ? confidencePct >= 80 ? '#22c55e' : confidencePct >= 60 ? '#f59e0b' : '#ef4444'
    : '#f59e0b'

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Sparkles size={24} className="text-amber-500" />
          {t('prediction.title')}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">{t('prediction.subtitle')}</p>
      </div>

      <button
        onClick={handlePredict}
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600
          hover:from-amber-600 hover:to-amber-700
          disabled:opacity-60 disabled:cursor-not-allowed
          text-white font-bold text-lg py-5 rounded-2xl
          shadow-[0px_6px_20px_rgba(245,158,11,0.35)]
          flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
      >
        {loading ? (
          <>
            <span className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
            {t('prediction.loading')}
          </>
        ) : (
          <>
            <Sparkles size={24} />
            {t('prediction.runButton')}
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm">{error}</div>
      )}

      {predicted && (
        <div className="bg-gradient-to-br from-[#1a2e1e] to-[#2d5a38] rounded-2xl p-6 text-white shadow-[0px_8px_24px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/65 text-xs font-semibold uppercase tracking-wider">{t('prediction.result')}</p>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${trendBg} ${trendColor}`}>
              <TrendIcon size={13} />
              <span>
                {predicted && currentPrice
                  ? `${predicted > currentPrice ? '+' : ''}${(predicted - currentPrice).toFixed(0)} ${t('prediction.vsLabel')} ${t('price.currentTitle')}`
                  : ''}
              </span>
            </div>
          </div>

          <div className="flex items-end gap-2 mb-4">
            <span className="text-6xl font-extrabold text-amber-400 tabular-nums">{animPred.toLocaleString()}</span>
            <span className="text-white/65 text-lg pb-1.5">{t('price.unit')}</span>
          </div>

          {confidencePct !== null && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-white/60 text-xs">{t('prediction.confidence')}</p>
                <p className="text-white text-xs font-bold">{confidencePct.toFixed(1)}%</p>
              </div>
              <div className="h-3 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${confidencePct}%`, backgroundColor: confColor }}
                />
              </div>
              <p className="text-white/35 text-[10px] mt-1">
                {confidencePct >= 80 ? t('prediction.highConf') : confidencePct >= 60 ? t('prediction.modConf') : t('prediction.lowConf')}
              </p>
            </div>
          )}

          {currentPrice && (
            <p className="text-white/35 text-xs mt-3 pt-3 border-t border-white/10">
              {t('price.currentShort')}: Rs. {Number(currentPrice).toLocaleString()} / kg
            </p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Clock size={15} className="text-gray-400" />
            <p className="font-semibold text-gray-700 text-sm">{t('prediction.recentTitle')}</p>
          </div>
          {history.map((item, i) => {
            const conf = item.confidence_score ? (item.confidence_score * 100).toFixed(1) : null
            return (
              <div
                key={item.id ?? i}
                className={`flex items-center justify-between px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}
              >
                <div>
                  <p className="text-xs text-gray-400">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : t('prediction.item', { n: i + 1 })}
                  </p>
                  {conf && <p className="text-[10px] text-gray-300 mt-0.5">{conf}% {t('prediction.confPct')}</p>}
                </div>
                <span className="font-extrabold text-amber-600">Rs. {Number(item.predicted_price).toLocaleString()}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
