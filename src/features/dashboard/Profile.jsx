// Profile.jsx

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Loading from '../../ui/Loading.jsx';
import useUser from '../dashboard/useUser.js';
import { becomeVendor } from '../../services/userService';
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';

dayjs.extend(jalaliday);

const Profile = () => {
  const { data: user, isLoading } = useUser();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState(null);

  const { mutate, isLoading: isBecomingVendor } = useMutation(becomeVendor, {
    onSuccess: (newUserData) => {
      // Update the user data in the cache with the response from becomeVendor
      queryClient.setQueryData(['get-user'], (oldData) => ({
        ...oldData,
        ...newUserData,
      }));
      setErrorMessage(null); // Clear any previous error message
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || 'خطایی رخ داده است');
    }
  });

  const handleBecomeVendorClick = () => {
    setErrorMessage(null); // Clear any previous error message
    mutate();
  };

  const formatPersianDate = (date) => {
    if (!date) return 'تاریخ تولد شما وارد نشده است';

    // Parse the date string and convert it to Jalali calendar
    const jalaliDate = dayjs(date).calendar('jalali');

    // Format the date in Persian
    const formattedDate = jalaliDate.locale('fa').format('YYYY MMMM DD');
    return formattedDate;
  };

  if (isLoading) return <Loading />;

  const cityName = user?.city?.name || 'شهر نامشخص';
  const sexLabel = user?.sex?.label || 'جنسیت نامشخص';
  const birthDate = formatPersianDate(user?.birth_date);
  const isVendor = user?.type === 'Vendor';
  const isAdmin = user?.type === 'Admin';

  return (
    <div className="w-full rounded-xl p-5">
      <div className="border-b pb-3 mb-5 text-xl font-semibold">اطلاعات شخصی</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-6">
        <UserInfo label="نام و نام خانوادگی :" value={user?.name || 'اطلاعاتی وارد نشده'} />
        <UserInfo label="ایمیل :" value={user?.email || 'اطلاعاتی وارد نشده'} />
        <UserInfo label="شماره تلفن همراه :" value={user?.phone || 'اطلاعاتی وارد نشده'} />
        <UserInfo label="کدملی :" value={user?.national_code || 'اطلاعاتی وارد نشده'} />
        <UserInfo label="شهر :" value={cityName} />
        <UserInfo label="شماره تلفن همراه دوم :" value={user?.second_phone || 'اطلاعاتی وارد نشده'} />
        <UserInfo label="تاریخ تولد :" value={birthDate} />
        <UserInfo label="جنسیت :" value={sexLabel} />
        <UserInfo label="درباره شما :" value={user?.bio || 'اطلاعاتی وارد نشده'} />
      </div>

      {/* Display error message if exists */}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

      {/* Show Become Vendor Button or Loading Spinner */}
      {!isVendor && !isAdmin && (
        <button 
          onClick={handleBecomeVendorClick}
          className="btn bg-primary-600 max-w-36 mt-6 text-sm flex items-center justify-center"
          disabled={isBecomingVendor}
        >
          {isBecomingVendor ? <Loading size={20} /> : 'میزبان شوید'}
        </button>
      )}
    </div>
  );
};

const UserInfo = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <div className="text-sm opacity-80">{label}</div>
    <div className="text-sm opacity-90 font-bold">{value}</div>
  </div>
);

export default Profile;
