// src/services/userService.js

import http from './httpService';

export function getUser() {
  return http
    .get('/client/profile')
    .then(({ data }) => data.data)
    .catch((error) => {
      // Handle errors if needed
      return Promise.reject(error);
    });
}

export function editUser(data) {
  return http
    .post('/client/profile', data)
    .then(({ data }) => data.data)
    .catch((error) => {
      // Handle errors if needed
      return Promise.reject(error);
    });
}

export function logOutUser() {
  return http
    .delete('/client/profile/logout')
    .then(({ data }) => data.data)
    .catch((error) => {
      // Handle errors if needed
      return Promise.reject(error);
    });
}

export function becomeVendor(data) {
  return http
    .put('/client/profile/vendor', data)
    .then(({ data }) => data.data)
    .catch((error) => {
      // Handle errors if needed
      return Promise.reject(error);
    });
}
