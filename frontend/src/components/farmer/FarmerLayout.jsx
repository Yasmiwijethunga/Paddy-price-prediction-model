import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Home, TrendingUp, Sparkles, Sprout, LogOut, Languages, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function SidebarContent({ onClose }) {
  const { t, i18n } = useTranslation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const links = [
    { to: '/farmer-dashboard',  icon: Home,       label: t('nav.home') },
    { to: '/farmer-trend',      icon: TrendingUp,  label: t('nav.priceTrend') },
    { to: '/farmer-prediction', icon: Sparkles,    label: t('nav.prediction') },
  ]

  const toggleLang = () => {
    const next = i18n.language === 'si' ? 'en' : 'si'
    i18n.changeLanguage(next)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isSinhala = i18n.language === 'si'

  return (
    <div className="flex flex-col h-full bg-[#1a2e1e] text-white">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Sprout size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">{t('nav.appName')}</p>
            <p className="text-[11px] text-white/50 leading-tight mt-0.5">{t('nav.appSub')}</p>
          </div>
        </div>
        {/* Close button – mobile only */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/60">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
              ${isActive
                ? 'bg-amber-500 text-white shadow-md shadow-amber-900/30'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={20} className="flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-5 space-y-2 border-t border-white/10 pt-4">
        <button
          onClick={toggleLang}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <Languages size={20} className="flex-shrink-0" />
          <span>{isSinhala ? 'Switch to English' : 'සිංහලට මාරු වන්න'}</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-all"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </div>
  )
}

export default function FarmerLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f0f7f0] flex">

      {/* ── Desktop sidebar (lg+) ─────────────────── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 lg:h-screen lg:sticky lg:top-0 shadow-xl">
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer overlay ─────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 shadow-2xl transition-transform duration-300 lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* ── Main content ─────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#1a2e1e] text-white px-4 py-3 flex items-center justify-between shadow-md">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="text-center">
            <p className="font-bold text-sm leading-tight">වී මිල අනාවැකිය</p>
            <p className="text-[10px] text-white/50">අනුරාධපුර · මහ කන්නය</p>
          </div>
          {/* spacer */}
          <div className="w-9" />
        </header>

        {/* Page content — padded for mobile bottom nav */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6 px-4 lg:px-8 pt-4 lg:pt-6 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto w-full">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>
    </div>
  )
}

function MobileBottomNav() {
  const { t } = useTranslation()
  const links = [
    { to: '/farmer-dashboard',  icon: Home,       label: t('nav.home') },
    { to: '/farmer-trend',      icon: TrendingUp,  label: t('nav.priceTrend') },
    { to: '/farmer-prediction', icon: Sparkles,    label: t('nav.prediction') },
  ]
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-stretch h-16">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors pt-1
              ${isActive
                ? 'text-amber-600 border-t-[3px] border-amber-500 -mt-px bg-amber-50'
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
