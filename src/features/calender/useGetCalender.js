// src/hooks/useFetchHouse.js
import { useQuery } from "@tanstack/react-query";
import { getHouseCalender } from "../../services/houseService";

export default function useFetchHouse(uuid) {
  return useQuery({
    queryKey: ["get-house-calender", uuid],
    queryFn: () => getHouseCalender(uuid),
    retry: false,
    enabled: !!uuid, 
  });
}
