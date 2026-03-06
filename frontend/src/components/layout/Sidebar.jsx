import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, Database, BarChart2,
  FileText, Settings, Sprout, CloudRain, DollarSign, Users, ChevronLeft, ChevronRight
} from 'lucide-react'

const navLinks = [
  { to: '/dashboard',           label: 'Dashboard',          icon: LayoutDashboard },
  { to: '/prediction',          label: 'Prediction',         icon: TrendingUp },
  { to: '/data-management',     label: 'Data Management',    icon: Database },
  { to: '/historical-analysis', label: 'Historical Analysis',icon: BarChart2 },
  { to: '/reports',             label: 'Reports',            icon: FileText },
  { to: '/model-settings',      label: 'Model Settings',     icon: Settings },
]

const dataRecords = [
  { label: 'Production', icon: Sprout,     count: '10' },
  { label: 'Climate',    icon: CloudRain,  count: '10' },
  { label: 'Input Costs',icon: DollarSign, count: '10' },
  { label: 'Consumption',icon: Users,      count: '10' },
]

export default function Sidebar({ open, onToggle }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          ${open ? 'w-64 translate-x-0' : 'w-0 lg:w-16 -translate-x-full lg:translate-x-0'}
          fixed lg:relative z-30 h-full flex flex-col bg-[#1a2e1e] text-white
          transition-all duration-300 overflow-hidden flex-shrink-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sprout size={20} className="text-white" />
          </div>
          {open && (
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight text-white">Paddy Price</p>
              <p className="text-xs text-gray-400">Prediction System</p>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-amber-500 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {open && <span className="truncate">{label}</span>}
            </NavLink>
          ))}

          {/* Data Records section */}
          {open && (
            <div className="mt-6">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Data Records
              </p>
              {dataRecords.map(({ label, icon: Icon, count }) => (
                <NavLink
                  key={label}
                  to={`/data-management?tab=${label.toLowerCase().replace(' ', '-')}`}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} className="flex-shrink-0" />
                    <span>{label}</span>
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{count}</span>
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-3 border-t border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </aside>
    </>
  )
}
