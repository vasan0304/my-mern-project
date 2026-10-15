import React from "react";
import MasterCRUD from "../../components/MasterCRUD";
import api from "../../utils/api";

export default function RolePage() {
  return (
    <MasterCRUD
      title="Role"
      apiPath="/roles"
      fetchFn={() => api("/roles")}
      columns={[
        { key: "roleName", label: "Role Name" },
        { key: "assignedUsers", label: "Person Name", render: (r) => r.assignedUsers || "None" },
      ]}
      formFields={[
        { key: "roleName", label: "Role Name" },
        {
          key: "assignedUser",
          label: "Assign Person",
          type: "select",
          fetchOptions: () => api("/users"),
          optionLabel: "userName",
        },
      ]}
    />
  );
}
