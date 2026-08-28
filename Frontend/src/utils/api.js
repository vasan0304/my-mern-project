const API_BASE = "http://localhost:5000/api";

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("tms_token");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Request failed");
  }
  return res.json();
};

export default api;
