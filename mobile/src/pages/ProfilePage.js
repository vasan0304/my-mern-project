import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  RefreshControl,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { colors } from "../utils/theme";
import { Btn, Input, Modal, Toast } from "../components/UI";

export default function ProfilePage({ onNavigate }) {
  const { user, logout, updateUser, isSuperAdmin, isStaff, isUser } = useAuth();
  const [complaintStats, setComplaintStats] = useState({ total: 0, resolved: 0, pending: 0 });
  const [loadingStats, setLoadingStats] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Form state for profile editing
  const [editForm, setEditForm] = useState({
    name: "",
    phoneNumber: "",
  });
  const [saving, setSaving] = useState(false);

  const displayName = user?.userName || user?.name || "User";
  const displayRole = user?.role?.roleName || (typeof user?.role === "string" ? user.role : "") || "Staff";
  const displayEmail = user?.email || "No email available";
  const displayPhone = user?.phoneNumber || user?.phone || "Not configured";
  const displayDepartment =
    user?.department?.departmentName ||
    user?.department?.name ||
    (typeof user?.department === "string" ? user.department : "General Department");
  const displayProgramme =
    user?.programme?.programmeName ||
    user?.programme?.name ||
    (typeof user?.programme === "string" ? user.programme : "General Programme");
  const displayRoom =
    user?.room?.roomNumber ||
    user?.room?.name ||
    (typeof user?.room === "string" ? user.room : "Not assigned");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Load complaint metrics for the logged in user
  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const data = await api("/complaints");
      if (Array.isArray(data)) {
        const total = data.length;
        const resolved = data.filter(
          (c) => c.status === "Completed" || c.status === "Resolved"
        ).length;
        const pending = data.filter(
          (c) => c.status === "Pending" || c.status === "Assigned" || c.status === "In-Progress"
        ).length;
        setComplaintStats({ total, resolved, pending });
      }
    } catch (e) {
      // Silently fall back to zero or cached stats if offline
      console.warn("Profile stats fetch failed:", e.message);
    } finally {
      setLoadingStats(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const openEditModal = () => {
    setEditForm({
      name: displayName,
      phoneNumber: user?.phoneNumber || user?.phone || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      showToast("Name cannot be empty", "error");
      return;
    }

    setSaving(true);
    try {
      const updatedFields = {
        name: editForm.name.trim(),
        userName: editForm.name.trim(),
        phoneNumber: editForm.phoneNumber.trim(),
      };

      // Update in local AuthContext + AsyncStorage
      await updateUser(updatedFields);

      // Best-effort remote update if user id exists
      const userId = user?._id || user?.id;
      if (userId) {
        try {
          await api(`/users/${userId}`, {
            method: "PUT",
            body: JSON.stringify(updatedFields),
          });
        } catch (apiErr) {
          console.log("Remote user profile sync note:", apiErr.message);
        }
      }

      showToast("Profile details updated successfully", "success");
      setIsEditModalOpen(false);
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOutConfirm = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to sign out?")) {
        logout();
      }
    } else {
      Alert.alert(
        "Sign Out",
        "Are you sure you want to log out of TMS?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign Out", style: "destructive", onPress: logout },
        ],
        { cancelable: true }
      );
    }
  };

  // Determine role pill style and color
  const getRoleBadgeConfig = () => {
    const roleLower = displayRole.toLowerCase();
    if (roleLower.includes("super")) {
      return { bg: "rgba(168,85,247,0.2)", text: "#c084fc", border: "#a855f7" };
    }
    if (roleLower.includes("admin")) {
      return { bg: "rgba(79,124,255,0.2)", text: "#93c5fd", border: "#4f7cff" };
    }
    if (roleLower.includes("staff")) {
      return { bg: "rgba(245,158,11,0.2)", text: "#fcd34d", border: "#f59e0b" };
    }
    return { bg: "rgba(34,197,94,0.2)", text: "#86efac", border: "#22c55e" };
  };

  const roleBadge = getRoleBadgeConfig();

  // Role permissions descriptions
  const getRolePermissions = () => {
    if (isSuperAdmin) {
      return [
        "Full system administration & user access control",
        "Manage Master Data (Departments, Programmes, Blocks, Rooms, Roles)",
        "Assign, reassign, and track all ticket complaints",
        "Generate and export comprehensive analytics & audit reports",
      ];
    }
    if (isStaff) {
      return [
        "View assigned service and maintenance tickets",
        "Update ticket status (In-Progress, On Hold, Completed)",
        "Log resolution notes and feedback",
        "Access operational system dashboard",
      ];
    }
    return [
      "Submit and register new service complaints",
      "Monitor real-time progress and status updates",
      "Receive automated email notifications on ticket resolution",
      "Access personal service history",
    ];
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
        />
      }
    >
      {/* Toast Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Hero Profile Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroBackgroundPattern} />
        
        <View style={styles.heroContentRow}>
          {/* Large Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.largeAvatar}>
              <Text style={styles.avatarInitials}>
                {displayName[0]?.toUpperCase() || "U"}
              </Text>
            </View>
            <View style={styles.onlineDot} />
          </View>

          {/* User Headline Info */}
          <View style={styles.heroTextCol}>
            <View style={styles.nameRow}>
              <Text style={styles.heroName} numberOfLines={1}>
                {displayName}
              </Text>
              <View
                style={[
                  styles.roleBadge,
                  {
                    backgroundColor: roleBadge.bg,
                    borderColor: roleBadge.border,
                  },
                ]}
              >
                <Text style={[styles.roleBadgeText, { color: roleBadge.text }]}>
                  {displayRole.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.heroEmail} numberOfLines={1}>
              {displayEmail}
            </Text>

            <View style={styles.statusIndicatorRow}>
              <View style={styles.statusDotGreen} />
              <Text style={styles.statusText}>Active Account • Online</Text>
            </View>
          </View>
        </View>

        {/* Quick Hero Actions */}
        <View style={styles.heroActionsRow}>
          <Btn
            variant="ghost"
            size="sm"
            onPress={openEditModal}
            style={styles.heroBtnEdit}
            textStyle={{ color: colors.accent, fontWeight: "700" }}
          >
            ✏️ Edit Profile
          </Btn>

          <Btn
            variant="danger"
            size="sm"
            onPress={handleSignOutConfirm}
            style={styles.heroBtnSignOut}
          >
            Sign Out
          </Btn>
        </View>
      </View>

      {/* Complaints Metric Highlights */}
      <View style={styles.statsRow}>
        <View style={styles.statTile}>
          <Text style={styles.statTileLabel}>COMPLAINTS</Text>
          <Text style={[styles.statTileValue, { color: colors.accent }]}>
            {loadingStats ? "..." : complaintStats.total}
          </Text>
          <Text style={styles.statTileSub}>Total In System</Text>
        </View>

        <View style={styles.statTile}>
          <Text style={styles.statTileLabel}>RESOLVED</Text>
          <Text style={[styles.statTileValue, { color: colors.success }]}>
            {loadingStats ? "..." : complaintStats.resolved}
          </Text>
          <Text style={styles.statTileSub}>Completed</Text>
        </View>

        <View style={styles.statTile}>
          <Text style={styles.statTileLabel}>ACTIVE</Text>
          <Text style={[styles.statTileValue, { color: colors.warning }]}>
            {loadingStats ? "..." : complaintStats.pending}
          </Text>
          <Text style={styles.statTileSub}>Pending / In-Progress</Text>
        </View>
      </View>

      {/* Information Cards Grid */}
      <View style={styles.sectionsGrid}>
        {/* Personal & Contact Information */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderIconBox}>
              <Text style={styles.cardHeaderIcon}>👤</Text>
            </View>
            <View>
              <Text style={styles.cardTitle}>Personal Information</Text>
              <Text style={styles.cardSubtitle}>Your registered credentials</Text>
            </View>
          </View>

          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Full Name</Text>
              <Text style={styles.detailValue}>{displayName}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Email Address</Text>
              <Text style={styles.detailValue}>{displayEmail}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Phone Number</Text>
              <Text style={styles.detailValue}>{displayPhone}</Text>
            </View>

            <View style={[styles.detailItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>User Identifier</Text>
              <Text style={[styles.detailValue, styles.monoText]}>
                {user?._id || user?.id || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Academic & Organizational Details */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderIconBox}>
              <Text style={styles.cardHeaderIcon}>🏛️</Text>
            </View>
            <View>
              <Text style={styles.cardTitle}>Institutional Details</Text>
              <Text style={styles.cardSubtitle}>Campus & room placement</Text>
            </View>
          </View>

          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Department</Text>
              <Text style={styles.detailValue}>{displayDepartment}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Programme</Text>
              <Text style={styles.detailValue}>{displayProgramme}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Assigned Room</Text>
              <Text style={styles.detailValue}>{displayRoom}</Text>
            </View>

            <View style={[styles.detailItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>System Role</Text>
              <Text style={[styles.detailValue, { color: roleBadge.text, fontWeight: "700" }]}>
                {displayRole}
              </Text>
            </View>
          </View>
        </View>

        {/* Role Privileges & Access Scope */}
        <View style={[styles.infoCard, { width: "100%" }]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderIconBox}>
              <Text style={styles.cardHeaderIcon}>🛡️</Text>
            </View>
            <View>
              <Text style={styles.cardTitle}>Role Privileges & Access Scope</Text>
              <Text style={styles.cardSubtitle}>
                Capabilities authorized for {displayRole}
              </Text>
            </View>
          </View>

          <View style={styles.privilegesList}>
            {getRolePermissions().map((perm, idx) => (
              <View key={idx} style={styles.privilegeRow}>
                <View style={styles.checkCircle}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
                <Text style={styles.privilegeText}>{perm}</Text>
              </View>
            ))}
          </View>

          {/* Quick Complaints Shortcut */}
          {onNavigate && (
            <View style={styles.shortcutBox}>
              <View style={styles.shortcutTextCol}>
                <Text style={styles.shortcutTitle}>Manage Complaints</Text>
                <Text style={styles.shortcutDesc}>
                  Quickly review status updates and take action on tickets
                </Text>
              </View>
              <Btn
                size="sm"
                variant="primary"
                onPress={() => onNavigate("complaints")}
                style={styles.shortcutBtn}
              >
                Go to Complaints →
              </Btn>
            </View>
          )}
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile Details"
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalBody}>
          <Input
            label="Full Name / Display Name"
            value={editForm.name}
            onChangeText={(name) => setEditForm((f) => ({ ...f, name }))}
            placeholder="Enter your full name"
          />

          <Input
            label="Phone Number"
            value={editForm.phoneNumber}
            onChangeText={(phoneNumber) => setEditForm((f) => ({ ...f, phoneNumber }))}
            placeholder="e.g. +91 98765 43210"
            keyboardType="phone-pad"
          />

          <View style={styles.readOnlyNote}>
            <Text style={styles.readOnlyLabel}>Email (Permanent):</Text>
            <Text style={styles.readOnlyValue}>{displayEmail}</Text>
          </View>

          <View style={styles.modalActionsRow}>
            <Btn
              variant="ghost"
              onPress={() => setIsEditModalOpen(false)}
              style={{ flex: 1 }}
            >
              Cancel
            </Btn>
            <Btn
              variant="primary"
              onPress={handleSaveProfile}
              disabled={saving}
              style={{ flex: 1 }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Btn>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  heroBackgroundPattern: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(79,124,255,0.06)",
  },
  heroContentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 16,
  },
  largeAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarInitials: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 28,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    borderWidth: 2.5,
    borderColor: colors.surface,
  },
  heroTextCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  heroName: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 0.3,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  heroEmail: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
    marginBottom: 6,
  },
  statusIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 11,
    color: colors.textDim,
    fontWeight: "600",
  },
  heroActionsRow: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  heroBtnEdit: {
    flex: 1,
    backgroundColor: "rgba(79,124,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(79,124,255,0.25)",
  },
  heroBtnSignOut: {
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statTile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  statTileLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: colors.textMuted,
    marginBottom: 4,
  },
  statTileValue: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 2,
  },
  statTileSub: {
    fontSize: 10,
    color: colors.textDim,
    fontWeight: "600",
    textAlign: "center",
  },
  sectionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  infoCard: {
    flexGrow: 1,
    flexBasis: 300,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
  },
  cardHeaderIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderIcon: {
    fontSize: 18,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "500",
    marginTop: 1,
  },
  detailsList: {
    gap: 12,
  },
  detailItem: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "700",
  },
  monoText: {
    fontSize: 12,
    color: colors.textDim,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  privilegesList: {
    gap: 10,
    marginBottom: 16,
  },
  privilegeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(34,197,94,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
  },
  checkIcon: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "bold",
  },
  privilegeText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
  },
  shortcutBox: {
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  shortcutTextCol: {
    flex: 1,
    minWidth: 180,
  },
  shortcutTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  shortcutDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  shortcutBtn: {
    minWidth: 140,
  },
  modalBody: {
    gap: 14,
  },
  readOnlyNote: {
    backgroundColor: colors.bg,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  readOnlyLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  readOnlyValue: {
    fontSize: 13,
    color: colors.textDim,
    marginTop: 2,
    fontWeight: "600",
  },
  modalActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
});

