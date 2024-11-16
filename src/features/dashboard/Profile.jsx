import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog } from '@headlessui/react';
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
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // State for confirmation modal

  const { mutate, isLoading: isBecomingVendor } = useMutation(becomeVendor, {
    onSuccess: (newUserData) => {
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
    setIsConfirmationOpen(true); // Open the confirmation modal
  };

  const confirmBecomeVendor = () => {
    setIsConfirmationOpen(false); // Close the modal
    mutate(); // Trigger the mutation
  };

  const formatPersianDate = (date) => {
    if (!date) return 'تاریخ تولد شما وارد نشده است';
    const jalaliDate = dayjs(date).calendar('jalali');
    return jalaliDate.locale('fa').format('YYYY MMMM DD');
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

      {/* Show Become Vendor Button */}
      {!isVendor && !isAdmin && (
        <button 
          onClick={handleBecomeVendorClick}
          className="btn bg-primary-600 max-w-36 mt-6 text-sm flex items-center justify-center"
          disabled={isBecomingVendor}
        >
          {isBecomingVendor ? <Loading size={20} /> : 'میزبان شوید'}
        </button>
      )}

      {/* Confirmation Modal */}
      <Dialog open={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-lg space-y-4 border bg-white p-6 rounded-3xl w-full">
            <Dialog.Title className="font-bold text-xl">آیا از تبدیل شدن به میزبان مطمئن هستید؟</Dialog.Title>
            <p className="mt-4">در صورت تایید، اطلاعات شما به عنوان میزبان در سیستم ثبت خواهد شد.</p>
            <div className="flex gap-4 mt-4">
              <button
                className="btn bg-gray-300 text-gray-800"
                onClick={() => setIsConfirmationOpen(false)}
                disabled={isBecomingVendor}
              >
                لغو
              </button>
              <button
                className="btn bg-primary-600 text-white"
                onClick={confirmBecomeVendor}
                disabled={isBecomingVendor}
              >
                {isBecomingVendor ? 'در حال ثبت...' : 'بله'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
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
