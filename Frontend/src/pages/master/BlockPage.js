import MasterCRUD from "../../components/MasterCRUD";
import api from "../../utils/api";

function BlockPage() {
  return (
    <MasterCRUD
      title="Block"
      apiPath="/blocks"
      fetchFn={() => api("/blocks")}
      columns={[
        { key: "department", label: "Department", render: (r) => r.department?.departmentName },
        { key: "programme", label: "Programme", render: (r) => r.programme?.programmeName },
        { key: "blockName", label: "Block Name" },
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

export default BlockPage;
