// src/hooks/useFetchHouses.js
import { useQuery } from "@tanstack/react-query";
import { getHouses } from "../../services/houseService";

export default function useFetchHouses() {
    return useQuery({
        queryKey: ["get-houses"],
        queryFn: getHouses,
        retry: false,
    });
}
