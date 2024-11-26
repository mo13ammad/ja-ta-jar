// src/services/authService.js

import http from "./httpService";

export function getOtp(data) {
  return http.post("/auth/authenticate", data).then(({ data }) => data.data); // Call via proxy
}

export function checkOtp(data) {
  return http.post("/auth/login", data).then(({ data }) => data.data);
}

export function register(data) {
  return http.post("/auth/register", data).then(({ data }) => data.data);
}

// Add the loginWithToken function
export function loginWithToken(data) {
  return http.post("/auth/login/token", data).then(({ data }) => data.data);
}
