"use client"

import { useEffect, useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"

export default function Deals() {
  const [items, setItems] = useState([])
  const [clients, setClients] = useState([])
  const [properties, setProperties] = useState([])
  const [form, setForm] = useState({
    clientId: "",
    propertyId: "",
    type: "sale",
    status: "draft",
    basePrice: "",
    discount: "",
    taxRate: "18",
    commissionRate: "",
  })
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [dealsData, clientsData, propertiesData] = await Promise.all([
        api.get("/api/admin/deals"),
        api.get("/api/admin/clients"),
        api.get("/api/properties")
      ])
      setItems(dealsData.data)
      setClients(clientsData.data)
      setProperties(propertiesData.data)
    } catch (err) {
      console.error("Erreur chargement:", err)
      if (err.response?.status === 401) nav("/login")
    } finally {
      setLoading(false)
    }
  }

  async function create() {
    if (!form.clientId) {
      alert("⚠️ Veuillez sélectionner un client")
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        clientId: Number(form.clientId),
        propertyId: form.propertyId ? Number(form.propertyId) : null,
        basePrice: form.basePrice ? Number(form.basePrice) : 0,
        discount: form.discount ? Number(form.discount) : 0,
        taxRate: form.taxRate ? Number(form.taxRate) : 0,
        commissionRate: form.commissionRate ? Number(form.commissionRate) : 0,
      }
      const { data } = await api.post("/api/admin/deals", payload)
      setItems([data, ...items])
      setForm({
        clientId: "",
        propertyId: "",
        type: "sale",
        status: "draft",
        basePrice: "",
        discount: "",
        taxRate: "18",
        commissionRate: "",
      })
    } catch (err) {
      alert("❌ Erreur : " + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  function calculateTotal() {
    const base = Number(form.basePrice) || 0
    const disc = Number(form.discount) || 0
    const tax = Number(form.taxRate) || 0
    const subtotal = base - disc
    const total = subtotal + (subtotal * tax / 100)
    return total
  }

  if (loading && items.length === 0) {
    return (
      <div className="container">
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-light)" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
          <p>Chargement des affaires...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="page-title">Affaires</h1>

      {/* Formulaire */}
      <div className="card">
        <h2 className="section-title">📋 Créer une affaire</h2>
        
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {/* Ligne 1 : Client et Bien */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label>Client *</label>
              <select
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                disabled={loading}
              >
                <option value="">Sélectionner un client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.email && `(${c.email})`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Bien (optionnel)</label>
              <select
                value={form.propertyId}
                onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
                disabled={loading}
              >
                <option value="">Aucun bien lié</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} - {p.location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ligne 2 : Type et Statut */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label>Type d'affaire</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                disabled={loading}
              >
                <option value="sale">Vente</option>
                <option value="purchase">Achat</option>
                <option value="rent">Location</option>
              </select>
            </div>
            <div>
              <label>Statut</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                disabled={loading}
              >
                <option value="draft">Brouillon</option>
                <option value="pending">En attente</option>
                <option value="active">Active</option>
                <option value="closed">Clôturée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>

          {/* Ligne 3 : Prix et Remise */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label>Prix de base (FCFA) *</label>
              <input
                type="number"
                placeholder="Ex: 5000000"
                value={form.basePrice}
                onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                disabled={loading}
              />
            </div>
            <div>
              <label>Remise (FCFA)</label>
              <input
                type="number"
                placeholder="Ex: 500000"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Ligne 4 : Taxe et Commission */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label>Taux de taxe (%)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 18"
                value={form.taxRate}
                onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
                disabled={loading}
              />
            </div>
            <div>
              <label>Taux de commission (%)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 5"
                value={form.commissionRate}
                onChange={(e) => setForm({ ...form, commissionRate: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Résumé */}
          {form.basePrice && (
            <div style={{ 
              background: "var(--primary-light)", 
              padding: "1rem", 
              borderRadius: "8px",
              border: "1px solid var(--primary)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>Prix de base:</span>
                <strong>{Number(form.basePrice).toLocaleString()} FCFA</strong>
              </div>
              {form.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "var(--danger)" }}>
                  <span>Remise:</span>
                  <strong>- {Number(form.discount).toLocaleString()} FCFA</strong>
                </div>
              )}
              {form.taxRate > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>Taxe ({form.taxRate}%):</span>
                  <strong>+ {((Number(form.basePrice) - Number(form.discount || 0)) * Number(form.taxRate) / 100).toLocaleString()} FCFA</strong>
                </div>
              )}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                paddingTop: "0.5rem", 
                borderTop: "2px solid var(--primary)",
                fontSize: "1.1rem"
              }}>
                <span><strong>Total TTC:</strong></span>
                <strong style={{ color: "var(--primary)" }}>{calculateTotal().toLocaleString()} FCFA</strong>
              </div>
            </div>
          )}

          {/* Bouton */}
          <button 
            className="btn btn-primary" 
            onClick={create}
            disabled={loading || !form.clientId || !form.basePrice}
          >
            {loading ? "⏳ Création..." : "✅ Créer l'affaire"}
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="card">
        <h2 className="section-title">📊 Liste des affaires ({items.length})</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Bien</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Prix de base</th>
                <th>Total TTC</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-message">
                    Aucune affaire enregistrée
                  </td>
                </tr>
              ) : (
                items.map((d) => {
                  const subtotal = Number(d.basePrice) - Number(d.discount)
                  const total = subtotal + (subtotal * Number(d.taxRate) / 100)
                  
                  return (
                    <tr key={d.id}>
                      <td style={{ fontWeight: "600" }}>#{d.id}</td>
                      <td>{d.client?.name || "—"}</td>
                      <td>{d.property?.title || "—"}</td>
                      <td>
                        <span
                          className="status"
                          style={{
                            background: d.type === "sale" ? "#dcfce7" : d.type === "purchase" ? "#dbeafe" : "#fef3c7",
                            color: d.type === "sale" ? "#047857" : d.type === "purchase" ? "#1e40af" : "#92400e",
                          }}
                        >
                          {d.type === "sale" ? "Vente" : d.type === "purchase" ? "Achat" : "Location"}
                        </span>
                      </td>
                      <td>
                        <span
                          className="status"
                          style={{
                            background: 
                              d.status === "closed" ? "#dcfce7" : 
                              d.status === "active" ? "#dbeafe" : 
                              d.status === "cancelled" ? "#fee2e2" : "#fef3c7",
                            color: 
                              d.status === "closed" ? "#047857" : 
                              d.status === "active" ? "#1e40af" : 
                              d.status === "cancelled" ? "#991b1b" : "#92400e",
                          }}
                        >
                          {d.status === "draft" ? "Brouillon" : 
                           d.status === "pending" ? "En attente" :
                           d.status === "active" ? "Active" :
                           d.status === "closed" ? "Clôturée" : "Annulée"}
                        </span>
                      </td>
                      <td className="price">{Number(d.basePrice).toLocaleString()} FCFA</td>
                      <td style={{ fontWeight: "600", color: "var(--primary)", fontSize: "1rem" }}>
                        {total.toLocaleString()} FCFA
                      </td>
                      <td>{new Date(d.createdAt).toLocaleDateString("fr-FR")}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}