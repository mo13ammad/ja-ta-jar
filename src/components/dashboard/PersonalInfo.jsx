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

  const gregorianDate = new Date(date);
  if (isNaN(gregorianDate.getTime())) return 'تاریخ تولد معتبر نیست';

  const { jy, jm, jd } = jalaali.toJalaali(gregorianDate.getFullYear(), gregorianDate.getMonth() + 1, gregorianDate.getDate());
  const dayFormatted = jd;
  const monthFormatted = persianMonths[jm - 1];
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

  // Safeguard: Extract only string properties from the `user` object
  const safeGetString = (value) => {
    return typeof value === 'string' ? value : 'مقدار نامعتبر';
  };

  // Extracting information from nested objects
  const cityName = user?.city?.name ? user.city.name : 'شهر نامشخص';
  const sexLabel = user?.sex?.label ? user.sex.label : 'جنسیت نامشخص';
  const birthDate = formatPersianDate(user?.birth_date);

  return (
    <div className="w-full">
      <div className="rounded-xl p-5">
        <div className="border-b pb-3 mb-5 text-xl font-semibold">اطلاعات شخصی</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-6">
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">نام و نام خانوادگی :</div>
            <div className="text-sm opacity-90">{safeGetString(user?.name)}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">ایمیل :</div>
            <div className="text-sm opacity-90">{safeGetString(user?.email)}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">شماره تلفن همراه :</div>
            <div className="text-sm opacity-90">{safeGetString(user?.phone)}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">کدملی :</div>
            <div className="text-sm opacity-90">{safeGetString(user?.national_code)}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">شهر :</div>
            <div className="text-sm opacity-90">{cityName}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">شماره تلفن همراه دوم :</div>
            <div className="text-sm opacity-90">{safeGetString(user?.second_phone)}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">تاریخ تولد :</div>
            <div className="text-sm opacity-90">{birthDate}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs opacity-80 mb-1">جنسیت :</div>
            <div className="text-sm opacity-90">{sexLabel}</div>
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
