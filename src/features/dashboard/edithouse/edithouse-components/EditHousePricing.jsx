import React, { useState, useEffect } from "react";
import Spinner from "../../../../ui/Loading";
import TextField from "../../../../ui/TextField";
import FormSelect from "../../../../ui/FormSelect";
import { Disclosure } from "@headlessui/react";
import { toast, Toaster } from "react-hot-toast";

const EditHousePricing = ({ houseData, loadingHouse }) => {
  const [formData, setFormData] = useState({});
  const [priceHandleBy, setPriceHandleBy] = useState(houseData?.price_handle_by?.key);

  const priceHandleOptions = [
    { key: "PerNight", label: "براساس هر شب" },
    { key: "PerPerson", label: "براساس هر نفر-شب" },
  ];

  useEffect(() => {
    const formatNumber = (value) =>
      value?.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "/");

    setPriceHandleBy(houseData?.price_handle_by?.key);

    if (houseData?.is_rent_room) {
      const initialFormData = houseData.room.reduce((acc, room) => {
        acc[room.uuid] = {
          nowruz: formatNumber(room.prices?.nowruz || ""),
          normal_spring: formatNumber(room.prices?.spring?.normal || ""),
          weekend_spring: formatNumber(room.prices?.spring?.weekend || ""),
          holiday_spring: formatNumber(room.prices?.spring?.holiday || ""),
          peak_spring: formatNumber(room.prices?.spring?.peak || ""),
          extra_people_spring: formatNumber(room.prices?.spring?.extra_people || ""),
          normal_summer: formatNumber(room.prices?.summer?.normal || ""),
          weekend_summer: formatNumber(room.prices?.summer?.weekend || ""),
          holiday_summer: formatNumber(room.prices?.summer?.holiday || ""),
          peak_summer: formatNumber(room.prices?.summer?.peak || ""),
          extra_people_summer: formatNumber(room.prices?.summer?.extra_people || ""),
          normal_autumn: formatNumber(room.prices?.autumn?.normal || ""),
          weekend_autumn: formatNumber(room.prices?.autumn?.weekend || ""),
          holiday_autumn: formatNumber(room.prices?.autumn?.holiday || ""),
          peak_autumn: formatNumber(room.prices?.autumn?.peak || ""),
          extra_people_autumn: formatNumber(room.prices?.autumn?.extra_people || ""),
          normal_winter: formatNumber(room.prices?.winter?.normal || ""),
          weekend_winter: formatNumber(room.prices?.winter?.weekend || ""),
          holiday_winter: formatNumber(room.prices?.winter?.holiday || ""),
          peak_winter: formatNumber(room.prices?.winter?.peak || ""),
          extra_people_winter: formatNumber(room.prices?.winter?.extra_people || ""),
        };
        return acc;
      }, {});
      setFormData(initialFormData);
    } else if (houseData?.prices) {
      setFormData({
        nowruz: formatNumber(houseData.prices.nowruz || ""),
        normal_spring: formatNumber(houseData.prices.spring?.normal || ""),
        weekend_spring: formatNumber(houseData.prices.spring?.weekend || ""),
        holiday_spring: formatNumber(houseData.prices.spring?.holiday || ""),
        peak_spring: formatNumber(houseData.prices.spring?.peak || ""),
        extra_people_spring: formatNumber(houseData.prices.spring?.extra_people || ""),
        normal_summer: formatNumber(houseData.prices.summer?.normal || ""),
        weekend_summer: formatNumber(houseData.prices.summer?.weekend || ""),
        holiday_summer: formatNumber(houseData.prices.summer?.holiday || ""),
        peak_summer: formatNumber(houseData.prices.summer?.peak || ""),
        extra_people_summer: formatNumber(houseData.prices.summer?.extra_people || ""),
        normal_autumn: formatNumber(houseData.prices.autumn?.normal || ""),
        weekend_autumn: formatNumber(houseData.prices.autumn?.weekend || ""),
        holiday_autumn: formatNumber(houseData.prices.autumn?.holiday || ""),
        peak_autumn: formatNumber(houseData.prices.autumn?.peak || ""),
        extra_people_autumn: formatNumber(houseData.prices.autumn?.extra_people || ""),
        normal_winter: formatNumber(houseData.prices.winter?.normal || ""),
        weekend_winter: formatNumber(houseData.prices.winter?.weekend || ""),
        holiday_winter: formatNumber(houseData.prices.winter?.holiday || ""),
        peak_winter: formatNumber(houseData.prices.winter?.peak || ""),
        extra_people_winter: formatNumber(houseData.prices.winter?.extra_people || ""),
      });
    }
  }, [houseData, priceHandleBy]);

  const handleInputChange = (key, value, roomUuid = null) => {
    const formattedValue = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "/");
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
  };

  const renderInputSection = (roomUuid, title, keys) => (
    <div className="">
      <h2 className="text-lg my-2 mt-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keys
          .filter(({ key }) => (priceHandleBy === "PerPerson" ? !key.includes("extra_people") : true))
          .map(({ key, label }) => (
            <TextField
              key={key}
              label={label}
              name={key}
              value={formData[roomUuid]?.[key] || formData[key] || ""}
              onChange={(e) => handleInputChange(key, e.target.value, roomUuid)}
              placeholder="قیمت را به تومان وارد کنید"
            />
          ))}
      </div>
    </div>
  );

  if (loadingHouse) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative p-2">
      <Toaster />
      <div className="overflow-auto scrollbar-thin  pt-2 px-2 lg:px-4 w-full ">
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
      </div>
    </div>
  );
};

export default EditHousePricing;
