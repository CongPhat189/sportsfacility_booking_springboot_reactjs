import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google' // Import cái này
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Dán mã Client ID bạn vừa lấy được vào đây */}
    <GoogleOAuthProvider clientId="365570324387-uo491n8atsdrqd4uk6pp3brfdj8m84pq.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)