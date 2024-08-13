import React, { useState, useEffect } from "react";
import axios from "axios";
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
import toast from "react-hot-toast";

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
  { key: "ownershipInfo", label: "اطلاعات مالکیت" },
];

const EditHouseContent = ({ houseData, token, onUpdate }) => {
  const [isGeneralLoading, setIsGeneralLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  // Initialize form data state with houseData
  const [formData, setFormData] = useState(houseData);

  const handleUpdateSuccess = async () => {
    setIsGeneralLoading(true);

    // Create a new object with only the necessary fields based on the active tab
    const updateData = {};
    if (activeTab === "location") {
      updateData.city_id = formData.city_id;
      updateData.latitude = formData.latitude;
      updateData.longitude = formData.longitude;
    } else if (activeTab === "generalInfo") {
      updateData.generalInfo = formData.generalInfo;
    } // Add similar conditions for other tabs
    
    try {
      const response = await axios.put(
        `https://portal1.jatajar.com/api/client/house/${houseData.uuid}`,
        updateData, // Send only the necessary data
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.status === 200) {
        toast.success("اطلاعات با موفقیت به‌روزرسانی شد");
        onUpdate(); // Optionally refresh the data after update
      } else {
        toast.error("خطایی رخ داده است");
      }
      
    } catch (error) {
      console.error("Error updating house data:", error);
      toast.error("Failed to update house data. Please try again.");
    } finally {
      setIsGeneralLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    console.log(`Active tab changed to: ${activeTab}`);
  }, [activeTab]);

  return (
    <div className="container relative mx-auto p-4">
      {isGeneralLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:h-[80vh] md:overflow-auto w-full">
          <EditHouseSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="col-span-1 md:col-span-3 md:max-h-[80vh] overflow-auto border p-4 rounded-xl bg-white scrollbar-thin">
          {activeTab === "generalInfo" && (
            <GeneralDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "environmentInfo" && (
            <EnvironmentDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "rooms" && (
            <RoomDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "bathrooms" && (
            <BathroomDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "otherSpaces" && (
            <OtherSpaceDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "mainFacilities" && (
            <MainFacilityDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "kitchenEquipment" && (
            <KitchenEquipmentDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "specialServices" && (
            <SpecialServiceDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "reservationRules" && (
            <ReservationRuleDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "stayRules" && (
            <StayRuleDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "pricing" && (
            <PricingDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "images" && (
            <ImageDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "personalInfo" && (
            <PersonalInfoDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "ownershipInfo" && (
            <OwnershipInfoDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "address" && (
            <AddressDetails data={formData} onChange={handleChange} />
          )}
          {activeTab === "location" && (
            <LocationDetails data={formData} onChange={handleChange} />
          )}
        </div>
        <div className="hidden md:absolute bottom-0 sm:bottom-1 md:bottom-2 lg:bottom-3 left-5 sm:left-6 md:left-8 lg:left-10 w-62 h-20 md:flex items-center justify-center">
          <button
            className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl"
            onClick={handleUpdateSuccess}
          >
            ثبت اطلاعات
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHouseContent;
