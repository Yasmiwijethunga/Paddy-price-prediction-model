export default function StatCard({ icon, label, value, unit, change, changeType, subtitle }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
            changeType === 'up'
              ? 'bg-red-50 text-red-600'
              : 'bg-red-50 text-red-600'
          }`}>
            {changeType === 'up' ? '↑' : '↓'}{change}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-extrabold text-gray-900 leading-none">
          {value}
          <span className="text-base font-medium text-gray-500 ml-1">{unit}</span>
        </p>
      </div>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  )
}
