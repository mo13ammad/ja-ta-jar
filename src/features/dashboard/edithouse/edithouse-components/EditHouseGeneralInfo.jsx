import React from "react";
import { Listbox } from "@headlessui/react";
import Spinner from "../../../../ui/Loading";
import TextField from "../../../../ui/TextField";
import RadioInput from "../../../../ui/RadioInput";

const EditHouseGeneralInfo = ({
    formData = {}, // Provide default value for formData
  handleInputChange,
  houseFloorOptions = [], // Provide default value for houseFloorOptions
  privacyOptions = [], // Provide default value for privacyOptions
  priceHandleOptions = [], // Provide default value for priceHandleOptions
  toggleRentType,
  togglePriceHandleBy,
  loading,
  loadingSubmit,
  handleSubmit,
}) => {
  return (
    <div className="relative">
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-auto scrollbar-thin max-h-[70vh] pr-2 w-full min-h-[70vh]">
          {/* Static Header */}
          <div className="text-center font-bold text-xl my-4">
            اطلاعات کلی اقامتگاه
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Name Input */}
            <TextField
              label="نام اقامتگاه"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="نام اقامتگاه"
            />

            {/* Land Size Input */}
            <TextField
              label="متراژ کل"
              name="land_size"
              value={formData.land_size}
              onChange={(e) => handleInputChange("land_size", e.target.value)}
              placeholder="متراژ کل به متر مربع"
            />

            {/* Structure Size Input */}
            <TextField
              label="متراژ زیر بنا"
              name="structure_size"
              value={formData.structure_size}
              onChange={(e) => handleInputChange("structure_size", e.target.value)}
              placeholder="متراژ زیر بنا به متر مربع"
            />

            {/* Number of Stairs Input */}
            <TextField
              label="تعداد پله"
              name="number_stairs"
              value={formData.number_stairs}
              onChange={(e) => handleInputChange("number_stairs", e.target.value)}
              placeholder="تعداد پله"
            />

            {/* Description Input */}
            <div className="mt-4 lg:col-span-2">
              <TextField
                label="درباره اقامتگاه"
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="امکاناتی که میخواهید به مهمانان نمایش داده شود را بنویسید"
              />
            </div>

            {/* Static Divider */}
            <div className="lg:col-span-2 mt-4">
              <hr className="border-gray-300 my-4" />
            </div>

            {/* Static Section Header */}
            <div className="lg:col-span-2 text-lg font-bold mb-2">
              تنظیمات نوع اقامتگاه و قیمت گذاری
            </div>

            {/* Tip (House Floor Type) Dropdown */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">تیپ سازه</label>
              <Listbox value={formData.tip} onChange={(value) => handleInputChange("tip", value)}>
                {({ open }) => (
                  <div className="relative">
                    <Listbox.Button className="block p-2 border rounded-xl w-full text-left flex justify-between items-center">
                      {houseFloorOptions.find((option) => option.key === formData.tip)?.label || "انتخاب نوع"}
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
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
                        className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
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

            {/* Rent Type Radio Buttons */}
            <div className="mt-4 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">اجاره بر اساس</label>
              <div className="grid grid-cols-2 gap-4">
                <RadioInput
                  label="اقامتگاه"
                  value="House"
                  name="rentType"
                  id="rent-house"
                  onChange={() => toggleRentType("House")}
                />
                <RadioInput
                  label="اتاق"
                  value="Rooms"
                  name="rentType"
                  id="rent-rooms"
                  onChange={() => toggleRentType("Rooms")}
                />
              </div>
            </div>

            {/* Price Handle By Radio Buttons */}
            <div className="mt-4 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">قیمت گذاری بر اساس</label>
              <div className="grid grid-cols-2 gap-4">
                {priceHandleOptions.map((option) => (
                  <RadioInput
                    key={option.key}
                    label={option.label}
                    value={option.key}
                    name="price_handle_by"
                    id={option.key}
                    onChange={() => togglePriceHandleBy(option.key)}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button with Static Info */}
            <div className="mt-4">
              <div className="mb-2 text-sm text-gray-600">
                <span className="font-bold">توجه:</span> قبل از ثبت، مطمئن شوید که تمام اطلاعات به درستی وارد شده است.
              </div>
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

export default EditHouseGeneralInfo;
