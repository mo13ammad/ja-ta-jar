import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const ReservationRuleDetails = ({ token, houseUuid, houseData }) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formData, setFormData] = useState({
    short_term_booking_length: "",
    short_term_booking_discount: "",
    long_term_booking_length: "",
    long_term_booking_discount: "",
    minimum_length_stay: [""], // Initialize as an array with one empty value
  });

  useEffect(() => {
    if (houseData) {
      setFormData({
        short_term_booking_length: houseData.reservation?.discount?.short_term?.minimum_length_stay|| "",
        short_term_booking_discount: houseData.reservation?.discount?.short_term?.discount || "",
        long_term_booking_length: houseData.reservation?.discount?.long_term?.minimum_length_stay|| "",
        long_term_booking_discount: houseData.reservation?.discount?.long_term?.discount || "",
        minimum_length_stay: houseData.reservation?.minimum_length_stay || [""], // If available, use data from houseData, else initialize as empty array
      });
    }
  }, [houseData]);

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleMinimumStayChange = (index, value) => {
    const newMinimumLengthStay = [...formData.minimum_length_stay];
    newMinimumLengthStay[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      minimum_length_stay: newMinimumLengthStay,
    }));
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);

    // Log the data being sent for debugging purposes
    console.log("Data being sent:", formData);

    try {
      const response = await axios.put(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}`,
        {
          ...formData,
          _method: "PUT",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response received:", response.data);

      if (response.status === 200) {
        toast.success("اطلاعات با موفقیت ثبت شد");
      } else {
        toast.error("خطایی در ثبت اطلاعات پیش آمد");
      }
    } catch (error) {
      // Log the error response for better debugging
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
        toast.error(`خطا: ${error.response.data.message || "Validation error occurred"}`);
      } else if (error.request) {
        console.error("Error request data:", error.request);
        toast.error("هیچ پاسخی از سرور دریافت نشد");
      } else {
        console.error("Error message:", error.message);
        toast.error("خطای غیرمنتظره‌ای رخ داده است");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">قوانین رزرو</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Short Term Booking Length */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            مد زمان رزرو کوتاه مدت
          </label>
          <input
            type="number"
            value={formData.short_term_booking_length}
            onChange={(e) => handleInputChange("short_term_booking_length", e.target.value)}
            className="block p-2 border rounded-xl w-full outline-none"
            placeholder="مد زمان رزرو کوتاه مدت"
          />
        </div>

        {/* Short Term Booking Discount */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تخفیف رزرو کوتاه مدت به درصد
          </label>
          <input
            type="number"
            value={formData.short_term_booking_discount}
            onChange={(e) => handleInputChange("short_term_booking_discount", e.target.value)}
            className="block p-2 border rounded-xl w-full outline-none"
            placeholder="تخفیف رزرو کوتاه مدت"
          />
        </div>

        {/* Long Term Booking Length */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            مد زمان رزرو بلند مدت
          </label>
          <input
            type="number"
            value={formData.long_term_booking_length}
            onChange={(e) => handleInputChange("long_term_booking_length", e.target.value)}
            className="block p-2 border rounded-xl w-full outline-none"
            placeholder="مد زمان رزرو بلند مدت"
          />
        </div>

        {/* Long Term Booking Discount */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تخفیف رزرو بلند مدت به درصد
          </label>
          <input
            type="number"
            value={formData.long_term_booking_discount}
            onChange={(e) => handleInputChange("long_term_booking_discount", e.target.value)}
            className="block p-2 border rounded-xl w-full outline-none"
            placeholder="تخفیف رزرو بلند مدت"
          />
        </div>

        {/* Minimum Length Stay */}
        <div className="mt-4 lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            کمینه تعداد شب رزرو
          </label>
          {formData.minimum_length_stay.map((stay, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="number"
                value={stay}
                onChange={(e) => handleMinimumStayChange(index, e.target.value)}
                className="block p-2 border rounded-xl w-full outline-none"
                placeholder="کمینه تعداد شب رزرو"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-xl"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "در حال بارگذاری..." : "ثبت اطلاعات"}
        </button>
      </div>
    </div>
  );
};

export default ReservationRuleDetails;
