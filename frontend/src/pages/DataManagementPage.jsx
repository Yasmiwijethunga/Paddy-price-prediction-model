import { useState, useEffect, useRef } from 'react'
import { recordService } from '../services/recordService'
import { datasetService } from '../services/datasetService'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Upload, Download, Filter, Eye, X, CheckCircle, AlertCircle, FileText } from 'lucide-react'

const DATA_TABS = ['Production', 'Climate', 'Input Costs', 'Consumption', 'Prices']

const SOURCE_CARDS = [
  { code: 'DCS',   name: 'Department of Census and Statistics',            count: 10 },
  { code: 'HARTI', name: 'Hector Kobbekaduwa Agrarian Research Institute', count: 10 },
  { code: 'DoM',   name: 'Department of Meteorology',                      count: 10 },
  { code: 'MoA',   name: 'Ministry of Agriculture',                        count: 10 },
]

const COLUMNS = {
  Production:    ['Year', 'Season', 'Cultivated (ha)', 'Harvested (MT)', 'Production (MT)', 'Yield (kg/ha)', 'Actions'],
  Climate:       ['Year', 'Season', 'Rainfall (mm)', 'Temp (C)', 'Humidity (%)', 'Rainy Days', 'Actions'],
  'Input Costs': ['Year', 'Fertilizer (LKR/kg)', 'Seed (LKR/kg)', 'Pesticide (LKR)', 'Actions'],
  Consumption:   ['Year', 'Population', 'Rice Consumption (MT)', 'Actions'],
  Prices:        ['Year', 'Season', 'Farmgate (LKR/bushel)', 'Wholesale (LKR)', 'Retail (LKR)', 'Actions'],
}

function renderRow(rec, tab) {
  switch (tab) {
    case 'Production':
      return [
        rec.year, rec.season ?? 'Maha',
        rec.cultivated_area?.toLocaleString(),
        rec.harvest_quantity?.toLocaleString(),
        rec.total_production?.toLocaleString(),
        rec.total_production && rec.cultivated_area
          ? Math.round((rec.total_production / rec.cultivated_area) * 1000)
          : '-',
      ]
    case 'Climate':
      return [rec.year, rec.season ?? 'Maha', rec.rainfall, rec.temperature, '-', '-']
    case 'Input Costs':
      return [rec.year, rec.fertilizer_price, rec.seed_cost, rec.pesticide_cost]
    case 'Consumption':
      return [rec.year, rec.population?.toLocaleString(), rec.rice_consumption?.toLocaleString()]
    case 'Prices':
      return [
        rec.year, rec.season ?? 'Maha',
        rec.paddy_price,
        rec.paddy_price ? Math.round(rec.paddy_price * 1.3) : '-',
        rec.paddy_price ? Math.round(rec.paddy_price * 2.1) : '-',
      ]
    default:
      return []
  }
}

