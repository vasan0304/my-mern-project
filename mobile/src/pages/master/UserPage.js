import React from "react";
import MasterCRUD from "../../components/MasterCRUD";
import api from "../../utils/api";

export default function UserPage() {
  return (
    <MasterCRUD
      title="User"
      apiPath="/users"
      fetchFn={() => api("/users")}
      columns={[
        { key: "userName", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phoneNumber", label: "Phone" },
        { key: "role", label: "Role", render: (r) => r.role?.roleName },
        { key: "department", label: "Department", render: (r) => r.department?.departmentName },
      ]}
      formFields={[
        { key: "userName", label: "User Name" },
        { key: "phoneNumber", label: "Phone Number" },
        { key: "email", label: "Email", inputType: "email" },
        { key: "password", label: "Password", inputType: "password" },
        {
          key: "role",
          label: "Role",
          type: "select",
          fetchOptions: () => api("/roles"),
          optionLabel: "roleName",
        },
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
      ]}
    />
  );
}

