"use client"

import { useEffect, useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"

export default function Invoices() {
  const [items, setItems] = useState([])
  const [deals, setDeals] = useState([])
  const [form, setForm] = useState({ dealId: "", amount: "" })
  const nav = useNavigate()
  useEffect(() => {
    ;(async () => {
      try {
        setItems((await api.get("/api/admin/invoices")).data)
        setDeals((await api.get("/api/admin/deals")).data)
      } catch {
        nav("/login")
      }
    })()
  }, [])
  async function create() {
    const { data } = await api.post("/api/admin/invoices", { dealId: Number(form.dealId), amount: Number(form.amount) })
    setItems([data, ...items])
  }
  return (
    <div className="container">
      <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem", color: "var(--text-dark)" }}>Factures</h1>
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--text-dark)" }}>
          Créer une facture
        </h2>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
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
              Montant TTC (FCFA)
            </label>
            <input
              placeholder="Montant"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>
          <button className="btn btn-primary" onClick={create}>
            Créer
          </button>
        </div>
      </div>
      <div className="card">
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--text-dark)" }}>
          Liste des factures
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Affaire</th>
                <th>Date</th>
                <th>Montant</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "var(--text-light)", padding: "2rem" }}>
                    Aucune facture créée
                  </td>
                </tr>
              ) : (
                items.map((i) => (
                  <tr key={i.id}>
                    <td style={{ fontWeight: "600" }}>{i.number}</td>
                    <td>#{i.dealId}</td>
                    <td>{new Date(i.issueDate).toLocaleDateString("fr-FR")}</td>
                    <td style={{ fontWeight: "600", color: "var(--primary-color)" }}>
                      {Number(i.amount).toLocaleString()} FCFA
                    </td>
                    <td>
                      <a
                        className="btn btn-secondary"
                        href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/api/admin/invoices/${i.id}/pdf`}
                        target="_blank"
                        style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                        rel="noreferrer"
                      >
                        Télécharger PDF
                      </a>
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
