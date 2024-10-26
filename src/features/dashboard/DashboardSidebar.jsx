import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, PencilSquareIcon, HomeIcon } from '@heroicons/react/24/solid';
import Loading from '../../ui/Loading';
import { logOutUser } from '../../services/userService';
import { useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';

function DashboardSidebar({ setSelectedTab, isLoading, user, setLoggedOut }) {
  const svgClasses = 'ml-1 w-5 h-5 text-current';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logOutUser();
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      queryClient.setQueryData(['get-user'], null);
      queryClient.invalidateQueries(['get-user']);
      setLoggedOut(true);
    } catch (error) {
      console.error("Failed to log out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleAdminPanelClick = () => {
    toast.success("در حال ورود به پنل ادمین");
    window.location.href = "https://portal1.jatajar.com/login";
  };

  if (isLoading) {
    return <Loading />;
  }

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
        <button
          onClick={handleAdminPanelClick}
          className="text-sm w-44 opacity-80 border rounded-xl px-8 py-2 flex justify-center flex-row-reverse items-center hover:text-blue-600 hover:bg-blue-100 transition-all"
        >
          ورود به پنل ادمین
        </button>
      )}

      {/* Logout Button with Spinner */}
      <button
        onClick={handleLogout}
        className="text-sm opacity-80 border  w-44  rounded-xl px-8 py-2 flex justify-center flex-row-reverse items-center hover:text-red-600 hover:bg-red-100 transition-all"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? <Loading size={20} /> : 'خروج'}
      </button>

      <Tab.Group className="w-full">
        <Tab.List className="border rounded-xl flex flex-col justify-center items-center p-2 gap-y-2">
          <Tab
            as="div"
            className={({ selected }) => `tab ${selected ? 'tab-selected' : 'tab-hover'}`}
            onClick={() => setSelectedTab('profile')}
          >
            {({ selected }) => (
              <>
                پروفایل
                <UserIcon className={`${svgClasses} ${selected ? 'text-secondary-100' : 'text-gray-700'}`} />
              </>
            )}
          </Tab>

          <Tab
            as="div"
            className={({ selected }) => `tab ${selected ? 'tab-selected' : 'tab-hover'}`}
            onClick={() => setSelectedTab('editProfile')}
          >
            {({ selected }) => (
              <>
                ویرایش اطلاعات
                <PencilSquareIcon className={`${svgClasses} ${selected ? 'text-secondary-100' : 'text-gray-700'}`} />
              </>
            )}
          </Tab>

          {user?.type === 'Vendor' && (
            <Tab
              as="div"
              className={({ selected }) => `tab ${selected ? 'tab-selected' : 'tab-hover'}`}
              onClick={() => setSelectedTab('houses')}
            >
              {({ selected }) => (
                <>
                  اقامتگاه ها
                  <HomeIcon className={`${svgClasses} ${selected ? 'text-secondary-100' : 'text-gray-700'}`} />
                </>
              )}
            </Tab>
          )}
        </Tab.List>
      </Tab.Group>
    </div>
  );
}

export default DashboardSidebar;
