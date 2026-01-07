"use client"

import { useEffect, useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"

export default function Expenses() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ category: "Frais divers", amount: "", description: "" })
  const nav = useNavigate()
  useEffect(() => {
    ;(async () => {
      try {
        setItems((await api.get("/api/admin/expenses")).data)
      } catch {
        nav("/login")
      }
    })()
  }, [])
  async function create() {
    const { data } = await api.post("/api/admin/expenses", { ...form, amount: Number(form.amount) })
    setItems([data, ...items])
    setForm({ category: "Frais divers", amount: "", description: "" })
  }
  return (
    <div className="container">
      <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem", color: "var(--text-dark)" }}>Dépenses</h1>
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--text-dark)" }}>
          Enregistrer une dépense
        </h2>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 2fr auto", gap: "1rem", alignItems: "end" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: "var(--text-dark)",
              }}
            >
              Catégorie
            </label>
            <input
              placeholder="Ex: Frais de bureau"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: "var(--text-dark)",
              }}
            >
              Montant (FCFA)
            </label>
            <input
              placeholder="Montant"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: "var(--text-dark)",
              }}
            >
              Description
            </label>
            <input
              placeholder="Détails de la dépense"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>
          <button className="btn btn-primary" onClick={create}>
            Ajouter
          </button>
        </div>
      </div>
      <div className="card">
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--text-dark)" }}>
          Historique des dépenses
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Catégorie</th>
                <th>Montant</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "var(--text-light)", padding: "2rem" }}>
                    Aucune dépense enregistrée
                  </td>
                </tr>
              ) : (
                items.map((e) => (
                  <tr key={e.id}>
                    <td>{new Date(e.date).toLocaleDateString("fr-FR")}</td>
                    <td style={{ fontWeight: "500" }}>{e.category}</td>
                    <td style={{ fontWeight: "600", color: "#ef4444" }}>{Number(e.amount).toLocaleString()} FCFA</td>
                    <td>{e.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
