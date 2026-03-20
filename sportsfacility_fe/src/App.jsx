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

function App() {
  function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user ? children : <Navigate to="/login" replace />;
  }
  function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user && user.role === 'ADMIN' ? children : <Navigate to="/admin/login" replace />;
  }
  function OwnerRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user && user.role === 'OWNER' ? children : <Navigate to="/owner/login" replace />;
  }
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courts" element={<CourtSearchPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/failed" element={<PaymentFailedPage />} />
          <Route path="/my-bookings" element={
            <PrivateRoute><BookingHistoryPage /></PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/courts" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
