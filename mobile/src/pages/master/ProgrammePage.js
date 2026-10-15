import React from "react";
import MasterCRUD from "../../components/MasterCRUD";
import api from "../../utils/api";

export default function ProgrammePage() {
  return (
    <MasterCRUD
      title="Programme"
      apiPath="/programmes"
      fetchFn={() => api("/programmes")}
      columns={[
        { key: "programmeName", label: "Programme Name" },
        { key: "programmeShortName", label: "Short Name" },
        { key: "department", label: "Department", render: (r) => r.department?.departmentName },
      ]}
      formFields={[
        {
          key: "department",
          label: "Department",
          type: "select",
          fetchOptions: () => api("/departments"),
          optionLabel: "departmentName",
        },
        { key: "programmeName", label: "Programme Name" },
        { key: "programmeShortName", label: "Short Name" },
      ]}
    />
  );
}

