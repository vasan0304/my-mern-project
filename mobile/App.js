import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  useWindowDimensions,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import Sidebar from "./src/components/Sidebar";
import Header from "./src/components/Header";
import LoginPage from "./src/pages/LoginPage";
import DashboardPage from "./src/pages/DashboardPage";
import ComplaintsPage from "./src/pages/ComplaintsPage";
import DepartmentPage from "./src/pages/master/DepartmentPage";
import ProgrammePage from "./src/pages/master/ProgrammePage";
import BlockPage from "./src/pages/master/BlockPage";
import RoomPage from "./src/pages/master/RoomPage";
import RolePage from "./src/pages/master/RolePage";
import UserPage from "./src/pages/master/UserPage";
import ReportsPage from "./src/pages/ReportsPage";
import { Spinner } from "./src/components/UI";
import { colors } from "./src/utils/theme";

function MainApp() {
  const { user, loading, isSuperAdmin } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { width } = useWindowDimensions();

  const isWide = width >= 840;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Spinner />
      </View>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Role protected screens map
  const pageMap = {
    dashboard: <DashboardPage />,
    complaints: <ComplaintsPage />,
    departments: isSuperAdmin ? <DepartmentPage /> : <DashboardPage />,
    programmes: isSuperAdmin ? <ProgrammePage /> : <DashboardPage />,
    blocks: isSuperAdmin ? <BlockPage /> : <DashboardPage />,
    rooms: isSuperAdmin ? <RoomPage /> : <DashboardPage />,
    roles: isSuperAdmin ? <RolePage /> : <DashboardPage />,
    users: isSuperAdmin ? <UserPage /> : <DashboardPage />,
    reports: isSuperAdmin ? <ReportsPage /> : <DashboardPage />,
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      complaints: "Complaints",
      departments: "Departments",
      programmes: "Programmes",
      blocks: "Blocks",
      rooms: "Rooms",
      roles: "Roles",
      users: "Users",
      reports: "Reports",
    };
    return titles[activePage] || "TMS";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.layoutContainer}>
        {/* Jobie Left Sidebar for Desktop / Tablet */}
        {isWide && (
          <Sidebar active={activePage} setActive={setActivePage} />
        )}

        {/* Right Main Application Area */}
        <View style={styles.mainCanvas}>
          {/* Jobie Top Header Bar */}
          <Header
            title={getPageTitle()}
            onMenuPress={() => setDrawerOpen(true)}
            isMobile={!isWide}
          />

          {/* Screen Content View */}
          <View style={styles.contentArea}>
            {pageMap[activePage] || <DashboardPage />}
          </View>
        </View>

        {/* Mobile Slide-Out Drawer Modal */}
        {!isWide && (
          <Modal
            visible={drawerOpen}
            animationType="slide"
            transparent
            onRequestClose={() => setDrawerOpen(false)}
          >
            <View style={styles.drawerOverlay}>
              <TouchableOpacity
                style={styles.drawerBackdrop}
                activeOpacity={1}
                onPress={() => setDrawerOpen(false)}
              />
              <View style={styles.drawerSheet}>
                <Sidebar
                  active={activePage}
                  setActive={setActivePage}
                  onClose={() => setDrawerOpen(false)}
                />
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: Platform.OS === "web" ? "100vh" : "100%",
    backgroundColor: "#11141c",
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  layoutContainer: {
    flex: 1,
    flexDirection: Platform.OS === "web" ? "row" : "column",
    backgroundColor: "#11141c",
    height: Platform.OS === "web" ? "100vh" : "100%",
  },
  mainCanvas: {
    flex: 1,
    backgroundColor: colors.bg,
    overflow: "hidden",
    borderTopLeftRadius: Platform.OS === "web" ? 24 : 0,
    borderBottomLeftRadius: Platform.OS === "web" ? 24 : 0,
    height: "100%",
  },
  contentArea: {
    flex: 1,
    backgroundColor: colors.bg,
    height: "100%",
  },
  drawerOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  drawerBackdrop: {
    flex: 1,
  },
  drawerSheet: {
    width: 270,
    height: "100%",
    backgroundColor: "#11141c",
  },
});
