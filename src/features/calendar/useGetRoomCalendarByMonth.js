// src/hooks/useGetRoomCalendarByMonth.js
import { useQuery } from "@tanstack/react-query";
import { getRoomCalendarByMonth } from "../../services/houseService";

export default function useGetRoomCalendarByMonth(uuid, roomUuid, year, month, enabled) {
  return useQuery({
    queryKey: ["get-room-calendar-by-month", uuid, roomUuid, year, month],
    queryFn: () => getRoomCalendarByMonth(uuid, roomUuid, year, month),
    retry: false,
    enabled: !!uuid && !!roomUuid && !!year && !!month && enabled,
  });
}
