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
              width: 58,
              height: 58,
              background: "linear-gradient(135deg, #4f7cff 0%, #2563eb 100%)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 20,
              color: "#ffffff",
              letterSpacing: 1,
              margin: "0 auto 16px",
              boxShadow: "0 6px 20px rgba(79, 124, 255, 0.35)",
            }}
          >
            TMS
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: colors.text }}>
            TMS Portal
          </h1>
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
      </div>
    </div>
  );
}

export default LoginPage;
