// src/components/edithouse-components/EditHousePricing.jsx

import React, { useState, useEffect } from "react";
import TextField from "../../../../ui/TextField";
import { toast, Toaster } from "react-hot-toast";
import { Disclosure } from "@headlessui/react";
import Spinner from "../../../../ui/Loading";
import {
  updateHousePrice,
  updateRoomPrice,
} from "../../../../services/houseService";

const EditHousePricing = ({
  houseData,
  loadingHouse,
  houseId,
  refetchHouseData,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [errorList, setErrorList] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [priceHandleBy, setPriceHandleBy] = useState(
    houseData?.price_handle_by?.key,
  );

  const placeholderText =
    priceHandleBy === "PerPerson"
      ? "قیمت را بر اساس هر نفر به تومان وارد کنید"
      : "قیمت را بر اساس هر شب به تومان وارد کنید";

  useEffect(() => {
    if (!houseData) return;

    const formatNumber = (value) =>
      value
        ?.toString()
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    setPriceHandleBy(houseData?.price_handle_by?.key);

    if (houseData?.is_rent_room) {
      const initialFormData = {};
      houseData.room.forEach((room) => {
        if (!room.is_living_room) {
          initialFormData[room.uuid] = {
            nowruz: formatNumber(room.prices?.nowruz || ""),
            // Spring
            normal_spring: formatNumber(room.prices?.spring?.normal || ""),
            weekend_spring: formatNumber(room.prices?.spring?.weekend || ""),
            holiday_spring: formatNumber(room.prices?.spring?.holiday || ""),
            peak_spring: formatNumber(room.prices?.spring?.peak || ""),
            extra_people_spring: formatNumber(
              room.prices?.spring?.extra_people || "",
            ),
            // Summer
            normal_summer: formatNumber(room.prices?.summer?.normal || ""),
            weekend_summer: formatNumber(room.prices?.summer?.weekend || ""),
            holiday_summer: formatNumber(room.prices?.summer?.holiday || ""),
            peak_summer: formatNumber(room.prices?.summer?.peak || ""),
            extra_people_summer: formatNumber(
              room.prices?.summer?.extra_people || "",
            ),
            // Autumn
            normal_autumn: formatNumber(room.prices?.autumn?.normal || ""),
            weekend_autumn: formatNumber(room.prices?.autumn?.weekend || ""),
            holiday_autumn: formatNumber(room.prices?.autumn?.holiday || ""),
            peak_autumn: formatNumber(room.prices?.autumn?.peak || ""),
            extra_people_autumn: formatNumber(
              room.prices?.autumn?.extra_people || "",
            ),
            // Winter
            normal_winter: formatNumber(room.prices?.winter?.normal || ""),
            weekend_winter: formatNumber(room.prices?.winter?.weekend || ""),
            holiday_winter: formatNumber(room.prices?.winter?.holiday || ""),
            peak_winter: formatNumber(room.prices?.winter?.peak || ""),
            extra_people_winter: formatNumber(
              room.prices?.winter?.extra_people || "",
            ),
          };
        }
      });
      setFormData(initialFormData);
    } else if (houseData?.prices) {
      setFormData({
        nowruz: formatNumber(houseData.prices.nowruz || ""),
        // Spring
        normal_spring: formatNumber(houseData.prices.spring?.normal || ""),
        weekend_spring: formatNumber(houseData.prices.spring?.weekend || ""),
        holiday_spring: formatNumber(houseData.prices.spring?.holiday || ""),
        peak_spring: formatNumber(houseData.prices.spring?.peak || ""),
        extra_people_spring: formatNumber(
          houseData.prices.spring?.extra_people || "",
        ),
        // Summer
        normal_summer: formatNumber(houseData.prices.summer?.normal || ""),
        weekend_summer: formatNumber(houseData.prices.summer?.weekend || ""),
        holiday_summer: formatNumber(houseData.prices.summer?.holiday || ""),
        peak_summer: formatNumber(houseData.prices.summer?.peak || ""),
        extra_people_summer: formatNumber(
          houseData.prices.summer?.extra_people || "",
        ),
        // Autumn
        normal_autumn: formatNumber(houseData.prices.autumn?.normal || ""),
        weekend_autumn: formatNumber(houseData.prices.autumn?.weekend || ""),
        holiday_autumn: formatNumber(houseData.prices.autumn?.holiday || ""),
        peak_autumn: formatNumber(houseData.prices.autumn?.peak || ""),
        extra_people_autumn: formatNumber(
          houseData.prices.autumn?.extra_people || "",
        ),
        // Winter
        normal_winter: formatNumber(houseData.prices.winter?.normal || ""),
        weekend_winter: formatNumber(houseData.prices.winter?.weekend || ""),
        holiday_winter: formatNumber(houseData.prices.winter?.holiday || ""),
        peak_winter: formatNumber(houseData.prices.winter?.peak || ""),
        extra_people_winter: formatNumber(
          houseData.prices.winter?.extra_people || "",
        ),
      });
    }
  }, [houseData]);

  const handleInputChange = (key, value, roomUuid = null) => {
    const formattedValue = value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (houseData?.is_rent_room && roomUuid) {
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
    setLoadingSubmit(true);
    const priceData = roomUuid ? formData[roomUuid] : formData;

    const formattedData = Object.fromEntries(
      Object.entries(priceData)
        .filter(([key, value]) => value !== "")
        .map(([key, value]) => [key, value.replace(/,/g, "")]),
    );

    // Set default values for extra people fields if not provided
    ["spring", "summer", "autumn", "winter"].forEach((season) => {
      if (!formattedData[`extra_people_${season}`]) {
        formattedData[`extra_people_${season}`] = "10000";
      }
    });

    try {
      if (houseData?.is_rent_room && roomUuid) {
        await updateRoomPrice(houseId, roomUuid, formattedData);
      } else {
        await updateHousePrice(houseId, formattedData);
      }
      toast.success("قیمت‌ها با موفقیت به روز شد");
      setErrorList([]);
      refetchHouseData();
    } catch (error) {
      if (error.response?.status === 422) {
        const errorsArray = Object.values(
          error.response.data.errors.fields || {},
        ).flat();
        setErrorList(errorsArray);
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
      setLoadingSubmit(false);
    }
  };

  const renderInputSection = (roomUuid, title, keys) => (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mt-7">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keys.map(({ key, label }) => (
          <TextField
            key={key}
            label={label}
            name={key}
            value={
              houseData?.is_rent_room && roomUuid
                ? formData[roomUuid]?.[key] || ""
                : formData[key] || ""
            }
            onChange={(e) => handleInputChange(key, e.target.value, roomUuid)}
            placeholder={placeholderText}
            className={errors[key] ? "border-red-500" : ""}
            error={errors[key]}
          />
        ))}
      </div>
    </div>
  );

  if (loadingHouse || !houseData) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative p-2">
      <Toaster />
      <div className="overflow-auto scrollbar-thin pt-2 px-2 lg:px-4 w-full">
        <h2 className="text-right font-bold lg:text-lg mb-4">قیمت‌گذاری :</h2>

        {houseData?.is_rent_room ? (
          houseData.room &&
          houseData.room.filter((room) => !room.is_living_room).length > 0 ? (
            houseData.room
              .filter((room) => !room.is_living_room)
              .map((room, index) => (
                <Disclosure
                  key={room.uuid}
                  as="div"
                  className="mb-2"
                  defaultOpen={false}
                >
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="py-2 flex justify-between items-center w-full bg-white mt-2 shadow-centered rounded-xl px-4">
                        <span className="flex items-center">
                          {room.name || `اتاق ${index + 1}`}
                        </span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${
                            open ? "rotate-180" : "rotate-0"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </Disclosure.Button>

                      <Disclosure.Panel className="p-4 rounded-xl bg-white shadow-centered mt-1.5">
                        {renderInputSection(
                          room.uuid,
                          "قیمت در تعطیلات نوروز",
                          [{ key: "nowruz", label: "تعطیلات نوروز" }],
                        )}

                        {renderInputSection(room.uuid, "قیمت در بهار", [
                          {
                            key: "normal_spring",
                            label: "روز های اول هفته (بهار)",
                          },
                          {
                            key: "weekend_spring",
                            label: "روز های آخر هفته (بهار)",
                          },
                          {
                            key: "holiday_spring",
                            label: "روز های تعطیل (بهار)",
                          },
                          {
                            key: "peak_spring",
                            label: "روز های ایام پیک (بهار)",
                          },
                          {
                            key: "extra_people_spring",
                            label: "به ازای هر نفر اضافه (بهار)",
                          },
                        ])}

                        {renderInputSection(room.uuid, "قیمت در تابستان", [
                          {
                            key: "normal_summer",
                            label: "روز های اول هفته (تابستان)",
                          },
                          {
                            key: "weekend_summer",
                            label: "روز های آخر هفته (تابستان)",
                          },
                          {
                            key: "holiday_summer",
                            label: "روز های تعطیل (تابستان)",
                          },
                          {
                            key: "peak_summer",
                            label: "روز های ایام پیک (تابستان)",
                          },
                          {
                            key: "extra_people_summer",
                            label: "به ازای هر نفر اضافه (تابستان)",
                          },
                        ])}

                        {renderInputSection(room.uuid, "قیمت در پاییز", [
                          {
                            key: "normal_autumn",
                            label: "روز های اول هفته (پاییز)",
                          },
                          {
                            key: "weekend_autumn",
                            label: "روز های آخر هفته (پاییز)",
                          },
                          {
                            key: "holiday_autumn",
                            label: "روز های تعطیل (پاییز)",
                          },
                          {
                            key: "peak_autumn",
                            label: "روز های ایام پیک (پاییز)",
                          },
                          {
                            key: "extra_people_autumn",
                            label: "به ازای هر نفر اضافه (پاییز)",
                          },
                        ])}

                        {renderInputSection(room.uuid, "قیمت در زمستان", [
                          {
                            key: "normal_winter",
                            label: "روز های اول هفته (زمستان)",
                          },
                          {
                            key: "weekend_winter",
                            label: "روز های آخر هفته (زمستان)",
                          },
                          {
                            key: "holiday_winter",
                            label: "روز های تعطیل (زمستان)",
                          },
                          {
                            key: "peak_winter",
                            label: "روز های ایام پیک (زمستان)",
                          },
                          {
                            key: "extra_people_winter",
                            label: "به ازای هر نفر اضافه (زمستان)",
                          },
                        ])}

                        <div className="mt-4 flex gap-2 justify-end">
                          <button
                            onClick={() => handleSubmit(room.uuid)}
                            className="btn bg-green-500 cursor-pointer text-white px-4 py-2 rounded-2xl shadow-centered hover:bg-green-600"
                            disabled={loadingSubmit}
                          >
                            {loadingSubmit ? "در حال ثبت ..." : "ثبت قیمت اتاق"}
                          </button>
                        </div>

                        {errorList.length > 0 && (
                          <div className="mt-4 text-red-600">
                            <h3 className="font-semibold">
                              خطاهای زیر را بررسی کنید:
                            </h3>
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
            <p className="text-center text-red-500 mt-4">
              هیچ اتاقی وجود ندارد لطفا ابتدا اتاق‌های خود را ثبت کنید
            </p>
          )
        ) : (
          <>
            {renderInputSection(null, "قیمت در تعطیلات نوروز", [
              { key: "nowruz", label: "تعطیلات نوروز" },
            ])}

            {renderInputSection(null, "قیمت در بهار", [
              { key: "normal_spring", label: "روز های اول هفته (بهار)" },
              { key: "weekend_spring", label: "روز های آخر هفته (بهار)" },
              { key: "holiday_spring", label: "روز های تعطیل (بهار)" },
              { key: "peak_spring", label: "روز های ایام پیک (بهار)" },
              {
                key: "extra_people_spring",
                label: "به ازای هر نفر اضافه (بهار)",
              },
            ])}

            {renderInputSection(null, "قیمت در تابستان", [
              { key: "normal_summer", label: "روز های اول هفته (تابستان)" },
              { key: "weekend_summer", label: "روز های آخر هفته (تابستان)" },
              { key: "holiday_summer", label: "روز های تعطیل (تابستان)" },
              { key: "peak_summer", label: "روز های ایام پیک (تابستان)" },
              {
                key: "extra_people_summer",
                label: "به ازای هر نفر اضافه (تابستان)",
              },
            ])}

            {renderInputSection(null, "قیمت در پاییز", [
              { key: "normal_autumn", label: "روز های اول هفته (پاییز)" },
              { key: "weekend_autumn", label: "روز های آخر هفته (پاییز)" },
              { key: "holiday_autumn", label: "روز های تعطیل (پاییز)" },
              { key: "peak_autumn", label: "روز های ایام پیک (پاییز)" },
              {
                key: "extra_people_autumn",
                label: "به ازای هر نفر اضافه (پاییز)",
              },
            ])}

            {renderInputSection(null, "قیمت در زمستان", [
              { key: "normal_winter", label: "روز های اول هفته (زمستان)" },
              { key: "weekend_winter", label: "روز های آخر هفته (زمستان)" },
              { key: "holiday_winter", label: "روز های تعطیل (زمستان)" },
              { key: "peak_winter", label: "روز های ایام پیک (زمستان)" },
              {
                key: "extra_people_winter",
                label: "به ازای هر نفر اضافه (زمستان)",
              },
            ])}

            <div className="mt-4">
              <button
                onClick={() => handleSubmit()}
                className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-xl"
                disabled={loadingSubmit}
              >
                {loadingSubmit ? "در حال ثبت ..." : "ثبت قیمت‌ها"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditHousePricing;
