import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ToastProvider from './components/ToastProvider.tsx'; // Import the new ToastProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider /> {/* Add ToastProvider here */}
    <App />
  </StrictMode>,
)