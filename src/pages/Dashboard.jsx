"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api"

export default function Dashboard() {
  const [data, setData] = useState(null)
  const nav = useNavigate()
  useEffect(() => {
    ;(async () => {
      try {
        setData((await api.get("/api/admin/dashboard")).data)
      } catch {
        nav("/login")
      }
    })()
  }, [])
  if (!data)
    return (
      <div className="container">
        <p>Chargement...</p>
      </div>
    )
  return (
    <div className="container">
      <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem", color: "var(--text-dark)" }}>
        Tableau de bord
      </h1>
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.5rem", marginBottom: "2rem" }}
      >
        <div className="card">
          <div style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "0.5rem", fontWeight: "500" }}>
            Affaires ouvertes
          </div>
          <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--primary-color)" }}>{data.dealsOpen}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "0.5rem", fontWeight: "500" }}>
            Factures ouvertes
          </div>
          <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--primary-color)" }}>
            {data.invoicesOpen}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "0.5rem", fontWeight: "500" }}>
            Encaissements (mois)
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--secondary-color)" }}>
            {Number(data.paymentsMonth).toLocaleString()} FCFA
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "0.5rem", fontWeight: "500" }}>
            Dépenses (mois)
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "700", color: "#ef4444" }}>
            {Number(data.expensesMonth).toLocaleString()} FCFA
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link className="btn btn-primary" to="/services">
          Gérer les services
        </Link>
        <Link className="btn btn-secondary" to="/properties">
          Gérer les biens
        </Link>
      </div>
    </div>
  )
}
