import { createContext, useContext, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("tms_user");
    return u ? JSON.parse(u) : null;
  });

  const login = async (email, password) => {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("tms_token", data.token);
    localStorage.setItem("tms_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("tms_token");
    localStorage.removeItem("tms_user");
    setUser(null);
  };

  const isSuperAdmin = user?.role?.roleName?.toLowerCase() === "superadmin";
  const isUser = user?.role?.roleName?.toLowerCase() === "user";
  const isStaff = user && !isSuperAdmin && !isUser;

  return (
    <AuthContext.Provider value={{ user, login, logout, isSuperAdmin, isUser, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}
