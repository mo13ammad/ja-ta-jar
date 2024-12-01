// src/hooks/useFetchHouse.js
import { useQuery } from "@tanstack/react-query";
import { getHouse } from "../../services/houseService";

export default function useFetchHouse(uuid) {
  return useQuery({
    queryKey: ["get-house", uuid],
    queryFn: () => getHouse(uuid),
    retry: false,
    enabled: !!uuid, // Only fetch when uuid is provided
    staleTime: 10 * 60 * 1000, // Data remains fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Cache remains for 10 minutes
  });
}
