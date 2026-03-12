import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sprout, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const { t, i18n } = useTranslation()
  const isSi = i18n.language?.startsWith('si')

  const [form, setForm]       = useState({ username: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.password) { setError(t('auth.login.errFill')); return }
    setLoading(true)
    try {
      const loggedInUser = await login(form.username, form.password)
      const role = loggedInUser?.role
      const destination = (role === 'farmer' || role === 'user') ? '/farmer-dashboard' : '/dashboard'
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || t('auth.login.errInvalid'))
    } finally {
      setLoading(false)
    }
  }

  const STATS = [
    ['92.2%', t('auth.login.stat1')],
    ['Rs. 3,650', t('auth.login.stat2')],
    ['354K MT', t('auth.login.stat3')],
    ['87.2%', t('auth.login.stat4')],
  ]

  return (
    <div className="min-h-screen flex bg-[#F4F6F3]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-[#1a2e1e] flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <Sprout size={22} className="text-white" />
          </div>
          <div>
            <p className="font-bold">{t('landing.hero.title1')}</p>
            <p className="text-xs text-gray-400">{t('landing.hero.title2')}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 rounded-full px-4 py-1.5 text-sm font-medium">
            <Sprout size={14} /> {t('landing.hero.badge')}
          </div>
          <h1 className="text-4xl font-extrabold leading-tight">
            {t('auth.login.heroTitle1')}<br />
            {t('auth.login.heroTitle2')}<br />
            <span className="text-amber-400">{t('auth.login.heroTitle3')}</span>
          </h1>
          <p className="text-gray-400 leading-relaxed max-w-sm">
            {t('auth.login.heroDesc')}
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-xs">
            {STATS.map(([v, l]) => (
              <div key={l} className="bg-white/10 rounded-xl p-3">
                <p className="text-2xl font-bold text-amber-400">{v}</p>
                <p className="text-xs text-gray-400 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-600">© 2025 Paddy Price Prediction System</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {/* Mobile logo + lang toggle */}
        <div className="flex items-center justify-between w-full max-w-md mb-8 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
              <Sprout size={18} className="text-white" />
            </div>
            <p className="font-bold text-sm">{t('landing.hero.title1')} {t('landing.hero.title2')}</p>
          </div>
          <button
            onClick={() => i18n.changeLanguage(isSi ? 'en' : 'si')}
            className="text-sm font-bold border border-gray-300 hover:border-primary-500 hover:text-primary-600 px-3 py-1.5 rounded-lg transition-all"
          >
            {isSi ? 'EN' : 'සිං'}
          </button>
        </div>

        <div className="w-full max-w-md">
          {/* Desktop lang toggle */}
          <div className="hidden lg:flex justify-end mb-4">
            <button
              onClick={() => i18n.changeLanguage(isSi ? 'en' : 'si')}
              className="text-sm font-bold border border-gray-300 hover:border-primary-500 hover:text-primary-600 px-3 py-1.5 rounded-lg transition-all"
            >
              {isSi ? 'EN' : 'සිං'}
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">{t('auth.login.welcome')}</h2>
          <p className="text-gray-500 text-sm mb-8">{t('auth.login.subtitle')}</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.login.usernameLabel')}</label>
              <input
                name="username"
                type="text"
                autoComplete="username"
                placeholder={t('auth.login.usernamePlaceholder')}
                value={form.username}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.login.passwordLabel')}</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder={t('auth.login.passwordPlaceholder')}
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn size={18} /> {t('auth.login.signInBtn')}</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('auth.login.noAccount')}{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              {t('auth.login.createAccount')}
            </Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gray-600 transition-colors">
              {t('auth.login.backHome')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
