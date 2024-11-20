// src/features/authentication/CheckOTPForm.jsx

import React, { useEffect, useState } from 'react';
import TextField from '../../ui/TextField';
import Loading from '../../ui/Loading';
import logo from "../../../public/assets/jatajarlogo.webp";
import OtpInput from "react-otp-input";
import { useMutation } from '@tanstack/react-query';
import { checkOtp, register, loginWithToken } from '../../services/authService'; // Import loginWithToken
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { HiArrowRight } from 'react-icons/hi';

const RESEND_TIME = 120;

// Helper function to store the token in cookies
const setAuthTokenInCookie = (token, expiryDays = 30) => {
  const now = new Date();
  now.setTime(now.getTime() + expiryDays * 24 * 60 * 60 * 1000); // Set expiry time
  const expires = `expires=${now.toUTCString()}`;
  document.cookie = `authToken=${token}; ${expires}; path=/; Secure; SameSite=Strict`; // Store in cookie
};

function CheckOTPForm({ userStatus, phone, onBack, onResendOtp }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [IDNumber, setIDNumber] = useState("");
  const [time, setTime] = useState(RESEND_TIME); // Countdown timer
  const [fieldErrors, setFieldErrors] = useState({}); // Holds validation errors
  const [isTokenLogin, setIsTokenLogin] = useState(false); // Tracks if token login is in progress
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Extract token from URL parameters
  const queryParams = new URLSearchParams(location.search);
  let tokenFromUrl = queryParams.get('token');
  if (tokenFromUrl) {
    tokenFromUrl = tokenFromUrl.replace(/=+$/, '');
  }

  // Mutation for token-based login
  const loginWithTokenMutation = useMutation({
    mutationFn: loginWithToken,
    onSuccess: (data) => {
      setAuthTokenInCookie(data.token); // Store the token in cookies
      navigate("/dashboard", { replace: true }); // Redirect to dashboard
    },
    onError: (error) => {
      console.error('Login with token failed:', error);
      toast.error('ورود با توکن ناموفق بود. لطفاً مجدداً تلاش کنید یا با پشتیبانی تماس بگیرید.');
      setIsTokenLogin(false); // Allow user to proceed with OTP form
    },
    onSettled: () => {
      setIsLoading(false); // Stop loading spinner
    },
  });

  // Mutation for OTP or registration
  const otpMutation = useMutation({
    mutationFn: userStatus ? checkOtp : register,
    onError: (error) => {
      console.log("Error response from server:", error.response);
      if (error.response && error.response.data && error.response.data.errors) {
        setFieldErrors(error.response.data.errors.fields || {});
      }
    },
    onSuccess: (data) => {
      // Store the token in cookie
      setAuthTokenInCookie(data.token);
      navigate("/dashboard", { replace: true });
    },
  });

  // Effect to handle token-based login
  useEffect(() => {
    if (tokenFromUrl) {
      setIsLoading(true);
      setIsTokenLogin(true);
      loginWithTokenMutation.mutate({ token: tokenFromUrl }); // Trigger the mutation
    }
  }, [tokenFromUrl]);

  const checkOtpHandler = async () => {
    try {
      const payload = { code: otp, phone };

      if (!userStatus) {
        payload.first_name = firstName;
        payload.last_name = familyName;
        payload.national_code = IDNumber;
      }

      console.log("Sending payload:", payload);

      await otpMutation.mutateAsync(payload);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error?.response?.data?.message || 'خطایی در ارسال کد تایید پیش آمده! لطفا دوباره امتحان کنید');
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (isTokenLogin) return; // Don't run the timer if logging in with token
    const timer = time > 0 && setInterval(() => setTime((t) => t - 1), 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [time, isTokenLogin]);

  // Automatically trigger the OTP submission when 4 digits are entered
  useEffect(() => {
    if (otp.length === 4) {
      console.log("OTP length is 4, submitting form...");
      checkOtpHandler();
    }
  }, [otp]);

  const handleOtpChange = (value) => {
    // Ensure only numeric values are allowed
    if (/^\d*$/.test(value)) {
      setOtp(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkOtpHandler();
  };

  const resendOtpHandler = () => {
    console.log("Resending OTP...");
    onResendOtp();
    setTime(RESEND_TIME); // Reset timer
  };

  return (
    <>
      {isLoading ? (
        <div className="min-h-[90vh] container md:max-w-md  flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="rounded-2xl p-8 bg-gray-100 shadow-sm">
          <button onClick={() => onBack(1)}>
            <HiArrowRight className='w-6 h-6 text-primary-700' />
          </button>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className="mb-2">
              <img src={logo} alt="Logo" className="max-w-40 mx-auto rounded-3xl" />
            </div>
            <p className="opacity-90 text-xl font-bold mb-5">{userStatus ? "ورود" : "ثبت نام"}</p>

            {/* Registration form fields (only shown for new users) */}
            {!userStatus && (
              <div className='flex flex-col gap-4'>
                <TextField
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="نام خود را وارد کنید"
                  label="نام"
                />
                {fieldErrors.first_name && (
                  <p className="text-red-500 text-sm">{fieldErrors.first_name[0]}</p>
                )}
                <TextField
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="نام خانوادگی خود را وارد کنید"
                  label="نام خانوادگی"
                />
                {fieldErrors.last_name && (
                  <p className="text-red-500 text-sm">{fieldErrors.last_name[0]}</p>
                )}
                <TextField
                  value={IDNumber}
                  onChange={(e) => setIDNumber(e.target.value)}
                  placeholder="شماره ملی خود را وارد کنید"
                  label="شماره ملی"
                />
                {fieldErrors.national_code && (
                  <p className="text-red-500 text-sm">{fieldErrors.national_code[0]}</p>
                )}
              </div>
            )}

            {/* OTP Input */}
            {!isTokenLogin && (
              <>
                <label htmlFor="otp" className='font-bold'>کد تایید :</label>
                <div className='flex justify-center' style={{ direction: 'ltr' }}>
                  <OtpInput
                    id="otp"
                    value={otp}
                    onChange={handleOtpChange}
                    numInputs={4}
                    renderInput={(props) => (
                      <input
                        {...props}
                        className="otp-input"
                        type='number'
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

                <div className="text-center mt-5 mb-3">
                  {otpMutation.isLoading ? <Loading /> : (
                    <button className="btn hover:bg-primary-700 bg-primary-600 w-full" type="submit">
                      {userStatus ? "ورود" : "ثبت نام"}
                    </button>
                  )}
                  {time > 0 ? (
                    <p className='text-primary-600 mt-1.5'>{time} ثانیه تا ارسال مجدد کد</p>
                  ) : (
                    <button onClick={resendOtpHandler} className="btn mt-2 hover:bg-primary-700 bg-primary-600 w-full">
                      ارسال مجدد کد
                    </button>
                  )}
                </div>

                {otpMutation.isError && <p className="text-red-500">{otpMutation.error?.response?.data?.message}</p>}

                <p className="text-xs opacity-80 leading-normal">
                  ثبت نام یا ورود شما به معنی پذیرش قوانین جات اجار می‌باشد
                </p>
              </>
            )}
          </form>
        </div>
      )}
    </>
  );
}

export default CheckOTPForm;
