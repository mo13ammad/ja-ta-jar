import React, { useState } from 'react';
import SendOTPForm from './SendOTPForm';
import CheckOTPForm from './CheckOTPForm';
import { useMutation } from '@tanstack/react-query';
import { getOtp } from '../../services/authService';
import toast from 'react-hot-toast';

function AuthContainer() {
  const [step, setStep] = useState(1);
  const [userStatus, setUserStatus] = useState(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);

  // Mutation to send OTP
  const { isError, isPending, mutateAsync } = useMutation({
    mutationFn: getOtp,
    onSuccess: (data) => {
      console.log("Response from server:", data);
      toast.success("کد تایید برای شما ارسال گردید");
      setUserStatus(data.has_account); // Save user status (has_account)
      setStep(2); // Move to the OTP verification step
    },
    onError: (error) => {
      setError(error?.response?.data?.message || 'خطایی در ارسال کد تایید پیش آمده!');
      toast.error(error?.response?.data?.message || 'خطایی در ارسال کد تایید پیش آمده! لطفا دوباره امتحان کنید');
    },
  });

  // Handler for sending OTP
  const sendOtpHandler = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault(); // Ensure preventDefault only runs if an event is passed
    }
    if (!phone) {
      toast.error("لطفا شماره موبایل صحیح را وارد کنید");
      return;
    }
    console.log("Sending request with phone number:", phone);
    await mutateAsync({ phone });
  };
  

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SendOTPForm
            phone={phone}
            onChange={(e) => setPhone(e.target.value)}
            onSubmit={sendOtpHandler}
            isError={isError}
            isPending={isPending}
            error={error}
          />
        );
      case 2:
        return (
          <CheckOTPForm
            phone={phone}
            userStatus={userStatus}
            isPending={isPending}
            onBack={() => setStep(1)} // Go back to phone input step
            onResendOtp={sendOtpHandler} // Resend OTP functionality
          />
        );
      default:
        return null;
    }
  };

  return <div className="w-full sm:max-w-sm">{renderStep()}</div>;
}

export default AuthContainer;
