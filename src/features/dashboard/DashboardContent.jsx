import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import EditProfile from './EditProfile';
import Houses from './Houses';

const DashboardContent = ({ selectedTab, initialUser }) => {
  const [user, setUser] = useState(initialUser);

  const renderContent = () => {
    switch (selectedTab) {
      case 'profile':
        return <Profile user={user} />;
      case 'editProfile':
        return <EditProfile user={user} onUpdateUser={setUser} />;
      case 'houses':
        // Only render Houses if user type is Vendor
        return user?.type === 'Vendor' ? <Houses user={user} /> : <Profile user={user} />;
      default:
        return <Profile user={user} />;
    }
  };

  return <div>{renderContent()}</div>;
};

export default DashboardContent;
