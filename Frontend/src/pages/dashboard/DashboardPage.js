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
        { label: "Total Complaints", value: stats.total, color: colors.accent, marker: "OVERVIEW" },
        { label: "Pending", value: stats.pending, color: colors.warning, marker: "PENDING" },
        { label: "Assigned", value: stats.assigned, color: "#a855f7", marker: "ASSIGNED" },
        { label: "In-Progress", value: stats.inProgress, color: "#06b6d4", marker: "IN-PROGRESS" },
        { label: "On Hold", value: stats.onHold, color: colors.textDim, marker: "ON HOLD" },
        { label: "Completed", value: stats.completed, color: colors.success, marker: "RESOLVED" },
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
                padding: "20px 20px 18px",
                transition: "all 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Professional Status Marker */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "3px 8px",
                    borderRadius: 20,
                    background: `${c.color}15`,
                    border: `1px solid ${c.color}35`,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: c.color,
                      boxShadow: `0 0 6px ${c.color}`,
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: c.color,
                      letterSpacing: 0.6,
                      textTransform: "uppercase",
                    }}
                  >
                    {c.marker}
                  </span>
                </div>
              </div>

              <div
                style={{ fontSize: 36, fontWeight: 800, color: c.color, lineHeight: 1 }}
              >
                {c.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: colors.textDim,
                  marginTop: 8,
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
