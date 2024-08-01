import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import ProfileSidebar from "./ProfileSidebar";
import PersonalInfo from "./PersonalInfo";
import Addresses from "./ProfileAddresses";
import EditUser from "./EditUser";
import Spinner from "../Spinner"; // Import Spinner component

const DashboardContent = ({ data, token, onUpdate, onEditStart, onEditEnd }) => {
  const [isGeneralLoading, setIsGeneralLoading] = useState(false);

  const handleUpdateSuccess = () => {
    setIsGeneralLoading(true); // Show general spinner when update is successful
    onUpdate();
    setTimeout(() => setIsGeneralLoading(false), 2000); // Hide spinner after some time
  };

  const handleEditStart = () => {
    setIsGeneralLoading(true); // Optionally show a spinner while editing starts
  };

  const handleEditEnd = () => {
    setIsGeneralLoading(false); // Hide spinner after editing ends
  };

  if (!data || !data.data) {
    return <div>No data available</div>;
  }

  const userData = data.data;

  return (
    <div className="container mx-auto p-4">
      {isGeneralLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner /> {/* Use the custom Spinner component */}
        </div>
      )}
      <Tab.Group>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <ProfileSidebar user={userData} token={token} />
          <div className="col-span-1 lg:col-span-3 border p-4 rounded-xl bg-white">
            <Tab.Panels>
              <Tab.Panel>
                <PersonalInfo user={userData} />
              </Tab.Panel>
              <Tab.Panel>
                <EditUser
                  user={userData}
                  token={token}
                  onUpdate={handleUpdateSuccess}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                />
              </Tab.Panel>
              <Tab.Panel>
                <Addresses user={userData} />
              </Tab.Panel>
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
    </div>
  );
};

export default DashboardContent;
