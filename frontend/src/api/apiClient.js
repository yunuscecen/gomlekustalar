import axios from "axios";

const apiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: apiUrl.replace(/\/$/, ""),
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        "İşlem sırasında beklenmeyen bir hata oluştu.",
      originalError: error,
    };

    return Promise.reject(normalizedError);
  }
);

export default apiClient;