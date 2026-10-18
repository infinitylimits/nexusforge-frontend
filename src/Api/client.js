import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// attach the JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// turn a backend error into a readable message
export function errorText(err) {
  const data = err.response?.data;
  if (!data) return err.message;
  if (data.fieldErrors) return Object.values(data.fieldErrors).join(", ");
  return data.message || "Something went wrong";
}

export default api;