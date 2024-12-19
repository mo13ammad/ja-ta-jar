import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { VendorHouseCalendarByHouse } from "../../services/houseService";

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

export function useVendorHouseCalendarData({ uuid, isRentRoom, enabled, prefetchCount = 1 }) {
  // If you've implemented the logic from previous messages, you can keep it as is.
  // Otherwise, here's the simpler version:
  
  const adjustedPrefetchCount = isRentRoom ? prefetchCount : Math.max(prefetchCount, 2);
  const [additionalMonths, setAdditionalMonths] = useState([]);

  const initialQuery = useQuery(
    ["vendor-house-calendar", uuid, "initial"],
    () => VendorHouseCalendarByHouse(uuid),
    {
      enabled: enabled && !!uuid && !isRentRoom,
      staleTime: 300000,
      cacheTime: 1800000,
      onSuccess: (data) => {
        if (data && data.year && data.month) {
          const { year, month } = data;
          const monthsToFetch = getNextMonths(year, month, adjustedPrefetchCount);
          setAdditionalMonths(monthsToFetch);
        }
      },
    }
  );

  const additionalQueries = useQueries({
    queries: additionalMonths.map(({ year, month }) => ({
      queryKey: ["vendor-house-calendar", uuid, year, month],
      queryFn: () => VendorHouseCalendarByHouse(uuid, year, month),
      enabled: !!uuid && !isRentRoom && additionalMonths.length > 0,
      staleTime: 300000,
      cacheTime: 1800000,
    })),
  });

  const isInitialLoading = initialQuery.isLoading;
  const isAdditionalLoading = additionalQueries.some((q) => q.isLoading);
  const isError = initialQuery.isError || additionalQueries.some((q) => q.isError);
  const error = initialQuery.error || additionalQueries.find((q) => q.isError)?.error;

  const initialData = initialQuery.data ? [initialQuery.data] : [];
  const additionalData = additionalQueries
    .filter((q) => q.isSuccess && q.data)
    .map((q) => q.data);

  const calendarData = [...initialData, ...additionalData];

  return {
    isLoading: enabled && (isInitialLoading || isAdditionalLoading),
    isError,
    error,
    calendarData,
  };
}
