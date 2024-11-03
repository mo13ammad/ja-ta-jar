import axios from "axios";

const BASE_URL = "https://portal1.jatajar.com/api";

const setAuthTokenInCookie = (token, expiryDays = 30) => {
  const now = new Date();
  now.setTime(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  const expires = `expires=${now.toUTCString()}`;
  document.cookie = `authToken=${token}; ${expires}; path=/; Secure; SameSite=Strict`;
};

const app = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
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
