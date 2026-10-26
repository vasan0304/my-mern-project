import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { colors } from "../utils/theme";

export default function Header({ title, onMenuPress, isMobile, onProfilePress }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const topInset = Platform.OS === "web" ? 0 : insets.top;
  const displayName = user?.userName || user?.name || "User";
  const displayRole = user?.role?.roleName || (typeof user?.role === "string" ? user.role : "") || "Staff";

  return (
    <View
      style={[
        styles.headerContainer,
        {
          paddingTop: topInset > 0 ? topInset + 8 : 12,
        },
      ]}
    >
      {/* Left: Menu Btn & Page Title */}
      <View style={styles.leftSection}>
        {isMobile && (
          <TouchableOpacity
            onPress={onMenuPress}
            style={styles.menuBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.pageTitle} numberOfLines={1}>{title}</Text>
      </View>

      {/* Right: Clickable User Pill leading to Profile section */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={onProfilePress}
          activeOpacity={0.7}
          style={styles.userPill}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {displayName[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.userTextCol}>
            <Text style={styles.userPillName} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.userPillRole} numberOfLines={1}>
              {displayRole}
            </Text>
          </View>
        </TouchableOpacity>
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
    paddingBottom: 12,
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
