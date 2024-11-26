import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SendOTPForm from "./SendOTPForm";
import CheckOTPForm from "./CheckOTPForm";
import { useMutation } from "@tanstack/react-query";
import { getOtp } from "../../services/authService";
import toast from "react-hot-toast";
import useUser from "../dashboard/useUser";

function AuthContainer() {
  const [step, setStep] = useState(1);
  const [userStatus, setUserStatus] = useState(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const { data: user } = useUser();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const { mutateAsync } = useMutation({
    mutationFn: getOtp,
    onMutate: () => setLoading(true), // Set loading to true on mutation start
    onSuccess: (data) => {
      setLoading(false); // Reset loading on success
      toast.success("کد تایید برای شما ارسال گردید");
      setUserStatus(data.has_account);
      setStep(2);
    },
    onError: (error) => {
      setLoading(false); // Reset loading on error
      setError(
        error?.response?.data?.message || "خطایی در ارسال کد تایید پیش آمده!",
      );
      toast.error(
        error?.response?.data?.message ||
          "خطایی در ارسال کد تایید پیش آمده! لطفا دوباره امتحان کنید",
      );
    },
  });

  const sendOtpHandler = async (e) => {
    e.preventDefault();
    if (!phone) {
      toast.error("لطفا شماره موبایل صحیح را وارد کنید");
      return;
    }
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
            loading={loading} // Pass the loading state
            error={error}
          />
        );
      case 2:
        return (
          <CheckOTPForm
            phone={phone}
            userStatus={userStatus}
            onBack={() => setStep(1)}
            onResendOtp={sendOtpHandler}
          />
        );
      default:
        return null;
    }
  };

  return <div className=" mx-4 md:mx-0 sm:max-w-sm ">{renderStep()}</div>;
}

export default AuthContainer;
