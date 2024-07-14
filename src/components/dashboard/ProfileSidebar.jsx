import React from 'react';
import profile from "./profile.webp"

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const getButtonClasses = (tab) => {
    return `text-sm opacity-80 w-full flex justify-end pr-5 flex-row-reverse items-center hover:text-green-600 transition hover:bg-gray-100 py-3 rounded-xl ${
      activeTab === tab ? 'focus:bg-gray-200 focus:text-green-500' : ''
    }`;
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="border w-full rounded-xl flex flex-col justify-center items-center py-4 gap-y-5">
      <img className="border rounded-full w-24" src={profile} alt="Profile" />
      <span className="font-semibold opacity-80">محمد سعادتی</span>
      <span className="text-xs opacity-70">عضویت 2 سال</span>
      <span className="flex text-xs opacity-70">
        <div>شماره تلفن:</div>
        <div>09304444444</div>
      </span>
      <a href="" className="text-sm opacity-80 border-t w-full pt-2 flex justify-center flex-row-reverse items-center hover:text-red-600 transition">
        خروج از حساب
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='ml-1' fill="#474747" viewBox="0 0 256 256">
          <path d="M110,216a6,6,0,0,1-6,6H48a14,14,0,0,1-14-14V48A14,14,0,0,1,48,34h56a6,6,0,0,1,0,12H48a2,2,0,0,0-2,2V208a2,2,0,0,0,2,2h56A6,6,0,0,1,110,216Zm110.24-92.24-40-40a6,6,0,0,0-8.48,8.48L201.51,122H104a6,6,0,0,0,0,12h97.51l-29.75,29.76a6,6,0,1,0,8.48,8.48l40-40A6,6,0,0,0,220.24,123.76Z"></path>
        </svg>
      </a>
      <div className="border w-5/6 rounded-xl flex flex-col justify-center items-center p-2 gap-y-2">
        <button onClick={() => handleTabClick('personalInfo')} className={getButtonClasses('personalInfo')}>
          پروفایل
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='ml-1' fill="#474747" viewBox="0 0 256 256">
            <path d="M229.19,213c-15.81-27.32-40.63-46.49-69.47-54.62a70,70,0,1,0-63.44,0C67.44,166.5,42.62,185.67,26.81,213a6,6,0,1,0,10.38,6C56.4,185.81,90.34,166,128,166s71.6,19.81,90.81,53a6,6,0,1,0,10.38-6ZM70,96a58,58,0,1,1,58,58A58.07,58.07,0,0,1,70,96Z"></path>
          </svg>
        </button>
        <button onClick={() => handleTabClick('orders')} className={getButtonClasses('orders')}>
          درخواست های رزور
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='ml-1' fill="#474747" viewBox="0 0 256 256">
            <path d="M134,120v56a6,6,0,0,1-12,0V120a6,6,0,0,1,12,0ZM237.88,97.85,224,201.85A14,14,0,0,1,210.13,214H45.87A14,14,0,0,1,32,201.85l-13.87-104A14,14,0,0,1,32,82H69.28l54.2-61.95a6,6,0,0,1,9,0l54.2,62H224a14,14,0,0,1,13.87,15.85ZM85.22,82h85.56L128,33.11ZM225.5,94.68A2,2,0,0,0,224,94H32a2,2,0,0,0-1.51.68A2,2,0,0,0,30,96.26l13.86,104a2,2,0,0,0,2,1.73H210.13a2,2,0,0,0,2-1.73L226,96.26A1.93,1.93,0,0,0,225.5,94.68ZM181.4,114a6,6,0,0,0-6.57,5.37l-5.6,56A6,6,0,0,0,174.6,182l.61,0a6,6,0,0,0,6-5.4l5.6-56A6,6,0,0,0,181.4,114ZM81.17,119.4a6,6,0,0,0-11.94,1.2l5.6,56a6,6,0,0,0,6,5.4l.61,0a6,6,0,0,0,5.37-6.57Z"></path>
          </svg>
        </button>
        <button onClick={() => handleTabClick('favorites')} className={getButtonClasses('favorites')}>
          علاقه مندی ها
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='ml-1' fill="#474747" viewBox="0 0 256 256">
            <path d="M233.22,41.12a58.06,58.06,0,0,0-82.05.23L128,64.46,104.83,41.35A58,58,0,0,0,22.77,123.17l92,92.54a6,6,0,0,0,8.52,0l92-92.54A58.07,58.07,0,0,0,233.22,41.12ZM220.68,110.2l-87.74,88.31L45.21,110.22A46,46,0,0,1,97.4,52.32a46.33,46.33,0,0,1,13.39,9.63L128,89.17a6,6,0,0,0,8.56.09l16.77-16.65A45.93,45.93,0,0,1,204.76,62,46,46,0,0,1,220.68,110.2Z"></path>
          </svg>
        </button>
        <button onClick={() => handleTabClick('addresses')} className={getButtonClasses('addresses')}>
          آدرس ها
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='ml-1' fill="#474747" viewBox="0 0 256 256">
            <path d="M128,14A86.09,86.09,0,0,0,42,100c0,31.64,17.18,67.91,51.06,108.22a142.79,142.79,0,0,0,30.76,26.84,6,6,0,0,0,6.36,0,142.79,142.79,0,0,0,30.76-26.84C196.82,167.91,214,131.64,214,100A86.09,86.09,0,0,0,128,14Zm0,211.3C83.84,192.58,54,146.31,54,100a74,74,0,0,1,148,0C202,146.31,172.16,192.58,128,225.3ZM128,66a30,30,0,1,0,30,30A30,30,0,0,0,128,66Z"></path>
          </svg>
        </button>
        <button onClick={() => handleTabClick('comments')} className={getButtonClasses('comments')}>
          دیدگاه های من
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='ml-1' fill="#474747" viewBox="0 0 256 256">
            <path d="M128,230a101.1,101.1,0,0,0,50.36-13.15l25.56,9.13A10,10,0,0,0,216.58,210l-9.13-25.56A101,101,0,1,0,128,230ZM128,38a90,90,0,1,1-54.61,163.52,6,6,0,0,0-6.84-.57L47.21,214.79l13.84-19.32a6,6,0,0,0-.57-6.84A90,90,0,0,1,128,38Z"></path>
          </svg>
        </button>
        <button onClick={() => handleTabClick('invite')} className={getButtonClasses('invite')}>
          دعوت از دوستان
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='ml-1' fill="#474747" viewBox="0 0 256 256">
            <path d="M222,154a46.4,46.4,0,0,0-26.25,8.09,65.9,65.9,0,0,0-3.78-4.2A73.58,73.58,0,0,0,192,158a66.54,66.54,0,0,0-2.38.17c-10.28.66-25.92,5.68-38.19,16.77a6,6,0,1,0,8.37,8.62c11.53-11.53,27.71-15.72,36.87-16.31a55.81,55.81,0,0,1,2.05-.13,54.92,54.92,0,0,1,9.67.79c8.66,1.17,16.12,3.73,21.27,7.83a6,6,0,0,0,8.07-8.88ZM128,74a34,34,0,1,0,34,34A34.05,34.05,0,0,0,128,74Zm57.36,62.64a6,6,0,0,0-8.37-8.62c-11.53,11.53-27.71,15.72-36.87,16.31a55.81,55.81,0,0,1-2.05.13,54.92,54.92,0,0,1-9.67-.79c-8.66-1.17-16.12-3.73-21.27-7.83a6,6,0,0,0-8.07,8.88c10.28,10.28,25.92,5.68,38.19-6.41a6,6,0,1,0-8.37-8.62c-11.53,11.53-27.71,15.72-36.87,16.31a55.81,55.81,0,0,1-2.05.13,54.92,54.92,0,0,1-9.67-.79c-8.66-1.17-16.12-3.73-21.27-7.83a6,6,0,0,0-8.07,8.88c10.28,10.28,25.92,5.68,38.19-6.41a6,6,0,1,0-8.37-8.62c-11.53,11.53-27.71,15.72-36.87,16.31a55.81,55.81,0,0,1-2.05.13,54.92,54.92,0,0,1-9.67-.79c-8.66-1.17-16.12-3.73-21.27-7.83a6,6,0,0,0-8.07,8.88c10.28,10.28,25.92,5.68,38.19-6.41A6,6,0,0,0,99.36,136.64Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
