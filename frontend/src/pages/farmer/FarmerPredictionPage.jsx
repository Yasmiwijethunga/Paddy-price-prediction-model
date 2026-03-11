import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { predictionService } from '../../services/predictionService'
import { analysisService } from '../../services/analysisService'
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react'

// Default payload matching PredictionPage defaults
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

export default function FarmerPredictionPage() {
  const { t } = useTranslation()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPrice, setCurrentPrice] = useState(null)

  useEffect(() => {
    Promise.all([
      predictionService.myHistory(),
      analysisService.getTrends(),
    ]).then(([hist, trends]) => {
      if (hist && hist.length > 0) setHistory(hist.slice(0, 3))
      if (trends && trends.length > 0) {
        setCurrentPrice(trends[trends.length - 1]?.paddy_price)
      }
    }).catch(console.error)
  }, [])

  const handlePredict = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await predictionService.run(DEFAULT_PAYLOAD)
      setResult(res)
      // refresh history
      const hist = await predictionService.myHistory()
      if (hist) setHistory(hist.slice(0, 3))
    } catch {
      setError(t('prediction.error'))
    } finally {
      setLoading(false)
    }
  }

  const predicted = result?.predicted_price ?? history[0]?.predicted_price
  const confidence = result?.confidence_score ?? history[0]?.confidence_score

  // Trend vs current price
  let TrendIcon = Minus
  let trendColor = 'text-yellow-600'
  if (predicted && currentPrice) {
    if (predicted > currentPrice) { TrendIcon = TrendingUp;   trendColor = 'text-green-600' }
    if (predicted < currentPrice) { TrendIcon = TrendingDown; trendColor = 'text-red-500' }
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{t('prediction.title')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t('prediction.subtitle')}</p>
      </div>

      {/* Big predict button */}
      <button
        onClick={handlePredict}
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700
          disabled:opacity-60 disabled:cursor-not-allowed
          text-white font-bold text-lg py-5 rounded-2xl shadow-lg shadow-amber-200
          flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
      >
        {loading ? (
          <>
            <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            {t('prediction.loading')}
          </>
        ) : (
          <>
            <Sparkles size={24} />
            {t('prediction.runButton')}
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Result card */}
      {predicted && (
        <div className="bg-gradient-to-br from-[#1a2e1e] to-[#2d5a38] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/70 text-sm">{t('prediction.result')}</p>
            <TrendIcon size={22} className={trendColor} />
          </div>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-6xl font-extrabold text-amber-400">
              {Number(predicted).toFixed(0)}
            </span>
            <span className="text-white/70 text-lg pb-1">Rs / kg</span>
          </div>
          {confidence && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white/60 text-xs">{t('prediction.confidence')}</p>
                <p className="text-white/80 text-xs font-semibold">{(confidence * 100).toFixed(1)}%</p>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(confidence * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
          {currentPrice && (
            <p className="text-white/40 text-xs mt-3">
              Current: Rs. {Number(currentPrice).toFixed(0)} / kg
            </p>
          )}
        </div>
      )}

      {/* Recent history */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-700 text-sm">Recent Predictions</p>
          </div>
          {history.map((item, i) => (
            <div
              key={item.id ?? i}
              className={`flex items-center justify-between px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div>
                <p className="text-xs text-gray-400">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : `Prediction ${i + 1}`}
                </p>
                {item.confidence_score && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {(item.confidence_score * 100).toFixed(1)}% confidence
                  </p>
                )}
              </div>
              <span className="font-bold text-amber-600 text-base">
                Rs. {Number(item.predicted_price).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
