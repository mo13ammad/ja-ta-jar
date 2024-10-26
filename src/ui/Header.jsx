import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import logo from "../../public/assets/logotype.png";
import Loading from './Loading.jsx';
import useUser from '../features/dashboard/useUser.js';
import { Menu } from '@headlessui/react';
import { UserIcon } from '@heroicons/react/24/outline';

function Header() {
  const { data, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // Access the current location
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const timerRef = useRef(null);

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
    // Navigate based on current location
    if (location.pathname.includes('/dashboard')) {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  const buttonText = location.pathname.includes('/dashboard') ? 'صفحه اصلی' : 'پنل کاربری';

  return (
    <div className="w-full rounded-b-lg absolute md:relative md:container">
      <nav className="relative w-full px-5 py-2 flex bg-gray-50 shadow-md flex-wrap justify-between items-center rounded-b-xl">
        {/* Logo */}
        <Link to="/" className="ml-auto">
          <img className="max-w-32 max-h-8" src={logo} alt="Logo" />
        </Link>

        {/* Links in lg size */}
        <div className="hidden md:flex lg:items-center lg:mr-auto lg:space-x-4 e">
          {isLoading ? (
            <Loading size={25} type="beat" size={6} />
          ) : data?.name ? (
            <div
              className="relative flex items-center text-sm text-gray-700"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <p>{data.name}</p>

              <div
                className={`absolute top-full mt-3 w-32 -left-4  rounded-lg shadow-lg transition-all bg-white ring-1 ring-black ring-opacity-5 duration-500 ease-in-out ${
                  isDropdownVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <Menu as="div">
                  <Menu.Items static>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleUserPanelClick}
                          className={`${
                            active ? 'bg-red-100' : ''
                          } w-full px-4 py-2 flex items-center justify-start text-gray-700`}
                        >
                          <UserIcon className="w-4 h-4 text-gray-700 ml-1" />
                          {buttonText}
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="text-gray-700 hover:text-primary-600">
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
            <svg className="block h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
          
          {/* Mobile Dropdown Menu */}
          {showMobileMenu && (
            <div
              className="absolute top-full -mt-2 left-0 w-full rounded-b-md shadow-lg transition-all bg-white ring-1 ring-black ring-opacity-5 duration-500 ease-in-out opacity-100 translate-y-0"
            >
              <button
                onClick={handleUserPanelClick}
                className="w-full px-4 py-2 flex items-center justify-start text-gray-700 hover:bg-gray-100"
              >
                <UserIcon className="w-5 h-5 text-gray-700 " />
                {buttonText}
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
