import React from 'react';

const PersonalInfo = ({user}) => {
  return (
    <div className="w-full">
    <div className="rounded-xl flex flex-col p-5 gap-y-5">
      <div className="border-b pb-3">اطلاعات شخصی</div>
      <div className="flex pb-2">
        <div className="w-1/2">
          <div className="text-xs opacity-80 mb-1">
            نام و نام خانوادگی:
          </div>
          <div className="text-sm opacity-90">
          {user.name}
          </div>
        </div>
        <div className="w-1/2">
          <div className="text-xs opacity-80 mb-1">
            ایمیل:
          </div>
          <div className="text-sm opacity-90">
            {user.email === null ? (<p>ایمیل شما وارد نشده است</p>) : user.email}
          </div>
        </div>
      </div>
      <div className="flex pb-2">
        <div className="w-1/2">
          <div className="text-xs opacity-80 mb-1">
            شماره تلفن همراه:
          </div>
          <div className="text-sm opacity-90">
            {user.phone}
          </div>
        </div>
        <div className="w-1/2">
          <div className="text-xs opacity-80 mb-1">
            تاریخ عضویت:
          </div>
          <div className="text-sm opacity-90">
            1402/12/01
          </div>
        </div>
      </div>
      <div className="flex pb-2">       
        <div className="w-1/2">
          <div className="text-xs opacity-80 mb-1">
            کدملی:
          </div>
          <div className="text-sm opacity-90">
            {user.national_code}
          </div>
        </div>
      </div>
      <span className="opacity-90">
        <button className="px-7 py-2 ml-2 text-center text-white bg-red-500 hover:bg-red-600 transition align-middle border-0 rounded-lg shadow-md text-sm">ویرایش اطلاعات</button>
        <button className="px-7 py-2 text-center text-white bg-green-500 hover:bg-green-600 transition align-middle border-0 rounded-lg shadow-md text-sm">میزبان شوید</button>
      </span>

    </div>
  </div>
  );
};

export default PersonalInfo;
