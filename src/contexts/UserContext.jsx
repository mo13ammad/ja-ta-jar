// UserContext.jsx
import React, { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUser } from '../services/userService';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: userData, isLoading: isUserDataLoading, refetch } = useQuery({
    queryKey: ['get-user'],
    queryFn: getUser,
    retry: false,
  });

  return (
    <UserContext.Provider value={{ userData, isUserDataLoading, refetch }}>
      {children}
    </UserContext.Provider>
  );
};
