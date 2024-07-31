import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Gender options with labels
const genderOptions = [
  { key: 'Male', label: 'مرد' },
  { key: 'Female', label: 'زن' }
];

// Format date from YYYY-MM-DD to YYYY/MM/DD
const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${year}/${parseInt(month, 10)}/${parseInt(day, 10)}`;
};

// Parse date from YYYY/MM/DD to YYYY-MM-DD
const parseDateForSubmission = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split('/');
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const EditUser = ({ user, token, onUpdate, onEditStart, onEditEnd }) => {
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [nationalCode, setNationalCode] = useState(user.national_code || "");
  const [email, setEmail] = useState(user.email || "");
  const [birthDate, setBirthDate] = useState(formatDateForDisplay(user.birth_date) || "");
  const [gender, setGender] = useState(user.sex || "Male");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update state when user prop changes
    setFirstName(user.first_name || "");
    setLastName(user.last_name || "");
    setNationalCode(user.national_code || "");
    setEmail(user.email || "");
    setBirthDate(formatDateForDisplay(user.birth_date) || "");
    setGender(user.sex || "Male");
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
        birth_date: parseDateForSubmission(birthDate),
        sex: gender
      }, {

        headers: {
          'Authorization': `Bearer ${token}`, // Bearer Token
          'Content-Type': 'application/json',
        }

      });
      
      console.log("API response:", response.data);
     
      // Call the onUpdate function to refetch data
      onUpdate();
    } catch (error) {
      console.error("Error during profile update:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
        toast.error(
          error.response.data.message || "An unexpected error occurred."
        );
      } else {
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
            placeholder="تاریخ تولد (YYYY/MM/DD)"
            disabled={loading}
            className="mt-1 border rounded-lg py-2 px-3 outline-none"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label className="block text-sm font-medium text-gray-700 w-1/5">جنسیت:</label>
          <div className="flex items-center">
            {genderOptions.map((option) => (
              <label key={option.key} className="flex items-center ml-4">
                <input
                  type="radio"
                  name="gender"
                  value={option.key}
                  checked={gender === option.key}
                  onChange={() => setGender(option.key)}
                  disabled={loading}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

      </div>
      <div className="text-center  mt-5 w-1/2 mb-3">
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
