// src/hooks/useFetchHouse.js
import { useQuery } from "@tanstack/react-query";
import {  getHouseCalendarByMonth } from "../../services/houseService";

export default function useGetCalendarByMonth(uuid,year,month){
  return useQuery({
    queryKey: ["get-house-calender-by-month", uuid],
    queryFn: () => getHouseCalendarByMonth(uuid,year,month),
    retry: false,
    enabled: !!uuid,
  });
}
