// src/components/edithouse-components/EditHouseReservationRules.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../../../ui/Loading";
import TextField from "../../../../ui/TextField";
import FormSelect from "../../../../ui/FormSelect";
import { toast, Toaster } from "react-hot-toast";
import { useFetchWeekendOptions } from "../../../../services/fetchDataService";

const EditHouseReservationRules = ({ houseData, handleEditHouse, loadingHouse, refetchHouseData }) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: weekendOptions = [], isLoading: loadingWeekendOptions } = useFetchWeekendOptions();

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
          ...prevFormData.minimum_length_stay,
          ...houseData.reservation.minimum_length_stay
        }
      }));
    }
  }, [houseData]);

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value
    }));
  };

  const handleMinimumStayChange = (day, value) => {
    setFormData((prevData) => ({
      ...prevData,
      minimum_length_stay: {
        ...prevData.minimum_length_stay,
        [day]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    setErrorMessage("");
    console.log("Submitting form data:", formData);
    try {
      await handleEditHouse(formData);
      await refetchHouseData();
      toast.success("اطلاعات با موفقیت ثبت شد");
    } catch (error) {
      const message = error.response?.data?.message || "An unexpected error occurred.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const renderErrorMessages = (fieldErrors) => {
    if (!fieldErrors) return null;
    return (
      <div className="mt-0.5 text-red-500 text-sm xl:text-lg">
        {Array.isArray(fieldErrors) ? fieldErrors.map((error, index) => <p key={index}>{error}</p>) : <p>{fieldErrors}</p>}
      </div>
    );
  };

  if (loadingHouse || loadingSubmit || loadingWeekendOptions) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4 text-center">قوانین رزرو</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="تعداد شب اقامت کوتاه مدت"
          name="short_term_booking_length"
          value={formData.short_term_booking_length}
          onChange={(e) => handleInputChange("short_term_booking_length", e.target.value)}
          placeholder="تعداد شب رزرو کوتاه مدت"
        />

        <TextField
          label="درصد تخفیف کوتاه مدت"
          name="short_term_booking_discount"
          value={formData.short_term_booking_discount}
          onChange={(e) => handleInputChange("short_term_booking_discount", e.target.value)}
          placeholder="درصد تخفیف"
        />

        <TextField
          label="تعداد شب اقامت بلند مدت"
          name="long_term_booking_length"
          value={formData.long_term_booking_length}
          onChange={(e) => handleInputChange("long_term_booking_length", e.target.value)}
          placeholder="تعداد شب رزرو بلند مدت"
        />

        <TextField
          label="درصد تخفیف بلند مدت"
          name="long_term_booking_discount"
          value={formData.long_term_booking_discount}
          onChange={(e) => handleInputChange("long_term_booking_discount", e.target.value)}
          placeholder="درصد تخفیف"
        />

        <div>
          <label className="block text-sm xl:text-lg font-medium mb-2">زمان ورود از</label>
          <input
            type="time"
            value={formData.enter_from || ""}
            onChange={(e) => handleInputChange("enter_from", e.target.value)}
            className="px-3 py-1.5 border rounded-2xl bg-white shadow-centered w-full outline-none"
          />
        </div>

        <div>
          <label className="block text-sm xl:text-lg font-medium mb-2">زمان ورود تا</label>
          <input
            type="time"
            value={formData.enter_until || ""}
            onChange={(e) => handleInputChange("enter_until", e.target.value)}
            className="px-3 py-1.5 border rounded-2xl bg-white shadow-centered w-full outline-none"
          />
        </div>

        <div>
          <label className="block text-sm xl:text-lg font-medium mb-2">زمان تخلیه</label>
          <input
            type="time"
            value={formData.discharge_time || ""}
            onChange={(e) => handleInputChange("discharge_time", e.target.value)}
            className="px-3 py-1.5 border rounded-2xl bg-white shadow-centered w-full outline-none"
          />
        </div>

        <TextField
          label="ظرفیت استاندارد"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={(e) => handleInputChange("capacity", e.target.value)}
        />

        <TextField
          label="حداکثر ظرفیت"
          name="maximum_capacity"
          type="number"
          value={formData.maximum_capacity}
          onChange={(e) => handleInputChange("maximum_capacity", e.target.value)}
        />

        <FormSelect
          label="تعیین روز های آخر هفته"
          name="weekendType"
          value={formData.weekendType}
          onChange={(e) => handleInputChange("weekendType", e.target.value)}
          options={[
            { value: "", label: "انتخاب کنید" },
            ...weekendOptions.map((option) => ({
              value: option.key,
              label: option.label,
            })),
          ]}
        />
      </div>

      <div className="mt-8 lg:col-span-2 lg:w-1/2">
        <label className="block text-sm xl:text-lg font-medium text-gray-700 mb-2">حداقل شب اقامت به ازای روزهای هفته</label>
        <table className="table-auto w-full rounded-xl text-right">
          <thead>
            <tr>
              <th className="p-2">روز</th>
              <th className="p-2">حداقل شب رزرو</th>
            </tr>
          </thead>
          <tbody>
            {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((dayKey, idx) => (
              <tr key={dayKey}>
                <td className="p-2">{["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"][idx]}</td>
                <td className="p-2">
                  <TextField
                    name={`minimum_length_stay.${dayKey}`}
                    value={formData.minimum_length_stay[dayKey]}
                    onChange={(e) => handleMinimumStayChange(dayKey, e.target.value)}
                    placeholder={`تعداد شب برای ${dayKey}`}
                    type="number"
                    className="p-2 border rounded-xl max-w-[4rem] outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errorMessage && (
        <div className="mt-4 bg-red-100 text-red-600 p-4 rounded-md mb-4">
          <h3 className="font-semibold">خطا:</h3>
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="mt-4 w-full lg:col-span-2 flex justify-end">
        <button
          onClick={handleSubmit}
          className="btn bg-primary-600 text-white px-4 py-2 shadow-lg hover:bg-primary-800 transition-colors duration-200"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "در حال ارسال..." : "ثبت اطلاعات"}
        </button>
      </div>
    </div>
  );
};

export default EditHouseReservationRules;
