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

export default function Properties() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    location: "",
    category: "",
    bedrooms: "",
    bathrooms: "",
    area_m2: "",
    surfaceHabitable: "",
    type: "",
    yearOfConstruction: "",
    capacity: "",
    status: "sale",
    mainImage: ""
  })
  const nav = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        setItems((await api.get("/api/properties")).data)
      } catch {
        nav("/login")
      }
    })()
  }, [])

  async function create() {
    const payload = {
      ...form,
      price: form.price ? Number(form.price) : null,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      area_m2: form.area_m2 ? Number(form.area_m2) : null,
      surfaceHabitable: form.surfaceHabitable ? Number(form.surfaceHabitable) : null,
      yearOfConstruction: form.yearOfConstruction ? Number(form.yearOfConstruction) : null,
      capacity: form.capacity ? Number(form.capacity) : null,
      slug: form.slug || slugify(form.title)
    }

    const { data } = await api.post("/api/admin/properties", payload)
    setItems([data, ...items])

    // Reset form
    setForm({
      title: "",
      slug: "",
      description: "",
      price: "",
      location: "",
      category: "",
      bedrooms: "",
      bathrooms: "",
      area_m2: "",
      surfaceHabitable: "",
      type: "",
      yearOfConstruction: "",
      capacity: "",
      status: "sale",
      mainImage: ""
    })
  }

  async function remove(id) {
    await api.delete(`/api/admin/properties/${id}`)
    setItems(items.filter((i) => i.id !== id))
  }

  return (
    <div className="container">
      <h1 className="page-title">Offres immobilières</h1>

      {/* Formulaire d’ajout */}
      <div className="card">
        <h2 className="section-title">Ajouter une offre</h2>
        <div className="grid-form">
          
          {/* Champs principaux */}
          <input placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} />
          <input placeholder="Localisation" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input placeholder="Prix (FCFA)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          {/* Autres caractéristiques */}
          <input placeholder="Catégorie" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input placeholder="Chambres" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
          <input placeholder="Salles de bain" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
          <input placeholder="Superficie (m²)" value={form.area_m2} onChange={(e) => setForm({ ...form, area_m2: e.target.value })} />
          <input placeholder="Surface habitable" value={form.surfaceHabitable} onChange={(e) => setForm({ ...form, surfaceHabitable: e.target.value })} />
          <input placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <input placeholder="Année de construction" value={form.yearOfConstruction} onChange={(e) => setForm({ ...form, yearOfConstruction: e.target.value })} />
          <input placeholder="Capacité" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />

          {/* Statut */}
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="sale">À vendre</option>
            <option value="rent">À louer</option>
            <option value="sold">Vendu</option>
          </select>

          {/* Upload image */}
          <label className="btn btn-secondary upload-btn">
            {form.mainImage ? "✓ Image ajoutée" : "Choisir une image"}
            <input type="file" onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              const fd = new FormData()
              fd.append("file", f)
              const { data } = await api.post("/api/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } })
              setForm({ ...form, mainImage: data.url })
            }} style={{ display: "none" }} />
          </label>

          <button className="btn btn-primary" onClick={create}>Ajouter l'offre</button>
        </div>
      </div>

      {/* Liste des biens */}
      <div className="card">
        <h2 className="section-title">Liste des offres</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Localisation</th>
                <th>Prix</th>
                <th>Chambres</th>
                <th>Salles de bain</th>
                <th>Surface</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-message">Aucune offre enregistrée</td>
                </tr>
              ) : (
                items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.title}</td>
                    <td>{i.location}</td>
                    <td className="price">{i.price ? Number(i.price).toLocaleString() + " FCFA" : "—"}</td>
                    <td>{i.bedrooms || "—"}</td>
                    <td>{i.bathrooms || "—"}</td>
                    <td>{i.area_m2 ? i.area_m2 + " m²" : "—"}</td>
                    <td>{i.status}</td>
                    <td><button onClick={() => remove(i.id)} className="btn btn-delete">Supprimer</button></td>
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
