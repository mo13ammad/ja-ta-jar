import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.webp";
import { Helmet } from "react-helmet-async";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = "http://jatajar.com/api/auth";

const InputField = ({ id, value, onChange, placeholder, disabled }) => (
  <div className="mb-2">
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    <input
      id={id}
      className="w-full rounded-2xl py-2 text-center shadow-lg outline-none"
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

const Register = () => {
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone;
  const hasAccount = location.state?.hasAccount;

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Submitting form with data:", {
      phone,
      code,
      firstName,
      lastName,
      nationalCode,
      hasAccount,
    });

    try {
      let response;
      if (hasAccount) {
        response = await axios.post(`${API_BASE_URL}/login`, {
          phone,
          code,
        });
      } else {
        response = await axios.post(`${API_BASE_URL}/register`, {
          phone,
          code,
          first_name: firstName,
          last_name: lastName,
          national_code: nationalCode,
        });
      }

      console.log("API response:", response);

      toast.success("Registration successful!");
      navigate("/dashboard", { state: { userData: response.data } });
    } catch (error) {
      console.error("Error during registration:", error);
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
    <>
      <Helmet>
        <title>ثبت نام</title>
      </Helmet>
      <Toaster />
      <div className="flex justify-center items-center text-right h-screen w-80 sm:w-96 mx-auto">
        <div className="rounded-2xl p-8 bg-gray-50 shadow-sm">
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-2">
              <a href="./index.html">
                <img src={logo} alt="Logo" className="w-22 mx-auto" />
              </a>
            </div>
            <div className="opacity-90 text-lg font-bold mb-5">ثبت نام</div>
            {loading}

            {!hasAccount && (
              <>
                <div className="text-sm my-4 mt-7">نام:</div>
                <InputField
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="نام"
                  disabled={loading}
                />
                <div className="text-sm my-4 mt-7">نام خانوادگی:</div>
                <InputField
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="نام خانوادگی"
                  disabled={loading}
                />
                <div className="text-sm my-4 mt-7">شماره ملی:</div>
                <InputField
                  id="nationalCode"
                  value={nationalCode}
                  onChange={(e) => setNationalCode(e.target.value)}
                  placeholder="شماره ملی"
                  disabled={loading}
                />
              </>
            )}
            <div className="text-sm my-4 mt-7">کد تایید را وارد کنید:</div>
            <InputField
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              disabled={loading}
            />
            <div className="text-center mt-5 mb-3">
              <button
                className={`bg-green-500 font-bold hover:bg-green-600 transition-all duration-300 text-white rounded-2xl w-full py-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={loading}
              >
                {loading ? "در حال ارسال..." : "ارسال"}
              </button>
            </div>
            <div className="text-xs opacity-80 leading-normal">
              ثبت نام یا ورود شما به منظور پذیرش
              <a href="#" className="text-red-500 ml-1 mr-1">
                قوانین و مقررات
              </a>
              جات آجار می باشد.
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
