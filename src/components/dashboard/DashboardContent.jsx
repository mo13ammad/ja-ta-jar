// DashboardContent.js
import React from "react";
import { Tab } from "@headlessui/react";
import ProfileSidebar from "./ProfileSidebar";
import PersonalInfo from "./PersonalInfo";
import Addresses from "./ProfileAddresses";
import EditUser from "./EditUser";

const DashboardContent = ({ data, token, onUpdate, onEditStart, onEditEnd }) => {
  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Tab.Group>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <ProfileSidebar user={data.data} token={token} />
          <div className="col-span-1 lg:col-span-3 border p-4 rounded-xl bg-white">
            <Tab.Panels>
              <Tab.Panel>
                <PersonalInfo user={data.data} />
              </Tab.Panel>
              <Tab.Panel>
                <EditUser
                  user={data.data}
                  token={token}
                  onUpdate={onUpdate}
                  onEditStart={onEditStart}
                  onEditEnd={onEditEnd}
                />
              </Tab.Panel>
              <Tab.Panel>
                <Addresses user={data.data} />
              </Tab.Panel>
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
    </div>
  );
};

export default DashboardContent;
