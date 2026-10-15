import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("tms_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn("Failed to load stored user:", e);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    await AsyncStorage.setItem("tms_token", data.token);
    await AsyncStorage.setItem("tms_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("tms_token");
      await AsyncStorage.removeItem("tms_user");
    } catch (e) {
      console.warn("Error during logout storage removal:", e);
    }
    setUser(null);
  };

  const isSuperAdmin = user?.role?.roleName?.toLowerCase() === "superadmin";
  const isUser = user?.role?.roleName?.toLowerCase() === "user";
  const isStaff = !!user && !isSuperAdmin && !isUser;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isSuperAdmin,
        isUser,
        isStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

