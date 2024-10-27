import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';
import useUser from './useUser';
import Loading from '../../ui/Loading';

function DashboardContainer() {
  const { isLoading, data: user } = useUser();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('profile');
  console.log(user);
  // Redirect to home if user does not exist after loading
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loading size={30} /></div>;
  }

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 w-full min-h-[83vh] h-full">
      <div className="md:col-span-3 w-full bg-gray-50 border-t border-gray-200 shadow-centered rounded-xl p-2 md:p-4">
        <DashboardSidebar user={user} setSelectedTab={setSelectedTab} />
      </div>
      <div className="md:col-span-9 flex-grow w-full bg-gray-50 border-t border-gray-200 shadow-centered rounded-xl p-2 md:p-4">
        <DashboardContent initialUser={user} selectedTab={selectedTab} />
      </div>
    </div>
  );
}

export default DashboardContainer;
