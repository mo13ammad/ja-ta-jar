import http from "./httpService";

export function getHouses(data) {
  return http.get('/client/house', data)
    .then(({ data }) => {
      return data.data;
    });
}

export function createHouse(data) {
  return http.post('/client/house', data)
    .then(({ data }) => {
      return data.data;
    });
}

export function getHouseTypes(data) {
  return http.get('/assets/types/structure/detail', data)
    .then(({ data }) => {
      return data.data;
    });
}




// const response = await axios.put(
//   `https://portal1.jatajar.com/api/client/house/${houseUuid}/facility`,
//   requestData,
//   {
//     headers: {









// Rooms 



// if (roomData.uuid) {
//   // PUT request for updating existing room
//   response = await axios.put(
//     `https://portal1.jatajar.com/api/client/house/${houseUuid}/room/${roomData.uuid}`,
//     requestData,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   );
// } else {
//   // POST request for creating new room
//   response = await axios.post(
//     `https://portal1.jatajar.com/api/client/house/${houseUuid}/room`,
//     requestData,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }


// const response = await axios.delete(
//   `https://portal1.jatajar.com/api/client/house/${houseUuid}/room/${roomData.uuid}`,
//   {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },









// Images

// const response = await axios.post(
//   `https://portal1.jatajar.com/api/client/house/${houseUuid}/media`,

// const response = await axios.delete(
//   `https://portal1.jatajar.com/api/client/house/${houseUuid}/media/${imageToDelete}`,
//   {
//     headers: {


// const response = await axios.put(
//   `https://portal1.jatajar.com/api/client/house/${houseUuid}/media/${imageId}`,
//   {
//     title: imageToMakeMain.title,
//     main: 1,



  //       );

  // const response = await axios.put(
//   `https://portal1.jatajar.com/api/client/house/${houseUuid}/facility`,
//   requestData,
//   {
//     headers: {