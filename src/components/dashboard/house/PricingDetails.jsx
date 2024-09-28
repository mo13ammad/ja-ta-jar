import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Disclosure } from "@headlessui/react";

const PricingDetails = ({ token, houseUuid, houseData, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [errorList, setErrorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceHandleBy, setPriceHandleBy] = useState(houseData?.price_handle_by?.key);

  useEffect(() => {
    setPriceHandleBy(houseData?.price_handle_by?.key);

    if (houseData?.is_rent_room) {
      const initialFormData = houseData.room.reduce((acc, room) => {
        acc[room.uuid] = {
          nowruz: room.prices?.nowruz || "",
          normal_spring: room.prices?.spring?.normal || "",
          weekend_spring: room.prices?.spring?.weekend || "",
          holiday_spring: room.prices?.spring?.holiday || "",
          peak_spring: room.prices?.spring?.peak || "",
          extra_people_spring: room.prices?.spring?.extra_people || "",
          normal_summer: room.prices?.summer?.normal || "",
          weekend_summer: room.prices?.summer?.weekend || "",
          holiday_summer: room.prices?.summer?.holiday || "",
          peak_summer: room.prices?.summer?.peak || "",
          extra_people_summer: room.prices?.summer?.extra_people || "",
          normal_autumn: room.prices?.autumn?.normal || "",
          weekend_autumn: room.prices?.autumn?.weekend || "",
          holiday_autumn: room.prices?.autumn?.holiday || "",
          peak_autumn: room.prices?.autumn?.peak || "",
          extra_people_autumn: room.prices?.autumn?.extra_people || "",
          normal_winter: room.prices?.winter?.normal || "",
          weekend_winter: room.prices?.winter?.weekend || "",
          holiday_winter: room.prices?.winter?.holiday || "",
          peak_winter: room.prices?.winter?.peak || "",
          extra_people_winter: room.prices?.winter?.extra_people || "",
        };
        return acc;
      }, {});
      setFormData(initialFormData);
    } else if (houseData?.prices) {
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
  }, [houseData, priceHandleBy]);

  const formatNumber = (value) => value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "/");

  const handleInputChange = (key, value, roomUuid = null) => {
    const formattedValue = formatNumber(value);
    if (houseData.is_rent_room && roomUuid) {
      setFormData((prevData) => ({
        ...prevData,
        [roomUuid]: {
          ...prevData[roomUuid],
          [key]: formattedValue,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [key]: formattedValue,
      }));
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: null,
    }));
  };

  const handleSubmit = async (roomUuid = null) => {
    setLoading(true);
    const priceData = roomUuid ? formData[roomUuid] : formData;
    const formattedData = Object.fromEntries(
      Object.entries(priceData)
        .filter(([key, value]) => value !== "")
        .map(([key, value]) => [key, String(value).replace(/\//g, "")])
    );

    // Set extra_people values to 100000 if price_handle_by is PerNight
    if (priceHandleBy === "PerNight") {
      formattedData.extra_people_spring = "100000";
      formattedData.extra_people_summer = "100000";
      formattedData.extra_people_autumn = "100000";
      formattedData.extra_people_winter = "100000";
    }

    try {
      const apiUrl = houseData.is_rent_room && roomUuid
        ? `https://portal1.jatajar.com/api/client/house/${houseUuid}/room/${roomUuid}/prices`
        : `https://portal1.jatajar.com/api/client/house/${houseUuid}/prices`;

      console.log("Sending data to API:", { apiUrl, formattedData });

      const response = await axios.put(apiUrl, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Received response data:", response.data);

      if (response.status === 200) {
        toast.success("قیمت‌ها با موفقیت به روز شد");
        setErrorList([]);

        if (onSubmit) {
          if (houseData.is_rent_room) {
            const updatedRoomPrices = houseData.room.map((room) =>
              room.uuid === roomUuid ? { ...room, prices: response.data.data } : room
            );
            onSubmit({ room: updatedRoomPrices });
          } else {
            onSubmit({ prices: { ...houseData.prices, ...response.data.data } });
          }
        }
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const errorsArray = Object.values(error.response.data.errors.fields || {}).flat();
        setErrorList(errorsArray);
        toast.error("خطا در ورود اطلاعات، لطفاً بررسی کنید");

        const fieldErrors = error.response.data.errors.fields;
        const updatedErrors = {};
        for (let field in fieldErrors) {
          updatedErrors[field] = fieldErrors[field][0];
        }
        setErrors(updatedErrors);
      } else {
        toast.error("مشکلی پیش آمده است");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInputSection = (roomUuid, title, keys) => (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mt-7">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keys
          .filter(({ key }) => !(priceHandleBy === "PerNight" && key.includes("extra_people")))
          .map(({ key, label }) => (
            <div key={key} className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <input
                type="text"
                value={formData[roomUuid]?.[key] || formData[key] || ""}
                onChange={(e) => handleInputChange(key, e.target.value, roomUuid)}
                className={`block p-2 border rounded-xl w-full outline-none ${errors[key] ? "border-red-500" : ""}`}
                placeholder={`قیمت را به تومان (${priceHandleBy === "PerNight" ? "بر اساس هر شب" : "بر اساس هر نفر"}) وارد کنید`}
              />
              {errors[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">قیمت‌گذاری</h1>

      {houseData.is_rent_room ? (
        houseData.room.map((room, index) => (
          <Disclosure key={room.uuid}>
            {({ open }) => (
              <>
                <Disclosure.Button className="py-2 flex justify-between items-center w-full bg-gray-200 rounded-lg px-4 mb-2">
                  <span>{room.name || `اتاق ${index + 1}`}</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel className="p-4 border rounded-lg mb-4">
                  {renderInputSection(room.uuid, `قیمت‌گذاری برای اتاق ${room.name || index + 1}`, [
                    { key: "nowruz", label: "تعطیلات نوروز" },
                    { key: "normal_spring", label: "روز های اول هفته (بهار)" },
                    { key: "weekend_spring", label: "روز های آخر هفته (بهار)" },
                    { key: "holiday_spring", label: "روز های تعطیل (بهار)" },
                    { key: "peak_spring", label: "روز های ایام پیک (بهار)" },
                    { key: "extra_people_spring", label: "به ازای هر نفر اضافه (بهار)" },
                    { key: "normal_summer", label: "روز های اول هفته (تابستان)" },
                    { key: "weekend_summer", label: "روز های آخر هفته (تابستان)" },
                    { key: "holiday_summer", label: "روز های تعطیل (تابستان)" },
                    { key: "peak_summer", label: "روز های ایام پیک (تابستان)" },
                    { key: "extra_people_summer", label: "به ازای هر نفر اضافه (تابستان)" },
                    { key: "normal_autumn", label: "روز های اول هفته (پاییز)" },
                    { key: "weekend_autumn", label: "روز های آخر هفته (پاییز)" },
                    { key: "holiday_autumn", label: "روز های تعطیل (پاییز)" },
                    { key: "peak_autumn", label: "روز های ایام پیک (پاییز)" },
                    { key: "extra_people_autumn", label: "به ازای هر نفر اضافه (پاییز)" },
                    { key: "normal_winter", label: "روز های اول هفته (زمستان)" },
                    { key: "weekend_winter", label: "روز های آخر هفته (زمستان)" },
                    { key: "holiday_winter", label: "روز های تعطیل (زمستان)" },
                    { key: "peak_winter", label: "روز های ایام پیک (زمستان)" },
                    { key: "extra_people_winter", label: "به ازای هر نفر اضافه (زمستان)" },
                  ])}

                  <div className="mt-4">
                    <button
                      onClick={() => handleSubmit(room.uuid)}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-xl"
                      disabled={loading}
                    >
                      {loading ? "در حال ثبت ..." : "ثبت قیمت اتاق"}
                    </button>
                  </div>

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
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))
      ) : (
        <>
          {renderInputSection(null, "قیمت در تعطیلات نوروز", [{ key: "nowruz", label: "تعطیلات نوروز" }])}
          {renderInputSection(null, "قیمت در بهار", [
            { key: "normal_spring", label: "روز های اول هفته (بهار)" },
            { key: "weekend_spring", label: "روز های آخر هفته (بهار)" },
            { key: "holiday_spring", label: "روز های تعطیل (بهار)" },
            { key: "peak_spring", label: "روز های ایام پیک (بهار)" },
            { key: "extra_people_spring", label: "به ازای هر نفر اضافه (بهار)" },
          ])}
          {renderInputSection(null, "قیمت در تابستان", [
            { key: "normal_summer", label: "روز های اول هفته (تابستان)" },
            { key: "weekend_summer", label: "روز های آخر هفته (تابستان)" },
            { key: "holiday_summer", label: "روز های تعطیل (تابستان)" },
            { key: "peak_summer", label: "روز های ایام پیک (تابستان)" },
            { key: "extra_people_summer", label: "به ازای هر نفر اضافه (تابستان)" },
          ])}
          {renderInputSection(null, "قیمت در پاییز", [
            { key: "normal_autumn", label: "روز های اول هفته (پاییز)" },
            { key: "weekend_autumn", label: "روز های آخر هفته (پاییز)" },
            { key: "holiday_autumn", label: "روز های تعطیل (پاییز)" },
            { key: "peak_autumn", label: "روز های ایام پیک (پاییز)" },
            { key: "extra_people_autumn", label: "به ازای هر نفر اضافه (پاییز)" },
          ])}
          {renderInputSection(null, "قیمت در زمستان", [
            { key: "normal_winter", label: "روز های اول هفته (زمستان)" },
            { key: "weekend_winter", label: "روز های آخر هفته (زمستان)" },
            { key: "holiday_winter", label: "روز های تعطیل (زمستان)" },
            { key: "peak_winter", label: "روز های ایام پیک (زمستان)" },
            { key: "extra_people_winter", label: "به ازای هر نفر اضافه (زمستان)" },
          ])}
        </>
      )}

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

      {!houseData.is_rent_room && (
        <div className="mt-4">
          <button
            onClick={() => handleSubmit()}
            className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-xl"
            disabled={loading}
          >
            {loading ? "در حال ثبت ..." : "ثبت قیمت‌ها"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PricingDetails;
