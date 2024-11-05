import http from "./httpService";

export function getHouses(data) {
  return http.get('/client/house', data).then(({ data }) => data.data);
}


export function createHouse(data) {
  return http.post('/client/house', data).then(({ data }) => data.data);
}


export function deleteHouse(houseId) {
  return http.delete(`/client/house/${houseId}`).then(({ data }) => data);
}
export function getHouse(houseId) {
  return http.get(`/client/house/${houseId}`).then(({ data }) => data);
}

export function editHouse(houseId, houseData) {
  if (!houseId || !houseData) {
    console.error("Missing houseId or houseData:", { houseId, houseData });
    throw new Error("House ID or data is missing.");
  }
  return http
    .put(`/client/house/${houseId}`, houseData)
    .then(({ data }) => data)
    .catch((error) => {
      console.error("editHouse - Error:", error);
      throw error;
    });
}
export function editHouseFacilities(houseId, facilitiesData) {
  if (!houseId || !facilitiesData) {
    console.error("Missing houseId or facilitiesData:", { houseId, facilitiesData });
    throw new Error("House ID or facilities data is missing.");
  }
  
  return http
    .put(`/client/house/${houseId}/facility`, { facilities: facilitiesData })
    .then(({ data }) => data)
    .catch((error) => {
      console.error("editHouseFacilities - Error:", error);
      throw error;
    });
}




export function getHouseTypes(data) {
  return http.get('/assets/types/structure/detail', data).then(({ data }) => data.data);
}
export function createHousePicture(data) {
  return http.post('/client/house/${houseUuid}/media', data).then(({ data }) => data.data);
}
export function deleteHousePicture(data) {
  return http.delete('/client/house/${houseUuid}/media/${imageToDelete}', data).then(({ data }) => data.data);
}

export function changeHouseMainPicture(data) {
  return http.delete('/client/house/${houseUuid}/media/${imageId}', data).then(({ data }) => data.data);
}

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




  // const response = await axios.put(
//   `https://portal1.jatajar.com/api/client/house/${houseUuid}/facility`,
//   requestData,
//   {
//     headers: {