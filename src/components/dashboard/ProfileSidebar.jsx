import React from "react";
import { Tab } from "@headlessui/react";
import profile from "./assets/profile.webp";

const ProfileSidebar = ({user}) => {
  console.log(user);
  return (
    <div className="border w-full rounded-xl flex flex-col justify-center items-center bg-white py-4 gap-y-5">
      <img className="border rounded-full w-24" src={profile} alt="Profile" />
      <span className="font-semibold opacity-80">{user.name}</span>
      <span className="text-xs opacity-70">عضویت 2 سال</span>
      <span className="flex text-xs opacity-70">
        <div>شماره تلفن: </div>
        <div>{user.phone}</div>
      </span>
      <a
        href=""
        className="text-sm opacity-80 border-t w-full pt-2 flex justify-center flex-row-reverse items-center hover:text-red-600 transition"
      >
        خروج از حساب
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          className="ml-1"
          fill="#474747"
          viewBox="0 0 256 256"
        >
          <path d="M110,216a6,6,0,0,1-6,6H48a14,14,0,0,1-14-14V48A14,14,0,0,1,48,34h56a6,6,0,0,1,0,12H48a2,2,0,0,0-2,2V208a2,2,0,0,0,2,2h56A6,6,0,0,1,110,216Zm110.24-92.24-40-40a6,6,0,0,0-8.48,8.48L201.51,122H104a6,6,0,0,0,0,12h97.51l-29.75,29.76a6,6,0,1,0,8.48,8.48l40-40A6,6,0,0,0,220.24,123.76Z"></path>
        </svg>
      </a>
      <Tab.List className="border w-5/6 rounded-xl flex flex-col justify-center items-center p-2 gap-y-2">
        <Tab as={React.Fragment}>
          {({ selected }) => (
            <button
              className={`text-sm opacity-80 w-full flex justify-end outline-none pr-5 flex-row-reverse items-center hover:text-green-600 transition  py-3 rounded-xl ${
                selected ? "bg-gray-100 text-green-500" : ""
              }`}
            >
              پروفایل
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                className="ml-1"
                fill="#474747"
                viewBox="0 0 256 256"
              >
                <path d="M229.19,213c-15.81-27.32-40.63-46.49-69.47-54.62a70,70,0,1,0-63.44,0C67.44,166.5,42.62,185.67,26.81,213a6,6,0,1,0,10.38,6C56.4,185.81,90.34,166,128,166s71.6,19.81,90.81,53a6,6,0,1,0,10.38-6ZM70,96a58,58,0,1,1,58,58A58.07,58.07,0,0,1,70,96Z"></path>
              </svg>
            </button>
          )}
        </Tab>
        
       
        <Tab as={React.Fragment}>
          {({ selected }) => (
            <button
              className={`text-sm opacity-80 outline-none w-full flex justify-end pr-5 flex-row-reverse items-center hover:text-green-600 transition  py-3 rounded-xl ${
                selected ? "bg-gray-100 text-green-500" : ""
              }`}
            >
              آدرس ها
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                className="ml-1"
                fill="#474747"
                viewBox="0 0 256 256"
              >
                <path d="M128,12A92,92,0,0,0,36,104c0,68.14,82.17,131.41,85.84,134.09a6,6,0,0,0,7.69,0C137.83,235.41,220,172.14,220,104A92,92,0,0,0,128,12Zm0,211.23C109.22,210,48,153.29,48,104a80,80,0,0,1,160,0C208,153.29,146.78,210,128,223.23ZM128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,68a28,28,0,1,1,28-28A28,28,0,0,1,128,132Z"></path>
              </svg>
            </button>
          )}
        </Tab>
      </Tab.List>
    </div>
  );
};

export default ProfileSidebar;
