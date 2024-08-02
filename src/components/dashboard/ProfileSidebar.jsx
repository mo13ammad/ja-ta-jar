import React from "react";
import { Tab } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import profile from "./assets/profile.webp";

const ProfileSidebar = ({ user, token }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.delete("https://portal1.jatajar.com/api/client/profile/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleEditUser = () => {
    navigate(`/edituser/${user.uuid}`, { state: { token } });
  };

  return (
    <div className="border w-full min-h-[80vh] lg:max-h-[80vh] overflow-auto rounded-xl flex flex-col justify-start pt-10 items-center bg-white py-4 gap-y-5">
      <img className="border rounded-full w-24" src={user.avatar || profile} alt="Profile" />
      <span className="font-semibold opacity-80">{user.name}</span>

      <span className="flex text-xs opacity-70">
        <div>شماره تلفن : </div>
        <div className="mr-1"> {user.phone}</div>
      </span>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleLogout();
        }}
        className="text-sm opacity-80 border rounded-xl px-8 py-2 flex justify-center flex-row-reverse items-center hover:text-red-600 hover:bg-red-100 transition-all"
      >
        خروج از حساب
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
      </a>
      <Tab.List className="border w-5/6 rounded-xl flex flex-col justify-center items-center p-2 gap-y-2">
        <Tab
          as="button"
          className={({ selected }) =>
            `text-sm opacity-80 w-full flex justify-end outline-none pr-5 flex-row-reverse items-center hover:text-green-600 transition  py-3 rounded-xl ${
              selected ? "bg-gray-100 text-green-500" : ""
            }`
          }
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
        </Tab>
        {user.type === "User" && (
          <Tab
            as="button"
            onClick={handleEditUser}
            className={({ selected }) =>
              `text-sm opacity-80 outline-none w-full flex justify-end pr-5 flex-row-reverse items-center hover:text-green-600 transition  py-3 rounded-xl ${
                selected ? "bg-gray-100 text-green-500" : ""
              }`
            }
          >
            ویرایش اطلاعات
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#474747" className="size-6 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5,0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5,0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </Tab>
        )}
        {user.type !== "User" && (
          <Tab
            as="button"
            className={({ selected }) =>
              `text-sm opacity-80 outline-none w-full flex justify-end pr-5 flex-row-reverse items-center hover:text-green-600 transition  py-3 rounded-xl ${
                selected ? "bg-gray-100 text-green-500" : ""
              }`
            }
          >
            اقامتگاه ها
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#474747" className="size-6 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 4.75A1.75 1.75 0 0 0 8.25 6.5v11A1.75 1.75 0 0 0 10 19.25h4.5A1.75 1.75 0 0 0 16.25 17.5V6.5A1.75 1.75 0 0 0 14 4.75H10zm0-1.5h4.5A3.25 3.25 0 0 1 18.75 6.5v11a3.25 3.25 0 0 1-3.25 3.25H10A3.25 3.25 0 0 1 6.75 17.5V6.5A3.25 3.25 0 0 1 10 3.25zM4.75 9a.75.75 0 0 0 0 1.5h11a.75.75 0 0 0 0-1.5H4.75zm0 4a.75.75 0 0 0 0 1.5h11a.75.75 0 0 0 0-1.5H4.75z" />
            </svg>
          </Tab>
        )}
      </Tab.List>
    </div>
  );
};

export default ProfileSidebar;
