import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import {
  Btn,
  Card,
  Select, 
  Textarea,
  Modal,
  Table,
  Toast,
  Badge,
  Spinner,
  JobieCard,
  JobieGrid,
  PillChips,
} from "../components/UI";
import { colors, STATUS_COLORS, COMPLAINT_TYPES, STAFF_STATUSES } from "../utils/theme";

export default function ComplaintsPage() {
  const { isSuperAdmin, isStaff } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const [filterType, setFilterType] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid"); // "grid" (Jobie cards) or "table"

  const showToast = (message, type = "success") => setToast({ message, type });

  const loadData = async () => {
    try {
      const [c, b] = await Promise.all([api("/complaints"), api("/blocks")]);
      setComplaints(c);
      setBlocks(b);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleBlockChange = async (blockId) => {
    setForm((f) => ({ ...f, block: blockId, room: "" }));
    if (blockId) {
      try {
        const r = await api(`/rooms?block=${blockId}`);
        setRooms(r);
      } catch (err) {
        console.error(err);
      }
    } else {
      setRooms([]);
    }
  };

  const openRaise = () => {
    setForm({});
    setRooms([]);
    setModal("raise");
  };

  const submitComplaint = async () => {
    if (!form.block || !form.room || !form.complaintType) {
      showToast("Please fill all required fields", "error");
      return;
    }
    try {
      await api("/complaints", { method: "POST", body: JSON.stringify(form) });
      showToast("Complaint raised successfully");
      setModal(null);
      loadData();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const openAssign = async (c) => {
    setSelected(c);
    setForm({ assignedTo: c.assignedTo?._id || c.assignedTo || "" });
    try {
      const users = await api("/users");
      const techStaff = users.filter(
        (u) => u.role?.roleName?.toLowerCase() !== "superadmin" && u.role?.roleName?.toLowerCase() !== "user"
      );
      setStaff(techStaff);
      setModal("assign");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const submitAssign = async () => {
    if (!form.assignedTo) {
      showToast("Please select a technician", "error");
      return;
    }
    try {
      await api(`/complaints/${selected._id}/assign`, {
        method: "PATCH",
        body: JSON.stringify({ assignedTo: form.assignedTo }),
      });
      showToast(selected?.assignedTo ? "Complaint reassigned successfully" : "Complaint assigned successfully");
      setModal(null);
      loadData();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const openStatus = (c) => {
    setSelected(c);
    setForm({ status: c.status || "", remarks: "" });
    setModal("status");
  };

  const submitStatus = async () => {
    if (!form.status) {
      showToast("Please select a status", "error");
      return;
    }
    try {
      await api(`/complaints/${selected._id}/status`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      showToast("Status updated successfully");
      setModal(null);
      loadData();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const filteredComplaints = filterType === "ALL"
    ? complaints
    : complaints.filter((c) => c.complaintType === filterType);

  const columns = [
    { key: "complaintType", label: "Type" },
    { key: "block", label: "Block", render: (r) => r.block?.blockName },
    { key: "room", label: "Room", render: (r) => r.room?.roomNumber },
    {
      key: "complaintRemarks",
      label: "Remarks",
      render: (r) => r.complaintRemarks || "—",
    },
    { key: "raisedBy", label: "Raised By", render: (r) => r.raisedBy?.userName },
    { key: "assignedTo", label: "Assigned To", render: (r) => r.assignedTo?.userName || "—" },
    { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
    {
      key: "createdAt",
      label: "Date",
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {/* Jobie-style Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Complaints</Text>
            <Text style={styles.subtitle}>Showing {filteredComplaints.length} tickets</Text>
          </View>

          <View style={styles.headerActions}>
            {/* View Mode Toggle */}
            <View style={styles.viewToggleGroup}>
              <TouchableOpacity
                onPress={() => setViewMode("grid")}
                style={[styles.toggleBtn, viewMode === "grid" && styles.toggleBtnActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleBtnText, viewMode === "grid" && styles.toggleBtnTextActive]}>⊞ Cards</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setViewMode("table")}
                style={[styles.toggleBtn, viewMode === "table" && styles.toggleBtnActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleBtnText, viewMode === "table" && styles.toggleBtnTextActive]}>☰ Table</Text>
              </TouchableOpacity>
            </View>

            <Btn onPress={openRaise} size="sm" style={styles.raisePillBtn}>
              + Raise Complaint
            </Btn>
          </View>
        </View>

        {/* Jobie Category Filter Pills */}
        <PillChips
          items={["ALL", ...COMPLAINT_TYPES]}
          selected={filterType}
          onSelect={setFilterType}
        />

        {loading && !refreshing ? (
          <Spinner />
        ) : viewMode === "grid" ? (
          /* Jobie Cards Grid */
          filteredComplaints.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No complaints matching filter</Text>
            </View>
          ) : (
            <JobieGrid>
              {filteredComplaints.map((c) => (
                <JobieCard
                  key={c._id}
                  category={`${c.block?.blockName || "Block"} • Room ${c.room?.roomNumber || "—"}`}
                  title={c.complaintType}
                  subtitle={c.assignedTo?.userName ? `Assigned to: ${c.assignedTo.userName}` : "Not Assigned"}
                  description={c.complaintRemarks || "No description provided."}
                  iconLetter={c.complaintType?.[0] || "C"}
                  iconColor={STATUS_COLORS[c.status]?.text || colors.accent}
                  tags={[
                    c.status,
                    `By: ${c.raisedBy?.userName || "User"}`,
                  ]}
                  actions={
                    <>
                      {isSuperAdmin && c.status !== "Completed" && (
                        <Btn
                          size="sm"
                          variant={c.status === "Assigned" || c.assignedTo ? "ghost" : "primary"}
                          onPress={() => openAssign(c)}
                        >
                          {c.status === "Assigned" || c.assignedTo ? "Reassign" : "Assign"}
                        </Btn>
                      )}
                      {(isStaff || isSuperAdmin) &&
                        (c.status === "Assigned" ||
                          c.status === "In-Progress" ||
                          c.status === "On Hold") && (
                          <Btn size="sm" variant="success" onPress={() => openStatus(c)}>
                            Update Status
                          </Btn>
                        )}
                    </>
                  }
                />
              ))}
            </JobieGrid>
          )
        ) : (
          /* Columnar Table View */
          <Table
            columns={columns}
            data={filteredComplaints}
            actions={(row) => (
              <View style={styles.actionButtons}>
                {isSuperAdmin && row.status !== "Completed" && (
                  <Btn
                    size="sm"
                    variant={row.status === "Assigned" || row.assignedTo ? "ghost" : "primary"}
                    onPress={() => openAssign(row)}
                  >
                    {row.status === "Assigned" || row.assignedTo ? "Reassign" : "Assign"}
                  </Btn>
                )}
                {(isStaff || isSuperAdmin) &&
                  (row.status === "Assigned" ||
                    row.status === "In-Progress" ||
                    row.status === "On Hold") && (
                    <Btn size="sm" variant="success" onPress={() => openStatus(row)}>
                      Update Status
                    </Btn>
                  )}
              </View>
            )}
          />
        )}
      </ScrollView>

      {/* Raise Complaint Modal */}
      <Modal
        title="Raise New Complaint"
        visible={modal === "raise"}
        onClose={() => setModal(null)}
      >
        <View style={styles.formRow}>
          <View style={styles.formCol}>
            <Select
              label="Block"
              value={form.block || ""}
              options={blocks.map((b) => ({ value: b._id, label: b.blockName }))}
              onSelect={handleBlockChange}
              placeholder="Select Block"
            />
          </View>

          <View style={styles.formCol}>
            <Select
              label="Room"
              value={form.room || ""}
              options={rooms.map((r) => ({ value: r._id, label: r.roomNumber }))}
              onSelect={(room) => setForm((f) => ({ ...f, room }))}
              placeholder="Select Room"
            />
          </View>
        </View>

        <Select
          label="Complaint Type"
          value={form.complaintType || ""}
          options={COMPLAINT_TYPES.map((t) => ({ value: t, label: t }))}
          onSelect={(complaintType) => setForm((f) => ({ ...f, complaintType }))}
          placeholder="Select Type"
        />

        <Textarea
          label="Remarks"
          value={form.complaintRemarks || ""}
          onChangeText={(complaintRemarks) => setForm((f) => ({ ...f, complaintRemarks }))}
          placeholder="Describe the issue..."
        />

        <View style={styles.modalActions}>
          <Btn variant="ghost" onPress={() => setModal(null)} style={{ flex: 1 }}>
            Cancel
          </Btn>
          <Btn onPress={submitComplaint} style={{ flex: 1 }}>
            Submit
          </Btn>
        </View>
      </Modal>

      {/* Assign Complaint Modal */}
      <Modal
        title={selected?.assignedTo ? "Reassign Complaint" : "Assign Complaint"}
        visible={modal === "assign"}
        onClose={() => setModal(null)}
      >
        {selected && (
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              {selected.complaintType} — {selected.complaintRemarks || "No remarks"}
            </Text>
          </View>
        )}

        <Select
          label="Assign To"
          value={form.assignedTo || ""}
          options={staff.map((s) => ({
            value: s._id,
            label: `${s.userName} (${s.role?.roleName || "Staff"})`,
          }))}
          onSelect={(assignedTo) => setForm((f) => ({ ...f, assignedTo }))}
          placeholder="Select Technician"
        />

        <View style={styles.modalActions}>
          <Btn variant="ghost" onPress={() => setModal(null)} style={{ flex: 1 }}>
            Cancel
          </Btn>
          <Btn onPress={submitAssign} style={{ flex: 1 }}>
            {selected?.assignedTo ? "Reassign" : "Assign"}
          </Btn>
        </View>
      </Modal>

      {/* Update Status Modal */}
      <Modal
        title="Update Status"
        visible={modal === "status"}
        onClose={() => setModal(null)}
      >
        {selected && (
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              {selected.complaintType} — {selected.complaintRemarks || "No remarks"}
            </Text>
          </View>
        )}

        <Select
          label="New Status"
          value={form.status || ""}
          options={STAFF_STATUSES.map((s) => ({ value: s, label: s }))}
          onSelect={(status) => setForm((f) => ({ ...f, status }))}
          placeholder="Select Status"
        />

        <Textarea
          label="Remarks / Action Taken"
          value={form.remarks || ""}
          onChangeText={(remarks) => setForm((f) => ({ ...f, remarks }))}
          placeholder="Details of action taken..."
        />

        <View style={styles.modalActions}>
          <Btn variant="ghost" onPress={() => setModal(null)} style={{ flex: 1 }}>
            Cancel
          </Btn>
          <Btn variant="success" onPress={submitStatus} style={{ flex: 1 }}>
            Update
          </Btn>
        </View>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    rowGap: 12,
    columnGap: 16,
  },
  titleCol: {
    flexShrink: 1,
    minWidth: 180,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  viewToggleGroup: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  toggleBtnActive: {
    backgroundColor: colors.accent,
  },
  toggleBtnText: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: "700",
  },
  toggleBtnTextActive: {
    color: "#ffffff",
  },
  raisePillBtn: {
    borderRadius: 20,
    paddingHorizontal: 18,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  formCol: {
    flex: 1,
  },
  infoBanner: {
    backgroundColor: colors.accentLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoBannerText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 48,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
