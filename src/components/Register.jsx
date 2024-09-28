import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import logo from "../assets/jatajarlogo.webp";
import { Helmet } from "react-helmet-async";
import toast, { Toaster } from "react-hot-toast";
import Spinner from './Spinner'; // Import Spinner component

const API_BASE_URL = "https://portal1.jatajar.com/api/auth";

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
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone;
  const hasAccount = location.state?.hasAccount;

  // Extract token from URL if present
  let token = new URLSearchParams(location.search).get('token');
  if (token) {
    token = token.replace(/=+$/, '');
  }

  useEffect(() => {
    if (token) {
      setLoading(true); // Show spinner immediately
      // Send the token in the body of the POST request
      axios.post(`${API_BASE_URL}/login/token`, { token })
        .then(response => {
          const { token: userToken, user } = response.data.data;
          // Save user token and user data to local storage under different keys
          localStorage.setItem('userToken', userToken);
          localStorage.setItem('userData', JSON.stringify(user));

          // Navigate to dashboard with token and user data
          navigate('/dashboard', { state: { token: userToken, user },replace:false });
        })
        .catch(error => {
          console.error('Login with token failed:', error);
          toast.error('Login with token failed. Please check the token or contact support.');
          navigate('/login', {replace:false});
        })
        .finally(() => setLoading(false)); // Hide spinner when done
    }
  }, [token, navigate]);

  useEffect(() => {
    if (otp.length === 4) {
      handleOtpSubmit();
    }
  }, [otp]);

  const handleOtpChange = (value) => {
    // Ensure only numeric values are allowed
    if (/^\d*$/.test(value)) {
      setOtp(value);
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true);

    console.log("Submitting form with data:", {
      phone,
      code: otp,
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
          code: otp,
        });
      } else {
        response = await axios.post(`${API_BASE_URL}/register`, {
          phone,
          code: otp,
          first_name: firstName,
          last_name: lastName,
          national_code: nationalCode,
        });
      }

      console.log("API response:", response);

      // Pass token and user data to Dashboard
      toast.success("ورود موفقیت آمیز بود");
      navigate("/dashboard", { state: { userData: response.data, token: response.data.data.token } });
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
        toast.error(
          error.response.data.message || "متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید"
        );
      } else {
        toast.error("متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100vh] flex items-center justify-center">
        <Spinner /> {/* Show spinner */}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{hasAccount ? "ورود" : "ثبت نام"}</title>
      </Helmet>
      <Toaster />
      <div className="flex justify-center items-center text-right h-screen w-80 sm:w-96 mx-auto">
        <div className="rounded-2xl p-8 bg-gray-50 shadow-sm">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-2">
              <a href="./index.html">
                <img src={logo} alt="Logo" className="max-w-40 mx-auto" />
              </a>
            </div>
            <div className="opacity-90 text-lg font-bold mb-5">
              {hasAccount ? "ورود" : "ثبت نام"}
            </div>
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
            <div className="text-sm my-4 mt-7 w-full flex flex-col items-center">
              <p className="self-start mb-3">لطفا کد تایید خود را وارد کنید :</p>
              <div style={{ direction: 'ltr' }}>
                <OtpInput
                  value={otp}
                  onChange={handleOtpChange}
                  numInputs={4}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="otp-input"
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        margin: "0 0.8rem",
                        fontSize: "1rem",
                        borderRadius: "12px",
                        border: "1px solid #ced4da",
                        textAlign: 'center',
                        outline: "none"
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="text-center mt-5 mb-3">
              <button
                className={`bg-green-500 font-bold hover:bg-green-600 transition-all duration-300 text-white rounded-2xl w-full py-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={loading}
                onClick={handleOtpSubmit}
              >
                {loading ? "در حال ارسال..." : hasAccount ? "ورود" : "ارسال"}
              </button>
            </div>
            <div className="text-xs opacity-80 leading-normal">
              ورود شما به منظور پذیرش قوانین و مقررات جات آجار می باشد.
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
