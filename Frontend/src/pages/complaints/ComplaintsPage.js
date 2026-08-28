import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Btn, Card, Select, Textarea, Modal, Table, Toast, Badge, Spinner } from "../../components/UI";
import { colors, COMPLAINT_TYPES, STAFF_STATUSES } from "../../utils/theme";

function ComplaintsPage() {
  const { isSuperAdmin, isStaff } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ message: msg, type });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [c, b] = await Promise.all([api("/complaints"), api("/blocks")]);
      setComplaints(c);
      setBlocks(b);
    } catch (e) {
      showToast(e.message, "error");
    }
    setLoading(false);
  };

  const handleBlockChange = async (blockId) => {
    setForm((f) => ({ ...f, block: blockId, room: "" }));
    if (blockId) {
      const r = await api(`/rooms?block=${blockId}`);
      setRooms(r);
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
    try {
      await api("/complaints", { method: "POST", body: JSON.stringify(form) });
      showToast("Complaint raised successfully");
      setModal(null);
      load();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const openAssign = async (c) => {
    setSelected(c);
    const allUsers = await api("/users");
    setStaff(
      allUsers.filter(
        (u) =>
          u.role?.roleName?.toLowerCase() !== "user" &&
          u.role?.roleName?.toLowerCase() !== "superadmin"
      )
    );
    setForm({ assignedTo: c.assignedTo?._id || "" });
    setModal("assign");
  };

  const submitAssign = async () => {
    try {
      await api(`/complaints/${selected._id}/assign`, {
        method: "PATCH",
        body: JSON.stringify({ assignedTo: form.assignedTo }),
      });
      showToast("Complaint assigned");
      setModal(null);
      load();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const openStatus = (c) => {
    setSelected(c);
    setForm({ status: "", remarks: "" });
    setModal("status");
  };

  const submitStatus = async () => {
    try {
      await api(`/complaints/${selected._id}/status`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      showToast("Status updated");
      setModal(null);
      load();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const columns = [
    { key: "complaintType", label: "Type" },
    { key: "block", label: "Block", render: (r) => r.block?.blockName },
    { key: "room", label: "Room", render: (r) => r.room?.roomNumber },
    {
      key: "complaintRemarks",
      label: "Remarks",
      render: (r) =>
        r.complaintRemarks?.slice(0, 50) + (r.complaintRemarks?.length > 50 ? "..." : ""),
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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: colors.text }}>
          Complaints
        </h1>
        <Btn onClick={openRaise}>+ Raise Complaint</Btn>
      </div>

      <Card>
        {loading ? (
          <Spinner />
        ) : (
          <Table
            columns={columns}
            data={complaints}
            actions={(row) => (
              <>
                {isSuperAdmin && row.status !== "Completed" && (
                  <Btn size="sm" onClick={() => openAssign(row)}>
                    Assign
                  </Btn>
                )}
                {isStaff &&
                  (row.status === "Assigned" ||
                    row.status === "In-Progress" ||
                    row.status === "On Hold") && (
                    <Btn size="sm" variant="success" onClick={() => openStatus(row)}>
                      Update Status
                    </Btn>
                  )}
              </>
            )}
          />
        )}
      </Card>

      {/* Raise Complaint Modal */}
      {modal === "raise" && (
        <Modal title="Raise New Complaint" onClose={() => setModal(null)}>
          <Select
            label="Block"
            value={form.block || ""}
            onChange={(e) => handleBlockChange(e.target.value)}
          >
            <option value="">Select Block</option>
            {blocks.map((b) => (
              <option key={b._id} value={b._id}>
                {b.blockName}
              </option>
            ))}
          </Select>

          <Select
            label="Room"
            value={form.room || ""}
            onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
          >
            <option value="">Select Room</option>
            {rooms.map((r) => (
              <option key={r._id} value={r._id}>
                {r.roomNumber}
              </option>
            ))}
          </Select>

          <Select
            label="Complaint Type"
            value={form.complaintType || ""}
            onChange={(e) => setForm((f) => ({ ...f, complaintType: e.target.value }))}
          >
            <option value="">Select Type</option>
            {COMPLAINT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>

          <Textarea
            label="Remarks"
            rows={4}
            value={form.complaintRemarks || ""}
            onChange={(e) => setForm((f) => ({ ...f, complaintRemarks: e.target.value }))}
          />

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Btn>
            <Btn onClick={submitComplaint}>Submit</Btn>
          </div>
        </Modal>
      )}

      {/* Assign Modal */}
      {modal === "assign" && (
        <Modal title="Assign Complaint" onClose={() => setModal(null)}>
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              background: colors.accentLight,
              borderRadius: 8,
              fontSize: 13,
              color: colors.textDim,
            }}
          >
            <strong style={{ color: colors.text }}>{selected?.complaintType}</strong> —{" "}
            {selected?.complaintRemarks?.slice(0, 80)}
          </div>

          <Select
            label="Assign To"
            value={form.assignedTo || ""}
            onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
          >
            <option value="">Select Staff Member</option>
            {staff.map((s) => (
              <option key={s._id} value={s._id}>
                {s.userName} ({s.role?.roleName})
              </option>
            ))}
          </Select>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Btn>
            <Btn onClick={submitAssign}>Assign</Btn>
          </div>
        </Modal>
      )}

      {/* Status Update Modal */}
      {modal === "status" && (
        <Modal title="Update Status" onClose={() => setModal(null)}>
          <Select
            label="New Status"
            value={form.status || ""}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">Select Status</option>
            {STAFF_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>

          <Textarea
            label="Remarks"
            rows={3}
            value={form.remarks || ""}
            onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
          />

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Btn>
            <Btn onClick={submitStatus}>Update</Btn>
          </div>
        </Modal>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default ComplaintsPage;