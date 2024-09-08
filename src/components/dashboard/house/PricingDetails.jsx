import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const PricingDetails = ({ token, houseUuid }) => {
  const [formData, setFormData] = useState({
    nowruz: "",
    normal_spring: "",
    weekend_spring: "",
    holiday_spring: "",
    peak_spring: "",
    extra_people_spring: "",
    normal_summer: "",
    weekend_summer: "",
    holiday_summer: "",
    peak_summer: "",
    extra_people_summer: "",
    normal_autumn: "",
    weekend_autumn: "",
    holiday_autumn: "",
    peak_autumn: "",
    extra_people_autumn: "",
    normal_winter: "",
    weekend_winter: "",
    holiday_winter: "",
    peak_winter: "",
    extra_people_winter: "",
  });

  const formatNumber = (value) => {
    // Remove non-numeric characters
    value = value.replace(/\D/g, '');
    // Format with slashes
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '/');
  };

  const handleInputChange = (key, value) => {
    const formattedValue = formatNumber(value);
    setFormData((prevData) => ({
      ...prevData,
      [key]: formattedValue,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Remove slashes before sending the request
      const formattedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value.replace(/\//g, '')])
      );
  
      // Log the formatted data before sending the request
      console.log("Data being sent to the API:", formattedData);
  
      const response = await axios.put(
        `https://portal1.jatajar.com/client/house/${houseUuid}/prices`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.status === 200) {
        toast.success("قیمت‌ها با موفقیت به روز شد");
      } else {
        toast.error("خطا در به‌روزرسانی قیمت‌ها");
      }
    } catch (error) {
      toast.error("مشکلی پیش آمده است");
    }
  };

  const renderInputSection = (title, keys) => (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mt-7">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keys.map(({ key, label }) => (
          <div key={key} className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
            <input
              type="text" // Change type to text to handle formatted input
              value={formData[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="block p-2 border rounded-xl w-full outline-none"
              placeholder="قیمت را به تومان وارد کنید"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">قیمت‌گذاری</h1>

      {/* Section for تعطیلات نوروز */}
      {renderInputSection("قیمت در تعطیلات نوروز", [
        { key: "nowruz", label: "تعطیلات نوروز" },
      ])}

      {/* Section for Spring */}
      {renderInputSection("قیمت در بهار", [
        { key: "normal_spring", label: "روز های اول هفته" },
        { key: "weekend_spring", label: "روز های آخر هفته" },
        { key: "holiday_spring", label: "روز های تعطیل" },
        { key: "peak_spring", label: "روز های اوج شلوغی" },
        { key: "extra_people_spring",label: "به ازای هر نفر اضافه (قیمت هر نفر بر بین ظرفیت استاندارد تا حداکثر ظرفیت)" },
      ])}

      {/* Section for Summer */}
      {renderInputSection("قیمت در تابستان", [
        { key: "normal_summer", label: "روز های اول هفته" },
        { key: "weekend_summer", label: "روز های آخر هفته" },
        { key: "holiday_summer", label: "روز های تعطیل" },
        { key: "peak_summer", label: "روز های اوج شلوغی" },
        { key: "extra_people_summer", label: "به ازای هر نفر اضافه (قیمت هر نفر بر بین ظرفیت استاندارد تا حداکثر ظرفیت)" },
      ])}

      {/* Section for Autumn */}
      {renderInputSection("قیمت در پاییز", [
        { key: "normal_autumn", label: "روز های اول هفته" },
        { key: "weekend_autumn", label: "روز های آخر هفته" },
        { key: "holiday_autumn", label: "روز های تعطیل" },
        { key: "peak_autumn", label: "روز های اوج شلوغی" },
        { key: "extra_people_autumn", label: "به ازای هر نفر اضافه (قیمت هر نفر بر بین ظرفیت استاندارد تا حداکثر ظرفیت)"  },
      ])}

      {/* Section for Winter */}
      {renderInputSection("قیمت در زمستان", [
        { key: "normal_winter", label: "روز های اول هفته" },
        { key: "weekend_winter", label: "روز های آخر هفته" },
        { key: "holiday_winter", label: "روز های تعطیل" },
        { key: "peak_winter", label: "روز های اوج شلوغی" },
        { key: "extra_people_winter",label: "به ازای هر نفر اضافه (قیمت هر نفر بر بین ظرفیت استاندارد تا حداکثر ظرفیت)"  },
      ])}

      {/* Submit Button */}
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-xl"
        >
          ثبت قیمت‌ها
        </button>
      </div>
    </div>
  );
};

export default PricingDetails;
