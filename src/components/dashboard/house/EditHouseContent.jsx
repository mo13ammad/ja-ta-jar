import React, { useState, useCallback } from "react";
import axios from "axios";
import EditHouseSidebar from "./EditHouseSidebar";
import Spinner from "../../Spinner";
import GeneralDetails from "./GeneralDetails";
import AddressDetails from "./AddressDetails";
import toast from "react-hot-toast";

const tabs = [
  { key: "address", label: "آدرس" },
  { key: "location", label: "موقعیت مکانی" },
  { key: "generalInfo", label: "اطلاعات اقامتگاه" },
  // other tabs...
];

const EditHouseContent = ({ houseData, token, onUpdate }) => {
  const [isGeneralLoading, setIsGeneralLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [formData, setFormData] = useState({
    city_id: houseData.city_id || "",
    latitude: houseData.latitude || "",
    longitude: houseData.longitude || "",
    village_name: houseData.village_name || "",
    house_number: houseData.house_number || "",
    floor: houseData.floor || "",
    postal_code: houseData.postal_code || "",
    address: houseData.address || "",
    _method: "PUT",
  });
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleUpdateSuccess = async () => {
    setIsGeneralLoading(true);
    setErrors({});

    console.log("Data being sent to the backend:", formData);

    try {
      const response = await axios.put(
        `https://portal1.jatajar.com/api/client/house/${houseData.uuid}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("اطلاعات با موفقیت به‌روزرسانی شد");
        onUpdate();
      } else {
        toast.error("خطایی رخ داده است");
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.errors) {
          setErrors(data.errors.fields || {});
        }
        toast.error(data.message || "An unexpected error occurred.");
      } else {
        toast.error("Failed to update house data. Please try again.");
      }
    } finally {
      setIsGeneralLoading(false);
    }
  };

  const renderErrorMessages = (fieldErrors) => {
    if (!fieldErrors) return null;
    return (
      <div className="mt-0.5 text-red-500 text-sm">
        {Array.isArray(fieldErrors) ? (
          fieldErrors.map((error, index) => <p key={index}>{error}</p>)
        ) : (
          <p>{fieldErrors}</p>
        )}
      </div>
    );
  };

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
          {activeTab === "address" && (
            <AddressDetails data={formData}  onChange={handleChange} errors={errors} renderErrorMessages={renderErrorMessages} />
          )}
          {/* Add other tab components here... */}
        </div>
        <div className="hidden md:absolute bottom-0 sm:bottom-1 md:bottom-2 lg:bottom-3 left-5 sm:left-6 md:left-8 lg:left-10 w-62 h-20 md:flex items-center justify-center">
          <button className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl" onClick={handleUpdateSuccess}>
            ثبت اطلاعات
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHouseContent;
