import React, { useState } from 'react';
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
        return user?.type === 'Vendor' ? <Houses user={user} /> : <Profile user={user} />;
      case 'wallet':
        return <div>کیف پول - Wallet Content Placeholder</div>;
      case 'favorites':
        return <div>علاقه مندی ها - Favorites Content Placeholder</div>;
      case 'inviteFriends':
        return <div>دعوت از دوستان - Invite Friends Content Placeholder</div>;
      case 'reserves':
        return <div>رزرو ها - Reserves Content Placeholder</div>;
      default:
        return <Profile user={user} />;
    }
  };

  return <div>{renderContent()}</div>;
};

export default DashboardContent;
