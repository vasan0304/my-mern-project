import React from "react";
import MasterCRUD from "../../components/MasterCRUD";
import api from "../../utils/api";

export default function BlockPage() {
  return (
    <MasterCRUD
      title="Block"
      apiPath="/blocks"
      fetchFn={() => api("/blocks")}
      columns={[
        { key: "blockName", label: "Block Name" },
        { key: "department", label: "Department", render: (r) => r.department?.departmentName },
        { key: "programme", label: "Programme", render: (r) => r.programme?.programmeName },
      ]}
      formFields={[
        {
          key: "department",
          label: "Department",
          type: "select",
          fetchOptions: () => api("/departments"),
          optionLabel: "departmentName",
        },
        {
          key: "programme",
          label: "Programme",
          type: "select",
          fetchOptions: () => api("/programmes"),
          optionLabel: "programmeName",
        },
        { key: "blockName", label: "Block Name" },
      ]}
    />
  );
}

