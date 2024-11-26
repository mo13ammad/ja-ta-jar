// HouseReserveMenu.jsx

import React, { useState, useEffect, useRef } from "react";
import toPersianNumber from "./../../../utils/toPersianNumber";
import { MinusIcon, XMarkIcon } from "@heroicons/react/24/outline";

function HouseReserveMenu({ houseData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const reserveMenuRef = useRef(null);

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isExpanded &&
        reserveMenuRef.current &&
        !reserveMenuRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  // Function to toggle the expanded state
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Overlay when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsExpanded(false)}
        ></div>
      )}

      <div
        ref={reserveMenuRef}
        className={`z-50 px-4 pt-1 shadow-centered flex flex-col bg-primary-50 w-full rounded-t-3xl md:hidden fixed bottom-0 transition-all duration-300 ${
          isExpanded ? "h-[50vh]" : "h-24"
        }`}
      >
        {/* Top Bar with Close Icon */}
        <div className="flex w-full justify-center items-center px-4">
          {/* Minus Icon */}
          <div
            className="flex justify-center w-full cursor-pointer"
            onClick={() => setIsExpanded((v) => !v)}
          >
            <MinusIcon className="w-7 h-7 text-primary-800 mb-1" />
          </div>

          {/* Empty div to balance the flex layout */}
          <div className="w-7 h-7"></div>
        </div>

        {/* Content */}
        {isExpanded ? (
          // Expanded content
          <div className="flex-1 overflow-y-auto px-4">
            {/* Add the content you want to display when expanded */}
            <p className="text-gray-700 text-sm mt-4">
              {/* Example expanded content */}
           
            </p>
            {/* You can add more components or content here */}
          </div>
        ) : (
          // Collapsed content
          <div
            className="flex w-full justify-between items-center cursor-pointer pr-10"
            onClick={handleToggle}
          >
            <div className="flex gap-2 text-white bg-primary-500 px-3 py-1.5 rounded-3xl">
              <p className="font-bold">قیمت هر شب :</p>
              <p>{toPersianNumber("3,500,000")}</p>
            </div>

            <button className="btn bg-primary-600 px-4 pr-5 py-1.5">
              رزرو اقامتگاه
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default HouseReserveMenu;