export default function DataManagementPage() {
  const { isResearcher } = useAuth()
  const [activeTab, setActiveTab]       = useState('Production')
  const [records, setRecords]           = useState([])
  const [loading, setLoading]           = useState(true)

  const [showUpload, setShowUpload]     = useState(false)
  const [uploadFile, setUploadFile]     = useState(null)
  const [uploadType, setUploadType]     = useState('production')
  const [uploading, setUploading]       = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [uploadError, setUploadError]   = useState('')
  const [dragOver, setDragOver]         = useState(false)
  const fileInputRef = useRef()

  const loadRecords = () => {
    setLoading(true)
    recordService.getAll({ limit: 200 })
      .then(setRecords)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadRecords() }, [])

  const openUpload = () => {
    setUploadFile(null)
    setUploadType('production')
    setUploadResult(null)
    setUploadError('')
    setShowUpload(true)
  }
  const closeUpload = () => { if (!uploading) setShowUpload(false) }

  const handleFileDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) setUploadFile(f)
  }

  const handleUpload = async () => {
    if (!uploadFile) { setUploadError('Please select a file.'); return }
    setUploading(true)
    setUploadError('')
    setUploadResult(null)
    try {
      const res = await datasetService.upload(uploadFile, uploadType)
      setUploadResult(res)
      loadRecords()
    } catch (err) {
      setUploadError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleExport = async () => {
    try {
      const res = await api.get('/records/export/csv', { responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'paddy_records.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed', err)
    }
  }

  const cols = COLUMNS[activeTab]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">View and manage historical paddy data records</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SOURCE_CARDS.map(({ code, name, count }) => (
          <div key={code} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="min-w-0 mr-2">
              <p className="font-bold text-gray-900 text-sm">{code}</p>
              <p className="text-xs text-gray-400 truncate">{name}</p>
            </div>
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
              {count} years
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {isResearcher && (
          <button onClick={openUpload} className="btn-primary">
            <Upload size={16} /> Import CSV
          </button>
        )}
        <button onClick={handleExport} className="btn-secondary">
          <Download size={16} /> Export All Data
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {DATA_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 flex-shrink-0 ${
                activeTab === tab
                  ? 'border-gray-800 text-gray-900 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {activeTab === 'Input Costs' ? 'Input Cost Data'
               : activeTab === 'Prices'    ? 'Paddy Price Data'
               : `${activeTab} Data`}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Anuradhapura District · Nadu Variety · Maha Season · 2015-2024
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm py-2"><Filter size={14} /> Filter</button>
            <button className="btn-secondary text-sm py-2"><Download size={14} /> Export</button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {cols.map(col => (
                    <th key={col} className="text-left px-5 py-3.5 font-semibold text-primary-600 text-xs uppercase tracking-wide">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={cols.length} className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <FileText size={32} className="text-gray-300" />
                        <p>No records found.</p>
                        {isResearcher && (
                          <button onClick={openUpload} className="text-primary-600 text-sm font-medium hover:underline">
                            Upload a dataset to get started
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  records.map((rec) => {
                    const cells = renderRow(rec, activeTab)
                    return (
                      <tr key={rec.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        {cells.map((cell, i) => (
                          <td key={i} className="px-5 py-3.5 text-gray-700">{cell ?? '-'}</td>
                        ))}
                        <td className="px-5 py-3.5">
                          <button className="text-gray-400 hover:text-primary-600 transition-colors">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Upload size={18} className="text-primary-600" />
                <h3 className="font-bold text-gray-900">Upload Dataset</h3>
              </div>
              <button onClick={closeUpload} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Dataset Type *</label>
                <select
                  value={uploadType}
                  onChange={e => setUploadType(e.target.value)}
                  className="input-field bg-white"
                  disabled={uploading}
                >
                  <option value="production">Production</option>
                  <option value="climate">Climate</option>
                  <option value="cost">Input Costs</option>
                  <option value="price">Price</option>
                  <option value="combined">Combined</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">CSV / Excel File *</label>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    dragOver       ? 'border-primary-500 bg-primary-50'
                    : uploadFile   ? 'border-green-400 bg-green-50'
                                   : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                  }`}
                >
                  {uploadFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <FileText size={20} />
                      <span className="text-sm font-medium">{uploadFile.name}</span>
                      <span className="text-xs text-green-500">({(uploadFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload size={24} className="mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600 font-medium">Drop file here or click to browse</p>
                      <p className="text-xs text-gray-400">Supports .csv, .xlsx, .xls</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={e => setUploadFile(e.target.files[0] || null)}
                    disabled={uploading}
                  />
                </div>
                {uploadFile && (
                  <button type="button" onClick={() => setUploadFile(null)} className="text-xs text-red-500 mt-1 hover:underline">
                    Remove file
                  </button>
                )}
              </div>

              {uploadError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{Array.isArray(uploadError) ? uploadError.join(', ') : String(uploadError)}</span>
                </div>
              )}

              {uploadResult && (
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{uploadResult.message || 'Upload successful!'}</p>
                    {uploadResult.dataset && (
                      <p className="text-xs text-green-600 mt-0.5">
                        Dataset #{uploadResult.dataset.id} — {uploadResult.dataset.filename}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleUpload}
                  disabled={uploading || !uploadFile || !!uploadResult}
                  className="flex-1 btn-primary justify-center py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />Uploading...</>
                    : <><Upload size={15} className="inline mr-1" />Upload Dataset</>
                  }
                </button>
                <button onClick={closeUpload} disabled={uploading} className="btn-secondary px-5">
                  {uploadResult ? 'Done' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
