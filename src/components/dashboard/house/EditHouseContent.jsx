import React, { useState } from "react";
import EditHouseSidebar from "./EditHouseSidebar";
import GeneralDetails from "./GeneralDetails";
import AddressDetails from "./AddressDetails";
import LocationDetails from "./LocationDetails";
import EnvironmentDetails from "./EnvironmentDetails";
import MainFacilityDetails from "./MainFacilityDetails";
import StayRuleDetails from "./StayRuleDetails";
import Sanitaries from "./Sanitaries"; // Importing the Sanitaries component

const tabs = [
  { key: "address", label: "آدرس" },
  { key: "location", label: "موقعیت مکانی" },
  { key: "generalInfo", label: "اطلاعات اقامتگاه" },
  { key: "environmentInfo", label: "اطلاعات محیطی" },
  { key: "mainFacilities", label: "امکانات اقامتگاه" },
  { key: "sanitaries", label: "امکانات بهداشتی" }, 
  { key: "stayRules", label: "قوانین اقامت" }, 
  // other tabs...
];

const EditHouseContent = ({ houseData, token, houseUuid }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
 
  return (
    <div className="container relative mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:h-[80vh] md:overflow-auto w-full">
          <EditHouseSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="col-span-1 md:col-span-3 md:max-h-[80vh] overflow-auto border p-4 rounded-xl bg-white scrollbar-thin">
          {activeTab === "generalInfo" && (
            <GeneralDetails
              data={houseData}  // Passing initial data to GeneralDetails
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "address" && (
            <AddressDetails
              data={houseData}  // Passing initial data to AddressDetails
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "location" && (
            <LocationDetails
              data={houseData}  // Passing initial data to LocationDetails
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "environmentInfo" && (
            <EnvironmentDetails
              data={houseData}  // Passing initial data to EnvironmentDetails
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "mainFacilities" && (
            <MainFacilityDetails
             facilities={houseData.facilities}  // Passing initial data to MainFacilityDetails
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "sanitaries" && ( // Added Sanitaries component for the new key
            <Sanitaries
              houseData={houseData}  // Passing initial data to Sanitaries
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "stayRules" && ( // Added StayRuleDetails component for the new key
            <>
              
              <StayRuleDetails
                houseData={houseData}  // Passing initial data to StayRuleDetails
                token={token}
                houseUuid={houseUuid}
              />
            </>
          )}
          {/* Add other tab components here... */}
        </div>
      </div>
    </div>
  );
};

export default EditHouseContent;
