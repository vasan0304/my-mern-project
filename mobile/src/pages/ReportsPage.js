import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import api from "../utils/api";
import { Btn, Card, Select, Table, Badge, Spinner } from "../components/UI";
import { colors, COMPLAINT_TYPES, COMPLAINT_STATUSES } from "../utils/theme";

export default function ReportsPage() {
  const [filters, setFilters] = useState({});
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    Promise.all([api("/departments"), api("/programmes")])
      .then(([d, p]) => {
        setDepartments(d);
        setProgrammes(p);
      })
      .catch(console.error);
  }, []);

  const generate = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v)
      );
      const query = new URLSearchParams(activeFilters).toString();
      const result = await api(`/reports?${query}`);
      setData(result);
      setGenerated(true);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({});
    setData([]);
    setGenerated(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Complaint Details Report</Text>

      {/* Filter Card */}
      <Card>
        <Text style={styles.sectionHeader}>Filters</Text>

        <View style={styles.filtersGrid}>
          <View style={styles.filterCol}>
            <Select
              label="Department"
              value={filters.department || ""}
              options={[
                { value: "", label: "All Departments" },
                ...departments.map((d) => ({ value: d._id, label: d.departmentName })),
              ]}
              onSelect={(val) => setFilters((f) => ({ ...f, department: val }))}
              placeholder="All Departments"
            />
          </View>

          <View style={styles.filterCol}>
            <Select
              label="Programme"
              value={filters.programme || ""}
              options={[
                { value: "", label: "All Programmes" },
                ...programmes.map((p) => ({ value: p._id, label: p.programmeName })),
              ]}
              onSelect={(val) => setFilters((f) => ({ ...f, programme: val }))}
              placeholder="All Programmes"
            />
          </View>

          <View style={styles.filterCol}>
            <Select
              label="Complaint Type"
              value={filters.complaintType || ""}
              options={[
                { value: "", label: "All Types" },
                ...COMPLAINT_TYPES.map((t) => ({ value: t, label: t })),
              ]}
              onSelect={(val) => setFilters((f) => ({ ...f, complaintType: val }))}
              placeholder="All Types"
            />
          </View>

          <View style={styles.filterCol}>
            <Select
              label="Status"
              value={filters.status || ""}
              options={[
                { value: "", label: "All Statuses" },
                ...COMPLAINT_STATUSES.map((s) => ({ value: s, label: s })),
              ]}
              onSelect={(val) => setFilters((f) => ({ ...f, status: val }))}
              placeholder="All Statuses"
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Btn onPress={generate} style={styles.actionBtn}>
            Generate Report
          </Btn>
          <Btn variant="ghost" onPress={resetFilters} style={styles.actionBtn}>
            Reset
          </Btn>
        </View>
      </Card>

      {loading && <Spinner />}

      {generated && !loading && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultCountText}>{data.length} record(s) found</Text>
          <Table
            columns={[
              { key: "complaintType", label: "Type" },
              {
                key: "department",
                label: "Department",
                render: (r) => r.department?.departmentName || "—",
              },
              { key: "block", label: "Block", render: (r) => r.block?.blockName || "—" },
              { key: "room", label: "Room", render: (r) => r.room?.roomNumber || "—" },
              { key: "raisedBy", label: "Raised By", render: (r) => r.raisedBy?.userName || "—" },
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
        </View>
      )}
    </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 20,
  },
  sectionHeader: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 16,
  },
  filtersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  filterCol: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 240,
    marginHorizontal: 8,
    maxWidth: 420,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionBtn: {
    minWidth: 140,
  },
  resultsContainer: {
    marginTop: 16,
  },
  resultCountText: {
    color: colors.textDim,
    fontSize: 13,
    marginBottom: 12,
  },
});

