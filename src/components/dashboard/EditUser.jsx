import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jalaali from "jalaali-js";
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

// Gender options with labels and values
const genderOptions = [
  { key: 'Male', label: 'مرد' },
  { key: 'Female', label: 'زن' },
  { key: 'Other', label: 'دیگر' }
];

// Mapping from Persian labels to internal keys
const genderMap = {
  'مرد': 'Male',
  'زن': 'Female',
  'دیگر': 'Other'
};

// Reverse mapping from internal keys to Persian labels
const reverseGenderMap = {
  'Male': 'مرد',
  'Female': 'زن',
  'Other': 'دیگر'
};

// Convert Persian date to Gregorian date (YYYY-MM-DD)
const persianToGregorian = (persianDate) => {
  if (!persianDate) return "";
  const [year, month, day] = persianDate.split('/');
  const gregorianDate = jalaali.toGregorian(parseInt(year), parseInt(month), parseInt(day));
  return `${gregorianDate.gy}-${String(gregorianDate.gm).padStart(2, '0')}-${String(gregorianDate.gd).padStart(2, '0')}`;
};

// Convert Gregorian date to Persian date (YYYY/MM/DD)
const gregorianToPersian = (gregorianDate) => {
  if (!gregorianDate) return "";
  const [year, month, day] = gregorianDate.split('-');
  const persianDate = jalaali.toJalaali(parseInt(year), parseInt(month), parseInt(day));
  return `${persianDate.jy}/${String(persianDate.jm).padStart(2, '0')}/${String(persianDate.jd).padStart(2, '0')}`;
};

const EditUser = ({ user, token, onUpdate, onEditStart, onEditEnd }) => {
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [nationalCode, setNationalCode] = useState(user.national_code || "");
  const [email, setEmail] = useState(user.email || "");
  const [birthDate, setBirthDate] = useState(gregorianToPersian(user.birth_date) || "");
  const [gender, setGender] = useState(genderMap[user.sex] || "Male");
  const [secondPhone, setSecondPhone] = useState(user.second_phone || ""); // Added state for second phone
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  useEffect(() => {
    // Update state when user prop changes
    setFirstName(user.first_name || "");
    setLastName(user.last_name || "");
    setNationalCode(user.national_code || "");
    setEmail(user.email || "");
    setBirthDate(gregorianToPersian(user.birth_date) || "");
    setGender(genderMap[user.sex] || "Male");
    setSecondPhone(user.second_phone || ""); // Added update for second phone
  }, [user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onEditStart(); // Notify Dashboard to show spinner

    try {
      const response = await axios.put("http://portal1.jatajar.com/api/client/profile", {
        first_name: firstName,
        last_name: lastName,
        national_code: nationalCode,
        email,
        birth_date: persianToGregorian(birthDate),
        sex: gender, // Send the internal value directly
        second_phone: secondPhone 
      }, {
        headers: {
          'Authorization': `Bearer ${token}`, // Bearer Token
          'Content-Type': 'application/json',
        }
      });
      
      console.log("API response:", response.data);
     
      // Call the onUpdate function to refetch data
      onUpdate();
      setErrorMessage(""); // Clear error message on successful request
    } catch (error) {
      console.error("Error during profile update:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
        setErrorMessage(error.response.data.message || "An unexpected error occurred.");
        toast.error(error.response.data.message || "An unexpected error occurred.");
      } else {
        setErrorMessage("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
      onEditEnd(); // Notify Dashboard to hide spinner
    }
  };

  return (
    <form onSubmit={handleEditSubmit} className="flex flex-col items-end p-1.5">
      <div className="opacity-90 text-lg font-bold mb-5 self-start">ویرایش پروفایل</div>
      <div className="grid grid-cols-2 gap-5 w-full">
        <div className="mb-4 flex items-center">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 w-1/5">
            نام:
          </label>
          <input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="نام"
            disabled={loading}
            className="mt-1 border rounded-lg py-2 px-3 outline-none"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 w-1/5">
            نام خانوادگی:
          </label>
          <input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="نام خانوادگی"
            disabled={loading}
            className="mt-1 border rounded-lg py-2 px-3 outline-none"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label htmlFor="nationalCode" className="block text-sm font-medium text-gray-700 w-1/5">
            کد ملی:
          </label>
          <input
            id="nationalCode"
            value={nationalCode}
            onChange={(e) => setNationalCode(e.target.value)}
            placeholder="کد ملی"
            disabled={loading}
            className="mt-1 border rounded-lg py-2 px-3 outline-none"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 w-1/5">
            ایمیل:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل"
            disabled={loading}
            className="mt-1 border rounded-lg py-2 px-3 outline-none"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 w-1/5">
            تاریخ تولد:
          </label>
          <input
            id="birthDate"
            type="text"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            placeholder="1364/03/25"
            disabled={loading}
            className="mt-1 border rounded-lg py-2 px-3 outline-none"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label className="block text-sm font-medium text-gray-700 w-1/5">جنسیت:</label>
          <div className="w-full">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  {reverseGenderMap[gender] || "مرد"}
                  <ChevronDownIcon className="mr-1 mt-0.5 h-4 w-4" aria-hidden="true" />
                </Menu.Button>
              </div>
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-900/10 focus:outline-none">
                <div className="p-1">
                  {genderOptions.map((option) => (
                    <Menu.Item key={option.key}>
                      {({ active }) => (
                        <button
                          onClick={() => setGender(option.key)}
                          className={`group flex rounded-md items-center w-full p-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                        >
                          {option.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <label htmlFor="secondPhone" className="block text-sm font-medium text-gray-700 w-1/5">
            شماره تلفن دوم:
          </label>
          <input
            id="secondPhone"
            type="text"
            value={secondPhone}
            onChange={(e) => setSecondPhone(e.target.value)}
            placeholder="0910000000"
            disabled={loading}
            className="mt-1 border rounded-lg py-2 px-3 outline-none"
          />
        </div>
      </div>

      <div className="text-center mt-5 w-full mb-3 flex flex-col items-center">
        {errorMessage && (
          <p className="text-red-500 mb-3">{errorMessage}</p>
        )}
        <button
          className={`bg-green-500 font-bold hover:bg-green-600 transition-all text-lg duration-300 text-white rounded-2xl px-12 py-3 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? 'در حال ارسال...' : 'ثبت'}
        </button>
      </div>
    </form>
  );
};

export default EditUser;
