import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import ProfileSidebar from "./ProfileSidebar";
import PersonalInfo from "./PersonalInfo";
import EditUser from "./EditUser";
import Houses from "./Houses";
import Spinner from "../Spinner";

const DashboardContent = ({ data, token, onUpdate, onEditStart, onEditEnd }) => {
  const [isGeneralLoading, setIsGeneralLoading] = useState(false);

  const handleUpdateSuccess = () => {
    setIsGeneralLoading(true);
    onUpdate();
    setTimeout(() => setIsGeneralLoading(false), 2000);
  };

  const handleEditStart = () => {
    setIsGeneralLoading(true);
  };

  const handleEditEnd = () => {
    setIsGeneralLoading(false);
  };

  if (!data || !data.data) {
    return <div>No data available</div>;
  }

  const userData = data.data;

  return (
    <div className="container mx-auto p-4">
      {isGeneralLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner />
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
              {userData.type === "User" && (
                <Tab.Panel>
                  <EditUser
                    user={userData}
                    token={token}
                    onUpdate={handleUpdateSuccess}
                    onEditStart={handleEditStart}
                    onEditEnd={handleEditEnd}
                  />
                </Tab.Panel>
              )}
              {userData.type !== "User" && (
                <Tab.Panel>
                  <Houses />
                </Tab.Panel>
              )}
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
    </div>
  );
};

export default DashboardContent;
