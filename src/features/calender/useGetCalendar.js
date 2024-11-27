// src/hooks/useFetchHouse.js
import { useQuery } from "@tanstack/react-query";
import { getHouseCalendar } from "../../services/houseService";

export default function useGetCalendar(uuid) {
  return useQuery({
    queryKey: ["get-house-calender", uuid],
    queryFn: () => getHouseCalendar(uuid),
    retry: false,
    enabled: !!uuid,
  });
}
