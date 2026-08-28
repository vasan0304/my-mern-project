import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Spinner } from "../../components/UI";
import { colors } from "../../utils/theme";

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/complaints/dashboard")
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: "Total", value: stats.total, color: colors.accent, icon: "📋" },
        { label: "Pending", value: stats.pending, color: colors.warning, icon: "⏳" },
        { label: "Assigned", value: stats.assigned, color: "#a855f7", icon: "👤" },
        { label: "In-Progress", value: stats.inProgress, color: "#06b6d4", icon: "⚙️" },
        { label: "On Hold", value: stats.onHold, color: colors.textDim, icon: "⏸️" },
        { label: "Completed", value: stats.completed, color: colors.success, icon: "✅" },
      ]
    : [];

  return (
    <div>
      <h1 style={{ margin: "0 0 32px", fontSize: 28, fontWeight: 800, color: colors.text }}>
        Dashboard
      </h1>

      {loading ? (
        <Spinner />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {cards.map((c) => (
            <div
              key={c.label}
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderTop: `3px solid ${c.color}`,
                borderRadius: 12,
                padding: 20,
                transition: "transform 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
              <div
                style={{ fontSize: 36, fontWeight: 800, color: c.color, lineHeight: 1 }}
              >
                {c.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: colors.textDim,
                  marginTop: 4,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {c.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
