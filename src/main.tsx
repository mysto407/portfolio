import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import PlanDetails from './PlanDetails.tsx'
import PrivacyPolicy from './PrivacyPolicy.tsx'
import NotFound from './NotFound.tsx'
import { GridOverlay } from './components/dev/GridOverlay'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/plan/:planId" element={<PlanDetails />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {import.meta.env.DEV && <GridOverlay />}
    </BrowserRouter>
  </React.StrictMode>,
)
