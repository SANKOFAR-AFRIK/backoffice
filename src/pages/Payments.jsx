"use client"

import { useEffect, useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"

export default function Payments() {
  const [items, setItems] = useState([])
  const [deals, setDeals] = useState([])
  const [form, setForm] = useState({ dealId: "", amount: "", method: "cash" })
  const nav = useNavigate()
  useEffect(() => {
    ;(async () => {
      try {
        setItems((await api.get("/api/admin/payments")).data)
        setDeals((await api.get("/api/admin/deals")).data)
      } catch {
        nav("/login")
      }
    })()
  }, [])
  async function create() {
    const { data } = await api.post("/api/admin/payments", {
      dealId: Number(form.dealId),
      amount: Number(form.amount),
      method: form.method,
    })
    setItems([data, ...items])
  }
  return (
    <div className="container">
      <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem", color: "var(--text-dark)" }}>
        Paiements
      </h1>
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--text-dark)" }}>
          Enregistrer un paiement
        </h2>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
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
              Affaire
            </label>
            <select
              value={form.dealId}
              onChange={(e) => setForm({ ...form, dealId: e.target.value })}
              style={{ width: "100%" }}
            >
              <option value="">Sélectionner une affaire</option>
              {deals.map((d) => (
                <option key={d.id} value={d.id}>
                  #{d.id} - {d.client?.name}
                </option>
              ))}
            </select>
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
              Mode de paiement
            </label>
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
              style={{ width: "100%" }}
            >
              <option value="cash">Espèces</option>
              <option value="bank">Virement bancaire</option>
              <option value="mobile">Mobile Money</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={create}>
            Ajouter
          </button>
        </div>
      </div>
      <div className="card">
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--text-dark)" }}>
          Historique des paiements
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Affaire</th>
                <th>Montant</th>
                <th>Mode</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "var(--text-light)", padding: "2rem" }}>
                    Aucun paiement enregistré
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id}>
                    <td>{new Date(p.date).toLocaleDateString("fr-FR")}</td>
                    <td style={{ fontWeight: "600" }}>#{p.dealId}</td>
                    <td style={{ fontWeight: "600", color: "var(--secondary-color)" }}>
                      {Number(p.amount).toLocaleString()} FCFA
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          background: p.method === "cash" ? "#dcfce7" : p.method === "bank" ? "#dbeafe" : "#fef3c7",
                          color: p.method === "cash" ? "#166534" : p.method === "bank" ? "#1e40af" : "#92400e",
                        }}
                      >
                        {p.method === "cash" ? "Espèces" : p.method === "bank" ? "Virement" : "Mobile Money"}
                      </span>
                    </td>
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
