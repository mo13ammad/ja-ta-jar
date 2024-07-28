import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.webp";
import { Helmet } from "react-helmet-async";

const Authenticated = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login with password:", password);
    try {
      const response = await axios.post(
        "http://jatajar.viraup.com/auth/login",
        {
          phoneNumber,
          password,
        }
      );
      console.log("Response from server:", response);
      setMessage("Login successful!");
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Error logging in.");
    }
  };

  return (
    <>
      <Helmet>
        <title>ورود</title>
      </Helmet>
      <div className="flex justify-center items-center text-right h-screen w-80 sm:w-96 mx-auto">
        <div className="rounded-2xl p-8 bg-gray-100">
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-2">
              <a href="./index.html">
                <img src={logo} alt="Logo" className="w-22 mx-auto" />
              </a>
            </div>
            <div className="opacity-90 text-lg font-bold mb-5">ورود</div>
            <div className="text-sm mb-4">رمز عبور خود را وارد کنید:</div>
            <div className="mb-2">
              <input
                className="w-full drop-shadow-lg outline-none rounded-2xl py-2 text-center"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
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

export default Authenticated;
