import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
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
import ImageDetails from "./ImageDetails";
import RoomDetails from "./RoomDetails";

const tabs = [
  { key: "address", label: "آدرس" },
  { key: "location", label: "موقعیت مکانی" },
  { key: "generalInfo", label: "اطلاعات اقامتگاه" },
  { key: "environmentInfo", label: "اطلاعات محیطی" },
  { key: "mainFacilities", label: "امکانات اقامتگاه" },
  { key: "rooms", label: "اتاق‌ها" },
  { key: "sanitaries", label: "امکانات بهداشتی" },
  { key: "stayRules", label: "قوانین اقامت" },
  { key: "pricing", label: "قیمت گذاری" },
  { key: "reservationRules", label: "قوانین رزرو" },
  { key: "images", label: "تصاویر اقامتگاه" },
];

const EditHouseContent = ({ token, houseUuid }) => {
  const [houseData, setHouseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  const fetchHouseData = async () => {
    try {
      const response = await axios.get(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setHouseData(response.data.data);
      
    } catch (error) {
      console.error("Error fetching house data:", error);
      toast.error("Error fetching house data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseData();
  }, [houseUuid]);

  const handleSubmit = async (updatedData) => {
    try {
      const response = await axios.post(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}`,
        { ...updatedData, _method: "PUT" }, // Add only updatedData here
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setHouseData(response.data.data); // Update the houseData with the latest response
      } else {
        toast.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!houseData) {
    return <div>Data not available</div>;
  }

  return (
    <div className="container relative mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:h-[80vh] md:overflow-auto w-full">
          <EditHouseSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="col-span-1 md:col-span-3 md:max-h-[80vh] overflow-auto border p-4 rounded-xl bg-white scrollbar-thin">
          {activeTab === "generalInfo" && (
            <GeneralDetails data={houseData} onSubmit={handleSubmit} />
          )}
          {activeTab === "address" && (
            <AddressDetails data={houseData} onSubmit={handleSubmit} />
          )}
          {activeTab === "location" && (
            <LocationDetails data={houseData} token={token} houseUuid={houseUuid} onSubmit={handleSubmit} />
          )}
          {activeTab === "environmentInfo" && (
            <EnvironmentDetails
              data={houseData}
              token={token}
              houseUuid={houseUuid}
              onSubmit={handleSubmit}
            />
          )}
          {activeTab === "mainFacilities" && (
            <MainFacilityDetails facilities={houseData.facilities} token={token} houseUuid={houseUuid} />
          )}
          {activeTab === "rooms" && (
            <RoomDetails houseData={houseData} token={token} houseUuid={houseUuid} onSubmit={handleSubmit}/>
          )}
          {activeTab === "sanitaries" && (
            <Sanitaries data={houseData}  token={token} houseUuid={houseUuid}  />
          )}
          {activeTab === "stayRules" && (
            <StayRuleDetails token={token} houseUuid={houseUuid} rules={houseData.rules.types} />
          )}
          {activeTab === "pricing" && (
            <PricingDetails
              token={token}
              houseUuid={houseUuid}
              houseData={houseData}
              onSubmit={handleSubmit}
            />
          )}
          {activeTab === "reservationRules" && (
            <ReservationRuleDetails houseData={houseData} token={token} houseUuid={houseUuid}  />
          )}
          {activeTab === "images" && (
            <ImageDetails
              houseData={houseData}
              token={token}
              houseUuid={houseUuid}
              onSubmit={handleSubmit} // Pass handleSubmit to update houseData after image actions
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditHouseContent;
