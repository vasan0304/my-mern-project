import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ComplaintsPage from "./pages/complaints/ComplaintsPage";
import DepartmentPage from "./pages/master/DepartmentPage";
import ProgrammePage from "./pages/master/ProgrammePage";
import BlockPage from "./pages/master/BlockPage";
import RoomPage from "./pages/master/RoomPage";
import RolePage from "./pages/master/RolePage";
import UserPage from "./pages/master/UserPage";
import ReportsPage from "./pages/reports/ReportsPage";
import { colors } from "./utils/theme";

function App() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");

  if (!user) return <LoginPage />;

  const pageMap = {
    dashboard: <DashboardPage />,
    complaints: <ComplaintsPage />,
    departments: <DepartmentPage />,
    programmes: <ProgrammePage />,
    blocks: <BlockPage />,
    rooms: <RoomPage />,
    roles: <RolePage />,
    users: <UserPage />,
    reports: <ReportsPage />,
  };

  return (
    <div
      style={{
        background: colors.bg,
        minHeight: "100vh",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: colors.text,
      }}
    >
      <Sidebar active={activePage} setActive={setActivePage} />
      <main style={{ marginLeft: 240, padding: 32, minHeight: "100vh" }}>
        {pageMap[activePage] || <DashboardPage />}
      </main>
    </div>
  );
}

export default App;
