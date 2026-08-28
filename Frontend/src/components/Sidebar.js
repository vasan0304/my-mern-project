import { useAuth } from "../context/AuthContext";
import { Btn } from "./UI";
import { colors } from "../utils/theme";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "◉", all: true },
  { id: "complaints", label: "Complaints", icon: "🎫", all: true },
  { id: "departments", label: "Departments", icon: "🏢", superAdmin: true },
  { id: "programmes", label: "Programmes", icon: "📚", superAdmin: true },
  { id: "blocks", label: "Blocks", icon: "🏗️", superAdmin: true },
  { id: "rooms", label: "Rooms", icon: "🚪", superAdmin: true },
  { id: "roles", label: "Roles", icon: "🔑", superAdmin: true },
  { id: "users", label: "Users", icon: "👥", superAdmin: true },
  { id: "reports", label: "Reports", icon: "📊", superAdmin: true },
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
              width: 36,
              height: 36,
              background: colors.accent,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🎫
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
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: active === item.id ? colors.accentLight : "transparent",
              color: active === item.id ? colors.accent : colors.textDim,
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
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
            {active === item.id && (
              <div
                style={{
                  marginLeft: "auto",
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  background: colors.accent,
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
