// HouseReserveMenu.jsx

import React, { useState, useEffect, useRef } from "react";
import toPersianNumber from "./../../../utils/toPersianNumber";
import { MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import PeopleDropdown from "./PeopleNumberDropDown";

function HouseReserveMenu({ houseData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reserveDateFrom, setreServeDateFrom] = useState("10/8/1403");
  const [reserveDateTo, setreServeDateTo] = useState(null);

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
          isExpanded ? 'h-[35vh]' : 'h-24'
        }`}
      >
        {/* Top Bar with Close Icon */}
        <div className="flex w-full justify-center items-center px-4">
         
          

          {/* Minus Icon */}
          <div
            className="flex justify-center w-full cursor-pointer"
            onClick={() => setIsExpanded(v => !v)}
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
            <p className="text-sm ">
                 تاریخ رزرو
            </p>
            <div className="h-12 my-1.5 w-full flex items-center justify-between rounded-xl shadow-centered bg-gray-100 px-4">
                  
            
                       <div className="flex-1 flex items-center justify-center  w-full h-full text-gray-700 text-sm">
                       {reserveDateFrom ?
                              <div className="h-full flex flex-col items-center justify-center w-full ">
                                <p>ورود</p>
                                <p>{reserveDateFrom}</p>
                              </div>
                                :
                              <div className="h-full flex items-center justify-center w-full">
                                <p>تاریخ ورود</p>
                              </div>
                           }
                        </div>

                      {/*separator*/}
                      <div className="w-px h-6 bg-gray-400 mx-2"></div>

                   
                      <div className="flex-1 flex items-center justify-center  w-full h-full text-gray-700 text-sm">
                            {reserveDateTo ?
                              <div className="h-full flex flex-col items-center justify-center w-full ">
                                <p>خروج</p>
                                <p>{reserveDateTo}</p>
                              </div>
                                :
                              <div className="h-full flex items-center justify-center w-full">
                                <p>تاریخ خروج</p>
                              </div>
                           }
                       </div>
                 </div>
                  
                  <div className="text-sm my-2 mt-4">                 
                    <PeopleDropdown/>
                  </div>
           

                 <div className="w-full my-3 mt-6">
                  <button className="w-full btn rounded-3xl bg-primary-500 hover:bg-primary-600 transition-all duration-300 px-3 py-1.5">رزرو</button>
                 </div>
          </div>
        ) : (
          // Collapsed content
          <div
            className="flex w-full justify-between items-center cursor-pointer"
            onClick={handleToggle}
          >
            <div className="flex gap-2 text-white bg-primary-500 px-3 py-1.5 xs:mr-10 rounded-3xl">
              <p className="font-bold text-sm xs:text-md">قیمت هر شب :</p>
              <p className="text-sm xs:text-md">{toPersianNumber("3,500,000")}</p>
            </div>

            <button className="btn text-sm xs:text-md bg-primary-600 px-4 py-1.5">
              رزرو اقامتگاه
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default HouseReserveMenu;
