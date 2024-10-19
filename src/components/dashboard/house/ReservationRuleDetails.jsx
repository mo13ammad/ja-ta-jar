import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const ReservationRuleDetails = ({ token, houseUuid, houseData, onSubmit, errors }) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
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
    setErrorMessage(""); // Reset error message

    try {
      await onSubmit(formData); // Submit data via parent component

    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "An unexpected error occurred.");
        toast.error(error.response.data.message || "An unexpected error occurred.");
      } else {
        toast.error("متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید");
      }
    } finally {
      setLoadingSubmit(false);
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
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">قوانین رزرو</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Short Term Booking Length */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">تعداد شب اقامت کوتاه مدت</label>
          <input
            type="number"
            value={formData.short_term_booking_length || ""}
            onChange={(e) => handleInputChange("short_term_booking_length", e.target.value)}
            className="block p-2 border rounded-xl w-full outline-none"
            placeholder="تعداد شب رزرو کوتاه مدت"
          />
          {renderErrorMessages(errors?.short_term_booking_length)}
        </div>

        {/* Short Term Booking Discount */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">درصد تخفیف</label>
          <input
            type="number"
            value={formData.short_term_booking_discount || ""}
            onChange={(e) => handleInputChange("short_term_booking_discount", e.target.value)}
            className="block p-2 border rounded-xl w-full outline-none"
            placeholder="درصد تخفیف"
          />
          {renderErrorMessages(errors?.short_term_booking_discount)}
        </div>

        {/* Long Term Booking Length */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">تعداد شب اقامت بلند مدت</label>
          <input
            type="number"
            value={formData.long_term_booking_length || ""}
            onChange={(e) => handleInputChange("long_term_booking_length", e.target.value)}
            className="block p-2 border rounded-xl w-full outline-none"
            placeholder="تعداد شب رزرو بلند مدت"
          />
          {renderErrorMessages(errors?.long_term_booking_length)}
        </div>

        {/* Long Term Booking Discount */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">درصد تخفیف</label>
          <input
            type="number"
            value={formData.long_term_booking_discount || ""}
            onChange={(e) => handleInputChange("long_term_booking_discount", e.target.value)}
            className="block p-2 border rounded-xl w-full outline-none"
            placeholder="درصد تخفیف"
          />
          {renderErrorMessages(errors?.long_term_booking_discount)}
        </div>

        {/* Minimum Stay for All Days */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">حداقل شب اقامت</label>
          <input
            type="number"
            value={formData.minimum_length_stay.all || ""}
            onChange={(e) => handleMinimumStayChange("all", e.target.value)}
            className="block p-2 border rounded-xl w-full outline-none"
            placeholder="حداقل شبی که اقامتگاه قابل رزرو است"
          />
        </div>

        {/* Enter Time Inputs */}
        <div className="mt-4">
          <label onClick={() => enterFromRef.current.focus()} className="block text-sm font-medium mb-2">
            زمان ورود از
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              ref={enterFromRef}
              type="time"
              value={formData.enter_from || ""}
              onChange={(e) => handleInputChange("enter_from", e.target.value)}
              className="p-2 border rounded-xl w-full outline-none"
            />
            <input
              ref={enterUntilRef}
              type="time"
              value={formData.enter_until || ""}
              onChange={(e) => handleInputChange("enter_until", e.target.value)}
              className="p-2 border rounded-xl w-full outline-none"
            />
          </div>
          {renderErrorMessages(errors?.enter_from)}
        </div>

        {/* Discharge Time */}
        <div className="mt-4">
          <label onClick={() => dischargeTimeRef.current.focus()} className="block text-sm font-medium mb-2">
            زمان تخلیه
          </label>
          <input
            ref={dischargeTimeRef}
            type="time"
            value={formData.discharge_time || ""}
            onChange={(e) => handleInputChange("discharge_time", e.target.value)}
            className="block p-2 border rounded-xl w-full outline-none"
          />
          {renderErrorMessages(errors?.discharge_time)}
        </div>

        {/* Capacity */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">ظرفیت استاندارد</label>
          <input
            type="number"
            value={formData.capacity || ""}
            onChange={(e) => handleInputChange("capacity", e.target.value)}
            className="block p-2 border rounded-xl w-full outline-none"
          />
          {renderErrorMessages(errors?.capacity)}
        </div>

        {/* Maximum Capacity */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">حداکثر ظرفیت</label>
          <input
            type="number"
            value={formData.maximum_capacity || ""}
            onChange={(e) => handleInputChange("maximum_capacity", e.target.value)}
            className="block p-2 border rounded-xl w-full outline-none"
          />
          {renderErrorMessages(errors?.maximum_capacity)}
        </div>

        {/* Minimum Stay Table */}
        <div className="mt-4 lg:col-span-2">
          <label className="block text-sm font-medium mb-2">حداقل شب اقامت به ازای روزهای هفته</label>
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
                      value={formData.minimum_length_stay[day.key] || ""}
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
          <label className="block text-sm font-medium mb-2">تعیین روز های آخر هفته</label>
          <select
            value={formData.weekendType || ""}
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

      {/* Display error message above the submit button */}
      {errorMessage && (
        <div className="mt-4 bg-red-100 text-red-600 p-4 rounded-md mb-4">
          <h3 className="font-semibold">خطا:</h3>
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-xl"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "در حال ارسال..." : "ثبت اطلاعات"}
        </button>
      </div>
    </div>
  );
};

export default ReservationRuleDetails;
