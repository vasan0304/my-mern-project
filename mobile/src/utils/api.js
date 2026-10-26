import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// Default host based on platform
export const getApiBaseUrl = () => {
  // Web browser only
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.location) {
      const port = window.location.port;
      // In production behind Nginx (port 80/443), use relative /api reverse proxy
      if (!port || port === "80" || port === "443") {
        return "/api";
      }
      const host = window.location.hostname || "localhost";
      return `http://${host}:5050/api`;
    }
    return "/api";
  }

  // Physical mobile device (iOS / Android Expo Go): connect to live AWS backend
  return "http://3.111.57.26/api";
};

const api = async (endpoint, options = {}) => {
  let token = null;
  try {
    token = await AsyncStorage.getItem("tms_token");
  } catch (err) {
    console.warn("Could not retrieve tms_token:", err);
  }

  const customBase = await AsyncStorage.getItem("tms_custom_api_url").catch(() => null);
  const baseUrl = customBase || getApiBaseUrl();

  const url = `${baseUrl}${endpoint}`;
  console.log(`[TMS API] Calling ${url}`);

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errMessage = "Request failed";
    try {
      const err = await res.json();
      errMessage = err.message || errMessage;
    } catch {
      errMessage = `HTTP error ${res.status}`;
    }
    throw new Error(errMessage);
  }

  return res.json();
};

export default api;

