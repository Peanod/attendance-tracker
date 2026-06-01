import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const saved = localStorage.getItem("student-attendance-tracker-auth");
  const token = saved ? JSON.parse(saved).token : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || "Terjadi kesalahan";
    return Promise.reject({
      ...error,
      message,
      payload: error.response?.data,
    });
  },
);

export default api;
