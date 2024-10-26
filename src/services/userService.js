import http from './httpService';


export function getUser(data) {
    return http.get('/client/profile', data).then(({data})=>data.data);
  }

  export function editUser(data) {
    return http.post('/client/profile', data).then(({data})=>data.data);
  }

  export function logOutUser(data) {
    return http.delete('/client/profile/logout', data).then(({data})=>data.data);
  }
  
 export function becomeVendor(data) {
  return http.put('/client/profile/vendor', data).then(({data})=>data.data);
 }
  