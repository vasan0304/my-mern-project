import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Btn } from "./UI";
import { colors } from "../utils/theme";

export const NAV_ITEMS = [
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

export default function Sidebar({ active, setActive, onClose }) {
  const { user, logout, isSuperAdmin } = useAuth();

  const visibleNav = NAV_ITEMS.filter((n) => n.all || (n.superAdmin && isSuperAdmin));

  const handleSelect = (id) => {
    setActive(id);
    if (onClose) onClose();
  };

  return (
    <View style={styles.container}>
      {/* Jobie Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>T</Text>
        </View>
        <View style={styles.brandTextContainer}>
          <Text style={styles.brandTitle}>TMS</Text>
          <Text style={styles.brandSubtitle}>Admin Dashboard</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Nav List with Jobie-style Pill Tabs */}
      <ScrollView style={styles.navList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>MAIN MENU</Text>
        {visibleNav.map((item) => {
          const isActive = active === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => handleSelect(item.id)}
              style={[
                styles.navItem,
                isActive && styles.navItemActive,
              ]}
            >
              {/* Jobie-style Rounded Marker */}
              <View
                style={[
                  styles.marker,
                  {
                    backgroundColor: isActive ? item.markerColor : colors.border,
                    borderRadius: 4,
                  },
                ]}
              />

              <Text
                style={[
                  styles.navLabel,
                  isActive ? styles.navLabelActive : styles.navLabelInactive,
                ]}
              >
                {item.label}
              </Text>

              {isActive && (
                <View style={[styles.activePill, { backgroundColor: item.markerColor }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Jobie-style User Footer */}
      <View style={styles.footer}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.userName?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.userName || "User"}
            </Text>
            <Text style={styles.userRole} numberOfLines={1}>
              {user?.role?.roleName || "Staff"}
            </Text>
          </View>
        </View>

        <Btn
          variant="ghost"
          size="sm"
          onPress={logout}
          style={styles.signOutBtn}
        >
          Sign Out
        </Btn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: "#11141c",
    borderRightWidth: 1,
    borderRightColor: colors.border,
    height: "100%",
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  logoBadgeText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 22,
    fontFamily: "System",
  },
  brandTextContainer: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    color: colors.textMuted,
    fontSize: 18,
  },
  navList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeader: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 12,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 6,
  },
  navItemActive: {
    backgroundColor: "#1a2133",
    borderWidth: 1,
    borderColor: "rgba(79,124,255,0.25)",
  },
  marker: {
    width: 8,
    height: 8,
    marginRight: 14,
  },
  navLabel: {
    fontSize: 14,
    flex: 1,
    fontFamily: "System",
  },
  navLabelActive: {
    color: "#ffffff",
    fontWeight: "800",
  },
  navLabelInactive: {
    color: colors.textDim,
    fontWeight: "500",
  },
  activePill: {
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 14,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  userRole: {
    fontSize: 11,
    color: colors.textMuted,
  },
  signOutBtn: {
    width: "100%",
    borderRadius: 10,
  },
});
