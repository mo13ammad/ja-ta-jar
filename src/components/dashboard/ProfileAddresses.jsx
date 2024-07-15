import React from "react";

const Addresses = () => {
  return (
    <div className="w-full flex flex-col gap-y-5">
      <div className="border rounded-xl flex flex-col p-5 gap-y-5">
        <div>
          <div className="opacity-80">خراسان رضوی-مشهد-خیابان .....</div>
        </div>
        <div className="md:grid grid-cols-2">
          <div>
            <div className="text-xs opacity-80 mb-1">شماره تلفن همراه:</div>
            <div className="text-sm opacity-90">09999999999</div>
          </div>
          <div>
            <div className="text-xs opacity-80 mb-1">ایمیل:</div>
            <div className="text-sm opacity-90">aaaaaaa@gmail.com</div>
          </div>
        </div>
        <div className="w-1/2">
          <div className="text-xs opacity-80 mb-1">کد پستی:</div>
          <div className="text-sm opacity-90">9889498984</div>
        </div>
        <span className="opacity-90">
          <button className="px-7 py-2 ml-2 text-center text-white bg-green-500 align-middle border-0 rounded-lg shadow-md text-sm">
            ویرایش آدرس
          </button>
          <button className="px-7 py-2 text-center text-white bg-red-500 align-middle border-0 rounded-lg shadow-md text-sm">
            حذف
          </button>
        </span>
      </div>
    </div>
  );
};

export default Addresses;
