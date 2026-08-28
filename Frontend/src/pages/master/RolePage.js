import MasterCRUD from "../../components/MasterCRUD";
import api from "../../utils/api";

function RolePage() {
  return (
    <MasterCRUD
      title="Role"
      apiPath="/roles"
      fetchFn={() => api("/roles")}
      columns={[{ key: "roleName", label: "Role Name" }]}
      formFields={[{ key: "roleName", label: "Role Name" }]}
    />
  );
}

export default RolePage;
