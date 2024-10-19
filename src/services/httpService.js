import axios from "axios";

// Base URL for the API
const BASE_URL = "https://portal1.jatajar.com/api";

// Helper function to set the token in a cookie
const setAuthTokenInCookie = (token, expiryDays = 30) => {
  const now = new Date();
  now.setTime(now.getTime() + expiryDays * 24 * 60 * 60 * 1000); // Expiry time
  const expires = `expires=${now.toUTCString()}`;
  document.cookie = `authToken=${token}; ${expires}; path=/; Secure; SameSite=Strict`;
};

// Create an Axios instance
const app = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Enable credentials
});

// Interceptor to include the token in request headers
app.interceptors.request.use(
  (config) => {
    // Extract token from cookie instead of localStorage
    const match = document.cookie.match(new RegExp('(^| )authToken=([^;]+)'));
    const token = match ? match[2] : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to store the token in a cookie
app.interceptors.response.use(
  (response) => {
    if (response.data?.token) {
      setAuthTokenInCookie(response.data.token); // Store the token in a cookie
    }
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

const http = {
  get: app.get,
  post: app.post,
  delete: app.delete,
  put: app.put,
  patch: app.patch,
};

export default http;
