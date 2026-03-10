import { useState, useEffect, useRef } from 'react'
import { FileText, Download, Printer, FileSpreadsheet, FilePlus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import api from '../services/api'

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ReportsPage() {
  const [summary, setSummary]       = useState(null)
  const [loadingSum, setLoadingSum] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [genReport, setGenReport]   = useState(null)
  const [exporting, setExporting]   = useState({})
  const [error, setError]           = useState('')
  const printRef = useRef()

  useEffect(() => {
    api.get('/records/export/summary')
      .then(r => setSummary(r.data))
      .catch(() => setSummary(null))
      .finally(() => setLoadingSum(false))
  }, [])

  const setExp = (key, val) => setExporting(p => ({ ...p, [key]: val }))

  const handleCSV = async () => {
    setExp('csv', true); setError('')
    try {
      const res = await api.get('/records/export/csv', { responseType: 'blob' })
      downloadBlob(new Blob([res.data], { type: 'text/csv' }), 'paddy_records.csv')
    } catch { setError('CSV export failed.') }
    finally { setExp('csv', false) }
  }

  const handleExcel = async () => {
    setExp('excel', true); setError('')
    try {
      const res = await api.get('/records/export/excel', { responseType: 'blob' })
      downloadBlob(
        new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        'paddy_records.xlsx'
      )
    } catch { setError('Excel export failed.') }
    finally { setExp('excel', false) }
  }

  const handlePrint = () => window.print()

  const handleGenerate = async () => {
    setGenerating(true); setGenReport(null); setError('')
    try {
      const [recRes, predRes] = await Promise.all([
        api.get('/records/?limit=500'),
        api.get('/predictions/history').catch(() => ({ data: [] })),
      ])
      const recs  = recRes.data
      const preds = predRes.data
      const priceRecs = recs.filter(r => r.paddy_price)
      const years = [...new Set(recs.map(r => r.year))].sort()
      setGenReport({
        generated: new Date().toLocaleString('en-GB'),
        records: recs.length,
        years,
        predictions: preds.length,
        avgPrice: priceRecs.length
          ? (priceRecs.reduce((s, r) => s + r.paddy_price, 0) / priceRecs.length).toFixed(2)
          : 'N/A',
        minPrice: priceRecs.length ? Math.min(...priceRecs.map(r => r.paddy_price)).toFixed(2) : 'N/A',
        maxPrice: priceRecs.length ? Math.max(...priceRecs.map(r => r.paddy_price)).toFixed(2) : 'N/A',
        latestPrice: priceRecs.length
          ? priceRecs.sort((a, b) => b.year - a.year)[0].paddy_price.toFixed(2)
          : 'N/A',
        avgProduction: recs.filter(r => r.total_production).length
          ? Math.round(recs.filter(r => r.total_production).reduce((s, r) => s + r.total_production, 0) /
              recs.filter(r => r.total_production).length).toLocaleString()
          : 'N/A',
      })
    } catch { setError('Failed to generate report.') }
    finally { setGenerating(false) }
  }

  const REPORT_ROWS = [
    {
      id: 1,
      title: 'Full Dataset Export',
      desc: 'All production, climate, cost and price records (CSV format).',
      date: summary ? new Date(summary.generated_at).toLocaleDateString('en-GB') : '—',
      status: 'Ready',
      action: handleCSV,
      loading: exporting.csv,
    },
    {
      id: 2,
      title: 'Excel Workbook Export',
      desc: 'Formatted Excel file with all paddy records across all categories.',
      date: summary ? new Date(summary.generated_at).toLocaleDateString('en-GB') : '—',
      status: 'Ready',
      action: handleExcel,
      loading: exporting.excel,
    },
    {
      id: 3,
      title: 'Summary Statistics Report',
      desc: `${summary?.data_records ?? '—'} records · ${summary?.years_covered?.length ?? '—'} years · Avg price LKR ${summary?.price_summary?.avg ?? '—'}/kg`,
      date: summary ? new Date(summary.generated_at).toLocaleDateString('en-GB') : '—',
      status: summary ? 'Ready' : 'Loading',
      action: handleGenerate,
      loading: generating,
    },
    {
      id: 4,
      title: 'Print / PDF Report',
      desc: 'Open browser print dialog to save as PDF or print directly.',
      date: new Date().toLocaleDateString('en-GB'),
      status: 'Ready',
      action: handlePrint,
      loading: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Download and export paddy data reports</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Report list */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="font-semibold text-gray-800 text-lg">Available Reports</h2>

          {REPORT_ROWS.map(r => (
            <div key={r.id} className="card flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-xl shrink-0">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900">{r.title}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.status === 'Ready'   ? 'bg-green-100 text-green-700'
                    : r.status === 'Loading' ? 'bg-gray-100 text-gray-500'
                    : 'bg-amber-100 text-amber-700'
                  }`}>
                    {r.status === 'Ready'
                      ? <CheckCircle className="w-3 h-3" />
                      : <Clock className="w-3 h-3" />}
                    {r.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{r.desc}</p>
                <p className="text-xs text-gray-400 mt-2">{r.date}</p>
              </div>
              <button
                onClick={r.action}
                disabled={r.loading || loadingSum}
                className="shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Download"
              >
                {r.loading
                  ? <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin block" />
                  : <Download className="w-4 h-4 text-primary-600" />
                }
              </button>
            </div>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Quick export */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Quick Export</h3>
            <div className="space-y-2">
              <button
                onClick={handleCSV}
                disabled={exporting.csv}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
              >
                {exporting.csv
                  ? <span className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  : <Download className="w-5 h-5 text-blue-500" />}
                <span className="text-sm font-medium text-gray-700">CSV Export</span>
              </button>

              <button
                onClick={handleExcel}
                disabled={exporting.excel}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
              >
                {exporting.excel
                  ? <span className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                  : <FileSpreadsheet className="w-5 h-5 text-green-600" />}
                <span className="text-sm font-medium text-gray-700">Excel Data (.xlsx)</span>
              </button>

              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <Printer className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Summary stats */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Generate Summary Report</h3>
            <p className="text-xs text-gray-500 mb-4">Computes live statistics from all uploaded records.</p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary w-full justify-center disabled:opacity-50"
            >
              {generating
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />Generating…</>
                : <><FilePlus className="w-4 h-4 inline mr-1" />Generate Report</>
              }
            </button>

            {genReport && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-sm space-y-1.5">
                <p className="font-semibold text-green-800 mb-2">Summary Report</p>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    ['Generated',      genReport.generated],
                    ['Records',        genReport.records],
                    ['Years',          genReport.years.join(', ')],
                    ['Predictions',    genReport.predictions],
                    ['Avg Price',      `LKR ${genReport.avgPrice}/kg`],
                    ['Min Price',      `LKR ${genReport.minPrice}/kg`],
                    ['Max Price',      `LKR ${genReport.maxPrice}/kg`],
                    ['Latest Price',   `LKR ${genReport.latestPrice}/kg`],
                    ['Avg Production', `${genReport.avgProduction} MT`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-gray-400">{k}</p>
                      <p className="font-semibold text-gray-700 truncate">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
