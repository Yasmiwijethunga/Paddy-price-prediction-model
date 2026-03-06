import { useEffect, useState } from 'react'
import { analysisService } from '../services/analysisService'
import { predictionService } from '../services/predictionService'
import StatCard from '../components/dashboard/StatCard'
import PriceTrendChart from '../components/dashboard/PriceTrendChart'
import ProductionConsumptionChart from '../components/dashboard/ProductionConsumptionChart'
import ModelPerformanceMetrics from '../components/dashboard/ModelPerformanceMetrics'
import FactorImpactAnalysis from '../components/dashboard/FactorImpactAnalysis'
import RecentPredictions from '../components/dashboard/RecentPredictions'
import {
  TrendingDown, Sprout, Users, Target,
  MapPin, Leaf, Calendar, TrendingUp
} from 'lucide-react'

export default function DashboardPage() {
  const [summary, setSummary]     = useState(null)
  const [trends, setTrends]       = useState([])
  const [predictions, setPredictions] = useState([])
  const [correlations, setCorrelations] = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      analysisService.getSummary(),
      analysisService.getTrends(),
      predictionService.myHistory(),
      analysisService.getCorrelations(),
    ]).then(([s, t, p, c]) => {
      setSummary(s)
      setTrends(t)
      setPredictions(p.slice(0, 4))
      setCorrelations(c)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const latestTrend = trends[trends.length - 1]
  const prevTrend   = trends[trends.length - 2]
  const priceDelta  = latestTrend && prevTrend
    ? (((latestTrend.paddy_price - prevTrend.paddy_price) / prevTrend.paddy_price) * 100).toFixed(1)
    : null

  const avgProduction = trends.length
    ? Math.round(trends.reduce((a, b) => a + (b.total_production || 0), 0) / trends.length / 1000)
    : 354

  const avgConsumption = trends.length
    ? Math.round(trends.reduce((a, b) => a + (b.rice_consumption || 0), 0) / trends.length / 1000)
    : 104

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Nadu Paddy Price Prediction &bull; Anuradhapura District &bull; Maha Season
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<TrendingDown size={22} className="text-primary-600" />}
          label="Current Farmgate Price"
          value={`Rs.${latestTrend?.paddy_price || summary?.avg_paddy_price?.toFixed(0) || '68'}`}
          unit="/kg"
          change={priceDelta !== null ? `${priceDelta > 0 ? '+' : ''}${priceDelta}%` : '-12.8%'}
          changeType={priceDelta > 0 ? 'up' : 'down'}
          subtitle="Latest recorded price (2024 Maha)"
        />
        <StatCard
          icon={<Sprout size={22} className="text-primary-600" />}
          label="Avg. Production"
          value={`${avgProduction}`}
          unit="K MT"
          subtitle="10-year average production volume"
        />
        <StatCard
          icon={<Users size={22} className="text-primary-600" />}
          label="Avg. Consumption"
          value={`${avgConsumption}`}
          unit="K MT"
          subtitle="Annual district consumption"
        />
        <StatCard
          icon={<Target size={22} className="text-primary-600" />}
          label="Model Accuracy"
          value="92.2"
          unit="%"
          subtitle="Prediction model performance"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { icon: <MapPin size={13} />, label: 'Anuradhapura District' },
          { icon: <Leaf size={13} />, label: 'Nadu Paddy Variety' },
          { icon: <Calendar size={13} />, label: 'Maha Season (Oct-Mar)' },
          { icon: <TrendingUp size={13} />, label: '2015-2024 Data Range' },
        ].map(({ icon, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
            {icon} {label}
          </span>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PriceTrendChart data={trends} />
        <ProductionConsumptionChart data={trends} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModelPerformanceMetrics />
        <FactorImpactAnalysis correlations={correlations} />
        <RecentPredictions predictions={predictions} />
      </div>
    </div>
  )
}
