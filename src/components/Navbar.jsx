import React, { useState } from "react";
import logo from "../assets/logo.webp";

function Navbar({ userName }) {
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
        <a  href="./index.html">
          <img className="w-28 md:w-32" src={logo} alt="Logo" />
        </a>

        {/* User Menu (Desktop) */}
        <div className=" relative">
          <button
            className="flex items-center text-gray-700 p-3"
            onClick={toggleUserDropdown}
          >
            <span>{userName}</span>
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
            {/* Pages Dropdown */}
            <div className="relative w-full">
              <button
                className="block w-full text-right px-4 py-2 text-sm font-semibold hover:bg-green-100 border-b"
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
                <div className="bg-white rounded-lg shadow-md mt-2 py-1 w-full text-sm text-gray-800 rtl">
                  <ul className="list-reset">
                    <li className="relative px-4 py-2 hover:bg-green-50 border-b">
                      <a href="./404.html" className="block w-full">
                        404
                      </a>
                      <ul className="pl-4 mt-1">
                        <li className="py-1">
                          <a href="./404-sub1.html" className="block w-full">
                            404 Subpage 1
                          </a>
                        </li>
                        <li className="py-1">
                          <a href="./404-sub2.html" className="block w-full">
                            404 Subpage 2
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="relative px-4 py-2 hover:bg-green-50 border-b">
                      <a href="./another-page.html" className="block w-full">
                        Another Page
                      </a>
                      <ul className="pl-4 mt-1">
                        <li className="py-1">
                          <a
                            href="./another-page-sub1.html"
                            className="block w-full"
                          >
                            Another Page Subpage 1
                          </a>
                        </li>
                        <li className="py-1">
                          <a
                            href="./another-page-sub2.html"
                            className="block w-full"
                          >
                            Another Page Subpage 2
                          </a>
                        </li>
                      </ul>
                    </li>
                    {/* Add more main items and their sub-items as needed */}
                  </ul>
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
