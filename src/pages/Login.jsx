import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"

export default function Login() {
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("admin123")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setErr("")
    setLoading(true)

    try {
      console.log("🔐 Tentative de connexion...", { email })
      const { data } = await api.post("/api/auth/login", { email, password })
      
      console.log("✅ Connexion réussie:", data)
      localStorage.setItem("token", data.token)
      nav("/")
    } catch (e) {
      console.error("❌ Erreur de connexion:", e.response || e)
      setErr(e.response?.data?.error || "Identifiants invalides")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)",
        padding: "2rem",
      }}
    >
      <div className="card" style={{ maxWidth: 440, width: "100%", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text-dark)", marginBottom: "0.5rem" }}>
            Connexion
          </h1>
          <p style={{ color: "var(--text-light)", fontSize: "0.95rem" }}>Accédez à votre espace d'administration</p>
        </div>
        
        {err && (
          <div
            style={{
              padding: "1rem",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            {err}
          </div>
        )}
        
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@exemple.com"
              style={{ width: "100%", padding: "0.75rem" }}
              required
              disabled={loading}
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
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "0.75rem" }}
              required
              disabled={loading}
            />
          </div>
          
          <button 
            className="btn btn-primary" 
            style={{ width: "100%", padding: "0.875rem", fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        
        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-light)" }}>
          <p>Identifiants par défaut :</p>
          <p style={{ fontFamily: "monospace", marginTop: "0.5rem" }}>admin@example.com / admin123</p>
        </div>
      </div>
    </div>
  )
}