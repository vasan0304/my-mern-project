import { useEffect } from "react";
import { colors, STATUS_COLORS } from "../utils/theme";

// ─── BADGE ─────────────────────────────────────────────────────────────────────
export function Badge({ status }) {
  const s = STATUS_COLORS[status] || { bg: colors.accentLight, text: colors.accent };
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
        display: "inline-block",
      }}
    >
      {status}
    </span>
  );
}

// ─── SPINNER ───────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 48 }}>
      <div
        style={{
          width: 32,
          height: 32,
          border: `3px solid ${colors.border}`,
          borderTop: `3px solid ${colors.accent}`,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── CARD ──────────────────────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── INPUT ─────────────────────────────────────────────────────────────────────
export function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            color: colors.textDim,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 6,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          color: colors.text,
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
          ...props.style,
        }}
        onFocus={(e) => (e.target.style.borderColor = colors.accent)}
        onBlur={(e) => (e.target.style.borderColor = colors.border)}
      />
    </div>
  );
}

// ─── SELECT ────────────────────────────────────────────────────────────────────
export function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            color: colors.textDim,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 6,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}
      <select
        {...props}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          color: colors.text,
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          ...props.style,
        }}
        onFocus={(e) => (e.target.style.borderColor = colors.accent)}
        onBlur={(e) => (e.target.style.borderColor = colors.border)}
      >
        {children}
      </select>
    </div>
  );
}

// ─── TEXTAREA ──────────────────────────────────────────────────────────────────
export function Textarea({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            color: colors.textDim,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </label>
      )}
      <textarea
        {...props}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          color: colors.text,
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          resize: "vertical",
          fontFamily: "inherit",
          ...props.style,
        }}
        onFocus={(e) => (e.target.style.borderColor = colors.accent)}
        onBlur={(e) => (e.target.style.borderColor = colors.border)}
      />
    </div>
  );
}

// ─── BUTTON ────────────────────────────────────────────────────────────────────
export function Btn({ children, variant = "primary", size = "md", style = {}, ...props }) {
  const base = {
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };
  const sizes = {
    sm: { padding: "6px 14px", fontSize: 12 },
    md: { padding: "10px 20px", fontSize: 14 },
    lg: { padding: "14px 28px", fontSize: 16 },
  };
  const variants = {
    primary: { background: colors.accent, color: "#fff" },
    danger: { background: colors.danger, color: "#fff" },
    ghost: { background: "transparent", color: colors.textDim, border: `1px solid ${colors.border}` },
    success: { background: colors.success, color: "#fff" },
  };
  return (
    <button
      {...props}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </button>
  );
}

// ─── MODAL ─────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: colors.surface,
          borderRadius: 16,
          padding: 32,
          width: "100%",
          maxWidth: 520,
          border: `1px solid ${colors.border}`,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, color: colors.text, fontWeight: 700 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: colors.textMuted, cursor: "pointer", fontSize: 20 }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── TABLE ─────────────────────────────────────────────────────────────────────
export function Table({ columns, data, actions }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: "left",
                  padding: "10px 16px",
                  color: colors.textDim,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                {c.label}
              </th>
            ))}
            {actions && (
              <th style={{ padding: "10px 16px", borderBottom: `1px solid ${colors.border}` }} />
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                style={{ textAlign: "center", padding: 32, color: colors.textMuted }}
              >
                No records found
              </td>
            </tr>
          )}
          {data.map((row, i) => (
            <tr
              key={row._id || i}
              style={{ transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = colors.surfaceHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    padding: "12px 16px",
                    borderBottom: `1px solid ${colors.border}`,
                    fontSize: 13,
                    color: colors.text,
                  }}
                >
                  {c.render ? c.render(row) : row[c.key] ?? "—"}
                </td>
              ))}
              {actions && (
                <td style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.border}` }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── TOAST ─────────────────────────────────────────────────────────────────────
export function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const typeColors = { success: "#22c55e", error: "#ef4444", info: colors.accent };
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: colors.surface,
        border: `1px solid ${typeColors[type] || colors.border}`,
        borderLeft: `4px solid ${typeColors[type] || colors.accent}`,
        borderRadius: 10,
        padding: "14px 20px",
        color: colors.text,
        fontSize: 14,
        fontWeight: 500,
        maxWidth: 320,
        animation: "slideIn 0.3s ease",
      }}
    >
      <style>{`@keyframes slideIn { from { transform: translateX(100px); opacity:0 } to { transform: translateX(0); opacity:1 } }`}</style>
      {message}
    </div>
  );
}
