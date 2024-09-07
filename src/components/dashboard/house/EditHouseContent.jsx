import React, { useState } from "react";
import EditHouseSidebar from "./EditHouseSidebar";
import GeneralDetails from "./GeneralDetails";
import AddressDetails from "./AddressDetails";
import LocationDetails from "./LocationDetails";
import EnvironmentDetails from "./EnvironmentDetails";
import MainFacilityDetails from "./MainFacilityDetails";
import StayRuleDetails from "./StayRuleDetails";
import Sanitaries from "./Sanitaries";
import PricingDetails from "./PricingDetails";
import ReservationRuleDetails from "./ReservationRuleDetails";
import ImageDetails from "./ImageDetails"; // Importing the new ImageDetails component

const tabs = [
  { key: "address", label: "آدرس" },
  { key: "location", label: "موقعیت مکانی" },
  { key: "generalInfo", label: "اطلاعات اقامتگاه" },
  { key: "environmentInfo", label: "اطلاعات محیطی" },
  { key: "mainFacilities", label: "امکانات اقامتگاه" },
  { key: "sanitaries", label: "امکانات بهداشتی" },
  { key: "stayRules", label: "قوانین اقامت" },
  { key: "pricing", label: "قیمت گذاری" },
  { key: "reservationRules", label: "قوانین رزرو" },
  { key: "images", label: "تصاویر اقامتگاه" }, // New tab for ImageDetails
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
              data={houseData}  
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "address" && (
            <AddressDetails
              data={houseData}  
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "location" && (
            <LocationDetails
              data={houseData}  
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "environmentInfo" && (
            <EnvironmentDetails
              data={houseData}  
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "mainFacilities" && (
            <MainFacilityDetails
              facilities={houseData.facilities}  
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "sanitaries" && (
            <Sanitaries
              houseData={houseData}  
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "stayRules" && (
            <StayRuleDetails
              houseData={houseData}  
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "pricing" && (
            <PricingDetails
              houseData={houseData}  
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "reservationRules" && (
            <ReservationRuleDetails
              houseData={houseData}  
              token={token}
              houseUuid={houseUuid}
            />
          )}
          {activeTab === "images" && ( // ImageDetails component for images tab
            <ImageDetails
            houseData={houseData}  
              token={token}
              houseUuid={houseUuid}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditHouseContent;
