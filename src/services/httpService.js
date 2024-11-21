// src/http.js

import axios from "axios";

const BASE_URL = "https://test.jatajar.com/api";

// Function to set auth token in cookie
const setAuthTokenInCookie = (token, expiryDays = 30) => {
  const now = new Date();
  now.setTime(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  const expires = `expires=${now.toUTCString()}`;
  document.cookie = `authToken=${token}; ${expires}; path=/; Secure; SameSite=Strict`;
};

// Function to delete auth token from cookie
const deleteAuthTokenCookie = () => {
  document.cookie = `authToken=; Max-Age=0; path=/; domain=${window.location.hostname};`;
};

const app = axios.create({
  baseURL: BASE_URL,
});

app.interceptors.request.use(
  (config) => {
    const match = document.cookie.match(new RegExp('(^| )authToken=([^;]+)'));
    const token = match ? match[2] : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

app.interceptors.response.use(
  (response) => {
    if (response.data?.token) {
      setAuthTokenInCookie(response.data.token);
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
export { setAuthTokenInCookie, deleteAuthTokenCookie };
