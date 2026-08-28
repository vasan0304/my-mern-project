import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Btn, Card, Select, Table, Badge, Spinner } from "../../components/UI";
import { colors, COMPLAINT_TYPES, COMPLAINT_STATUSES } from "../../utils/theme";

function ReportsPage() {
  const [filters, setFilters] = useState({});
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    Promise.all([api("/departments"), api("/programmes")]).then(([d, p]) => {
      setDepartments(d);
      setProgrammes(p);
    });
  }, []);

  const generate = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      );
      const result = await api(`/reports?${params}`);
      setData(result);
      setGenerated(true);
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  const resetFilters = () => {
    setFilters({});
    setData([]);
    setGenerated(false);
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: 24, fontWeight: 800, color: colors.text }}>
        Complaint Details Report
      </h1>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, color: colors.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Filters
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          <Select
            label="Department"
            value={filters.department || ""}
            onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.departmentName}
              </option>
            ))}
          </Select>

          <Select
            label="Programme"
            value={filters.programme || ""}
            onChange={(e) => setFilters((f) => ({ ...f, programme: e.target.value }))}
          >
            <option value="">All Programmes</option>
            {programmes.map((p) => (
              <option key={p._id} value={p._id}>
                {p.programmeName}
              </option>
            ))}
          </Select>

          <Select
            label="Complaint Type"
            value={filters.complaintType || ""}
            onChange={(e) => setFilters((f) => ({ ...f, complaintType: e.target.value }))}
          >
            <option value="">All Types</option>
            {COMPLAINT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>

          <Select
            label="Status"
            value={filters.status || ""}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            {COMPLAINT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <Btn onClick={generate}>Generate Report</Btn>
          <Btn variant="ghost" onClick={resetFilters}>Reset</Btn>
        </div>
      </Card>

      {/* Results */}
      {loading && <Spinner />}

      {generated && !loading && (
        <Card>
          <div style={{ marginBottom: 12, color: colors.textDim, fontSize: 13 }}>
            {data.length} record(s) found
          </div>
          <Table
            columns={[
              { key: "complaintType", label: "Type" },
              {
                key: "department",
                label: "Department",
                render: (r) => r.department?.departmentName,
              },
              { key: "block", label: "Block", render: (r) => r.block?.blockName },
              { key: "room", label: "Room", render: (r) => r.room?.roomNumber },
              { key: "raisedBy", label: "Raised By", render: (r) => r.raisedBy?.userName },
              {
                key: "assignedTo",
                label: "Assignee",
                render: (r) => r.assignedTo?.userName || "—",
              },
              { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
              {
                key: "createdAt",
                label: "Date",
                render: (r) => new Date(r.createdAt).toLocaleDateString(),
              },
            ]}
            data={data}
          />
        </Card>
      )}
    </div>
  );
}

export default ReportsPage;
