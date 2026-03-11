import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Sprout, LogOut, Languages } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function FarmerTopBar() {
  const { t, i18n } = useTranslation()
  const { logout } = useAuth()
  const navigate = useNavigate()

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
    <header className="sticky top-0 z-40 bg-[#1a2e1e] text-white px-4 py-3 flex items-center justify-between shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Sprout size={18} className="text-white" />
        </div>
        <span className="font-bold text-sm leading-tight">{t('nav.appName')}</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
          aria-label="Toggle language"
        >
          <Languages size={13} />
          <span>{isSinhala ? 'English' : 'සිංහල'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 bg-red-600/80 hover:bg-red-600 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
          aria-label={t('nav.logout')}
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">{t('nav.logout')}</span>
        </button>
      </div>
    </header>
  )
}
