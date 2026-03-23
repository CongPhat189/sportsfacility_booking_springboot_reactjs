import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './context/AuthProvider'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CourtSearchPage from './pages/CourtSearchPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentFailedPage from './pages/PaymentFailedPage'
import BookingHistoryPage from './pages/BookingHistoryPage'
import AdminDashboard from './pages/AdminDashboard'
import OwnerLayout from "./components/OwnerLayout"
import OwnerCourtPage from "./pages/OwnerCourtPage"

// Các route bảo vệ
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return user && user.role === 'ADMIN' ? children : <Navigate to="/login" replace />
}
function OwnerRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return user && user.role === 'OWNER' ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courts" element={<CourtSearchPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/failed" element={<PaymentFailedPage />} />

          {/* Private routes */}
          <Route path="/my-bookings" element={
            <PrivateRoute><BookingHistoryPage /></PrivateRoute>
          } />

          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/courts" replace />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* Owner routes */}
          <Route path="/owner/*" element={
            <OwnerRoute>
              <OwnerLayout />
            </OwnerRoute>
          }>
            {/* Redirect /owner → /owner/courts */}
            <Route index element={<Navigate to="courts" replace />} />
            <Route path="courts" element={<OwnerCourtPage />} />
            {/* Sau này thêm các route khác của Owner: finance, customers, settings */}
          </Route>
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App