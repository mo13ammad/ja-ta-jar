import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import jalaali from 'jalaali-js';

// Persian months mapping
const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const formatPersianDate = (date) => {
  if (!date) return 'تاریخ تولد شما وارد نشده است';

  // Extract the date part from the string and convert to Date object
  const gregorianDate = new Date(date);

  // Convert Gregorian date to Persian date
  const { jy, jm, jd } = jalaali.toJalaali(gregorianDate.getFullYear(), gregorianDate.getMonth() + 1, gregorianDate.getDate());

  // Format date using Persian months
  const dayFormatted = jd;
  const monthFormatted = persianMonths[jm - 1]; // Months are 1-based in Persian calendar
  const yearFormatted = jy;

  return `${yearFormatted} ${monthFormatted} ${dayFormatted}`;
};

const PersonalInfo = ({ user }) => {
  const handleBecomeHost = async () => {
    try {
      const response = await axios.put('https://portal1.jatajar.com/api/client/profile/vendor');
      toast.success('Request sent successfully!');
      console.log('API response:', response.data);
    } catch (error) {
      console.error('Error during request:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
        toast.error(error.response.data.message || 'An unexpected error occurred.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-xl p-5">
        <div className="border-b pb-3 mb-5 text-xl font-semibold">اطلاعات شخصی</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-6">
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">نام و نام خانوادگی :</div>
            <div className="text-sm opacity-90">{user.name}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">ایمیل :</div>
            <div className="text-sm opacity-90">
              {user.email === null ? <p>ایمیل شما وارد نشده است</p> : user.email}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">شماره تلفن همراه :</div>
            <div className="text-sm opacity-90">{user.phone}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">کدملی :</div>
            <div className="text-sm opacity-90">{user.national_code}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">شهر :</div>
            <div className="text-sm opacity-90">
              {user.city === null ? <p>شهر شما وارد نشده است</p> : user.city}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">شماره تلفن همراه دوم :</div>
            <div className="text-sm opacity-90">
              {user.second_phone === null ? <p>شماره تلفن همراه دوم شما وارد نشده است</p> : user.second_phone}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">تاریخ تولد :</div>
            <div className="text-sm opacity-90">
              {formatPersianDate(user.birth_date)}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">جنسیت :</div>
            <div className="text-sm opacity-90">
              {user.sex?.label || 'جنسیت شما وارد نشده است'}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-start">
          <button
            className="px-7 py-2 text-center text-white bg-green-500 hover:bg-green-600 transition align-middle border-0 rounded-lg shadow-md text-sm"
            onClick={handleBecomeHost}
          >
            میزبان شوید
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
