import React, { useState } from "react";
import logo from "../assets/jatajarlogo.webp";

function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="w-full">
      <nav className="relative w-full px-5 py-2 flex bg-gray-100 shadow-md flex-wrap justify-between items-center">
        {/* Logo */}
        <a href="/" className="ml-auto">
          <img className="max-w-28 md:max-w-32 max-h-10" src={logo} alt="Logo" />
        </a>

        {/* Links in lg size */}
        <div className="hidden lg:flex lg:items-center lg:mr-auto lg:space-x-4 lg:space-x-reverse">
          <a href="/login" className="text-gray-700 hover:text-green-600">ورود | ثبت نام</a>
 
      
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            className="text-green-600 p-3"
            onClick={toggleMobileMenu}
          >
            <svg
              className="block h-4 w-4"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Dropdowns) */}
      {showMobileMenu && (
        <div className="lg:hidden w-full">
          <div className="flex flex-col items-end text-gray-700 bg-white w-full overflow-hidden">
            <a href="/login" className="block py-2 px-2 hover:bg-gray-200 w-full text-right">
              ورود
            </a>
            <a href="/" className="block py-2 px-2 hover:bg-gray-200 w-full text-right">
              صفحه اصلی
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
