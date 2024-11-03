import React, { useState, useEffect } from "react";
import Spinner from "../../../../ui/Loading";
import TextField from "../../../../ui/TextField";
import TextArea from "../../../../ui/TextArea";
import FormSelect from "../../../../ui/FormSelect";
import ToggleSwitch from "../../../../ui/ToggleSwitch";
import { useFetchHouseFloors, useFetchPrivacyOptions } from "../../../../services/fetchDataService";

const EditHouseGeneralInfo = ({ userData, loadingUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    land_size: "",
    structure_size: "",
    number_stairs: "",
    description: "",
    tip: "",
    privacy: "",
    rentType: "House",
    price_handle_by: "PerNight",
  });

  const { data: houseFloorOptions = [], isLoading: loadingHouseFloors } = useFetchHouseFloors();
  const { data: privacyOptions = [], isLoading: loadingPrivacyOptions } = useFetchPrivacyOptions();

  const rentTypeOptions = [
    { key: "House", label: "اقامتگاه" },
    { key: "Rooms", label: "اتاق" },
  ];

  const priceHandleOptions = [
    { key: "PerNight", label: "براساس هر شب" },
    { key: "PerPerson", label: "براساس هر نفر-شب" },
  ];

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        land_size: userData.land_size || "",
        structure_size: userData.structure_size || "",
        number_stairs: userData.number_stairs || "",
        description: userData.description || "",
        tip: userData.tip || "",
        privacy: userData.privacy || "",
        rentType: userData.rentType || "House",
        price_handle_by: userData.price_handle_by || "PerNight",
      });
    }
  }, [userData]);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (loadingUser || loadingHouseFloors || loadingPrivacyOptions) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-auto scrollbar-thin pt-2 px-2 lg:px-4 w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TextField
            label="نام اقامتگاه"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="نام اقامتگاه"
          />

          <TextField
            label="متراژ کل"
            name="land_size"
            value={formData.land_size}
            onChange={(e) => handleInputChange("land_size", e.target.value)}
            placeholder="متراژ کل به متر مربع"
          />

          <TextField
            label="متراژ زیر بنا"
            name="structure_size"
            value={formData.structure_size}
            onChange={(e) => handleInputChange("structure_size", e.target.value)}
            placeholder="متراژ زیر بنا به متر مربع"
          />

          <TextField
            label="تعداد پله"
            name="number_stairs"
            value={formData.number_stairs}
            onChange={(e) => handleInputChange("number_stairs", e.target.value)}
            placeholder="تعداد پله"
          />

          <div className="mt-4 lg:col-span-2">
            <TextArea
              label="درباره اقامتگاه"
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="امکاناتی که میخواهید به مهمانان نمایش داده شود را بنویسید"
            />
          </div>

          <FormSelect
            label="تیپ سازه"
            name="tip"
            value={formData.tip}
            onChange={(e) => handleInputChange("tip", e.target.value)}
            options={
              loadingHouseFloors
                ? [{ value: "", label: "در حال بارگذاری..." }]
                : [{ value: "", label: "انتخاب نوع" }, ...houseFloorOptions.map((option) => ({
                    value: option.key,
                    label: option.label,
                  }))]
            }
          />

          <FormSelect
            label="وضعیت حریم"
            name="privacy"
            value={formData.privacy}
            onChange={(e) => handleInputChange("privacy", e.target.value)}
            options={
              loadingPrivacyOptions
                ? [{ value: "", label: "در حال بارگذاری..." }]
                : [{ value: "", label: "انتخاب حریم" }, ...privacyOptions.map((option) => ({
                    value: option.key,
                    label: option.label,
                  }))]
            }
          />

          {/* Rent Type ToggleSwitches */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">اجاره بر اساس</label>
            <div className="flex space-x-4">
              {rentTypeOptions.map((option) => (
                <ToggleSwitch
                  key={option.key}
                  checked={formData.rentType === option.key}
                  onChange={() => handleInputChange("rentType", option.key)}
                  label={option.label}
                />
              ))}
            </div>
          </div>

          {/* Price Handle ToggleSwitches */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">قیمت گذاری بر اساس</label>
            <div className="flex space-x-4">
              {priceHandleOptions.map((option) => (
                <ToggleSwitch
                  key={option.key}
                  checked={formData.price_handle_by === option.key}
                  onChange={() => handleInputChange("price_handle_by", option.key)}
                  label={option.label}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 w-full lg:col-span-2 flex justify-end">
            <button
              className="btn bg-primary-600 text-white px-3 py-1.6 shadow-xl hover:bg-primary-800 transition-colors duration-200"
              onClick={() => {}}
            >
              ثبت اطلاعات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHouseGeneralInfo;
