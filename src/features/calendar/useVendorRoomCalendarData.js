import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { VendorHouseCalendarByRoom } from "../../services/houseService";
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';

dayjs.extend(jalaliday);

function getNextMonths(year, month, count) {
  const months = [];
  for (let i = 1; i <= count; i++) {
    let newMonth = month + i;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = newMonth % 12;
      newYear += Math.floor((month + i - 1) / 12);
    }
    months.push({ year: newYear, month: newMonth });
  }
  return months;
}

/**
 * useVendorRoomCalendarData:
 * Fetches initial and subsequent months for a single selected room.
 * Conditions:
 * - Only fetch if isRentRoom = true
 * - Only fetch if selectedRoomUuid is defined
 * - If either condition not met, no request sent
 */
export function useVendorRoomCalendarData({ uuid, isRentRoom, enabled, prefetchCount = 1, selectedRoomUuid }) {
  const shouldFetch = isRentRoom && enabled && !!uuid && !!selectedRoomUuid;

  // Step 1: Fetch initial month for the selected room
  const initialQuery = useQuery(
    ["vendor-room-calendar", uuid, selectedRoomUuid, "initial"],
    async () => {
      console.log("[useVendorRoomCalendarData] Fetching initial month for room:", selectedRoomUuid, "house:", uuid);
      const res = await VendorHouseCalendarByRoom(uuid, selectedRoomUuid);
      console.log("[useVendorRoomCalendarData] Initial month data for room:", selectedRoomUuid, "=>", res);
      return res; // single month object
    },
    {
      enabled: shouldFetch,
      staleTime: 300000,
      cacheTime: 1800000,
    }
  );

  const allInitialSuccess = initialQuery.isSuccess && initialQuery.data;
  const anyInitialError = initialQuery.isError ? initialQuery.error : null;

  // Step 2: Compute queries for subsequent months
  const subsequentMonthsConfigs = useMemo(() => {
    if (!allInitialSuccess) {
      if (anyInitialError) {
        console.log("[useVendorRoomCalendarData] Initial query failed, skipping subsequent months.");
      }
      return [];
    }

    const initialMonth = initialQuery.data;
    if (!initialMonth || typeof initialMonth.year === "undefined" || typeof initialMonth.month === "undefined") {
      console.log("[useVendorRoomCalendarData] initialMonth is missing year/month for room:", selectedRoomUuid, initialMonth);
      return [];
    }

    const { year, month } = initialMonth;

    const gregorianDate = dayjs(`${year}-${month}-01`, 'YYYY-M-D');
    const jalaliDate = gregorianDate.calendar('jalali').locale('fa').format('YYYY/MM/DD');
    console.log(`[useVendorRoomCalendarData] Gregorian: ${year}-${month}-01 -> Jalali: ${jalaliDate}`);

    const nextMonths = getNextMonths(year, month, prefetchCount);
    return nextMonths.map(({ year: y, month: m }) => ({
      queryKey: ["vendor-room-calendar", uuid, selectedRoomUuid, y, m],
      queryFn: async () => {
        console.log(`[useVendorRoomCalendarData] Fetching subsequent month ${y}-${m} for room: ${selectedRoomUuid}, house: ${uuid}`);
        const res = await VendorHouseCalendarByRoom(uuid, selectedRoomUuid, y, m);
        console.log(`[useVendorRoomCalendarData] Subsequent month ${y}-${m} data for room: ${selectedRoomUuid} =>`, res);
        return res;
      },
      enabled: allInitialSuccess,
      staleTime: 300000,
      cacheTime: 1800000,
    }));
  }, [allInitialSuccess, initialQuery.data, anyInitialError, uuid, selectedRoomUuid, prefetchCount]);

  const subsequentQueries = useQueries({ queries: subsequentMonthsConfigs });

  const anySubsequentError = subsequentQueries.find(q => q.isError)?.error;
  const isError = !!anyInitialError || !!anySubsequentError;
  const error = anyInitialError || anySubsequentError;

  const isInitialLoading = initialQuery.isLoading;
  const isSubsequentLoading = subsequentQueries.some((q) => q.isLoading);

  const isLoading = shouldFetch && (isInitialLoading || isSubsequentLoading);

  const calendarData = useMemo(() => {
    if (!shouldFetch || isLoading || isError) {
      if (isError) {
        console.error("[useVendorRoomCalendarData] Returning empty data due to error:", error);
      }
      return [];
    }

    const initialMonth = initialQuery.data;
    const subsequentMonths = subsequentQueries
      .filter(sq => sq.isSuccess && sq.data)
      .map(sq => sq.data);

    const finalMonths = [initialMonth, ...subsequentMonths];

    console.log("[useVendorRoomCalendarData] Final calendarData for room:", selectedRoomUuid, finalMonths);
    // Return data in the same format as before: since we have a single room, return just an array of months
    return finalMonths;
  }, [shouldFetch, isLoading, isError, initialQuery.data, subsequentQueries, selectedRoomUuid, error]);

  return {
    isLoading,
    isError,
    error,
    calendarData,
  };
}
