import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute, PublicRoute, FarmerRoute } from './routes/PrivateRoute'

// Research layout
import Layout from './components/layout/Layout'
// Farmer layout
import FarmerLayout from './components/farmer/FarmerLayout'

// Public pages
import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/auth/LoginPage'
import RegisterPage   from './pages/auth/RegisterPage'

// Research/Admin protected pages
import DashboardPage          from './pages/DashboardPage'
import PredictionPage         from './pages/PredictionPage'
import PredictionHistoryPage  from './pages/PredictionHistoryPage'
import DataManagementPage     from './pages/DataManagementPage'
import HistoricalAnalysisPage from './pages/HistoricalAnalysisPage'
import ReportsPage            from './pages/ReportsPage'
import ModelSettingsPage      from './pages/ModelSettingsPage'

// Farmer pages
import FarmerDashboardPage    from './pages/farmer/FarmerDashboardPage'
import FarmerPriceTrendPage   from './pages/farmer/FarmerPriceTrendPage'
import FarmerPredictionPage   from './pages/farmer/FarmerPredictionPage'

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

          {/* Farmer routes – simple mobile UI */}
          <Route element={<FarmerRoute />}>
            <Route element={<FarmerLayout />}>
              <Route path="/farmer-dashboard" element={<FarmerDashboardPage />} />
              <Route path="/farmer-trend"     element={<FarmerPriceTrendPage />} />
              <Route path="/farmer-prediction" element={<FarmerPredictionPage />} />
            </Route>
          </Route>

          {/* Researcher / Admin routes – full research UI */}
          <Route element={<PrivateRoute requiredRole="researcher" />}>
            <Route element={<Layout />}>
              <Route path="/dashboard"           element={<DashboardPage />} />
              <Route path="/prediction"          element={<PredictionPage />} />
              <Route path="/prediction/history"  element={<PredictionHistoryPage />} />
              <Route path="/data-management"     element={<DataManagementPage />} />
              <Route path="/historical-analysis" element={<HistoricalAnalysisPage />} />
              <Route path="/reports"             element={<ReportsPage />} />
              <Route path="/model-settings"      element={<ModelSettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
