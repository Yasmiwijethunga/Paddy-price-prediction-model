import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sprout, Eye, EyeOff, UserPlus, User, FlaskConical } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '', role: 'user'
  })
  const [showPwd, setShowPwd]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword)
      return 'All fields are required.'
    if (form.username.length < 3)
      return 'Username must be at least 3 characters.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return 'Please enter a valid email address.'
    if (form.password.length < 6)
      return 'Password must be at least 6 characters.'
    if (form.password !== form.confirmPassword)
      return 'Passwords do not match.'
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
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#F4F6F3]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-[#1a2e1e] flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <Sprout size={22} className="text-white" />
          </div>
          <div>
            <p className="font-bold">Paddy Price</p>
            <p className="text-xs text-gray-400">Prediction System</p>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight">
            Join Our<br />Research<br />
            <span className="text-amber-400">Community</span>
          </h1>
          <p className="text-gray-400 leading-relaxed max-w-sm">
            Access prediction tools, historical data analysis, and research reports for
            Nadu paddy prices in Anuradhapura District.
          </p>
          <ul className="space-y-3">
            {[
              'Access 10-year historical dataset',
              'Run ML-powered price predictions',
              'Explore factor impact analysis',
              'Generate and download reports',
            ].map(item => (
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

      {/* Right panel – form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
            <Sprout size={18} className="text-white" />
          </div>
          <p className="font-bold text-sm">Paddy Price Prediction System</p>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create account</h2>
          <p className="text-gray-500 text-sm mb-8">Register to access the prediction system</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              Account created! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username *</label>
                <input
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="e.g. sanjulee"
                  value={form.username}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: 'user',
                      Icon: User,
                      title: 'Normal User',
                      desc: 'View predictions & historical data',
                    },
                    {
                      value: 'researcher',
                      Icon: FlaskConical,
                      title: 'Researcher',
                      desc: 'Full access to data, analysis & model tools',
                    },
                  ].map(({ value, Icon, title, desc }) => (
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
                      <span className={`text-sm font-semibold ${
                        form.role === value ? 'text-primary-700' : 'text-gray-800'
                      }`}>{title}</span>
                      <span className="text-xs text-gray-500 leading-tight">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address *</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat password"
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

            {/* Password strength indicator */}
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
                <p className="text-xs text-gray-400">
                  {form.password.length < 6 ? 'Weak' : form.password.length < 9 ? 'Fair' : form.password.length < 12 ? 'Good' : 'Strong'}
                </p>
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
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gray-600 transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
