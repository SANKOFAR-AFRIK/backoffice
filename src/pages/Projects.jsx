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

export default function Projects() {
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    coverImage: "",
    status: "planned",
    location: "",
    category: "résidentiel",
    surface: "",
    units: "",
    startedAt: "",
    deliveredAt: "",
  })
  const nav = useNavigate()

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      const { data } = await api.get("/api/projects")
      setItems(data)
    } catch (err) {
      console.error("Erreur chargement:", err)
    }
  }

  function resetForm() {
    setForm({
      title: "",
      slug: "",
      description: "",
      coverImage: "",
      status: "planned",
      location: "",
      category: "résidentiel",
      surface: "",
      units: "",
      startedAt: "",
      deliveredAt: "",
    })
    setEditingId(null)
  }

  async function handleSubmit() {
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.title),
        surface: form.surface ? Number(form.surface) : null,
        units: form.units ? Number(form.units) : null,
        startedAt: form.startedAt ? new Date(form.startedAt).toISOString() : null,
        deliveredAt: form.deliveredAt ? new Date(form.deliveredAt).toISOString() : null,
      }

      if (editingId) {
        await api.put(`/api/admin/projects/${editingId}`, payload)
      } else {
        await api.post("/api/projects", payload)
      }

      await loadProjects()
      resetForm()
    } catch (err) {
      alert("Erreur : " + (err.response?.data?.error || err.message))
    }
  }

  function editItem(item) {
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      description: item.description || "",
      coverImage: item.coverImage || "",
      status: item.status || "planned",
      location: item.location || "",
      category: item.category || "résidentiel",
      surface: item.surface || "",
      units: item.units || "",
      startedAt: item.startedAt ? new Date(item.startedAt).toISOString().split("T")[0] : "",
      deliveredAt: item.deliveredAt ? new Date(item.deliveredAt).toISOString().split("T")[0] : "",
    })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function remove(id) {
    if (!confirm("Supprimer ce projet ?")) return
    try {
      await api.delete(`/api/admin/projects/${id}`)
      await loadProjects()
    } catch (err) {
      alert("Erreur suppression : " + err.message)
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append("file", file)
    try {
      const { data } = await api.post("/api/admin/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setForm({ ...form, coverImage: data.url })
    } catch (err) {
      alert("Erreur upload : " + err.message)
    }
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem", color: "var(--text-dark)" }}>
        Gestion des Projets
      </h1>

      {/* Formulaire */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--text-dark)" }}>
          {editingId ? "Modifier le projet" : "Ajouter un projet"}
        </h2>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          {/* Ligne 1 : Titre, Catégorie, Statut */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                Titre du projet *
              </label>
              <input
                placeholder="Ex: Résidence Les Palmiers"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
                style={{ width: "100%", padding: "0.75rem" }}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                Catégorie
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ width: "100%", padding: "0.75rem" }}
              >
                <option value="résidentiel">Résidentiel</option>
                <option value="commercial">Commercial</option>
                <option value="lotissement">Lotissement</option>
                <option value="culturel">Culturel</option>
                <option value="industriel">Industriel</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                Statut
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={{ width: "100%", padding: "0.75rem" }}
              >
                <option value="planned">Planifié</option>
                <option value="ongoing">En cours</option>
                <option value="delivered">Livré</option>
              </select>
            </div>
          </div>

          {/* Ligne 2 : Localisation, Surface, Unités */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                Localisation *
              </label>
              <input
                placeholder="Ex: Cocody, Abidjan"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                style={{ width: "100%", padding: "0.75rem" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                Surface (m²)
              </label>
              <input
                type="number"
                placeholder="Ex: 5000"
                value={form.surface}
                onChange={(e) => setForm({ ...form, surface: e.target.value })}
                style={{ width: "100%", padding: "0.75rem" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                Nombre d'unités
              </label>
              <input
                type="number"
                placeholder="Ex: 50"
                value={form.units}
                onChange={(e) => setForm({ ...form, units: e.target.value })}
                style={{ width: "100%", padding: "0.75rem" }}
              />
            </div>
          </div>

          {/* Ligne 3 : Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                Date de début
              </label>
              <input
                type="date"
                value={form.startedAt}
                onChange={(e) => setForm({ ...form, startedAt: e.target.value })}
                style={{ width: "100%", padding: "0.75rem" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                Date de livraison
              </label>
              <input
                type="date"
                value={form.deliveredAt}
                onChange={(e) => setForm({ ...form, deliveredAt: e.target.value })}
                style={{ width: "100%", padding: "0.75rem" }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Description
            </label>
            <textarea
              placeholder="Description détaillée du projet..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              style={{ width: "100%", padding: "0.75rem", resize: "vertical" }}
            />
          </div>

          {/* Image de couverture */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Image de couverture
            </label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <label
                className="btn btn-secondary"
                style={{ cursor: "pointer", display: "inline-block", padding: "0.75rem 1.5rem" }}
              >
                {form.coverImage ? "✓ Image ajoutée" : "Choisir une image"}
                <input type="file" onChange={handleImageUpload} style={{ display: "none" }} accept="image/*" />
              </label>
              {form.coverImage && (
                <img
                  src={form.coverImage}
                  alt="Preview"
                  style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                />
              )}
            </div>
          </div>

          {/* Boutons */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!form.title || !form.location}
              style={{ opacity: !form.title || !form.location ? 0.5 : 1 }}
            >
              {editingId ? "Mettre à jour" : "Ajouter le projet"}
            </button>
            {editingId && (
              <button className="btn btn-secondary" onClick={resetForm}>
                Annuler
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Liste des projets */}
      <div className="card">
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--text-dark)" }}>
          Liste des projets ({items.length})
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Localisation</th>
                <th>Surface/Unités</th>
                <th>Statut</th>
                <th>Livraison</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", color: "var(--text-light)", padding: "2rem" }}>
                    Aucun projet enregistré
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.coverImage ? (
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "80px",
                            height: "50px",
                            background: "#f3f4f6",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            color: "#9ca3af",
                          }}
                        >
                          Pas d'img
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: "600" }}>{item.title}</td>
                    <td>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "6px",
                          fontSize: "0.875rem",
                          background: "#f3f4f6",
                          color: "#374151",
                        }}
                      >
                        {item.category || "—"}
                      </span>
                    </td>
                    <td>{item.location || "—"}</td>
                    <td>
                      {item.surface ? `${Number(item.surface).toLocaleString()} m²` : "—"}
                      {item.units ? ` / ${item.units} unités` : ""}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          background:
                            item.status === "delivered"
                              ? "#dcfce7"
                              : item.status === "ongoing"
                                ? "#dbeafe"
                                : "#fef3c7",
                          color:
                            item.status === "delivered"
                              ? "#166534"
                              : item.status === "ongoing"
                                ? "#1e40af"
                                : "#92400e",
                        }}
                      >
                        {item.status === "delivered"
                          ? "Livré"
                          : item.status === "ongoing"
                            ? "En cours"
                            : "Planifié"}
                      </span>
                    </td>
                    <td>
                      {item.deliveredAt
                        ? new Date(item.deliveredAt).toLocaleDateString("fr-FR")
                        : "—"}
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