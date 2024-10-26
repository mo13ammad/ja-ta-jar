import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Spinner from "../../../../ui/Loading"; // Assuming you have a Spinner component
import TextField from "../../../../ui/TextField";


const EditHouseReservationRules = ({ token, houseUuid, houseData, onSubmit, errors }) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
      [key]: value !== undefined ? value : "" 
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
    setErrorMessage(""); 

    try {
      await onSubmit(formData);
      toast.success("اطلاعات با موفقیت ثبت شد");
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
        {Array.isArray(fieldErrors) ? fieldErrors.map((error, index) => <p key={index}>{error}</p>) : <p>{fieldErrors}</p>}
      </div>
    );
  };

  return (
    <div className="relative">
      {loadingSubmit ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-auto scrollbar-thin max-h-[70vh] pr-2 w-full min-h-[70vh]">
          {/* Static Header */}
          <div className="text-center font-bold text-xl my-4">قوانین رزرو</div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Short Term Booking Length */}
            <div className="mt-4">
              <TextField
                label="تعداد شب اقامت کوتاه مدت"
                name="short_term_booking_length"
                value={formData.short_term_booking_length}
                onChange={(e) => handleInputChange("short_term_booking_length", e.target.value)}
                placeholder="تعداد شب رزرو کوتاه مدت"
              />
              {renderErrorMessages(errors?.short_term_booking_length)}
            </div>

            {/* Short Term Booking Discount */}
            <div className="mt-4">
              <TextField
                label="درصد تخفیف"
                name="short_term_booking_discount"
                value={formData.short_term_booking_discount}
                onChange={(e) => handleInputChange("short_term_booking_discount", e.target.value)}
                placeholder="درصد تخفیف"
              />
              {renderErrorMessages(errors?.short_term_booking_discount)}
            </div>

            {/* Long Term Booking Length */}
            <div className="mt-4">
              <TextField
                label="تعداد شب اقامت بلند مدت"
                name="long_term_booking_length"
                value={formData.long_term_booking_length}
                onChange={(e) => handleInputChange("long_term_booking_length", e.target.value)}
                placeholder="تعداد شب رزرو بلند مدت"
              />
              {renderErrorMessages(errors?.long_term_booking_length)}
            </div>

            {/* Long Term Booking Discount */}
            <div className="mt-4">
              <TextField
                label="درصد تخفیف"
                name="long_term_booking_discount"
                value={formData.long_term_booking_discount}
                onChange={(e) => handleInputChange("long_term_booking_discount", e.target.value)}
                placeholder="درصد تخفیف"
              />
              {renderErrorMessages(errors?.long_term_booking_discount)}
            </div>

            {/* Enter Time Inputs */}
            <div className="mt-4">
              <TextField
                label="زمان ورود از"
                name="enter_from"
                type="time"
                value={formData.enter_from}
                onChange={(e) => handleInputChange("enter_from", e.target.value)}
              />
              <TextField
                label="تا"
                name="enter_until"
                type="time"
                value={formData.enter_until}
                onChange={(e) => handleInputChange("enter_until", e.target.value)}
              />
              {renderErrorMessages(errors?.enter_from)}
            </div>

            {/* Discharge Time */}
            <div className="mt-4">
              <TextField
                label="زمان تخلیه"
                name="discharge_time"
                type="time"
                value={formData.discharge_time}
                onChange={(e) => handleInputChange("discharge_time", e.target.value)}
              />
              {renderErrorMessages(errors?.discharge_time)}
            </div>

            {/* Capacity */}
            <div className="mt-4">
              <TextField
                label="ظرفیت استاندارد"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
              />
              {renderErrorMessages(errors?.capacity)}
            </div>

            {/* Maximum Capacity */}
            <div className="mt-4">
              <TextField
                label="حداکثر ظرفیت"
                name="maximum_capacity"
                type="number"
                value={formData.maximum_capacity}
                onChange={(e) => handleInputChange("maximum_capacity", e.target.value)}
              />
              {renderErrorMessages(errors?.maximum_capacity)}
            </div>

            {/* Weekend Type Dropdown */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">تعیین روز های آخر هفته</label>
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
                  {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                    <tr key={day}>
                      <td className="border p-1">{day}</td>
                      <td className="border p-1">
                        <TextField
                          name={`minimum_length_stay.${day}`}
                          value={formData.minimum_length_stay[day] || ""}
                          onChange={(e) => handleMinimumStayChange(day, e.target.value)}
                          placeholder={`تعداد شب برای ${day}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Error Message */}
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
              className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? "در حال ارسال..." : "ثبت اطلاعات"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditHouseReservationRules;
