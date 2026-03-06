import { useEffect, useState } from 'react'
import { predictionService } from '../services/predictionService'
import { Eye } from 'lucide-react'

const CONFIDENCE_COLOR = (c) => {
  if (c >= 80) return 'bg-green-100 text-green-700'
  if (c >= 60) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

export default function PredictionHistoryPage() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [selected, setSelected]       = useState(null)

  useEffect(() => {
    predictionService.myHistory()
      .then(data  => setPredictions(Array.isArray(data) ? data : []))
      .catch(()   => setPredictions([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Prediction History</h1>
        <p className="text-sm text-gray-500 mt-0.5">All your past paddy price predictions</p>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : predictions.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium mb-1">No predictions yet</p>
            <p className="text-sm">Run a prediction from the Prediction page to see results here.</p>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['#', 'Target Year', 'Predicted Price', 'Method', 'Date', 'Confidence', 'Notes', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {predictions.map((p, i) => {
                const conf = p.confidence_score ? Math.round(p.confidence_score) : null
                return (
                  <tr key={p.id ?? i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-400">{i + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{p.target_year}</td>
                    <td className="py-3 px-4 font-semibold text-primary-700">
                      LKR {p.predicted_price?.toFixed(2) ?? '—'} /kg
                    </td>
                    <td className="py-3 px-4 text-gray-600">{p.method || 'ML Model'}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td className="py-3 px-4">
                      {conf !== null ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${CONFIDENCE_COLOR(conf)}`}>
                          {conf}%
                        </span>
                      ) : '—'}
                    </td>
                    <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{p.notes || '—'}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelected(p)}
                        className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
             onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
               onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 text-xl mb-4">Prediction Details</h3>
            <dl className="space-y-3 text-sm">
              {[
                ['Target Year',     selected.target_year],
                ['Predicted Price', `LKR ${selected.predicted_price?.toFixed(2)} /kg`],
                ['Method',          selected.method || 'ML Model'],
                ['Confidence',      selected.confidence_score ? `${Math.round(selected.confidence_score)}%` : '—'],
                ['Date',            selected.created_at ? new Date(selected.created_at).toLocaleString('en-GB') : '—'],
                ['Notes',           selected.notes || 'No notes'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-gray-500 shrink-0">{k}</dt>
                  <dd className="font-medium text-gray-900 text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
