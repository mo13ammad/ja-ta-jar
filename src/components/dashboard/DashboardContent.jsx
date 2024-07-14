import React, { useState } from 'react';
import ProfileSidebar from './ProfileSidebar';
import PersonalInfo from './PersonalInfo';
import ProfileOrders from './ProfileOrders';
import ProfileFavorites from './ProfileFavorites';
import ProfileAddresses from './ProfileAddresses';
import ProfileComments from './ProfileComments';
import InviteFriends from './InviteFriends';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('personalInfo');

  const renderContent = () => {
    switch (activeTab) {
      case 'personalInfo':
        return <PersonalInfo />;
      case 'orders':
        return <ProfileOrders />;
      case 'favorites':
        return <ProfileFavorites />;
      case 'addresses':
        return <ProfileAddresses />;
      case 'comments':
        return <ProfileComments />;
      case 'invite':
        return <InviteFriends />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-3">
      <div className="bg-white rounded-2xl my-5 lg:my-10 p-3 md:p-5">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="md:w-4/12 lg:w-3/12 flex flex-col gap-y-5">
            <ProfileSidebar setActiveTab={setActiveTab} />
          </div>
          <div className="md:w-8/12 lg:w-9/12">
            <div className="rounded-xl flex flex-col p-5 gap-y-5">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
