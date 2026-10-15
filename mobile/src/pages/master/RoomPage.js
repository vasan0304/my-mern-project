import React from "react";
import MasterCRUD from "../../components/MasterCRUD";
import api from "../../utils/api";

export default function RoomPage() {
  return (
    <MasterCRUD
      title="Room"
      apiPath="/rooms"
      fetchFn={() => api("/rooms")}
      columns={[
        { key: "roomNumber", label: "Room Number", render: (r) => `Room ${r.roomNumber}` },
        { key: "block", label: "Block", render: (r) => r.block?.blockName },
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

