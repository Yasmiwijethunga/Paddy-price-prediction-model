import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const MOCK = [
  { year: 2015, production: 357, consumption: 99 },
  { year: 2016, production: 373, consumption: 102 },
  { year: 2017, production: 389, consumption: 103 },
  { year: 2018, production: 402, consumption: 105 },
  { year: 2019, production: 395, consumption: 107 },
  { year: 2020, production: 298, consumption: 109 },
  { year: 2021, production: 365, consumption: 110 },
  { year: 2022, production: 249, consumption: 112 },
  { year: 2023, production: 328, consumption: 113 },
  { year: 2024, production: 351, consumption: 104 },
]

const fmtK = v => `${(v / 1000).toFixed(0)}K`

export default function ProductionConsumptionChart({ data }) {
  const chartData = data?.length
    ? data.map(d => ({
        year: d.year,
        production: Math.round((d.total_production || 0) / 1000),
        consumption: Math.round((d.rice_consumption || 0) / 1000),
      }))
    : MOCK

  return (
    <div className="card">
      <h3 className="font-bold text-gray-900 text-lg mb-0.5">Production vs Consumption</h3>
      <p className="text-xs text-gray-500 mb-5">Annual comparison in thousand metric tons - Anuradhapura District</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} />
          <YAxis tickFormatter={v => `${v}K`} tick={{ fontSize: 11, fill: '#6b7280' }} width={42} />
          <Tooltip
            formatter={(v, n) => [`${v}K MT`, n === 'production' ? 'Production' : 'Consumption']}
            labelFormatter={l => `Year ${l}`}
            contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: 12 }}
          />
          <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="production" fill="#2D6A4F" radius={[3, 3, 0, 0]} />
          <Bar dataKey="consumption" fill="#F5A623" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
