import { useState, useEffect } from "react";
import api from "../utils/api";
import { Btn, Card, Input, Select, Modal, Table, Toast } from "./UI";
import { colors } from "../utils/theme";

function MasterCRUD({ title, apiPath, fetchFn, columns, formFields }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const [dropdowns, setDropdowns] = useState({});

  const showToast = (message, type = "success") => setToast({ message, type });
  const path = apiPath || `/${title.toLowerCase().replace(/ /g, "")}s`;

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const d = fetchFn ? await fetchFn() : await api(path);
      setData(d);
    } catch (e) {
      showToast(e.message, "error");
    }
    setLoading(false);
  };

  const loadDropdowns = async () => {
    const dd = {};
    for (const f of formFields) {
      if (f.fetchOptions) dd[f.key] = await f.fetchOptions();
    }
    setDropdowns(dd);
  };

  const openCreate = async () => {
    setForm({});
    setEditing(null);
    await loadDropdowns();
    setModal("form");
  };

  const openEdit = async (row) => {
    setEditing(row);
    const initial = {};
    formFields.forEach((f) => {
      initial[f.key] = row[f.key]?._id || row[f.key] || "";
    });
    setForm(initial);
    await loadDropdowns();
    setModal("form");
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await api(`${path}/${editing._id}`, { method: "PUT", body: JSON.stringify(form) });
        showToast(`${title} updated`);
      } else {
        await api(path, { method: "POST", body: JSON.stringify(form) });
        showToast(`${title} created`);
      }
      setModal(null);
      load();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete this ${title}?`)) return;
    try {
      await api(`${path}/${row._id}`, { method: "DELETE" });
      showToast(`${title} deleted`);
      load();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const { Spinner } = require("./UI");

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
          {title} Management
        </h1>
        <Btn onClick={openCreate}>+ Add {title}</Btn>
      </div>

      <Card>
        {loading ? (
          <Spinner />
        ) : (
          <Table
            columns={columns}
            data={data}
            actions={(row) => (
              <>
                <Btn size="sm" variant="ghost" onClick={() => openEdit(row)}>
                  Edit
                </Btn>
                <Btn size="sm" variant="danger" onClick={() => handleDelete(row)}>
                  Delete
                </Btn>
              </>
            )}
          />
        )}
      </Card>

      {modal === "form" && (
        <Modal
          title={editing ? `Edit ${title}` : `New ${title}`}
          onClose={() => setModal(null)}
        >
          {formFields.map((f) => {
            if (f.type === "select") {
              const opts = dropdowns[f.key] || [];
              return (
                <Select
                  key={f.key}
                  label={f.label}
                  value={form[f.key] || ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                >
                  <option value="">Select {f.label}</option>
                  {opts.map((o) => (
                    <option key={o._id} value={o._id}>
                      {o[f.optionLabel]}
                    </option>
                  ))}
                </Select>
              );
            }
            return (
              <Input
                key={f.key}
                label={f.label}
                type={f.inputType || "text"}
                value={form[f.key] || ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            );
          })}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Btn>
            <Btn onClick={handleSubmit}>{editing ? "Update" : "Create"}</Btn>
          </div>
        </Modal>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default MasterCRUD;
