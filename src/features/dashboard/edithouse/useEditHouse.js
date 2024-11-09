// src/hooks/useEditHouse.js

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editHouse } from '../../../services/houseService';

export default function useEditHouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ houseId, houseData }) => editHouse(houseId, houseData),
    onSuccess: (data, variables) => {
      console.log('useEditHouse - Mutation successful:', data);
      queryClient.invalidateQueries(['get-house', variables.houseId]);
    },
    onError: (error) => {
      console.error('useEditHouse - Mutation error:', error.response?.data || error.message);
    },
  });
}
