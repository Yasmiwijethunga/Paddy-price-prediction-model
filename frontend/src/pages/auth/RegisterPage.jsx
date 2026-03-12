import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sprout, Eye, EyeOff, UserPlus, User, FlaskConical } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate      = useNavigate()
  const { t, i18n }  = useTranslation()
  const isSi = i18n.language?.startsWith('si')

  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '', role: 'user'
  })
  const [showPwd, setShowPwd]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword)
      return t('auth.register.errRequired')
    if (form.username.length < 3)
      return t('auth.register.errUsername')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return t('auth.register.errEmail')
    if (form.password.length < 6)
      return t('auth.register.errPassword')
    if (form.password !== form.confirmPassword)
      return t('auth.register.errMatch')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)
    try {
      await register({ username: form.username, email: form.email, password: form.password, role: form.role })
      setSuccess(true)
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || t('auth.register.errFailed'))
    } finally {
      setLoading(false)
    }
  }

  const pwLabel = () => {
    if (form.password.length < 6)  return t('auth.register.pwWeak')
    if (form.password.length < 9)  return t('auth.register.pwFair')
    if (form.password.length < 12) return t('auth.register.pwGood')
    return t('auth.register.pwStrong')
  }

  const ROLES = [
    { value: 'user',       Icon: User,         titleKey: 'auth.register.roleUserTitle',       descKey: 'auth.register.roleUserDesc' },
    { value: 'researcher', Icon: FlaskConical,  titleKey: 'auth.register.roleResearcherTitle', descKey: 'auth.register.roleResearcherDesc' },
  ]

  const FEATURES = [
    t('auth.register.feat1'),
    t('auth.register.feat2'),
    t('auth.register.feat3'),
    t('auth.register.feat4'),
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
          <h1 className="text-4xl font-extrabold leading-tight">
            {t('auth.register.heroTitle1')}<br />
            {t('auth.register.heroTitle2')}<br />
            <span className="text-amber-400">{t('auth.register.heroTitle3')}</span>
          </h1>
          <p className="text-gray-400 leading-relaxed max-w-sm">
            {t('auth.register.heroDesc')}
          </p>
          <ul className="space-y-3">
            {FEATURES.map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-gray-600">© 2025 Paddy Price Prediction System</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
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

          <h2 className="text-2xl font-bold text-gray-900 mb-1">{t('auth.register.heading')}</h2>
          <p className="text-gray-500 text-sm mb-8">{t('auth.register.subtitle')}</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {t('auth.register.successMsg')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.register.usernameLabel')} *</label>
              <input
                name="username"
                type="text"
                autoComplete="username"
                placeholder={t('auth.register.usernamePlaceholder')}
                value={form.username}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.register.accountTypeLabel')} *</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(({ value, Icon, titleKey, descKey }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: value }))}
                    className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border-2 text-left transition-all ${
                      form.role === value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      form.role === value ? 'bg-primary-600' : 'bg-gray-100'
                    }`}>
                      <Icon size={16} className={form.role === value ? 'text-white' : 'text-gray-500'} />
                    </span>
                    <span className={`text-sm font-semibold ${form.role === value ? 'text-primary-700' : 'text-gray-800'}`}>
                      {t(titleKey)}
                    </span>
                    <span className="text-xs text-gray-500 leading-tight">{t(descKey)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.register.emailLabel')} *</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t('auth.register.emailPlaceholder')}
                value={form.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.register.passwordLabel')} *</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={t('auth.register.passwordPlaceholder')}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.register.confirmLabel')} *</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={t('auth.register.confirmPlaceholder')}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Password strength */}
            {form.password.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        form.password.length >= i * 3
                          ? i <= 1 ? 'bg-red-400' : i <= 2 ? 'bg-amber-400' : i <= 3 ? 'bg-yellow-400' : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400">{pwLabel()}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><UserPlus size={18} /> {t('auth.register.createBtn')}</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('auth.register.hasAccount')}{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              {t('auth.register.signIn')}
            </Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gray-600 transition-colors">
              {t('auth.register.backHome')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
