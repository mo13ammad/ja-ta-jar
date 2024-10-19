import React, { useState } from "react";
import logo from "../../public/assets/logotype.png"
import { Link } from "react-router-dom";
import useUser from '../features/authentication/useUser'; // Assuming this gets user data

function Header() {
     const {data} = useUser()
  console.log(data);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="w-full rounded-b-lg  absolute md:relative md:container"> 
      <nav className="relative w-full px-5 py-2 flex bg-gray-50 shadow-md flex-wrap justify-between items-center rounded-b-xl">
        {/* Logo */}
        <Link to="/" className="ml-auto">
          <img className=" max-w-32 max-h-8" src={logo} alt="Logo" />
        </Link>

        {/* Links in lg size */}
        <div className="hidden md:flex lg:items-center lg:mr-auto lg:space-x-4 lg:space-x-reverse">
          {data?.name ? (
            <p className="text-gray-700 text-sm">{data.name}</p>
          ) : (
            <Link to="/auth" className="text-gray-700 hover:text-green-600">
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
        <div className="md:hidden w-full">
          <div className="flex flex-col items-end text-gray-700 bg-white w-full overflow-hidden">
            <Link to="/login" className="block py-2 px-2 hover:bg-gray-200 w-full text-right">
              ورود
            </Link>
            <Link to="/" className="block py-2 px-2 hover:bg-gray-200 w-full text-right">
              صفحه اصلی
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
