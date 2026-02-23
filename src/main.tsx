import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HabitProvider } from './context/HabitContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <HabitProvider>
        <App />
      </HabitProvider>
    </AuthProvider>
  </StrictMode>,
)
