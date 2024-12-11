// src/hooks/useFetchHouse.js
import { useQuery } from "@tanstack/react-query";
import { getRoomCalendar } from "../../services/houseService";

export default function useGetRoomCalendar(uuid,roomUuid) {
  return useQuery({
    queryKey: ["get-room-calendar", uuid],
    queryFn: () => getRoomCalendar(uuid,roomUuid),
    retry: false,
    enabled: !!uuid && !!roomUuid,
  });
}
