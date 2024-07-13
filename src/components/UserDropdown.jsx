import React, { useState, useEffect } from "react";

function UserDropdown({ isMobile }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false); // Track if mouse is over the dropdown

  const toggleDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      clearTimeout(hoverTimeout);
      setShowUserDropdown(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setHoverTimeout(
        setTimeout(() => {
          if (!isHoveringDropdown) {
            setShowUserDropdown(false);
          }
        }, 500)
      );
    }
  };

  const handleDropdownMouseEnter = () => {
    setIsHoveringDropdown(true);
    clearTimeout(hoverTimeout);
  };

  const handleDropdownMouseLeave = () => {
    setIsHoveringDropdown(false);
    if (!isMobile) {
      setHoverTimeout(
        setTimeout(() => {
          setShowUserDropdown(false);
        }, 500)
      );
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  const handleItemClick = (e) => {
    e.preventDefault();
    // Perform redirect based on login status
    const isLoggedIn = true; // Replace with actual login status check
    if (isLoggedIn) {
      // Redirect to dashboard if logged in
      window.location.href = "./dashboard.html"; // Example redirect
    } else {
      // Redirect to login page if not logged in
      window.location.href = "./login.html"; // Example redirect
    }
  };

  return (
    <div className="order-4 hidden lg:flex">
      <span
        className="block relative"
        onMouseEnter={!isMobile ? handleMouseEnter : undefined}
        onMouseLeave={!isMobile ? handleMouseLeave : undefined}
      >
        <a
          href="#"
          className="flex items-center h-10 leading-10 px-3 mx-1 transition rounded-xl hover:bg-green-50"
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown();
          }}
        >
          <span className="text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </span>
          <span className="text-sm opacity-95">ورود | ثبت نام</span>
          <span className="text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </a>
        {showUserDropdown && (
          <div
            className="bg-white rounded-2xl shadow-md border-gray-50 text-sm absolute top-auto left-0 w-64 z-30 mt-2 dropdown-enter-active"
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <div className="bg-white rounded-2xl w-full relative z-10 py-2 px-2">
              <ul className="list-reset">
                <li className="relative border-b-2 border-green-300 pb-2">
                  <a
                    href="./profile.html"
                    className="px-2 py-2 flex w-full items-start hover:bg-green-50 rounded-xl"
                    onClick={handleItemClick}
                  >
                    <span className="flex justify-center items-center opacity-90">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                      محمد سعادتی
                    </span>
                  </a>
                </li>
                {/* Add more menu items as needed */}
              </ul>
            </div>
          </div>
        )}
      </span>
    </div>
  );
}

export default UserDropdown;
