import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity, useWindowDimensions } from "react-native";
import api from "../utils/api";
import { Btn, Card, Input, Select, Modal, Table, Toast, Spinner, JobieCard, JobieGrid } from "./UI";
import { colors } from "../utils/theme";

export default function MasterCRUD({ title, apiPath, fetchFn, columns, formFields }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const [dropdowns, setDropdowns] = useState({});
  const [viewMode, setViewMode] = useState("grid"); // "grid" (Jobie cards) or "table"
  const { width } = useWindowDimensions();
  const useTwoColumns = width >= 540 && formFields.length >= 4;

  const showToast = (message, type = "success") => setToast({ message, type });
  const path = apiPath || `/${title.toLowerCase().replace(/ /g, "")}s`;

  const loadData = async () => {
    try {
      const d = fetchFn ? await fetchFn() : await api(path);
      setData(d);
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

  const loadDropdowns = async () => {
    const dd = {};
    for (const f of formFields) {
      if (f.fetchOptions) {
        try {
          dd[f.key] = await f.fetchOptions();
        } catch (e) {
          console.error(`Error loading dropdown for ${f.key}:`, e);
          dd[f.key] = [];
        }
      }
    }
    setDropdowns(dd);
  };

  const openCreate = async () => {
    setForm({});
    setEditing(null);
    await loadDropdowns();
    setModal(true);
  };

  const openEdit = async (row) => {
    setEditing(row);
    const initial = {};
    formFields.forEach((f) => {
      initial[f.key] = row[f.key]?._id || row[f.key] || "";
    });
    setForm(initial);
    await loadDropdowns();
    setModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await api(`${path}/${editing._id}`, { method: "PUT", body: JSON.stringify(form) });
        showToast(`${title} updated successfully`);
      } else {
        await api(path, { method: "POST", body: JSON.stringify(form) });
        showToast(`${title} created successfully`);
      }
      setModal(false);
      loadData();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const confirmDelete = (row) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete this ${title}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api(`${path}/${row._id}`, { method: "DELETE" });
              showToast(`${title} deleted successfully`);
              loadData();
            } catch (e) {
              showToast(e.message, "error");
            }
          },
        },
      ]
    );
  };

  // Helper to extract primary and secondary details for JobieCard
  const getCardDetails = (row) => {
    const primaryCol = columns[0];
    const secondaryCol = columns[1];
    const primaryVal = primaryCol?.render ? primaryCol.render(row) : row[primaryCol?.key] ?? "—";
    const secondaryVal = secondaryCol?.render ? secondaryCol.render(row) : row[secondaryCol?.key];

    const extraFields = columns.slice(2).map((col) => {
      const val = col.render ? col.render(row) : row[col.key];
      return `${col.label}: ${val || "—"}`;
    }).filter(Boolean);

    return {
      title: String(primaryVal),
      subtitle: secondaryVal ? `${secondaryCol.label}: ${secondaryVal}` : null,
      description: extraFields.length > 0 ? extraFields.join(" • ") : null,
      iconLetter: String(primaryVal)?.[0]?.toUpperCase() || title[0].toUpperCase(),
    };
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {/* Jobie-style Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.titleCol}>
            <Text style={styles.title}>{title} Management</Text>
            <Text style={styles.subtitle}>Showing {data.length} registered {title.toLowerCase()}s</Text>
          </View>

          <View style={styles.headerRightActions}>
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

            {/* Jobie Add Pill Button */}
            <Btn onPress={openCreate} size="sm" style={styles.addPillBtn}>
              + Add {title}
            </Btn>
          </View>
        </View>

        {loading && !refreshing ? (
          <Spinner />
        ) : viewMode === "grid" ? (
          /* Jobie Cards Grid View */
          data.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No records found</Text>
            </View>
          ) : (
            <JobieGrid>
              {data.map((row, i) => {
                const details = getCardDetails(row);
                return (
                  <JobieCard
                    key={row._id || i}
                    category={title.toUpperCase()}
                    title={details.title}
                    subtitle={details.subtitle}
                    description={details.description}
                    iconLetter={details.iconLetter}
                    tags={["ACTIVE", "REGISTERED"]}
                    actions={
                      <>
                        <Btn size="sm" variant="ghost" onPress={() => openEdit(row)}>
                          Edit
                        </Btn>
                        <Btn size="sm" variant="danger" onPress={() => confirmDelete(row)}>
                          Delete
                        </Btn>
                      </>
                    }
                  />
                );
              })}
            </JobieGrid>
          )
        ) : (
          /* Columnar Table View */
          <Table
            columns={columns}
            data={data}
            actions={(row) => (
              <View style={styles.actionsRow}>
                <Btn size="sm" variant="ghost" onPress={() => openEdit(row)}>
                  Edit
                </Btn>
                <Btn size="sm" variant="danger" onPress={() => confirmDelete(row)}>
                  Delete
                </Btn>
              </View>
            )}
          />
        )}
      </ScrollView>

      {/* Create / Edit Modal */}
      <Modal
        title={editing ? `Edit ${title}` : `Add New ${title}`}
        visible={modal}
        onClose={() => setModal(false)}
      >
        <View style={useTwoColumns ? styles.formGrid : styles.formColumn}>
          {formFields.map((field, idx) => {
            const isOddLast = formFields.length % 2 === 1 && idx === formFields.length - 1;
            const fieldWrapperStyle = useTwoColumns
              ? (isOddLast ? styles.formFieldFull : styles.formFieldHalf)
              : styles.formFieldFull;

            let fieldContent = null;
            if (field.type === "select") {
              const rawOptions = dropdowns[field.key] || [];
              const selectOptions = rawOptions.map((opt) => ({
                value: opt._id || opt.id || opt.value || opt,
                label: field.optionLabel ? opt[field.optionLabel] : opt.label || opt.name || opt,
              }));

              fieldContent = (
                <Select
                  label={field.label}
                  value={form[field.key] || ""}
                  options={selectOptions}
                  onSelect={(val) => setForm((f) => ({ ...f, [field.key]: val }))}
                  placeholder={`Select ${field.label}`}
                />
              );
            } else {
              fieldContent = (
                <Input
                  label={field.label}
                  value={form[field.key] || ""}
                  onChangeText={(val) => setForm((f) => ({ ...f, [field.key]: val }))}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  secureTextEntry={field.inputType === "password"}
                  keyboardType={field.inputType === "email" ? "email-address" : "default"}
                  autoCapitalize={field.inputType === "email" ? "none" : "sentences"}
                />
              );
            }

            return (
              <View key={field.key} style={fieldWrapperStyle}>
                {fieldContent}
              </View>
            );
          })}
        </View>

        <View style={styles.modalActions}>
          <Btn variant="ghost" onPress={() => setModal(false)} style={{ flex: 1 }}>
            Cancel
          </Btn>
          <Btn onPress={handleSubmit} style={{ flex: 1 }}>
            {editing ? "Save Changes" : "Create"}
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
    minWidth: 200,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  headerRightActions: {
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
  addPillBtn: {
    borderRadius: 20,
    paddingHorizontal: 18,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    width: "100%",
  },
  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  formColumn: {
    width: "100%",
  },
  formFieldHalf: {
    width: "50%",
    paddingHorizontal: 6,
  },
  formFieldFull: {
    width: "100%",
    paddingHorizontal: 6,
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
