import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Listbox } from "@headlessui/react";
import Spinner from "./Spinner"; // Assuming you have a Spinner component

const GeneralDetails = ({ data, onSubmit, token, houseUuid }) => {
  const [houseFloorOptions, setHouseFloorOptions] = useState([]);
  const [privacyOptions, setPrivacyOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [formData, setFormData] = useState({
    name: data?.name || "",
    land_size: data?.structure?.land_size || "",
    structure_size: data?.structure?.size || "",
    house_floor: data?.house_floor || "",
    number_stairs: data?.structure?.number_stairs || "",
    description: data?.description || "",
    tip: "", // Initially empty, will be set in useEffect
    privacy: "", // Initially empty, will be set in useEffect
    rentType: data?.is_rent_room ? "Rooms" : "House", // Based on is_rent_room flag
    price_handle_by: data?.price_handle_by?.key || "PerNight", // Set based on fetched data or default
  });

  const priceHandleOptions = [
    { key: "PerNight", label: "براساس هر شب" },
    { key: "PerPerson", label: "براساس هر نفر-شب" },
  ];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [houseFloorRes, privacyRes] = await Promise.all([
          axios.get("https://portal1.jatajar.com/api/assets/types/tip/detail", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          axios.get("https://portal1.jatajar.com/api/assets/types/privacy/detail", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (houseFloorRes.status === 200) {
          setHouseFloorOptions(houseFloorRes.data.data);
        }

        if (privacyRes.status === 200) {
          setPrivacyOptions(privacyRes.data.data);
        }

        // Set initial values based on fetched options and existing data
        setFormData((prev) => ({
          ...prev,
          tip: data?.tip?.key || "",
          privacy: data?.privacy?.key || "",
        }));
      } catch (error) {
        toast.error("Error fetching options");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [token, data]);

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const toggleRentType = (key) => {
    setFormData((prevData) => ({
      ...prevData,
      rentType: key,
    }));
  };

  const togglePriceHandleBy = (key) => {
    setFormData((prevData) => ({
      ...prevData,
      price_handle_by: key,
    }));
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);

    const updatedData = {
      ...formData,
      _method: "PUT",
    };

    try {
      await onSubmit(updatedData); // Use the onSubmit function from the parent component
      toast.success("اطلاعات با موفقیت ثبت شد");
    } catch (error) {
      toast.error("متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="relative">
      <Toaster />
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-auto scrollbar-thin max-h-[70vh] pr-2 w-full min-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Name Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">نام اقامتگاه</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="block p-2 border rounded-xl w-full outline-none"
                placeholder="نام اقامتگاه"
              />
            </div>

            {/* Land Size Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">متراژ کل</label>
              <input
                type="text"
                value={formData.land_size}
                onChange={(e) => handleInputChange("land_size", e.target.value)}
                className="block p-2 border rounded-xl w-full outline-none"
                placeholder="متراژ کل به متر مکعب"
              />
            </div>

            {/* Structure Size Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">متراژ زیر بنا</label>
              <input
                type="text"
                value={formData.structure_size}
                onChange={(e) => handleInputChange("structure_size", e.target.value)}
                className="block p-2 border rounded-xl w-full outline-none"
                placeholder="متراژ زیر بنا به متر مکعب"
              />
            </div>

            {/* Number of Stairs Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">تعداد پله</label>
              <input
                type="text"
                value={formData.number_stairs}
                onChange={(e) => handleInputChange("number_stairs", e.target.value)}
                className="block p-2 border rounded-xl w-full outline-none"
                placeholder="تعداد پله"
              />
            </div>

            {/* Description Input */}
            <div className="mt-4 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">درباره اقامتگاه</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="block p-2 border rounded-xl w-full outline-none"
                placeholder="امکاناتی که میخواهید به مهمانان نمایش داده شود را بنویسید"
              />
            </div>

            {/* Tip (House Floor Type) Dropdown */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">تیپ سازه</label>
              <Listbox value={formData.tip} onChange={(value) => handleInputChange("tip", value)}>
                {({ open }) => (
                  <div className="relative">
                    <Listbox.Button className="block p-2 border rounded-xl w-full text-left flex justify-between items-center">
                      {houseFloorOptions.find((option) => option.key === formData.tip)?.label ||
                        "انتخاب نوع"}
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          open ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-2 w-full border rounded-xl bg-white shadow-lg z-50 max-h-60 overflow-y-auto">
                      {houseFloorOptions.map((option) => (
                        <Listbox.Option key={option.key} value={option.key} className="cursor-pointer px-4 py-2 hover:bg-gray-200">
                          <span>{option.label}</span>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                )}
              </Listbox>
            </div>

            {/* Privacy Dropdown */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت حریم</label>
              <Listbox value={formData.privacy} onChange={(value) => handleInputChange("privacy", value)}>
                {({ open }) => (
                  <div className="relative">
                    <Listbox.Button className="block p-2 border rounded-xl w-full text-left flex justify-between items-center">
                      {privacyOptions.find((option) => option.key === formData.privacy)?.label || "انتخاب حریم"}
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          open ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-2 w-full border rounded-xl bg-white shadow-lg z-50 max-h-60 overflow-y-auto">
                      {privacyOptions.map((option) => (
                        <Listbox.Option key={option.key} value={option.key} className="cursor-pointer px-4 py-2 hover:bg-gray-200">
                          <span>{option.label}</span>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                )}
              </Listbox>
            </div>

            {/* Rent Type Checkboxes */}
            {data?.structure?.can_rent_room && (
              <div className="mt-4 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">اجاره بر اساس</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.rentType === "House"}
                          onChange={() => toggleRentType("House")}
                          className="sr-only"
                        />
                        <div
                          className={`h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                            formData.rentType === "House" ? "bg-green-500" : "bg-gray-200"
                          }`}
                        >
                          {formData.rentType === "House" && (
                            <svg
                              className="w-4 h-4 text-white absolute inset-0 m-auto"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">اقامتگاه</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.rentType === "Rooms"}
                          onChange={() => toggleRentType("Rooms")}
                          className="sr-only"
                        />
                        <div
                          className={`h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                            formData.rentType === "Rooms" ? "bg-green-500" : "bg-gray-200"
                          }`}
                        >
                          {formData.rentType === "Rooms" && (
                            <svg
                              className="w-4 h-4 text-white absolute inset-0 m-auto"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">اتاق</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Price Handle By Checkboxes */}
            <div className="mt-4 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">قیمت گذاری بر اساس</label>
              <div className="grid grid-cols-2 gap-4">
                {priceHandleOptions.map((option) => (
                  <div key={option.key} className="flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.price_handle_by === option.key}
                          onChange={() => togglePriceHandleBy(option.key)}
                          className="sr-only"
                        />
                        <div
                          className={`h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                            formData.price_handle_by === option.key ? "bg-green-500" : "bg-gray-200"
                          }`}
                        >
                          {formData.price_handle_by === option.key && (
                            <svg
                              className="w-4 h-4 text-white absolute inset-0 m-auto"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">{option.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                onClick={handleSubmit}
                className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl"
                disabled={loadingSubmit}
              >
                {loadingSubmit ? "در حال بارگذاری..." : "ثبت اطلاعات"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralDetails;
