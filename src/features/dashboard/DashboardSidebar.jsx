// DashboardSidebar.js
import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { UserIcon, PencilSquareIcon, HomeIcon } from '@heroicons/react/24/solid';
import Loading from '../../ui/Loading';
import { logOutUser } from '../../services/userService';
import { useQueryClient } from "@tanstack/react-query";

// Function to get token from cookies
const getAuthTokenFromCookies = () => {
  const match = document.cookie.match(new RegExp('(^| )authToken=([^;]+)'));
  return match ? match[2] : null;
};

function DashboardSidebar({ setSelectedTab, user }) {
  const svgClasses = 'ml-1 w-5 h-5 text-current';
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const token = getAuthTokenFromCookies();

  // Log the token for debugging


  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logOutUser();
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      queryClient.setQueryData(['get-user'], null);
      queryClient.invalidateQueries(['get-user']);
    } catch (error) {
      console.error("Failed to log out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full overflow-auto rounded-xl flex flex-col justify-start pt-10 items-center py-4 gap-y-5">
      <img
        className="border rounded-full w-24"
        src={user?.avatar || '/path-to-default-avatar.png'}
        alt="Profile"
      />
      <span className="font-semibold opacity-80">{user?.name || 'نام کاربر'}</span>

      <span className="flex text-xs opacity-70">
        <div>شماره تلفن :</div>
        <div className="mr-1">{user?.phone || 'شماره ثبت نشده'}</div>
      </span>

      {/* Admin Panel Button for Admin Users */}
      {user?.type === 'Admin' && (
        <form action="https://portal1.jatajar.com/api/auth/login/admin" method="POST">
          <input type="hidden" name="token" value={token} />
          <button
            type="submit"
            className="text-sm opacity-80 border rounded-xl px-6 py-2 flex justify-center flex-row-reverse items-center hover:text-blue-600 hover:bg-blue-100 transition-all"
          >
            ورود به پنل ادمین
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 3.75H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25h12A2.25 2.25 0 0 0 19.5 18V13.5m-9 0 3.75-3.75m0 0L10.5 6m3.75 3.75H21" />
            </svg>
          </button>
        </form>
      )}

      {/* Logout Button with Spinner */}
      <button
        onClick={handleLogout}
        className="text-sm opacity-80 border w-44 rounded-xl px-8 py-2 flex justify-center flex-row-reverse items-center hover:text-red-600 hover:bg-red-100 transition-all"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? <Loading size={20} /> : 'خروج'}
      </button>

      <Tab.Group className="w-full">
        <Tab.List className="border rounded-xl flex flex-col justify-center items-center p-2 gap-y-2">
          <Tab as="div" className={({ selected }) => `tab ${selected ? 'tab-selected' : 'tab-hover'}`} onClick={() => setSelectedTab('profile')}>
            پروفایل
            <UserIcon className={`${svgClasses}`} />
          </Tab>
          <Tab as="div" className={({ selected }) => `tab ${selected ? 'tab-selected' : 'tab-hover'}`} onClick={() => setSelectedTab('editProfile')}>
            ویرایش اطلاعات
            <PencilSquareIcon className={`${svgClasses}`} />
          </Tab>
          {user?.type === 'Vendor' && (
            <Tab as="div" className={({ selected }) => `tab ${selected ? 'tab-selected' : 'tab-hover'}`} onClick={() => setSelectedTab('houses')}>
              اقامتگاه ها
              <HomeIcon className={`${svgClasses}`} />
            </Tab>
          )}
        </Tab.List>
      </Tab.Group>
    </div>
  );
}

export default DashboardSidebar;
