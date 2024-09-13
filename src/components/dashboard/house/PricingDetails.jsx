import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const PricingDetails = ({ token, houseUuid, houseData, onSubmit }) => {
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

  const [errors, setErrors] = useState({});
  const [errorList, setErrorList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (houseData?.prices) {
      setFormData({
        nowruz: houseData.prices.nowruz || "",
        normal_spring: houseData.prices.spring?.normal || "",
        weekend_spring: houseData.prices.spring?.weekend || "",
        holiday_spring: houseData.prices.spring?.holiday || "",
        peak_spring: houseData.prices.spring?.peak || "",
        extra_people_spring: houseData.prices.spring?.extra_people || "",
        normal_summer: houseData.prices.summer?.normal || "",
        weekend_summer: houseData.prices.summer?.weekend || "",
        holiday_summer: houseData.prices.summer?.holiday || "",
        peak_summer: houseData.prices.summer?.peak || "",
        extra_people_summer: houseData.prices.summer?.extra_people || "",
        normal_autumn: houseData.prices.autumn?.normal || "",
        weekend_autumn: houseData.prices.autumn?.weekend || "",
        holiday_autumn: houseData.prices.autumn?.holiday || "",
        peak_autumn: houseData.prices.autumn?.peak || "",
        extra_people_autumn: houseData.prices.autumn?.extra_people || "",
        normal_winter: houseData.prices.winter?.normal || "",
        weekend_winter: houseData.prices.winter?.weekend || "",
        holiday_winter: houseData.prices.winter?.holiday || "",
        peak_winter: houseData.prices.winter?.peak || "",
        extra_people_winter: houseData.prices.winter?.extra_people || "",
      });
    }
  }, [houseData]);

  const formatNumber = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "/");
  };

  const handleInputChange = (key, value) => {
    const formattedValue = formatNumber(value);
    setFormData((prevData) => ({
      ...prevData,
      [key]: formattedValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: null,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formattedData = Object.fromEntries(
        Object.entries(formData)
          .filter(([key, value]) => value !== "")
          .map(([key, value]) => [key, String(value).replace(/\//g, "")])
      );

      // Check if the price is handled "PerNight"
      if (houseData?.price_handle_by?.key === "PerNight") {
        formattedData.extra_people_spring = "100000";
        formattedData.extra_people_summer = "100000";
        formattedData.extra_people_autumn = "100000";
        formattedData.extra_people_winter = "100000";
      }

      const response = await axios.put(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}/prices`,
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
        setErrorList([]);
        if (onSubmit) {
          // Pass the updated house data back to the parent component
          const updatedPrices = { ...houseData.prices, ...response.data.data };
          onSubmit({ prices: updatedPrices });
        }
      }
    } catch (error) {
      if (error.response) {
        console.log("Error response data:", error.response.data);
        if (error.response.status === 422) {
          const errorsArray = Object.values(error.response.data.errors.fields || {}).flat();
          setErrorList(errorsArray);
          toast.error("خطا در ورود اطلاعات، لطفاً بررسی کنید");
        } else {
          toast.error("مشکلی پیش آمده است");
        }
      } else {
        console.error("Error updating prices:", error);
        toast.error("مشکلی پیش آمده است");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInputSection = (title, keys) => (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mt-7">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keys.map(({ key, label }) => (
          <div key={key} className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <input
              type="text"
              value={formData[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className={`block p-2 border rounded-xl w-full outline-none ${
                errors[key] ? "border-red-500" : ""
              }`}
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
      {renderInputSection("قیمت در تعطیلات نوروز", [{ key: "nowruz", label: "تعطیلات نوروز" }])}

      {/* Section for Spring */}
      {renderInputSection("قیمت در بهار", [
        { key: "normal_spring", label: "روز های اول هفته" },
        { key: "weekend_spring", label: "روز های آخر هفته" },
        { key: "holiday_spring", label: "روز های تعطیل" },
        { key: "peak_spring", label: "روز های اوج شلوغی" },
        ...(houseData?.price_handle_by?.key !== "PerNight"
          ? [{ key: "extra_people_spring", label: "به ازای هر نفر اضافه (قیمت هر نفر بر بین ظرفیت استاندارد تا حداکثر ظرفیت)" }]
          : []),
      ])}

      {/* Section for Summer */}
      {renderInputSection("قیمت در تابستان", [
        { key: "normal_summer", label: "روز های اول هفته" },
        { key: "weekend_summer", label: "روز های آخر هفته" },
        { key: "holiday_summer", label: "روز های تعطیل" },
        { key: "peak_summer", label: "روز های اوج شلوغی" },
        ...(houseData?.price_handle_by?.key !== "PerNight"
          ? [{ key: "extra_people_summer", label: "به ازای هر نفر اضافه (قیمت هر نفر بر بین ظرفیت استاندارد تا حداکثر ظرفیت)" }]
          : []),
      ])}

      {/* Section for Autumn */}
      {renderInputSection("قیمت در پاییز", [
        { key: "normal_autumn", label: "روز های اول هفته" },
        { key: "weekend_autumn", label: "روز های آخر هفته" },
        { key: "holiday_autumn", label: "روز های تعطیل" },
        { key: "peak_autumn", label: "روز های اوج شلوغی" },
        ...(houseData?.price_handle_by?.key !== "PerNight"
          ? [{ key: "extra_people_autumn", label: "به ازای هر نفر اضافه (قیمت هر نفر بر بین ظرفیت استاندارد تا حداکثر ظرفیت)" }]
          : []),
      ])}

      {/* Section for Winter */}
      {renderInputSection("قیمت در زمستان", [
        { key: "normal_winter", label: "روز های اول هفته" },
        { key: "weekend_winter", label: "روز های آخر هفته" },
        { key: "holiday_winter", label: "روز های تعطیل" },
        { key: "peak_winter", label: "روز های اوج شلوغی" },
        ...(houseData?.price_handle_by?.key !== "PerNight"
          ? [{ key: "extra_people_winter", label: "به ازای هر نفر اضافه (قیمت هر نفر بر بین ظرفیت استاندارد تا حداکثر ظرفیت)" }]
          : []),
      ])}

      {/* Error List Display */}
      {errorList.length > 0 && (
        <div className="mt-4 text-red-600">
          <h3 className="font-semibold">خطاهای زیر را بررسی کنید:</h3>
          <ul className="list-disc ml-5">
            {errorList.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-xl"
          disabled={loading}
        >
          {loading ? "در حال ثبت ..." : "ثبت قیمت‌ها"}
        </button>
      </div>
    </div>
  );
};

export default PricingDetails;
