import http from "./httpService";

// General House Functions
export function getHouses(data) {
  return http.get("/client/house", data).then(({ data }) => data.data);
}

export function createHouse(data) {
  return http.post("/client/house", data).then(({ data }) => data.data);
}

export function deleteHouse(houseId) {
  return http.delete(`/client/house/${houseId}`).then(({ data }) => data.data);
}

export function getHouse(houseId) {
  return http.get(`/client/house/${houseId}`).then(({ data }) => data.data);
}

export function showHouse(houseId) {
  return http.get(`/house/${houseId}`).then(({ data }) => data.data);
}

export async function getRoomCalendar(houseId, roomId) {
  console.log(`[getRoomCalendar] Fetching initial month for room ${roomId} in house ${houseId}`);
  const { data } = await http.get(`/house/${houseId}/calendar/${roomId}`);
  console.log(`[getRoomCalendar] Response for room ${roomId} in house ${houseId}:`, data.data);
  return data.data;
}

export async function getRoomCalendarByMonth(houseId, roomId, year, month) {
  console.log(`[getRoomCalendarByMonth] Fetching month ${year}-${month} for room ${roomId} in house ${houseId}`);
  const { data } = await http.get(`/house/${houseId}/calendar/${roomId}?year=${year}&month=${month}`);
  console.log(`[getRoomCalendarByMonth] Response for ${year}-${month}, room ${roomId}, house ${houseId}:`, data.data);
  return data.data;
}

export async function getHouseCalendar(houseId) {
  console.log(`[getHouseCalendar] Fetching initial month for house ${houseId}`);
  const { data } = await http.get(`/house/${houseId}/calendar`);
  console.log(`[getHouseCalendar] Response for house ${houseId}:`, data.data);
  return data.data;
}

export async function getHouseCalendarByMonth(houseId, year, month) {
  console.log(`[getHouseCalendarByMonth] Fetching month ${year}-${month} for house ${houseId}`);
  const { data } = await http.get(`/house/${houseId}/calendar?year=${year}&month=${month}`);
  console.log(`[getHouseCalendarByMonth] Response for ${year}-${month}, house ${houseId}:`, data.data);
  return data.data;
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
    console.error("Missing houseId or facilitiesData:", {
      houseId,
      facilitiesData,
    });
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
  return http
    .get("/assets/types/structure/detail", data)
    .then(({ data }) => data.data);
}

export function createHousePicture(houseId, data) {
  return http
    .post(`/client/house/${houseId}/media`, data)
    .then(({ data }) => data.data);
}

export function deleteHousePicture(houseId, imageToDelete) {
  return http
    .delete(`/client/house/${houseId}/media/${imageToDelete}`)
    .then(({ data }) => data.data);
}

export function changeHouseMainPicture(houseId, imageId, data) {
  return http
    .put(`/client/house/${houseId}/media/${imageId}`, data)
    .then(({ data }) => data.data);
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
    console.error("Missing houseId, roomId, or roomData:", {
      houseId,
      roomId,
      roomData,
    });
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

// Function to update house-level prices
export function updateHousePrice(houseId, prices) {
  if (!houseId || !prices) {
    console.error("Missing houseId or prices:", { houseId, prices });
    throw new Error("House ID or prices data is missing.");
  }

  return http
    .put(`/client/house/${houseId}/prices`, prices)
    .then(({ data }) => data.data)
    .catch((error) => {
      console.error("updateHousePrice - Error:", error);
      throw error;
    });
}

// Function to update room-specific prices
export function updateRoomPrice(houseId, roomId, prices) {
  if (!houseId || !roomId || !prices) {
    console.error("Missing houseId, roomId, or prices:", {
      houseId,
      roomId,
      prices,
    });
    throw new Error("House ID, room ID, or prices data is missing.");
  }

  return http
    .put(`/client/house/${houseId}/room/${roomId}/prices`, prices)
    .then(({ data }) => data.data)
    .catch((error) => {
      console.error("updateRoomPrice - Error:", error);
      throw error;
    });
}

// Function to upload a document for a house
export function uploadHouseDocument(houseId, documentData) {
  if (!houseId || !documentData) {
    console.error("Missing houseId or documentData:", {
      houseId,
      documentData,
    });
    throw new Error("House ID or document data is missing.");
  }

  const formData = new FormData();
  formData.append("document_type", documentData.document_type);
  formData.append("document", documentData.document);

  return http
    .post(`/client/house/${houseId}/document`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(({ data }) => data.data)
    .catch((error) => {
      console.error("uploadHouseDocument - Error:", error);
      throw error;
    });
}

// Function to publish a house
export function publishHouse(houseId) {
  if (!houseId) {
    console.error("Missing houseId:", { houseId });
    throw new Error("House ID is missing.");
  }

  return http
    .put(`/client/house/${houseId}/publish`)
    .then(({ data }) => data.data)
    .catch((error) => {
      console.error("publishHouse - Error:", error);
      throw error;
    });
}

/** 
 * New Peak Days APIs
 */

// Add peak days (POST /client/house/:uuid/calendar/peaks)
export function addPeakDays(houseId, fromDate, toDate) {
  if (!houseId || !fromDate || !toDate) {
    console.error("Missing parameters:", { houseId, fromDate, toDate });
    throw new Error("House ID, from_date and to_date are required.");
  }

  return http
    .post(`/client/house/${houseId}/calendar/peaks`, { from_date: fromDate, to_date: toDate })
    .then(({ data }) => data.data)
    .catch((error) => {
      console.error("addPeakDays - Error:", error);
      throw error;
    });
}

// Get peak days for a specific month (GET /client/house/:uuid/calendar/:year/:month/peaks)
export function getPeakDays(houseId, year, month) {
  if (!houseId || !year || !month) {
    console.error("Missing parameters:", { houseId, year, month });
    throw new Error("House ID, year, and month are required.");
  }

  return http
    .get(`/client/house/${houseId}/calendar/${year}/${month}/peaks`)
    .then(({ data }) => data.data)
    .catch((error) => {
      console.error("getPeakDays - Error:", error);
      throw error;
    });
}

// Remove peak days (DELETE /client/house/:uuid/calendar/peaks)
export function removePeakDays(houseId, fromDate, toDate) {
  if (!houseId || !fromDate || !toDate) {
    console.error("Missing parameters:", { houseId, fromDate, toDate });
    throw new Error("House ID, from_date, and to_date are required.");
  }

  return http
    .delete(`/client/house/${houseId}/calendar/peaks`, {
      data: { from_date: fromDate, to_date: toDate },
    })
    .then(({ data }) => data.data)
    .catch((error) => {
      console.error("removePeakDays - Error:", error);
      throw error;
    });
}
