import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input, Btn } from "../components/UI";
import { colors } from "../utils/theme";

function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("All fields required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 20,
          padding: 48,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: colors.accent,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              margin: "0 auto 16px",
            }}
          >
            🎫

            
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: colors.text }}>
            TMS Portal
          </h1>
          <p style={{ margin: "6px 0 0", color: colors.textMuted, fontSize: 14 }}>
            Ticket Management System
          </p>
        </div>

        <Input
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        {error && (
          <div
            style={{
              color: colors.danger,
              fontSize: 13,
              marginBottom: 16,
              padding: "10px 14px",
              background: colors.dangerLight,
              borderRadius: 8,
            }}
          >
            {error}
          </div>
        )}

        <Btn
          onClick={handleLogin}
          size="lg"
          style={{ width: "100%", justifyContent: "center" }}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Btn>

        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: colors.accentLight,
            borderRadius: 10,
            fontSize: 12,
            color: colors.textDim,
          }}
        >
          <strong style={{ color: colors.accent }}>First time setup:</strong> Use Postman to POST
          to{" "}
          <code style={{ color: colors.text }}>/api/auth/register</code> to create a SuperAdmin
          user.
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
