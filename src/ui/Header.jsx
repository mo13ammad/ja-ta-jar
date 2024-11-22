import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../public/assets/white-type.png";
import Loading from './Loading.jsx';
import useUser from '../features/dashboard/useUser.js';
import { Menu } from '@headlessui/react';
import { UserIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useQueryClient } from "@tanstack/react-query";
import { logOutUser } from '../services/userService.js';
import { Bars3Icon } from '@heroicons/react/24/outline';

import toast from "react-hot-toast";

function Header() {
  const { data, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const timerRef = useRef(null);
  const queryClient = useQueryClient();

  const toggleMobileMenu = () => {
    setShowMobileMenu((prev) => !prev);
  };

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setDropdownVisible(false);
    }, 1000);
  };

  const handleUserPanelClick = () => {
    if (location.pathname.includes('/dashboard')) {
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  const buttonText = location.pathname.includes('/dashboard') ? 'صفحه اصلی' : 'پنل کاربری';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logOutUser();
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      queryClient.setQueryData(['get-user'], null);
      queryClient.invalidateQueries(['get-user']);
      toast.success(" از حساب کاربری خود با موفقیت خارج شدید !")
      navigate('/');
    } catch (error) {
      console.error("Failed to log out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full rounded-b-lg absolute md:relative md:container">
      <nav className="relative w-full px-5 py-2 flex bg-primary-300 shadow-md flex-wrap justify-between items-center rounded-b-xl">
        <Link to="/" className="ml-auto">
          <img className="max-w-32 max-h-8" src={logo} alt="Logo" />
        </Link>

        <div className="hidden md:flex lg:items-center lg:mr-auto lg:space-x-4">
          {isLoading ? (
            <Loading size={25} type="beat" size={6} />
          ) : data?.name ? (
            <div
              className="relative flex items-center text-sm text-gray-700"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <p className="text-secondary-100">{data.name}</p>

              <div
                className={`absolute top-full z-50 mt-3 w-44 -left-4 rounded-lg shadow-lg transition-all bg-white ring-1 ring-black ring-opacity-5 duration-500 ease-in-out ${
                  isDropdownVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <Menu as="div">
                  <Menu.Items static>
                    <Menu.Item>
                      {({ active }) => (
                      <div className="w-full flex justify-center items-center flex-col"> 
                        <button
                          onClick={handleUserPanelClick}
                          className={`${
                            active ? 'bg-red-100' : ''
                          } w-full px-4 py-2  flex text-sm  items-center justify-start text-gray-700`}
                        >
                          <UserIcon className="w-4 h-4 text-gray-700 ml-1" />
                          {buttonText}
                        </button>
                        <span className="border-b inline-block mx-auto border-secondary-100 border-opacity-90 w-11/12"></span>
                      </div>
                      )}
                    </Menu.Item>
                    {/* Only show Logout if user data is available */}
                    {data && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? 'bg-red-100' : ''
                            } w-full px-4 py-2 text-sm flex items-center justify-start text-gray-700`}
                            disabled={isLoggingOut}
                          >
                            <ArrowLeftOnRectangleIcon className="w-4 h-4 text-gray-700 ml-1" />
                            {isLoggingOut ? (
                              <span className="flex items-center">
                                <span className="ml-2">در حال خروج ...</span>
                                <Loading size={20} />
                              </span>
                            ) : (
                              'خروج از حساب کاربری'
                            )}
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="text-secondary-50 hover:text-secondary-300">
              ورود | ثبت نام
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-green-600 p-3"
            onClick={toggleMobileMenu}
          >
            <Bars3Icon className="block h-7 w-7 text-secondary-200" />
          </button>
          
          {showMobileMenu && (
            <div className="absolute top-full z-50 left-0 w-full rounded-b-md shadow-lg transition-all bg-white ring-1 ring-black ring-opacity-5 duration-500 ease-in-out">
              <button
                onClick={handleUserPanelClick}
                className="w-full px-4 py-2 flex items-center justify-start text-gray-700 hover:bg-gray-100"
              >
                <UserIcon className="w-5 h-5 text-gray-700" />
                {buttonText}
              </button>
           
              {/* Only show Logout if user data is available */}
              {data && (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 pb-4 flex items-center justify-start  text-gray-700 hover:bg-gray-100"
                  disabled={isLoggingOut}
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5 text-gray-700" />
                  {isLoggingOut ? (
                    <span className="flex items-center">
                      <span className="ml-2">در حال خروج ...</span>
                      <Loading size={20} />
                    </span>
                  ) : (
                    'خروج از حساب کاربری'
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
