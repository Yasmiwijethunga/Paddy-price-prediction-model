import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, TrendingUp, Sparkles } from 'lucide-react'

export default function FarmerBottomNav() {
  const { t } = useTranslation()

  const links = [
    { to: '/farmer-dashboard', icon: Home,       label: t('nav.home') },
    { to: '/farmer-trend',     icon: TrendingUp,  label: t('nav.priceTrend') },
    { to: '/farmer-prediction',icon: Sparkles,    label: t('nav.prediction') },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      <div className="flex items-stretch h-16 max-w-lg mx-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors pt-1
              ${isActive
                ? 'text-amber-600 border-t-2 border-amber-500 -mt-px bg-amber-50'
                : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="leading-tight">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
