
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Public endpoints do not need an access token.
const publicEndpoints = [
  "/auth/register/student/",
  "/auth/register/brand/",
  "/auth/login/",
  "/auth/refresh/",
  "/auth/verify-otp/",
  "/auth/resend-otp/",
  "/auth/forgot-password/",
  "/auth/reset-password/",
];

api.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    const isPublicEndpoint = publicEndpoints.includes(url);

    if (isPublicEndpoint) {
      delete config.headers.Authorization;
    } else {
      const accessToken = localStorage.getItem("access");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        delete config.headers.Authorization;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
