import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/jatajarlogo.webp";
import toast from "react-hot-toast";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Sending request with phone number:", phone); // Debugging line
      const response = await axios.post(
        "https://portal1.jatajar.com/api/auth/authenticate",
        { phone }
      );

      console.log("Response from server:", response); // Debugging line
      
      const hasAccount = response.data.data.has_account;
      if (hasAccount) {
        navigate("/register", { state: { phone, hasAccount },replace:false  });
      } else {
        navigate("/register", { state: { phone, hasAccount },replace:false  });
      } 
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error.response) {
        errorMessage = error.response.data?.message || "Error from server";
      } else if (error.request) {
        errorMessage = "No response received from server";
      }
      console.error(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center text-right h-screen w-80 sm:w-96 mx-auto">
      <div className="rounded-2xl p-8 bg-gray-50 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <a href="/">
              <img src={logo} alt="Logo" className="max-w-40 mx-auto" />
            </a>
          </div>
          <div className="opacity-90 text-lg font-bold mb-5">ورود</div>
          <div className="text-sm mb-4">شماره همراه خود را وارد کنید :</div>
          <div className="mb-2">
            <input
              className="w-full drop-shadow-lg outline-none rounded-2xl py-2 text-center"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="******0912"
              disabled={loading}
            />
          </div>
          <div className="text-center mt-5 mb-3">
            <button
              className={`bg-green-500 font-bold hover:bg-green-600 transition-all duration-300 text-white opacity-80 rounded-2xl w-full py-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "در حال ارسال..." : "ورود"}
            </button>
          </div>
          <div className="text-xs opacity-80 leading-normal">
            ثبت نام یا ورود شما به منظور پذیرش
           
              قوانین و مقررات
            
            جات آجار می باشد.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
