import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import Loading from './Loading';
import useUser from '../features/authentication/useUser';

function AppLayout() {
  const { isLoading, data } = useUser();  // Assume useUser provides isLoading for fetch state
  const navigate = useNavigate();

  // Redirect to /auth if user does not exist after loading is complete
  useEffect(() => {
    if (!isLoading && !data) {
      navigate('/auth');
    }
  }, [isLoading, data, navigate]);

  // While fetching user data, show loading spinner
  if (isLoading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loading />
      </div>
    );
  }

  return (
    <>
      {data && (
        <div className='w-full relative min-h-screen'>
          <Header />
          <div className='container xl:max-w-8xl min-h-[85vh] pt-20 md:pt-6 flex flex-col'>
            {/* Outlet renders the current route's component */}
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}

export default AppLayout;
