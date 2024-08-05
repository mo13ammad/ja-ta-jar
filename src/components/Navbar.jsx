import React, { useState } from "react";
import logo from "../assets/jatajarlogo.webp";

function Navbar({ userName }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  return (
    <div>
      <nav className="relative px-5 py-2 flex bg-gray-100 shadow-md flex-row-reverse lg:flex-row flex-wrap justify-between items-center">
        {/* Mobile Menu Button */}
        <div className="order-1 lg:hidden">
          <button
            className="navbar-burger flex items-center text-green-600 p-3"
            onClick={toggleMobileMenu}
          >
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>

        {/* Logo */}
        <a href="/">
          <img className="max-w-28 md:max-w-32 max-h-14 pr-8" src={logo} alt="Logo" />
        </a>

        {/* User Menu (Desktop) */}
        <div className="relative">
          <button
            className="flex items-center text-gray-700 p-3"
            onClick={toggleUserDropdown}
          >
            <span>{userName || "User"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={`w-4 h-4 inline-block mr-1 transition-all duration-300 ${
                showUserDropdown ? "transform rotate-180" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-md py-1 text-sm text-gray-800 rtl">
              <ul className="list-reset">
                <li className="px-4 py-2 hover:bg-green-50">
                  <a href="/">صفحه اصلی</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu (Dropdowns) */}
      {showMobileMenu && (
        <div className="lg:hidden">
          <div className="flex flex-col items-center text-gray-700 bg-white w-full py-2 rtl">
            {/* Add additional items as needed */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
