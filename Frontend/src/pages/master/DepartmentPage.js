import MasterCRUD from "../../components/MasterCRUD";
import api from "../../utils/api";

function DepartmentPage() {
  return (
    <MasterCRUD
      title="Department"
      apiPath="/departments"
      fetchFn={() => api("/departments")}
      columns={[
        { key: "departmentName", label: "Department Name" },
        { key: "departmentShortName", label: "Short Name" },
      ]}
      formFields={[
        { key: "departmentName", label: "Department Name" },
        { key: "departmentShortName", label: "Short Name" },
      ]}
    />
  );
}

export default DepartmentPage;
