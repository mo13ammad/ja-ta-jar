// src/hooks/useFetchHouse.js
import { useQuery } from "@tanstack/react-query";
import { showHouse } from "../../services/houseService";

export default function useFetchHouse(uuid) {
  return useQuery({
    queryKey: ["show-house", uuid],
    queryFn: () => showHouse(uuid),
    retry: false,
    enabled: !!uuid, // Only fetch when uuid is provided
  });
}
