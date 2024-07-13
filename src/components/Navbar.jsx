import React, { useState } from "react";
import PagesDropdown from "./PagesDropdown";
import UserDropdown from "./UserDropdown";
import logo from "../assets/logo.webp";

function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPagesDropdown, setShowPagesDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const togglePagesDropdown = () => {
    setShowPagesDropdown(!showPagesDropdown);
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
        <a className="order-1 lg:order-2" href="./index.html">
          <img className="w-28 md:w-32" src={logo} alt="Logo" />
        </a>

        {/* Main Menu (Desktop) */}
        <PagesDropdown />

        {/* User Menu (Desktop) */}
        <UserDropdown />
      </nav>

      {/* Mobile Menu (Dropdowns) */}
      {showMobileMenu && (
        <div className="lg:hidden">
          <div className="flex flex-col items-center text-gray-700 bg-white w-full py-2">
            {/* Pages Dropdown */}
            <div className="relative">
              <button
                className="block w-full text-left px-4 py-2 text-sm font-semibold hover:bg-green-100"
                onClick={togglePagesDropdown}
              >
                صفحات
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-4 h-4 inline-block ml-1 ${
                    showPagesDropdown ? "transform rotate-180" : ""
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

              {showPagesDropdown && (
                <div className="bg-white rounded-lg shadow-md mt-2 py-1 w-full text-sm text-gray-800">
                  <PagesDropdown isMobile />
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative mt-2">
              <button
                className="block w-full text-left px-4 py-2 text-sm font-semibold hover:bg-green-100"
                onClick={toggleUserDropdown}
              >
                ورود | ثبت نام
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-4 h-4 inline-block ml-1 ${
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
                <div className="bg-white rounded-lg shadow-md mt-2 py-1 w-full text-sm text-gray-800">
                  <UserDropdown isMobile />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
