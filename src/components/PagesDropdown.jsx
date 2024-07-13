import React, { useState, useEffect } from "react";

function PagesDropdown({ isMobile }) {
  const [showPagesDropdown1, setShowPagesDropdown1] = useState(false);
  const [showPagesDropdown2, setShowPagesDropdown2] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isHoveringDropdown1, setIsHoveringDropdown1] = useState(false);
  const [isHoveringDropdown2, setIsHoveringDropdown2] = useState(false);

  const toggleDropdown1 = () => {
    setShowPagesDropdown1(!showPagesDropdown1);
    if (!showPagesDropdown1) {
      setShowPagesDropdown2(false);
    }
  };

  const toggleDropdown2 = () => {
    setShowPagesDropdown2(!showPagesDropdown2);
    if (!showPagesDropdown2) {
      setShowPagesDropdown1(false);
    }
  };

  const handleMouseEnter1 = () => {
    if (!isMobile) {
      clearTimeout(hoverTimeout);
      setShowPagesDropdown1(true);
      setShowPagesDropdown2(false); // Ensure other dropdown is hidden
    }
  };

  const handleMouseLeave1 = () => {
    if (!isMobile) {
      setHoverTimeout(
        setTimeout(() => {
          if (!isHoveringDropdown1) {
            setShowPagesDropdown1(false);
          }
        }, 500)
      );
    }
  };

  const handleMouseEnter2 = () => {
    if (!isMobile) {
      clearTimeout(hoverTimeout);
      setShowPagesDropdown2(true);
      setShowPagesDropdown1(false); // Ensure other dropdown is hidden
    }
  };

  const handleMouseLeave2 = () => {
    if (!isMobile) {
      setHoverTimeout(
        setTimeout(() => {
          if (!isHoveringDropdown2) {
            setShowPagesDropdown2(false);
          }
        }, 500)
      );
    }
  };

  const handleDropdownMouseEnter1 = () => {
    setIsHoveringDropdown1(true);
    clearTimeout(hoverTimeout);
  };

  const handleDropdownMouseLeave1 = () => {
    setIsHoveringDropdown1(false);
    if (!isMobile) {
      setHoverTimeout(
        setTimeout(() => {
          setShowPagesDropdown1(false);
        }, 500)
      );
    }
  };

  const handleDropdownMouseEnter2 = () => {
    setIsHoveringDropdown2(true);
    clearTimeout(hoverTimeout);
  };

  const handleDropdownMouseLeave2 = () => {
    setIsHoveringDropdown2(false);
    if (!isMobile) {
      setHoverTimeout(
        setTimeout(() => {
          setShowPagesDropdown2(false);
        }, 500)
      );
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  return (
    <div className="order-3 hidden lg:flex flex-wrap items-center">
      {/* First Dropdown */}
      <li
        className="block relative"
        onMouseEnter={handleMouseEnter1}
        onMouseLeave={handleMouseLeave1}
      >
        <a
          href="#"
          className={`flex items-center h-10 leading-10 px-3 cursor-pointer text-sm no-underline hover:no-underline duration-100 mx-1 transition text-gray-700 ${
            showPagesDropdown1 ? "text-green-500" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown1();
          }}
        >
          <span>صفحات</span>
          <span
            className={`text-green-500 ml-1 ${
              showPagesDropdown1 ? "transform rotate-180" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-5`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19 9-7 7-7-7"
              />
            </svg>
          </span>
        </a>
        {showPagesDropdown1 && (
          <div
            id="pagesDropdown1"
            className={`bg-white rounded-2xl shadow-md text-sm absolute top-auto left-0 xl:right-0 min-w-full w-56 z-30 mt-3 dropdown-enter-active ${
              !showPagesDropdown1 ? "dropdown-leave-to" : ""
            }`}
            onMouseEnter={handleDropdownMouseEnter1}
            onMouseLeave={handleDropdownMouseLeave1}
          >
            <div className="bg-white rounded-2xl w-full relative z-10 py-2 px-2">
              <ul className="list-reset">
                <li className="relative">
                  <a
                    href="./404.html"
                    className="px-4 py-2 flex w-full items-start hover:text-green-500 rounded-lg transition no-underline hover:no-underline duration-100 cursor-pointer"
                  >
                    <span className="flex-1">404</span>
                  </a>
                </li>
                <li className="relative">
                  <a
                    href="./another-page.html"
                    className="px-4 py-2 flex w-full items-start hover:text-green-500 rounded-lg transition no-underline hover:no-underline duration-100 cursor-pointer"
                  >
                    <span className="flex-1">Another Page</span>
                  </a>
                </li>
                {/* Add more menu items as needed */}
              </ul>
            </div>
          </div>
        )}
      </li>

      {/* Second Dropdown */}
      <li
        className="block relative"
        onMouseEnter={handleMouseEnter2}
        onMouseLeave={handleMouseLeave2}
      >
        <a
          href="#"
          className={`flex items-center h-10 leading-10 px-3 cursor-pointer text-sm no-underline hover:no-underline duration-100 mx-1 transition text-gray-700 ${
            showPagesDropdown2 ? "text-green-500" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown2();
          }}
        >
          <span>صفحات</span>
          <span
            className={`text-green-500 ml-1 ${
              showPagesDropdown2 ? "transform rotate-180" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-5`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19 9-7 7-7-7"
              />
            </svg>
          </span>
        </a>
        {showPagesDropdown2 && (
          <div
            id="pagesDropdown2"
            className={`bg-white rounded-2xl shadow-md text-sm absolute top-auto left-0 xl:right-0 min-w-full w-56 z-30 mt-3 dropdown-enter-active ${
              !showPagesDropdown2 ? "dropdown-leave-to" : ""
            }`}
            onMouseEnter={handleDropdownMouseEnter2}
            onMouseLeave={handleDropdownMouseLeave2}
          >
            <div className="bg-white rounded-2xl w-full relative z-10 py-2 px-2">
              <ul className="list-reset">
                <li className="relative">
                  <a
                    href="./page1.html"
                    className="px-4 py-2 flex w-full items-start hover:text-green-500 rounded-lg transition no-underline hover:no-underline duration-100 cursor-pointer"
                  >
                    <span className="flex-1">Page 1</span>
                  </a>
                </li>
                <li className="relative">
                  <a
                    href="./page2.html"
                    className="px-4 py-2 flex w-full items-start hover:text-green-500 rounded-lg transition no-underline hover:no-underline duration-100 cursor-pointer"
                  >
                    <span className="flex-1">Page 2</span>
                  </a>
                </li>
                {/* Add more menu items as needed */}
              </ul>
            </div>
          </div>
        )}
      </li>
    </div>
  );
}

export default PagesDropdown;
