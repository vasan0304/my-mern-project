import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../utils/theme";

export default function Header({ title, onMenuPress, isMobile }) {
  const { user } = useAuth();

  return (
    <View style={styles.headerContainer}>
      {/* Left: Menu Btn & Page Title */}
      <View style={styles.leftSection}>
        {isMobile && (
          <TouchableOpacity onPress={onMenuPress} style={styles.menuBtn} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.pageTitle} numberOfLines={1}>{title}</Text>
      </View>

      {/* Right: User Pill */}
      <View style={styles.rightSection}>
        <View style={styles.userPill}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user?.userName?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.userTextCol}>
            <Text style={styles.userPillName} numberOfLines={1}>
              {user?.userName || "User"}
            </Text>
            <Text style={styles.userPillRole} numberOfLines={1}>
              {user?.role?.roleName || "Staff"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    minHeight: 64,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    marginRight: 12,
  },
  menuBtn: {
    padding: 6,
    marginRight: 8,
  },
  menuIcon: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold",
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },
  userPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 6,
    paddingRight: 12,
    gap: 8,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 12,
  },
  userTextCol: {
    justifyContent: "center",
    maxWidth: 140,
  },
  userPillName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 15,
  },
  userPillRole: {
    color: colors.textDim,
    fontSize: 10,
    fontWeight: "600",
    lineHeight: 12,
  },
});
