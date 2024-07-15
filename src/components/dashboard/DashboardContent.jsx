import React from "react";
import ProfileSidebar from "./ProfileSidebar";
import PersonalInfo from "./PersonalInfo";
import ProfileOrders from "./ProfileOrders";
import Favorites from "./ProfileFavorites";
import Addresses from "./ProfileAddresses";
import { Tab } from "@headlessui/react";

const DashboardContent = () => {
  return (
    <div className="container mx-auto p-4">
      <Tab.Group>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <ProfileSidebar />
          <div className="col-span-1 lg:col-span-3 border p-4 rounded-xl bg-white">
            <Tab.Panels>
              <Tab.Panel>
                <PersonalInfo />
              </Tab.Panel>
              <Tab.Panel>
                <ProfileOrders />
              </Tab.Panel>
              <Tab.Panel>
                <Favorites />
              </Tab.Panel>
              <Tab.Panel>
                <Addresses />
              </Tab.Panel>
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
    </div>
  );
};

export default DashboardContent;
