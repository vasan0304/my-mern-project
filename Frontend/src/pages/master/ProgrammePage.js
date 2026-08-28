import MasterCRUD from "../../components/MasterCRUD";
import api from "../../utils/api";

function ProgrammePage() {
  return (
    <MasterCRUD
      title="Programme"
      apiPath="/programmes"
      fetchFn={() => api("/programmes")}
      columns={[
        { key: "department", label: "Department", render: (r) => r.department?.departmentName },
        { key: "programmeName", label: "Programme Name" },
        { key: "programmeShortName", label: "Short Name" },
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

export default ProgrammePage;
