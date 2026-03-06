import { useState, useEffect } from 'react'
import { recordService } from '../services/recordService'
import { useAuth } from '../context/AuthContext'
import { Plus, Upload, Download, Filter, Eye } from 'lucide-react'

const DATA_TABS = ['Production', 'Climate', 'Input Costs', 'Consumption', 'Prices']

const SOURCE_CARDS = [
  { code: 'DCS',   name: 'Department of Census and Statistics',             count: 10 },
  { code: 'HARTI', name: 'Hector Kobbekaduwa Agrarian Research Institute',  count: 10 },
  { code: 'DoM',   name: 'Department of Meteorology',                       count: 10 },
  { code: 'MoA',   name: 'Ministry of Agriculture',                         count: 10 },
]

const COLUMNS = {
  Production: ['Year', 'Season', 'Cultivated (ha)', 'Harvested (ha)', 'Production (MT)', 'Yield (kg/ha)', 'Actions'],
  Climate:    ['Year', 'Season', 'Rainfall (mm)', 'Temp (°C)', 'Humidity (%)', 'Rainy Days', 'Actions'],
  'Input Costs': ['Year', 'Fertilizer (LKR/kg)', 'Seeds (LKR/kg)', 'Agrochemical (LKR/L)', 'Labor (LKR/day)', 'Fuel (LKR/L)', 'Actions'],
  Consumption: ['Year', 'Population', 'Per Capita (kg/yr)', 'Total (MT)', 'Seasonal Factor', 'Actions'],
  Prices:     ['Year', 'Season', 'Farmgate (LKR/kg)', 'Wholesale (LKR/kg)', 'Retail (LKR/kg)', 'Actions'],
}

function renderRow(rec, tab) {
  switch (tab) {
    case 'Production':
      return [
        rec.year, rec.season,
        rec.cultivated_area?.toLocaleString(),
        rec.harvest_quantity?.toLocaleString(),
        rec.total_production?.toLocaleString(),
        rec.total_production && rec.cultivated_area ? Math.round(rec.total_production / rec.cultivated_area * 1000) : '-',
      ]
    case 'Climate':
      return [
        rec.year, rec.season,
        rec.rainfall?.toLocaleString(),
        rec.temperature,
        rec.humidity ? `${rec.humidity}%` : '—',
        rec.rainy_days || '—',
      ]
    case 'Input Costs':
      return [
        rec.year,
        rec.fertilizer_price?.toLocaleString(),
        rec.seed_cost?.toLocaleString(),
        rec.pesticide_cost?.toLocaleString(),
        rec.labor_cost?.toLocaleString() || '1,200',
        rec.fuel_cost?.toLocaleString() || '98',
      ]
    case 'Consumption':
      return [
        rec.year,
        rec.population?.toLocaleString(),
        rec.rice_consumption,
        rec.total_consumption?.toLocaleString() || (rec.population && rec.rice_consumption ? Math.round(rec.population * rec.rice_consumption) : '—'),
        rec.seasonal_factor || '1.15',
      ]
    case 'Prices':
      return [
        rec.year, rec.season,
        rec.paddy_price,
        rec.wholesale_price || Math.round((rec.paddy_price || 0) * 1.3),
        rec.retail_price    || Math.round((rec.paddy_price || 0) * 2.1),
      ]
    default:
      return []
  }
}

export default function DataManagementPage() {
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('Production')
  const [records, setRecords]     = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    recordService.getAll({ limit: 100 })
      .then(setRecords)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const cols = COLUMNS[activeTab]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">View and manage historical data for model training</p>
      </div>

      {/* Source cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SOURCE_CARDS.map(({ code, name, count }) => (
          <div key={code} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="min-w-0 mr-2">
              <p className="font-bold text-gray-900 text-sm">{code}</p>
              <p className="text-xs text-gray-400 truncate">{name}</p>
            </div>
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
              {count} records
            </span>
          </div>
        ))}
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3">
        {isAdmin && (
          <button className="btn-primary">
            <Plus size={16} /> Add New Record
          </button>
        )}
        <button className="btn-secondary">
          <Upload size={16} /> Import CSV
        </button>
        <button className="btn-secondary">
          <Download size={16} /> Export All Data
        </button>
      </div>

      {/* Data tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Tab bar */}
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

        {/* Table header */}
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {activeTab === 'Input Costs' ? 'Input Cost Data'
               : activeTab === 'Prices' ? 'Paddy Price Data'
               : `${activeTab} Data`}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {activeTab === 'Production'   && 'Anuradhapura District Maha Season Production Statistics (2015-2024)'}
              {activeTab === 'Climate'      && 'Seasonal climate variables affecting paddy cultivation'}
              {activeTab === 'Input Costs'  && 'Agricultural input prices over the years'}
              {activeTab === 'Consumption'  && 'District population and rice consumption patterns'}
              {activeTab === 'Prices'       && 'Historical Nadu paddy prices at different market levels'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm py-2">
              <Filter size={14} /> Filter
            </button>
            <button className="btn-secondary text-sm py-2">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
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
                    <th key={col} className="text-left px-5 py-3.5 font-semibold text-primary-600 text-xs uppercase tracking-wide first:rounded-none">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={cols.length} className="text-center py-12 text-gray-400">No records found. Upload a dataset to get started.</td>
                  </tr>
                ) : (
                  records.slice(0, 15).map((rec) => {
                    const cells = renderRow(rec, activeTab)
                    return (
                      <tr key={rec.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        {cells.map((cell, i) => (
                          <td key={i} className="px-5 py-3.5 text-gray-700">{cell ?? '—'}</td>
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
    </div>
  )
}
