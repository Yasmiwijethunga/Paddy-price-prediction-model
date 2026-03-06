import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const MOCK = [
  { year: 2015, actual: 36, predicted: 34 }, { year: 2016, actual: 38, predicted: 37 },
  { year: 2017, actual: 40, predicted: 39 }, { year: 2018, actual: 45, predicted: 43 },
  { year: 2019, actual: 48, predicted: 46 }, { year: 2020, actual: 52, predicted: 50 },
  { year: 2021, actual: 68, predicted: 65 }, { year: 2022, actual: 105, predicted: 100 },
  { year: 2023, actual: 80, predicted: 82 }, { year: 2024, actual: 68, predicted: 70 },
]

export default function PriceTrendChart({ data }) {
  const chartData = data?.length
    ? data.map(d => ({ year: d.year, actual: d.paddy_price, predicted: d.predicted_price || null }))
    : MOCK

  return (
    <div className="card">
      <h3 className="font-bold text-gray-900 text-lg mb-0.5">Price Trend Analysis</h3>
      <p className="text-xs text-gray-500 mb-5">Historical and predicted Nadu paddy farmgate prices (LKR/kg) - Maha Season</p>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2D6A4F" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#F5A623" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} />
          <YAxis
            tickFormatter={v => `Rs.${v}`}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            width={55}
          />
          <Tooltip
            formatter={(v, n) => [`Rs.${v}`, n === 'actual' ? 'Actual Price' : 'Predicted Price']}
            labelFormatter={l => `Year ${l}`}
            contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: 12 }}
          />
          <Legend
            formatter={v => v === 'actual' ? 'Actual Price' : 'Predicted Price'}
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
          />
          <Area type="monotone" dataKey="actual"    stroke="#2D6A4F" strokeWidth={2} fill="url(#colorActual)"    dot={{ r: 3 }} />
          <Area type="monotone" dataKey="predicted" stroke="#F5A623" strokeWidth={2} fill="url(#colorPredicted)" dot={{ r: 3 }} strokeDasharray="4 2" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
