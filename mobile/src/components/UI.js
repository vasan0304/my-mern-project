import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal as RNModal,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { colors, STATUS_COLORS } from "../utils/theme";

// ─── BADGE ─────────────────────────────────────────────────────────────────────
export function Badge({ status }) {
  const s = STATUS_COLORS[status] || { bg: colors.accentLight, text: colors.accent };
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.text }]}>{status}</Text>
    </View>
  );
}

// ─── SPINNER ───────────────────────────────────────────────────────────────────
export function Spinner({ size = "large", color = colors.accent }) {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

// ─── CARD ──────────────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ─── JOBIE CARD ────────────────────────────────────────────────────────────────
export function JobieCard({
  category,
  title,
  subtitle,
  description,
  tags = [],
  iconLetter = "T",
  iconColor = colors.accent,
  actions,
  style,
}) {
  return (
    <View style={[styles.jobieCard, style]}>
      {/* Top Header: Category & Squircle emblem */}
      <View style={styles.jobieCardHeader}>
        <View style={styles.jobieCategoryCol}>
          {category && <Text style={styles.jobieCategoryText}>{category}</Text>}
          <Text style={styles.jobieTitleText} numberOfLines={1}>{title}</Text>
        </View>
        <View style={[styles.jobieSquircle, { backgroundColor: `${iconColor}20`, borderColor: `${iconColor}40` }]}>
          <Text style={[styles.jobieSquircleText, { color: iconColor }]}>{iconLetter}</Text>
        </View>
      </View>

      {/* Subtitle / Key value with status dot */}
      {subtitle && (
        <View style={styles.jobieSubtitleRow}>
          <View style={[styles.jobieDot, { backgroundColor: iconColor }]} />
          <Text style={styles.jobieSubtitleText} numberOfLines={1}>{subtitle}</Text>
        </View>
      )}

      {/* Description text */}
      {description ? (
        <Text style={styles.jobieDescText} numberOfLines={2}>{description}</Text>
      ) : null}

      {/* Footer: Tags on left, Action buttons on right */}
      <View style={styles.jobieFooter}>
        <View style={styles.jobieTagsRow}>
          {tags.map((tag, i) => {
            const statusConfig = STATUS_COLORS[tag];
            if (statusConfig) {
              return (
                <View
                  key={i}
                  style={[
                    styles.jobiePillTag,
                    {
                      backgroundColor: statusConfig.bg,
                      borderColor: statusConfig.text,
                    },
                  ]}
                >
                  <Text style={[styles.jobiePillTagText, { color: statusConfig.text, fontWeight: "800" }]}>
                    {tag}
                  </Text>
                </View>
              );
            }
            return (
              <View key={i} style={styles.jobiePillTag}>
                <Text style={styles.jobiePillTagText}>{tag}</Text>
              </View>
            );
          })}
        </View>
        {actions && <View style={styles.jobieActionsRow}>{actions}</View>}
      </View>
    </View>
  );
}

// ─── JOBIE GRID ────────────────────────────────────────────────────────────────
export function JobieGrid({ children, style }) {
  return <View style={[styles.jobieGrid, style]}>{children}</View>;
}

// ─── PILL CHIPS ────────────────────────────────────────────────────────────────
export function PillChips({ items = [], selected, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillChipsContainer}>
      {items.map((item, idx) => {
        const isSelected = selected === item.value || selected === item;
        const val = item.value !== undefined ? item.value : item;
        const label = item.label || item;
        return (
          <TouchableOpacity
            key={idx}
            activeOpacity={0.7}
            onPress={() => onSelect(val)}
            style={[styles.pillChip, isSelected && styles.pillChipActive]}
          >
            <Text style={[styles.pillChipText, isSelected && styles.pillChipTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── INPUT ─────────────────────────────────────────────────────────────────────
export function Input({ label, value, onChangeText, placeholder, secureTextEntry, style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.inputGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          focused && styles.inputFocused,
          style,
        ]}
        {...props}
      />
    </View>
  );
}

// ─── SELECT / PICKER MODAL ─────────────────────────────────────────────────────
export function Select({ label, value, options = [], onSelect, placeholder = "Select an option" }) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((o) => o.value === value || o._id === value || o.id === value);
  const displayLabel = selectedOption
    ? selectedOption.label || selectedOption.name || selectedOption.departmentName || selectedOption.programmeName || selectedOption.blockName || selectedOption.roomNumber || selectedOption.roleName || selectedOption.userName || selectedOption.value
    : placeholder;

  return (
    <View style={styles.inputGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.selectButton}
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.selectButtonText, !selectedOption && { color: colors.textMuted }]}>
          {displayLabel}
        </Text>
        <Text style={styles.selectArrow}>▾</Text>
      </TouchableOpacity>

      <RNModal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.pickerBackdrop}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{label || "Select"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 300 }}>
              {options.map((opt, idx) => {
                const optVal = opt.value !== undefined ? opt.value : opt._id || opt.id || opt;
                const optLabel = opt.label || opt.name || opt.departmentName || opt.programmeName || opt.blockName || opt.roomNumber || opt.roleName || opt.userName || optVal;
                const isSelected = optVal === value;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                    onPress={() => {
                      onSelect(optVal);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={[styles.pickerItemText, isSelected && { color: colors.accent, fontWeight: "700" }]}>
                      {optLabel}
                    </Text>
                    {isSelected && <Text style={{ color: colors.accent, fontWeight: "bold" }}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </RNModal>
    </View>
  );
}

// ─── TEXTAREA ──────────────────────────────────────────────────────────────────
export function Textarea({ label, value, onChangeText, placeholder, numberOfLines = 3, style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.inputGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline
        numberOfLines={numberOfLines}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          styles.textarea,
          focused && styles.inputFocused,
          style,
        ]}
        {...props}
      />
    </View>
  );
}

// ─── BUTTON ────────────────────────────────────────────────────────────────────
export function Btn({ children, onPress, variant = "primary", size = "md", style, textStyle, disabled }) {
  const variantStyles = {
    primary: styles.btnPrimary,
    danger: styles.btnDanger,
    ghost: styles.btnGhost,
    success: styles.btnSuccess,
  };

  const sizeStyles = {
    sm: styles.btnSm,
    md: styles.btnMd,
    lg: styles.btnLg,
  };

  const textVariantStyles = {
    primary: styles.btnPrimaryText,
    danger: styles.btnDangerText,
    ghost: styles.btnGhostText,
    success: styles.btnSuccessText,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btnBase,
        variantStyles[variant],
        sizeStyles[size],
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text style={[styles.btnTextBase, textVariantStyles[variant], textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

// ─── MODAL ─────────────────────────────────────────────────────────────────────
export function Modal({ title, visible, onClose, children }) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}

// ─── TABLE / COLUMNAR DATA TABLE ───────────────────────────────────────────────
export function Table({ columns, data = [], actions }) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No records found</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableScroll}>
      <View style={styles.tableCard}>
        {/* Table Header */}
        <View style={styles.tableHeaderRow}>
          {columns.map((col) => (
            <View key={col.key} style={[styles.tableHeaderCell, col.width ? { width: col.width } : { flex: col.flex || 1 }]}>
              <Text style={styles.tableHeaderCellText}>{col.label}</Text>
            </View>
          ))}
          {actions && (
            <View style={[styles.tableHeaderCell, styles.tableHeaderActionCell]}>
              <Text style={styles.tableHeaderCellText}>ACTIONS</Text>
            </View>
          )}
        </View>

        {/* Table Body Rows */}
        {data.map((row, i) => (
          <View
            key={row._id || i}
            style={[
              styles.tableRow,
              i === data.length - 1 && styles.tableRowLast,
            ]}
          >
            {columns.map((col) => (
              <View
                key={col.key}
                style={[styles.tableCell, col.width ? { width: col.width } : { flex: col.flex || 1 }]}
              >
                {col.render ? (
                  typeof col.render(row) === "string" ? (
                    <Text style={styles.tableCellText}>{col.render(row)}</Text>
                  ) : (
                    col.render(row)
                  )
                ) : (
                  <Text style={styles.tableCellText}>{String(row[col.key] ?? "—")}</Text>
                )}
              </View>
            ))}

            {actions && (
              <View style={[styles.tableCell, styles.tableActionCell]}>
                {actions(row)}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── TOAST ─────────────────────────────────────────────────────────────────────
export function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  const typeBorder = {
    success: colors.success,
    error: colors.danger,
    info: colors.accent,
  };

  return (
    <View style={[styles.toastContainer, { borderLeftColor: typeBorder[type] || colors.accent }]}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  spinnerContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputFocused: {
    borderColor: colors.accent,
  },
  selectButton: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectButtonText: {
    color: colors.text,
    fontSize: 14,
  },
  selectArrow: {
    color: colors.textDim,
    fontSize: 12,
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pickerCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    width: "100%",
    maxWidth: 440,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  pickerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  pickerItemSelected: {
    backgroundColor: colors.accentLight,
    borderRadius: 8,
  },
  pickerItemText: {
    color: colors.text,
    fontSize: 14,
  },
  btnBase: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  btnTextBase: {
    fontWeight: "700",
    fontFamily: "System",
  },
  btnSm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnMd: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  btnLg: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  btnPrimary: {
    backgroundColor: colors.accent,
  },
  btnPrimaryText: {
    color: "#ffffff",
    fontSize: 14,
  },
  btnDanger: {
    backgroundColor: colors.danger,
  },
  btnDangerText: {
    color: "#ffffff",
    fontSize: 14,
  },
  btnGhost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnGhostText: {
    color: colors.textDim,
    fontSize: 14,
  },
  btnSuccess: {
    backgroundColor: colors.success,
  },
  btnSuccessText: {
    color: "#ffffff",
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    width: "100%",
    maxWidth: 540,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalCloseText: {
    color: colors.textDim,
    fontSize: 18,
    fontWeight: "bold",
  },
  tableScroll: {
    width: "100%",
    marginBottom: 20,
  },
  tableCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    minWidth: "100%",
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceHover,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableHeaderCell: {
    minWidth: 150,
    paddingRight: 16,
    justifyContent: "center",
  },
  tableHeaderActionCell: {
    minWidth: 150,
    alignItems: "flex-end",
    paddingRight: 0,
  },
  tableHeaderCellText: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableCell: {
    minWidth: 150,
    paddingRight: 16,
    justifyContent: "center",
  },
  tableActionCell: {
    minWidth: 150,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 0,
    gap: 8,
  },
  tableCellText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  toastContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderRadius: 10,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  toastText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  jobieGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
    marginBottom: 20,
  },
  jobieCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 20,
    margin: 8,
    minWidth: 280,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 320,
    maxWidth: 460,
    minHeight: 200,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  jobieCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  jobieCategoryCol: {
    flex: 1,
    paddingRight: 12,
  },
  jobieCategoryText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  jobieTitleText: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
  },
  jobieSquircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  jobieSquircleText: {
    fontSize: 17,
    fontWeight: "900",
  },
  jobieSubtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  jobieDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  jobieSubtitleText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    flexShrink: 1,
  },
  jobieDescText: {
    color: colors.textDim,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  jobieFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "auto",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    rowGap: 8,
    columnGap: 8,
  },
  jobieTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  jobiePillTag: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  jobiePillTagText: {
    color: colors.textDim,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  jobieActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: "auto",
    flexShrink: 0,
  },
  pillChipsContainer: {
    marginBottom: 20,
  },
  pillChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  pillChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillChipText: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: "700",
  },
  pillChipTextActive: {
    color: "#ffffff",
  },
});

