import MasterCRUD from "../../components/MasterCRUD";
import api from "../../utils/api";

function RoomPage() {
  return (
    <MasterCRUD
      title="Room"
      apiPath="/rooms"
      fetchFn={() => api("/rooms")}
      columns={[
        { key: "department", label: "Department", render: (r) => r.department?.departmentName },
        { key: "programme", label: "Programme", render: (r) => r.programme?.programmeName },
        { key: "block", label: "Block", render: (r) => r.block?.blockName },
        { key: "roomNumber", label: "Room Number" },
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
        {
          key: "block",
          label: "Block",
          type: "select",
          fetchOptions: () => api("/blocks"),
          optionLabel: "blockName",
        },
        { key: "roomNumber", label: "Room Number" },
      ]}
    />
  );
}

export default RoomPage;
