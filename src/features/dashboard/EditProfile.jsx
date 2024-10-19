import React from "react";

function EditProfile() {
  return (
    <div className="relative">
      {/* Form Layout */}
      <form className="flex flex-col md:grid grid-cols-2 gap-6 p-1.5">
        {/* Name */}
        <FormInput label="نام" placeholder="نام" />

        {/* Family Name */}
        <FormInput label="نام خانوادگی" placeholder="نام خانوادگی" />

        {/* National Code */}
        <FormInput label="کد ملی" placeholder="کد ملی" />

        {/* Email */}
        <FormInput label="ایمیل" type="email" placeholder="ایمیل" />

        {/* Province */}
        <FormSelect label="استان" placeholder="انتخاب استان" options={["استان 1", "استان 2", "استان 3"]} />

        {/* City */}
        <FormSelect label="شهر" placeholder="انتخاب شهر" options={["شهر 1", "شهر 2", "شهر 3"]} />

        {/* Birth Date */}
        <BirthDateFields />

        {/* Gender */}
        <FormSelect label="جنسیت" placeholder="انتخاب جنسیت" options={["مرد", "زن", "دیگر"]} />

        {/* Second Phone */}
        <FormInput label="شماره دوم" placeholder="شماره دوم" />

        {/* Profile Picture */}
        <FormFileInput label="عکس پروفایل" />

        {/* Biography */}
        <FormTextArea label="درباره شما" placeholder="درباره شما" />

        {/* Submit Button */}
        <SubmitButton label="ذخیره اطلاعات" />
      </form>
    </div>
  );
}

// Reusable Form Input Component
const FormInput = ({ label, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="mt-1 p-2 border rounded-xl w-full"
    />
  </div>
);

// Reusable Form Select Component
const FormSelect = ({ label, placeholder, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative w-full">
      <select className="block p-2 border rounded-xl w-full text-left flex justify-between items-center">
        <option>{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  </div>
);

// Birth Date Component with Day/Month/Year Inputs
const BirthDateFields = () => (
  <div className="flex flex-col gap-2">
    <label className="block text-sm font-medium text-gray-700">تاریخ تولد</label>
    <div className="flex gap-2">
      <FormInput placeholder="روز" />
      <FormInput placeholder="ماه" />
      <FormInput placeholder="سال" />
    </div>
  </div>
);

// File Input Component for Profile Picture
const FormFileInput = ({ label }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input type="file" className="mt-1 p-2 border rounded-xl w-full" accept="image/*" />
  </div>
);

// Text Area Component for Biography
const FormTextArea = ({ label, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      className="mt-1 p-2 border rounded-xl w-full"
      placeholder={placeholder}
      rows="4"
    />
  </div>
);

// Submit Button Component
const SubmitButton = ({ label }) => (
  <button
    type="button"
    className="max-w-44 max-h-12 mt-6 py-2 md:py-0 px-2 bg-green-600 text-white rounded-lg"
  >
    {label}
  </button>
);

export default EditProfile;
