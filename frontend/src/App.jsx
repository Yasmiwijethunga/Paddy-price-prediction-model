import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute, PublicRoute } from './routes/PrivateRoute'

// Layout
import Layout from './components/layout/Layout'

// Public pages
import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/auth/LoginPage'
import RegisterPage   from './pages/auth/RegisterPage'

// Protected pages
import DashboardPage         from './pages/DashboardPage'
import PredictionPage        from './pages/PredictionPage'
import PredictionHistoryPage from './pages/PredictionHistoryPage'
import DataManagementPage    from './pages/DataManagementPage'
import HistoricalAnalysisPage from './pages/HistoricalAnalysisPage'
import ReportsPage           from './pages/ReportsPage'
import ModelSettingsPage     from './pages/ModelSettingsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route element={<PublicRoute />}>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected – inside Layout */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard"          element={<DashboardPage />} />
              <Route path="/prediction"         element={<PredictionPage />} />
              <Route path="/prediction/history" element={<PredictionHistoryPage />} />
              <Route path="/data-management"    element={<DataManagementPage />} />
              <Route path="/historical-analysis" element={<HistoricalAnalysisPage />} />
              <Route path="/reports"            element={<ReportsPage />} />
              <Route path="/model-settings"     element={<ModelSettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
