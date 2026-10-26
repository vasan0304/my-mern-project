import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
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
import ProfilePage from "./src/pages/ProfilePage";
import { Spinner } from "./src/components/UI";
import { colors } from "./src/utils/theme";

function MainApp() {
  const { user, loading, isSuperAdmin } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isWide = width >= 840;

  if (loading) {
    return (
      <View
        style={[
          styles.centerContainer,
          {
            paddingTop: Platform.OS === "web" ? 0 : insets.top,
            paddingBottom: Platform.OS === "web" ? 0 : insets.bottom,
          },
        ]}
      >
        <StatusBar style="light" />
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
    profile: <ProfilePage onNavigate={setActivePage} />,
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
      profile: "My Profile",
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
    <View style={styles.rootContainer}>
      <StatusBar style="light" backgroundColor={colors.surface} />
      <View
        style={[
          styles.layoutContainer,
          {
            paddingLeft: Platform.OS === "web" ? 0 : insets.left,
            paddingRight: Platform.OS === "web" ? 0 : insets.right,
          },
        ]}
      >
        {/* Jobie Left Sidebar for Desktop / Tablet */}
        {isWide && (
          <Sidebar active={activePage} setActive={setActivePage} />
        )}

        {/* Right Main Application Area */}
        <View style={styles.mainCanvas}>
          {/* Jobie Top Header Bar with Profile shortcut */}
          <Header
            title={getPageTitle()}
            onMenuPress={() => setDrawerOpen(true)}
            onProfilePress={() => setActivePage("profile")}
            isMobile={!isWide}
          />

          {/* Screen Content View with bottom safe area padding */}
          <View
            style={[
              styles.contentArea,
              {
                paddingBottom: Platform.OS === "web" ? 0 : insets.bottom,
              },
            ]}
          >
            {pageMap[activePage] || <DashboardPage />}
          </View>
        </View>

        {/* Mobile Slide-Out Drawer Modal */}
        {!isWide && (
          <Modal
            visible={drawerOpen}
            animationType="fade"
            transparent
            statusBarTranslucent={true}
            onRequestClose={() => setDrawerOpen(false)}
          >
            <View style={styles.drawerOverlay}>
              {/* Drawer Sheet placed on LEFT side directly under hamburger menu icon */}
              <View
                style={[
                  styles.drawerSheet,
                  {
                    paddingTop: Platform.OS === "web" ? 0 : insets.top,
                    paddingBottom: Platform.OS === "web" ? 0 : insets.bottom,
                  },
                ]}
              >
                <Sidebar
                  active={activePage}
                  setActive={setActivePage}
                  onClose={() => setDrawerOpen(false)}
                />
              </View>

              {/* Backdrop placed on RIGHT side */}
              <TouchableOpacity
                style={styles.drawerBackdrop}
                activeOpacity={1}
                onPress={() => setDrawerOpen(false)}
              />
            </View>
          </Modal>
        )}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    height: Platform.OS === "web" ? "100vh" : "100%",
    backgroundColor: colors.surface,
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
    backgroundColor: colors.bg,
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
  drawerSheet: {
    width: 280,
    height: "100%",
    backgroundColor: "#11141c",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 16,
  },
  drawerBackdrop: {
    flex: 1,
  },
});
