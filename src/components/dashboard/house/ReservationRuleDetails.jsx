import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const ReservationRuleDetails = ({ token, houseUuid, houseData }) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); // For non-field specific errors
  const [weekendOptions, setWeekendOptions] = useState([]);
  const enterFromRef = useRef(null);
  const enterUntilRef = useRef(null);
  const dischargeTimeRef = useRef(null);

  const [formData, setFormData] = useState({
    short_term_booking_length: houseData?.reservation?.discount?.short_term?.minimum_length_stay || "",
    short_term_booking_discount: houseData?.reservation?.discount?.short_term?.discount || "",
    long_term_booking_length: houseData?.reservation?.discount?.long_term?.minimum_length_stay || "",
    long_term_booking_discount: houseData?.reservation?.discount?.long_term?.discount || "",
    minimum_length_stay: houseData?.reservation?.minimum_length_stay || {
      all: "",
      Saturday: "",
      Sunday: "",
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: ""
    },
    enter_from: houseData?.reservation?.timing?.enter?.from || "",
    enter_until: houseData?.reservation?.timing?.enter?.to || "",
    discharge_time: houseData?.reservation?.timing?.leave || "",
    capacity: houseData?.reservation?.capacity?.normal || "",
    maximum_capacity: houseData?.reservation?.capacity?.maximum || "",
    weekendType: houseData?.weekendType?.key || ""
  });

  useEffect(() => {
    if (houseData?.reservation?.minimum_length_stay) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        minimum_length_stay: {
          all: houseData.reservation.minimum_length_stay.all || "",
          Saturday: houseData.reservation.minimum_length_stay.Saturday || "",
          Sunday: houseData.reservation.minimum_length_stay.Sunday || "",
          Monday: houseData.reservation.minimum_length_stay.Monday || "",
          Tuesday: houseData.reservation.minimum_length_stay.Tuesday || "",
          Wednesday: houseData.reservation.minimum_length_stay.Wednesday || "",
          Thursday: houseData.reservation.minimum_length_stay.Thursday || "",
          Friday: houseData.reservation.minimum_length_stay.Friday || ""
        }
      }));
    }
  }, [houseData]);

  // Fetch weekend options for the dropdown
  useEffect(() => {
    const fetchWeekendOptions = async () => {
      try {
        const response = await axios.get("https://portal1.jatajar.com/api/assets/types/weekendHoliday/detail");
        setWeekendOptions(response.data.data);
      } catch (error) {
        toast.error("خطا در بارگذاری گزینه‌های تعطیلات");
      }
    };
    fetchWeekendOptions();
  }, []);

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value !== undefined ? value : "" // Always set a default value to prevent uncontrolled input
    }));
  };

  const handleMinimumStayChange = (day, value) => {
    setFormData((prevData) => ({
      ...prevData,
      minimum_length_stay: {
        ...prevData.minimum_length_stay,
        [day]: value !== undefined ? value : ""
      }
    }));
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    setErrors({});
    setErrorMessage(""); // Reset error message

    try {
      const response = await axios.put(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}`,
        {
          ...formData,
          _method: "PUT"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        toast.success("اطلاعات با موفقیت ثبت شد");
      } else {
        toast.error("خطایی در ثبت اطلاعات پیش آمد");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const responseErrors = error.response.data.errors?.fields;

        // Check if there are field-specific errors
        if (responseErrors) {
          setErrors(responseErrors);
        }

        // If there's a general error message, display it
        if (error.response.data.message) {
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message);
        } 
      } else {
        toast.error("خطایی رخ داده است");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleFocusClick = (inputRef) => {
    inputRef.current.focus();
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">قوانین رزرو</h1>

      {/* Display general error message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-600 p-4 rounded-md mb-4">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Short Term Booking Length */}
        <div className="mt-4">
          <label className={`block text-sm font-medium mb-2 ${errors.short_term_booking_length ? 'text-red-600' : 'text-gray-700'}`}>
            تعداد شب اقامت کوتاه مدت
          </label>
          <input
            type="number"
            value={formData.short_term_booking_length || ""} // Ensure a valid default value
            onChange={(e) => handleInputChange("short_term_booking_length", e.target.value)}
            className={`block p-2 border rounded-xl w-full outline-none ${errors.short_term_booking_length ? 'border-red-600' : 'border-gray-300'}`}
            placeholder="تعداد شب رزرو کوتاه مدت"
          />
          {errors.short_term_booking_length && <p className="text-red-600 text-sm">{errors.short_term_booking_length[0]}</p>}
        </div>

        {/* Short Term Booking Discount */}
        <div className="mt-4">
          <label className={`block text-sm font-medium mb-2 ${errors.short_term_booking_discount ? 'text-red-600' : 'text-gray-700'}`}>
            درصد تخفیف
          </label>
          <input
            type="number"
            value={formData.short_term_booking_discount || ""} // Ensure a valid default value
            onChange={(e) => handleInputChange("short_term_booking_discount", e.target.value)}
            className={`block p-2 border rounded-xl w-full outline-none ${errors.short_term_booking_discount ? 'border-red-600' : 'border-gray-300'}`}
            placeholder="درصد تخفیف"
          />
          {errors.short_term_booking_discount && <p className="text-red-600 text-sm">{errors.short_term_booking_discount[0]}</p>}
        </div>

        {/* Long Term Booking Length */}
        <div className="mt-4">
          <label className={`block text-sm font-medium mb-2 ${errors.long_term_booking_length ? 'text-red-600' : 'text-gray-700'}`}>
            تعداد شب اقامت بلند مدت
          </label>
          <input
            type="number"
            value={formData.long_term_booking_length || ""} // Ensure a valid default value
            onChange={(e) => handleInputChange("long_term_booking_length", e.target.value)}
            className={`block p-2 border rounded-xl w-full outline-none ${errors.long_term_booking_length ? 'border-red-600' : 'border-gray-300'}`}
            placeholder="تعداد شب رزرو بلند مدت"
          />
          {errors.long_term_booking_length && <p className="text-red-600 text-sm">{errors.long_term_booking_length[0]}</p>}
        </div>

        {/* Long Term Booking Discount */}
        <div className="mt-4">
          <label className={`block text-sm font-medium mb-2 ${errors.long_term_booking_discount ? 'text-red-600' : 'text-gray-700'}`}>
            درصد تخفیف
          </label>
          <input
            type="number"
            value={formData.long_term_booking_discount || ""} // Ensure a valid default value
            onChange={(e) => handleInputChange("long_term_booking_discount", e.target.value)}
            className={`block p-2 border rounded-xl w-full outline-none ${errors.long_term_booking_discount ? 'border-red-600' : 'border-gray-300'}`}
            placeholder="درصد تخفیف"
          />
          {errors.long_term_booking_discount && <p className="text-red-600 text-sm">{errors.long_term_booking_discount[0]}</p>}
        </div>

        {/* Minimum Stay for All Days */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">حداقل شب اقامت</label>
          <input
            type="number"
            value={formData.minimum_length_stay.all || ""} // Ensure a valid default value
            onChange={(e) => handleMinimumStayChange("all", e.target.value)}
            className="block p-2 border border-gray-300 rounded-xl w-full outline-none"
            placeholder="حداقل شبی که اقامتگاه قابل رزرو است"
          />
        </div>

        {/* Enter Time Inputs */}
        <div className="mt-4">
          <label onClick={() => handleFocusClick(enterFromRef)} className={`block text-sm font-medium mb-2 cursor-pointer ${errors.enter_from ? 'text-red-600' : 'text-gray-700'}`}>
            زمان ورود از
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              ref={enterFromRef}
              type="time"
              value={formData.enter_from || ""} // Ensure a valid default value
              onChange={(e) => handleInputChange("enter_from", e.target.value)}
              className="p-2 border rounded-xl w-full outline-none border-gray-300"
            />
            <input
              ref={enterUntilRef}
              type="time"
              value={formData.enter_until || ""} // Ensure a valid default value
              onChange={(e) => handleInputChange("enter_until", e.target.value)}
              className="p-2 border rounded-xl w-full outline-none border-gray-300"
            />
          </div>
          {errors.enter_from && <p className="text-red-600 text-sm">{errors.enter_from[0]}</p>}
        </div>

        {/* Discharge Time */}
        <div className="mt-4">
          <label onClick={() => handleFocusClick(dischargeTimeRef)} className={`block text-sm font-medium mb-2 cursor-pointer ${errors.discharge_time ? 'text-red-600' : 'text-gray-700'}`}>
            زمان تخلیه
          </label>
          <input
            ref={dischargeTimeRef}
            type="time"
            value={formData.discharge_time || ""} // Ensure a valid default value
            onChange={(e) => handleInputChange("discharge_time", e.target.value)}
            className={`block p-2 border rounded-xl w-full outline-none ${errors.discharge_time ? 'border-red-600' : 'border-gray-300'}`}
          />
          {errors.discharge_time && <p className="text-red-600 text-sm">{errors.discharge_time[0]}</p>}
        </div>

        {/* Capacity */}
        <div className="mt-4">
          <label className={`block text-sm font-medium mb-2 ${errors.capacity ? 'text-red-600' : 'text-gray-700'}`}>
         ظرفیت استاندارد
          </label>
          <input
            type="number"
            value={formData.capacity || ""} // Ensure a valid default value
            onChange={(e) => handleInputChange("capacity", e.target.value)}
            className={`block p-2 border rounded-xl w-full outline-none ${errors.capacity ? 'border-red-600' : 'border-gray-300'}`}
          />
          {errors.capacity && <p className="text-red-600 text-sm">{errors.capacity[0]}</p>}
        </div>

        {/* Maximum Capacity */}
        <div className="mt-4">
          <label className={`block text-sm font-medium mb-2 ${errors.maximum_capacity ? 'text-red-600' : 'text-gray-700'}`}>
            حداکثر ظرفیت
          </label>
          <input
            type="number"
            value={formData.maximum_capacity || ""} // Ensure a valid default value
            onChange={(e) => handleInputChange("maximum_capacity", e.target.value)}
            className={`block p-2 border rounded-xl w-full outline-none ${errors.maximum_capacity ? 'border-red-600' : 'border-gray-300'}`}
          />
          {errors.maximum_capacity && <p className="text-red-600 text-sm">{errors.maximum_capacity[0]}</p>}
        </div>

        {/* Minimum Stay Table */}
        <div className="mt-4 lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">حداقل شب اقامت به ازای روزهای هفته</label>
          <table className="table-auto w-full lg:w-1/2 border border-collapse">
            <thead>
              <tr>
                <th className="border p-1">روز</th>
                <th className="border p-1">تعداد شب رزرو</th>
              </tr>
            </thead>
            <tbody>
              {[
                { key: "Saturday", label: "شنبه" },
                { key: "Sunday", label: "یکشنبه" },
                { key: "Monday", label: "دوشنبه" },
                { key: "Tuesday", label: "سه‌شنبه" },
                { key: "Wednesday", label: "چهارشنبه" },
                { key: "Thursday", label: "پنج‌شنبه" },
                { key: "Friday", label: "جمعه" }
              ].map((day) => (
                <tr key={day.key}>
                  <td className="border p-1 text-right">{day.label}</td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={formData.minimum_length_stay[day.key] || ""} // Ensure a valid default value
                      onChange={(e) => handleMinimumStayChange(day.key, e.target.value)}
                      className="p-1 border rounded-xl w-full outline-none"
                      placeholder={`تعداد شب برای ${day.label}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Weekend Type Dropdown */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">تعیین روز های آخر هفته</label>
          <select
            value={formData.weekendType || ""} // Ensure a valid default value
            onChange={(e) => handleInputChange("weekendType", e.target.value)}
            className="block p-2 border rounded-xl w-full outline-none"
          >
            <option value="">انتخاب کنید</option>
            {weekendOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
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
