import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export function PrivateRoute({ requiredRole } = {}) {
  const { user, loading, isFarmer } = useAuth()
  const hasToken = !!localStorage.getItem('token')

  if (loading || (hasToken && !user)) return <Spinner />
  if (!user) return <Navigate to="/login" replace />

  // Protect researcher-only routes from farmers
  if (requiredRole === 'researcher' && isFarmer) {
    return <Navigate to="/farmer-dashboard" replace />
  }
  return <Outlet />
}

export function FarmerRoute() {
  const { user, loading, isFarmer } = useAuth()
  const hasToken = !!localStorage.getItem('token')

  if (loading || (hasToken && !user)) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  // Non-farmers who land on /farmer-* get redirected to research dashboard
  if (!isFarmer) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export function PublicRoute() {
  const { user, loading, isFarmer } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Outlet />
  return <Navigate to={isFarmer ? '/farmer-dashboard' : '/dashboard'} replace />
}
