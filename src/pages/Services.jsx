"use client"

import { useEffect, useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 50)
}

export default function Services() {
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    content: "",
    icon: "",
    slug: "",
  })
  const nav = useNavigate()

  useEffect(() => {
    loadServices()
  }, [])

  async function loadServices() {
    try {
      const { data } = await api.get("/api/services")
      setItems(data)
    } catch (err) {
      console.error("Erreur chargement:", err)
    }
  }

  function resetForm() {
    setForm({
      name: "",
      title: "",
      description: "",
      content: "",
      icon: "",
      slug: "",
    })
    setEditingId(null)
  }

  async function handleSubmit() {
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
      }

      if (editingId) {
        await api.put(`/api/admin/services/${editingId}`, payload)
      } else {
        await api.post("/api/admin/services", payload)
      }

      await loadServices()
      resetForm()
    } catch (err) {
      alert("Erreur : " + (err.response?.data?.error || err.message))
    }
  }

  function editItem(item) {
    setForm({
      name: item.name || "",
      title: item.title || "",
      description: item.description || "",
      content: item.content || "",
      icon: item.icon || "",
      slug: item.slug || "",
    })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function remove(id) {
    if (!confirm("Supprimer ce service ?")) return
    try {
      await api.delete(`/api/admin/services/${id}`)
      await loadServices()
    } catch (err) {
      alert("Erreur suppression : " + err.message)
    }
  }

  async function handleIconUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append("file", file)
    try {
      const { data } = await api.post("/api/admin/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setForm({ ...form, icon: data.url })
    } catch (err) {
      alert("Erreur upload : " + err.message)
    }
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem", color: "var(--text-dark)" }}>
        Gestion des Services
      </h1>

      {/* Formulaire */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--text-dark)" }}>
          {editingId ? "Modifier le service" : "Ajouter un service"}
        </h2>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          {/* Ligne 1 : Nom et Titre */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                Nom du service *
              </label>
              <input
                placeholder="Ex: Aménagement foncier"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                style={{ width: "100%", padding: "0.75rem" }}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                Titre (optionnel)
              </label>
              <input
                placeholder="Ex: Aménagement foncier professionnel"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ width: "100%", padding: "0.75rem" }}
              />
            </div>
          </div>

          {/* Description courte */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Description courte
            </label>
            <input
              placeholder="Ex: Lotissement, viabilisation, études topographiques..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ width: "100%", padding: "0.75rem" }}
            />
          </div>

          {/* Contenu détaillé */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Contenu détaillé
            </label>
            <textarea
              placeholder="Description complète du service..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={5}
              style={{ width: "100%", padding: "0.75rem", resize: "vertical" }}
            />
          </div>

          {/* Icône/Image */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Icône ou image
            </label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <label
                className="btn btn-secondary"
                style={{ cursor: "pointer", display: "inline-block", padding: "0.75rem 1.5rem" }}
              >
                {form.icon ? "✓ Image ajoutée" : "Choisir une image"}
                <input type="file" onChange={handleIconUpload} style={{ display: "none" }} accept="image/*" />
              </label>
              {form.icon && (
                <img
                  src={form.icon}
                  alt="Icon preview"
                  style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "8px" }}
                />
              )}
            </div>
          </div>

          {/* Slug (readonly) */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Slug (généré automatiquement)
            </label>
            <input
              value={form.slug}
              readOnly
              style={{ width: "100%", padding: "0.75rem", background: "#f9fafb", cursor: "not-allowed" }}
            />
          </div>

          {/* Boutons */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!form.name}
              style={{ opacity: !form.name ? 0.5 : 1 }}
            >
              {editingId ? "Mettre à jour" : "Ajouter le service"}
            </button>
            {editingId && (
              <button className="btn btn-secondary" onClick={resetForm}>
                Annuler
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Liste des services */}
      <div className="card">
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--text-dark)" }}>
          Liste des services ({items.length})
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Icône</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "var(--text-light)", padding: "2rem" }}>
                    Aucun service enregistré
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt={item.name}
                          style={{ width: "40px", height: "40px", objectFit: "contain" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "#f3f4f6",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                          }}
                        >
                          🏗️
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: "600" }}>{item.title || item.name}</td>
                    <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.description || "—"}
                    </td>
                    <td>
                      <code
                        style={{
                          padding: "0.25rem 0.5rem",
                          background: "#f3f4f6",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                          color: "#6b7280",
                        }}
                      >
                        {item.slug || "—"}
                      </code>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="btn"
                          onClick={() => editItem(item)}
                          style={{ background: "var(--primary-color)", padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                        >
                          Modifier
                        </button>
                        <button
                          className="btn"
                          onClick={() => remove(item.id)}
                          style={{ background: "#ef4444", padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                        >
                          Supprimer
                        </button>
                      </div>
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