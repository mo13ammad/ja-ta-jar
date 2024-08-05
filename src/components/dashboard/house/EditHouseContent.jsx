import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import EditHouseSidebar from "./EditHouseSidebar";
import Spinner from "../../Spinner";
import GeneralDetails from "./GeneralDetails";
import EnvironmentDetails from "./EnvironmentDetails";
import RoomDetails from "./RoomDetails";
import BathroomDetails from "./BathroomDetails";
import OtherSpaceDetails from "./OtherSpaceDetails";
import MainFacilityDetails from "./MainFacilityDetails";
import KitchenEquipmentDetails from "./KitchenEquipmentDetails";
import SpecialServiceDetails from "./SpecialServiceDetails";
import ReservationRuleDetails from "./ReservationRuleDetails";
import StayRuleDetails from "./StayRuleDetails";
import PricingDetails from "./PricingDetails";
import ImageDetails from "./ImageDetails";
import PersonalInfoDetails from "./PersonalInfoDetails";
import OwnershipInfoDetails from "./OwnershipInfoDetails";
import AddressDetails from "./AddressDetails";
import LocationDetails from "./LocationDetails";

const tabs = [
  { key: "address", label: "آدرس" },
  { key: "location", label: "موقعیت مکانی" },
  { key: "generalInfo", label: "اطلاعات اقامتگاه" },
  { key: "environmentInfo", label: "اطلاعات محیطی" },
  { key: "rooms", label: "اتاق‌ها و پذیرایی" },
  { key: "bathrooms", label: "سرویس‌های بهداشتی و حمام" },
  { key: "otherSpaces", label: "سایر فضاهای اقامتگاه" },
  { key: "mainFacilities", label: "امکانات اصلی" },
  { key: "kitchenEquipment", label: "تجهیزات آشپزخانه" },
  { key: "specialServices", label: "خدمات ویژه" },
  { key: "reservationRules", label: "قوانین رزرو" },
  { key: "stayRules", label: "قوانین اقامت" },
  { key: "pricing", label: "قیمت گذاری" },
  { key: "images", label: "تصاویر اقامتگاه" },
  { key: "personalInfo", label: "اطلاعات فردی" },
  { key: "ownershipInfo", label: "اطلاعات مالکیت" }
];

const EditHouseContent = ({ houseData, token, onUpdate }) => {
  const [isGeneralLoading, setIsGeneralLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].key);

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

  return (
    <div className="container relative mx-auto p-4  ">
      {isGeneralLoading && (
        <div className="fixed inset-0 flex items-center justify-center   bg-black bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}
      <Tab.Group>
        <div className="grid grid-cols-1  md:grid-cols-4 gap-4 ">
          <div className="md:h-[80vh]  md:overflow-auto w-full">
            <EditHouseSidebar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="col-span-1  md:col-span-3 md:max-h-[80vh] overflow-auto border p-4 rounded-xl bg-white scrollbar-thin">
            <Tab.Panels>
              {tabs.map((tab) => (
                <Tab.Panel key={tab.key}>
                  {tab.key === "generalInfo" && <GeneralDetails />}
                  {tab.key === "environmentInfo" && <EnvironmentDetails />}
                  {tab.key === "rooms" && <RoomDetails />}
                  {tab.key === "bathrooms" && <BathroomDetails />}
                  {tab.key === "otherSpaces" && <OtherSpaceDetails />}
                  {tab.key === "mainFacilities" && <MainFacilityDetails />}
                  {tab.key === "kitchenEquipment" && <KitchenEquipmentDetails />}
                  {tab.key === "specialServices" && <SpecialServiceDetails />}
                  {tab.key === "reservationRules" && <ReservationRuleDetails />}
                  {tab.key === "stayRules" && <StayRuleDetails />}
                  {tab.key === "pricing" && <PricingDetails />}
                  {tab.key === "images" && <ImageDetails />}
                  {tab.key === "personalInfo" && <PersonalInfoDetails />}
                  {tab.key === "ownershipInfo" && <OwnershipInfoDetails />}
                  {tab.key === "address" && <AddressDetails />}
                  {tab.key === "location" && <LocationDetails />}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </div>
          <div className="absolute bottom-0 sm:bottom-1 md:bottom-2 lg:bottom-3 left-5 sm:left-6 md:left-8 lg:left-10 w-62 h-20 flex items-center justify-center">
            <button className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl" onClick={handleUpdateSuccess}>
              ثبت اطلاعات
            </button>
          </div>
        </div>
      </Tab.Group>
    </div>
  );
};

export default EditHouseContent;
