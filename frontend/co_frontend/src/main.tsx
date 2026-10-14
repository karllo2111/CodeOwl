import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import '@fontsource-variable/figtree'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ className: 'bg-slate-900 text-slate-100 border border-slate-800' }} />
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
