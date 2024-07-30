import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PersonalInfo = ({ user }) => {
  const handleBecomeHost = async () => {
    try {
      const response = await axios.put('http://jatajar.com/api/client/profile/vendor');
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
      <div className="rounded-xl flex flex-col p-5 gap-y-5">
        <div className="border-b pb-3">اطلاعات شخصی</div>
        <div className="flex pb-2">
          <div className="w-1/2">
            <div className="text-xs opacity-80 mb-1">نام و نام خانوادگی:</div>
            <div className="text-sm opacity-90">{user.name}</div>
          </div>
          <div className="w-1/2">
            <div className="text-xs opacity-80 mb-1">ایمیل:</div>
            <div className="text-sm opacity-90">
              {user.email === null ? <p>ایمیل شما وارد نشده است</p> : user.email}
            </div>
          </div>
        </div>
        <div className="flex pb-2">
          <div className="w-1/2">
            <div className="text-xs opacity-80 mb-1">شماره تلفن همراه:</div>
            <div className="text-sm opacity-90">{user.phone}</div>
          </div>
        </div>
        <div className="flex pb-2">
          <div className="w-1/2">
            <div className="text-xs opacity-80 mb-1">کدملی:</div>
            <div className="text-sm opacity-90">{user.national_code}</div>
          </div>
        </div>
        <span className="opacity-90">
          
          <button
            className="px-7 py-2 text-center text-white bg-green-500 hover:bg-green-600 transition align-middle border-0 rounded-lg shadow-md text-sm"
            onClick={handleBecomeHost}
          >
            میزبان شوید
          </button>
        </span>
      </div>
    </div>
  );
};

export default PersonalInfo;
