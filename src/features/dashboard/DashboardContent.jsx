// src/features/dashboard/DashboardContent.jsx

import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import EditProfile from './EditProfile';
import Houses from './Houses';

const DashboardContent = ({ selectedTab, initialUser, onUpdateUser }) => {
  const [user, setUser] = useState(initialUser);
  console.log(user);
  // Update local user state when initialUser changes
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const renderContent = () => {
    switch (selectedTab) {
      case 'profile':
        return <Profile user={user} onUpdateUser={onUpdateUser} />;
      case 'editProfile':
        return <EditProfile user={user} onUpdateUser={onUpdateUser} />;
      case 'houses':
        return user?.type === 'Vendor' ? (
          <Houses user={user} />
        ) : (
          <div className="text-center text-red-500">شما میزبان نیستید</div>
        );
      case 'wallet':
        return <div>کیف پول - Wallet Content Placeholder</div>;
      case 'favorites':
        return <div>علاقه مندی ها - Favorites Content Placeholder</div>;
      case 'inviteFriends':
        return <div>دعوت از دوستان - Invite Friends Content Placeholder</div>;
      case 'reserves':
        return <div>رزرو ها - Reserves Content Placeholder</div>;
      default:
        return <Profile user={user} onUpdateUser={onUpdateUser} />;
    }
  };

  return <div>{renderContent()}</div>;
};

export default DashboardContent;
