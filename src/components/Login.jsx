import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.webp";
import { Helmet } from "react-helmet-async";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with phone number:", phoneNumber);
    try {
      const response = await axios.post("YOUR_BACKEND_ENDPOINT", {
        phoneNumber,
      });
      console.log("Response from server:", response);
      setMessage("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Error sending OTP.");
    }
  };

  return (
    <>
      <Helmet>
        <title>ورود</title>
      </Helmet>
      <div className="flex  justify-center items-center text-right h-screen w-80 sm:w-96 mx-auto">
        <div className="rounded-2xl p-8 bg-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <a href="./index.html">
                <img src={logo} alt="Logo" className="w-22 mx-auto" />
              </a>
            </div>
            <div className="opacity-90 text-lg font-bold mb-5">ورود</div>
            <div className="text-sm mb-4"> شماره همراه خود را وارد کنید :</div>
            <div className="mb-2">
              <input
                className="w-full text-left drop-shadow-lg outline-none rounded-2xl py-2 text-center"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="1245 345 912"
              />
            </div>
            <div className="text-center mt-5 mb-3">
              <button
                className="bg-green-500 font-bold hover:bg-green-600 transition-all duration-300 text-white opacity-80 rounded-2xl w-full py-2"
                type="submit"
              >
                ورود
              </button>
            </div>
            <div className="text-xs opacity-80 leading-normal">
              ثبت نام یا ورود شما به منظور پذیرش
              <a href="#" className="text-red-500 ml-1 mr-1">
                قوانین و مقررات
              </a>
              جات آجار می باشد.
            </div>

            {message && (
              <div className="text-center mt-4 text-red-500">{message}</div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
