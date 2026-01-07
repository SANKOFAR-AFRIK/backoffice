import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import Dashboard from "./pages/Dashboard"
import Clients from "./pages/Clients"
import Deals from "./pages/Deals"
import Invoices from "./pages/Invoices"
import Payments from "./pages/Payments"
import Expenses from "./pages/Expenses"
import Login from "./pages/Login"
import Projects from "./pages/Projects"
import Services from "./pages/Services"
import Properties from "./pages/Properties"
import "./styles.css"

// Composant pour protéger les routes
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Layout avec navigation (seulement pour les pages protégées)
function AppLayout({ children }) {
  return (
    <div className="app-wrapper">
      <nav className="main-nav">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-text">Interface d'administration</span>
            <span className="logo-subtitle">Sankofa Afrik</span>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Tableau de bord
            </Link>
            <Link to="/services" className="nav-link">
              Services
            </Link>
            <Link to="/properties" className="nav-link">
              Offres
            </Link>
            <Link to="/projects" className="nav-link">
              Projets
            </Link>
            <Link to="/clients" className="nav-link">
              Clients
            </Link>
            <Link to="/deals" className="nav-link">
              Affaires
            </Link>
            <Link to="/invoices" className="nav-link">
              Factures
            </Link>
            <Link to="/payments" className="nav-link">
              Paiements
            </Link>
            <Link to="/expenses" className="nav-link">
              Dépenses
            </Link>
            <button 
              className="btn-site"
              onClick={() => {
                localStorage.removeItem("token")
                window.location.href = "/login"
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === "/login"

  return (
    <>
      {isLoginPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <AppLayout>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/deals" element={<ProtectedRoute><Deals /></ProtectedRoute>} />
            <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      )}
    </>
  )
}