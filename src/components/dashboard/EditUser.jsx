import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditUser = ({ user }) => {
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [nationalCode, setNationalCode] = useState(user.national_code || "");
  const [email, setEmail] = useState(user.email || "");
  const [birthDate, setBirthDate] = useState(user.birth_date || "");
  const [gender, setGender] = useState(user.sex || "male");
  const [loading, setLoading] = useState(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put("http://jatajar.com/api/client/profile", {
        first_name: firstName,
        last_name: lastName,
        national_code: nationalCode,
        email,
        birth_date: birthDate,
        sex: gender,
      }, {
        headers: {
          'Authorization': `Bearer ZldcMuDu9PPwtCmeAS3VgoDhgkyAl8z2kx3iyQws14db1511`, // Bearer Token
          'Content-Type': 'application/json',
        }
      });
      toast.success("Profile updated successfully!");
      console.log("API response:", response.data);
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
            شماره ملی:
          </label>
          <input
            id="nationalCode"
            value={nationalCode}
            onChange={(e) => setNationalCode(e.target.value)}
            placeholder="شماره ملی"
            disabled={loading}
            className="mt-1 border rounded-lg py-2 px-3 outline-none"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 w-1/5">
            ایمیل :
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل"
            disabled={loading}
            className="mt-1 border rounded-lg py-2 px-3 outline-none"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 w-1/5">
            تاریخ تولد :
          </label>
          <input
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            placeholder="1376/11/04"
            disabled={loading}
            className="mt-1 border rounded-lg py-2 px-3 outline-none"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label className="block text-sm font-medium text-gray-700 w-1/5">
            جنسیت :
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
                disabled={loading}
                className="form-radio"
              />
              <span className="px-2 ml-4">مرد</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
                disabled={loading}
                className="form-radio"
              />
              <span className="px-2">زن</span>
            </label>
          </div>
        </div>
      </div>
      <div className="text-center mt-5 mb-3">
        <button
          className={`bg-green-500 font-bold hover:bg-green-600 transition-all text-lg duration-300 text-white rounded-2xl ml-52 px-16 py-4 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? "در حال ارسال..." : "ارسال"}
        </button>
      </div>
    </form>
  );
};

export default EditUser;
