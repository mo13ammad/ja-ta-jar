// src/hooks/useGetCalendarByMonth.js (For House)
import { useQuery } from "@tanstack/react-query";
import { getHouseCalendarByMonth } from "../../services/houseService";

export default function useGetHouseCalendarByMonth(uuid, year, month, enabled) {
  return useQuery({
    queryKey: ["get-house-calendar-by-month", uuid, year, month],
    queryFn: () => getHouseCalendarByMonth(uuid, year, month),
    retry: false,
    enabled: !!uuid && !!year && !!month && enabled,
  });
}
