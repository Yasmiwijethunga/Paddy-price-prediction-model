import { useState } from 'react'
import { FileText, Download, Printer, FileSpreadsheet, FilePlus, CheckCircle, Clock } from 'lucide-react'

const REPORTS = [
  {
    id: 1,
    title: 'Monthly Price Analysis Report',
    description: 'Comprehensive analysis of paddy price movements and contributing factors for January 2025.',
    date: '2025-01-15',
    status: 'Ready',
    icon: FileText,
  },
  {
    id: 2,
    title: 'Prediction Accuracy Report',
    description: 'Model performance evaluation and accuracy metrics for Q4 2024 predictions.',
    date: '2025-01-10',
    status: 'Ready',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Data Quality Assessment',
    description: 'Validation and quality metrics for production, climate, and market data sources.',
    date: '2025-01-05',
    status: 'Ready',
    icon: FileText,
  },
  {
    id: 4,
    title: 'Seasonal Forecast Summary',
    description: 'Paddy price forecast for Maha and Yala 2025 seasons based on current trend analysis.',
    date: '2024-12-28',
    status: 'Draft',
    icon: FileText,
  },
]

const EXPORT_OPTIONS = [
  { label: 'PDF Report',   icon: FileText,        color: 'text-red-500' },
  { label: 'Excel Data',   icon: FileSpreadsheet, color: 'text-green-600' },
  { label: 'CSV Export',   icon: Download,        color: 'text-blue-500' },
  { label: 'Print View',   icon: Printer,         color: 'text-gray-500' },
]

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false)

  const handleExport = (label) => {
    alert(`${label} export initiated. This feature requires backend integration.`)
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">View, generate, and export analysis reports</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left — report list */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="font-semibold text-gray-800 text-lg">Generated Reports</h2>
          {REPORTS.map(r => (
            <div key={r.id} className="card flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-xl shrink-0">
                <r.icon className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900">{r.title}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.status === 'Ready'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {r.status === 'Ready'
                      ? <CheckCircle className="w-3 h-3" />
                      : <Clock className="w-3 h-3" />
                    }
                    {r.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{r.description}</p>
                <p className="text-xs text-gray-400 mt-2">{r.date}</p>
              </div>
              <button
                onClick={() => handleExport(r.title)}
                className="shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4 text-primary-600" />
              </button>
            </div>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Export */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Export Options</h3>
            <div className="space-y-2">
              {EXPORT_OPTIONS.map(({ label, icon: Icon, color }) => (
                <button
                  key={label}
                  onClick={() => handleExport(label)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate new */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-2">Generate New Report</h3>
            <p className="text-xs text-gray-500 mb-4">Create a custom report with selected data range and parameters.</p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <FilePlus className="w-4 h-4" />
              {generating ? 'Generating…' : 'Create Custom Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
