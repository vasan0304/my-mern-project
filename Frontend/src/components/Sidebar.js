import { useAuth } from "../context/AuthContext";
import { Btn } from "./UI";
import { colors } from "../utils/theme";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", markerColor: "#4f7cff", all: true },
  { id: "complaints", label: "Complaints", markerColor: "#f59e0b", all: true },
  { id: "departments", label: "Departments", markerColor: "#8b5cf6", superAdmin: true },
  { id: "programmes", label: "Programmes", markerColor: "#06b6d4", superAdmin: true },
  { id: "blocks", label: "Blocks", markerColor: "#10b981", superAdmin: true },
  { id: "rooms", label: "Rooms", markerColor: "#6366f1", superAdmin: true },
  { id: "roles", label: "Roles", markerColor: "#ec4899", superAdmin: true },
  { id: "users", label: "Users", markerColor: "#38bdf8", superAdmin: true },
  { id: "reports", label: "Reports", markerColor: "#a855f7", superAdmin: true },
];

function Sidebar({ active, setActive }) {
  const { user, logout, isSuperAdmin } = useAuth();

  const visibleNav = NAV_ITEMS.filter((n) => n.all || (n.superAdmin && isSuperAdmin));

  return (
    <div
      style={{
        width: 240,
        background: colors.surface,
        borderRight: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg, #4f7cff 0%, #2563eb 100%)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 12,
              color: "#ffffff",
              letterSpacing: 0.8,
              boxShadow: "0 2px 8px rgba(79, 124, 255, 0.3)",
            }}
          >
            TMS
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, letterSpacing: 0.5 }}>TMS</div>
            <div style={{ fontSize: 11, color: colors.textMuted }}>Ticket System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {visibleNav.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: active === item.id ? colors.accentLight : "transparent",
              color: active === item.id ? colors.text : colors.textDim,
              fontWeight: active === item.id ? 700 : 500,
              fontSize: 13,
              marginBottom: 2,
              textAlign: "left",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (active !== item.id) e.currentTarget.style.background = colors.surfaceHover;
            }}
            onMouseLeave={(e) => {
              if (active !== item.id) e.currentTarget.style.background = "transparent";
            }}
          >
            {/* Marker Indicator */}
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: active === item.id ? "2px" : "50%",
                background: active === item.id ? item.markerColor : colors.border,
                boxShadow: active === item.id ? `0 0 8px ${item.markerColor}` : "none",
                display: "inline-block",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
            />
            <span style={{ flex: 1 }}>{item.label}</span>
            {active === item.id && (
              <div
                style={{
                  width: 3,
                  height: 14,
                  borderRadius: 2,
                  background: item.markerColor,
                  boxShadow: `0 0 6px ${item.markerColor}`,
                }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* User info */}
      <div style={{ padding: 16, borderTop: `1px solid ${colors.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: colors.accentLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.accent,
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            {user?.userName?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{user?.userName}</div>
            <div style={{ fontSize: 11, color: colors.textMuted }}>{user?.role?.roleName}</div>
          </div>
        </div>
        <Btn
          variant="ghost"
          size="sm"
          onClick={logout}
          style={{ width: "100%", justifyContent: "center" }}
        >
          Sign Out
        </Btn>
      </div>
    </div>
  );
}

export default Sidebar;
