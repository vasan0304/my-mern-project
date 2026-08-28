export const colors = {
  bg: "#0d0f14",
  surface: "#141720",
  surfaceHover: "#1a1f2e",
  border: "#252a3a",
  accent: "#4f7cff",
  accentHover: "#3a63e8",
  accentLight: "rgba(79,124,255,0.12)",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  dangerLight: "rgba(239,68,68,0.12)",
  successLight: "rgba(34,197,94,0.12)",
  warningLight: "rgba(245,158,11,0.12)",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#94a3b8",
};

export const STATUS_COLORS = {
  Pending: { bg: colors.warningLight, text: colors.warning },
  Assigned: { bg: colors.accentLight, text: colors.accent },
  "In-Progress": { bg: "rgba(168,85,247,0.12)", text: "#a855f7" },
  "On Hold": { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" },
  Completed: { bg: colors.successLight, text: colors.success },
};

export const COMPLAINT_TYPES = [
  "PC Hardware",
  "PC Software",
  "Application Issues",
  "Network",
  "Electronics",
  "Plumbing",
  "Other",
];

export const COMPLAINT_STATUSES = [
  "Pending",
  "Assigned",
  "In-Progress",
  "On Hold",
  "Completed",
];

export const STAFF_STATUSES = ["In-Progress", "On Hold", "Completed"];
