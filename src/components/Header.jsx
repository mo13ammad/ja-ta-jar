import React, { useState } from "react";
import logo from "../assets/logo.webp";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Example state for login status
  const [userName, setUserName] = useState(""); // Example state for user's name

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to simulate user login (example)
  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserName("John Doe"); // Set the user's name when logged in
  };

  // Function to simulate user logout (example)
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName(""); // Clear user's name on logout
  };

  return (
    <div className="relative">
      <div className="h-14 md:h-16 bg-gray-100 flex items-center justify-between shadow-md px-4">
        <img src={logo} alt="Logo" className="max-w-36" />

        <button
          onClick={toggleMenu}
          className="mr-4 focus:outline-none md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } md:hidden absolute top-12 left-0 w-full bg-white shadow-md transition-all duration-400`}
        >
          <ul className="flex-col">
            <li className="p-2 border-b">
              <a href="#home" className="block text-xs sm:text-sm">
                صفحه اصلی
              </a>
            </li>
            <li className="p-2 border-b">
              <a href="#contact" className="block text-xs sm:text-sm">
                تماس با ما
              </a>
            </li>
            <li className="p-2">
              <a href="#about" className="block text-xs sm:text-sm">
                درباره ما
              </a>
            </li>
          </ul>
        </div>

        {/* Separate input element outside of the menu toggle div */}
        <div className="hidden md:flex items-center justify-between md:w-full lg:px-10">
          <ul className="flex space-x-3 lg:space-x-4">
            <li className="p-2">
              <a href="#home">صفحه اصلی</a>
            </li>
            <li className="p-2">
              <a href="#contact">تماس با ما</a>
            </li>
            <li className="p-2">
              <a href="#about">درباره ما</a>
            </li>
          </ul>

          <div className="md:w-1/3 relative">
            <input
              type="text"
              className="hidden md:w-full md:block ml-8 border-opacity-65 placeholder:text-sm min-h-10 cursor-pointer outline-none rounded-3xl border border-gray-300 px-4 py-2"
              placeholder="شهر مقصد، عنوان و یا شناسه اقامتگاه"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="size-5 absolute left-1.5 top-1.5 rounded-full bg-green-500 w-8 h-8 p-1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>

          {/* Conditional rendering based on login status */}
          {isLoggedIn ? (
            <span className="text-green-700">{userName}</span>
          ) : (
            <a href="/login" className="text-green-700 md:ml-6 ">
              ورود | ثبت نام
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
