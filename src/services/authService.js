import http from './httpService';

export function getOtp(data) {
    return http.post('/auth/authenticate', data).then(({data})=>data.data); // Call via proxy
  }

export function checkOtp(data) {
  return http.post('/auth/login', data).then(({data})=>data.data);
}

export function register(data) {
    return http.post('/auth/register', data).then(({data})=>data.data);
  }


  export function getUser(data) {
    return http.get('/client/profile', data).then(({data})=>data.data);
  }