import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import useUser from '../features/dashboard/useUser';

function AppLayout() {
  // Fetch user data in the background
  useUser();

  return (
    <>
      <div className="w-full relative min-h-screen">
        <Header />
        <div className="md:container xl:max-w-8xl min-h-[85vh] pt-12 md:pt-8 flex flex-col">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AppLayout;
