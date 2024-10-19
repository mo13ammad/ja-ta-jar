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
  { key: "finalSubmit", label: "ثبت نهایی اقامتگاه" }, // Added finalSubmit tab
];

const EditHouseContent = ({ token, houseUuid }) => {
  const [houseData, setHouseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [publishing, setPublishing] = useState(false); // Track the publishing state
  const [errorMessages, setErrorMessages] = useState([]); // Track error messages for final submission
  const [formErrors, setFormErrors] = useState({}); // Track form-specific errors

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
        setFormErrors({}); // Clear errors after successful update
      } else {
        toast.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      if (error.response && error.response.data.errors) {
        setFormErrors(error.response.data.errors.fields || {}); // Capture form-specific errors
      }
      toast.error(error?.response?.data?.message);
    }
  };

  const handleFinalSubmit = async () => {
    setPublishing(true); // Set publishing state to true
    setErrorMessages([]); // Reset error messages before final submission

    try {
      const response = await axios.put(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}/publish`, 
        { uuid: houseUuid }, // Send the UUID
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("اقامتگاه با موفقیت ثبت نهایی شد");
      } else {
        toast.error("خطا در ثبت نهایی اقامتگاه");
      }
    } catch (error) {
      console.error("Error during final submission:", error);

      if (error.response) {
        toast.error(`خطا: ${error.response.data.message || "خطا در ثبت نهایی اقامتگاه"}`);

        const errorFields = error.response.data.errors?.fields || {};
        const errorList = Object.values(errorFields).flat();
        setErrorMessages(errorList); // Set the error messages to be displayed
      } else {
        toast.error("خطا در ثبت نهایی اقامتگاه");
      }
    } finally {
      setPublishing(false); // Reset publishing state
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
            <LocationDetails
              data={houseData}
              token={token}
              houseUuid={houseUuid}
              onSubmit={handleSubmit}
            />
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
            <MainFacilityDetails
              facilities={houseData.facilities}
              token={token}
              houseUuid={houseUuid}
              onSubmit={handleSubmit}
            />
          )}
          {activeTab === "rooms" && (
            <RoomDetails
              houseData={houseData}
              token={token}
              houseUuid={houseUuid}
              onSubmit={handleSubmit}
            />
          )}
          {activeTab === "sanitaries" && (
            <Sanitaries data={houseData} token={token} houseUuid={houseUuid} />
          )}
          {activeTab === "stayRules" && (
            <StayRuleDetails
              token={token}
              houseUuid={houseUuid}
              rules={houseData.rules.types}
              onSubmit={handleSubmit}
            />
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
            <ReservationRuleDetails
              houseData={houseData}
              token={token}
              houseUuid={houseUuid}
              onSubmit={handleSubmit}
              errors={formErrors} // Pass form-specific errors to ReservationRuleDetails
            />
          )}
          {activeTab === "images" && (
            <ImageDetails
              houseData={houseData}
              token={token}
              houseUuid={houseUuid}
              onSubmit={handleSubmit} // Pass handleSubmit to update houseData after image actions
            />
          )}
          {activeTab === "finalSubmit" && (
            <div className="flex flex-col justify-end">
              {/* Display the error messages if any */}
              {errorMessages.length > 0 && (
                <div className="bg-red-100 text-red-600 p-4 rounded-md mb-4">
                  <h3 className="font-semibold">خطاها:</h3>
                  <ul className="list-disc list-inside">
                    {errorMessages.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                className="bg-orange-600 text-white px-4 py-2 rounded-xl max-w-52 shadow-xl mt-4"
                onClick={handleFinalSubmit}
                disabled={publishing} // Disable button during publishing
              >
                {publishing ? "در حال ثبت ..." : "ثبت نهایی اقامتگاه"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditHouseContent;
