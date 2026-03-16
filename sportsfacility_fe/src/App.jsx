import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user ? children : <Navigate to="/login" replace />;
  }
  function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user && user.role === 'admin' ? children : <Navigate to="/admin/login" replace />;
  }
  function OwnerRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user && user.role === 'owner' ? children : <Navigate to="/owner/login" replace />;
  }
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>






          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
