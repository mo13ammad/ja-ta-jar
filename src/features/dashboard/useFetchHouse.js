// src/hooks/useFetchHouse.js
import { useQuery } from "@tanstack/react-query";
import { getHouse } from "../../services/houseService";

export default function useFetchHouse(uuid) {
  return useQuery({
    queryKey: ["get-house", uuid],
    queryFn: () => getHouse(uuid),
    retry: false,
    enabled: !!uuid, // Only fetch when uuid is provided
  });
}
