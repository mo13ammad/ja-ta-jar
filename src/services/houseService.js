// src/services/houseService.js

import http from "./httpService";

// General House Functions
export function getHouses(data) {
  return http.get('/client/house', data).then(({ data }) => data.data);
}

export function createHouse(data) {
  return http.post('/client/house', data).then(({ data }) => data.data);
}

export function deleteHouse(houseId) {
  return http.delete(`/client/house/${houseId}`).then(({ data }) => data.data);
}

export function getHouse(houseId) {
  return http.get(`/client/house/${houseId}`).then(({ data }) => data.data);
}

export function editHouse(houseId, houseData) {
  if (!houseId || !houseData) {
    console.error("Missing houseId or houseData:", { houseId, houseData });
    throw new Error("House ID or data is missing.");
  }
  return http
    .put(`/client/house/${houseId}`, houseData)
    .then(({ data }) => data.data)
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
    .then(({ data }) => data.data)
    .catch((error) => {
      console.error("editHouseFacilities - Error:", error);
      throw error;
    });
}

// House Media Functions
export function getHouseTypes(data) {
  return http.get('/assets/types/structure/detail', data).then(({ data }) => data.data);
}

export function createHousePicture(houseId, data) {
  return http.post(`/client/house/${houseId}/media`, data).then(({ data }) => data.data);
}

export function deleteHousePicture(houseId, imageToDelete) {
  return http.delete(`/client/house/${houseId}/media/${imageToDelete}`).then(({ data }) => data.data);
}

export function changeHouseMainPicture(houseId, imageId) {
  return http.put(`/client/house/${houseId}/media/${imageId}`, { main: 1 }).then(({ data }) => data.data);
}

// Room Functions
export function createRoom(houseId, roomData) {
  if (!houseId || !roomData) {
    console.error("Missing houseId or roomData:", { houseId, roomData });
    throw new Error("House ID or room data is missing.");
  }
  return http
    .post(`/client/house/${houseId}/room`, roomData)
    .then(({ data }) => data.data)
    .catch((error) => {
      console.error("createRoom - Error:", error);
      throw error;
    });
}

export function editRoom(houseId, roomId, roomData) {
  if (!houseId || !roomId || !roomData) {
    console.error("Missing houseId, roomId, or roomData:", { houseId, roomId, roomData });
    throw new Error("House ID, room ID, or room data is missing.");
  }
  return http
    .put(`/client/house/${houseId}/room/${roomId}`, roomData)
    .then(({ data }) => data.data)
    .catch((error) => {
      console.error("editRoom - Error:", error);
      throw error;
    });
}

export function deleteRoom(houseId, roomId) {
  if (!houseId || !roomId) {
    console.error("Missing houseId or roomId:", { houseId, roomId });
    throw new Error("House ID or room ID is missing.");
  }
  return http
    .delete(`/client/house/${houseId}/room/${roomId}`)
    .then(({ data }) => data.data)
    .catch((error) => {
      console.error("deleteRoom - Error:", error);
      throw error;
    });
}
