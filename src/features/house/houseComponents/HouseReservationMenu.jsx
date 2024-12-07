// HouseReservationMenu.jsx

import React, { useState, useEffect, useRef } from "react";
import toPersianNumber from "../../../utils/toPersianNumber";
import { MinusIcon, TrashIcon } from "@heroicons/react/24/outline"; // Import TrashIcon
import PeopleDropdown from "./PeopleNumberDropDown";
import CalendarContainer from "../../calender/CalendarContainer";
import { Transition } from "@headlessui/react";

function HouseReservationMenu({
  houseData,
  reserveDateFrom,
  reserveDateTo,
  setReserveDateFrom,
  setReserveDateTo,
  uuid,
  calendarData, // Receive calendar data
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const reserveMenuRef = useRef(null);
  const calendarModalRef = useRef(null); // New ref for calendar modal

  // Function to toggle the expanded state
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCalendarModal &&
        calendarModalRef.current &&
        !calendarModalRef.current.contains(event.target)
      ) {
        setShowCalendarModal(false);
      } else if (
        !showCalendarModal && // Only close the reservation menu if the calendar modal is not open
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
  }, [showCalendarModal, isExpanded]);

  // Close modal when both dates are selected
  useEffect(() => {
    if (reserveDateFrom && reserveDateTo) {
      setShowCalendarModal(false);
      // Ensure the reservation menu remains expanded
      setIsExpanded(true);
    }
  }, [reserveDateFrom, reserveDateTo]);

  return (
    <>
      {/* Overlay for calendar modal */}
      {showCalendarModal && (
        <div
          className="fixed inset-0  opacity-50 z-40"
          onClick={() => {
            setShowCalendarModal(false);
          }}
        ></div>
      )}

      {/* Overlay for expanded menu */}
      {isExpanded && !showCalendarModal && (
        <div
          className="fixed inset-0  opacity-50 z-30"
          onClick={() => {
            setIsExpanded(false);
          }}
        ></div>
      )}

      {/* Calendar Modal with Transition */}
      <Transition
        show={showCalendarModal}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 translate-y-full"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-full"
        className="fixed w-full bottom-0 z-50 flex"
        style={{ zIndex: 1000 }}
      >
        <div
          ref={calendarModalRef}
          className="w-full h-[80vh] md:hidden flex flex-col bg-gray-50 rounded-t-3xl overflow-auto"
        >
          {/* Header with Close and Clear buttons */}
          <div className="flex justify-between items-center p-4">
            {/* Close Button */}
            <button onClick={() => setShowCalendarModal(false)}>
              <MinusIcon className="w-7 h-7 text-gray-700 mb-1" />
            </button>
            {/* Clear Button */}
            <button
              onClick={() => {
                setReserveDateFrom(null);
                setReserveDateTo(null);
              }}
              className="py-1.5 px-3 border rounded-2xl border-gray-400 flex items-center"
            >
              پاک کردن
              <TrashIcon className="w-5 h-5 mr-2" />
            </button>
          </div>
          {/* CalendarContainer */}
          <CalendarContainer
            reserveDateFrom={reserveDateFrom}
            setReserveDateFrom={setReserveDateFrom}
            reserveDateTo={reserveDateTo}
            setReserveDateTo={setReserveDateTo}
            closeModal={() => setShowCalendarModal(false)}
            instantBooking={houseData.instant_booking}
            calendarData={calendarData} // Pass calendar data
          />
        </div>
      </Transition>

      {/* Reservation Menu */}
      <div
        ref={reserveMenuRef}
        className={`z-50 px-4 pt-1 w-full shadow-centered flex flex-col bg-primary-50 rounded-t-3xl md:hidden fixed bottom-0 transition-all duration-300`}
        style={{
          zIndex: 500,
          maxHeight: isExpanded ? "80vh" : "6rem", // Adjusted for smooth transition
        }}
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
        <div className="overflow-hidden transition-all duration-300">
          {isExpanded ? (
            // Expanded content
            <div className="flex-1 overflow-y-auto px-4">
              {/* Reservation Dates */}
              <p className="text-sm ">تاریخ رزرو</p>
              <div className="h-12 my-1.5 w-full flex items-center justify-between rounded-xl shadow-sm bg-white px-4 border">
                {/* Date From */}
                <div
                  className="flex-1 flex items-center justify-center w-full h-full text-gray-700 text-sm cursor-pointer"
                  onClick={() => setShowCalendarModal(true)} // Open calendar modal
                >
                  {reserveDateFrom ? (
                    <div className="h-full flex flex-col items-center justify-center w-full ">
                      <p>ورود</p>
                      <p>{`${toPersianNumber(
                        reserveDateFrom.year
                      )}/${toPersianNumber(
                        reserveDateFrom.month
                      )}/${toPersianNumber(reserveDateFrom.day)}`}</p>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center w-full">
                      <p>تاریخ ورود</p>
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div className="w-px h-6 bg-gray-400 mx-2"></div>

                {/* Date To */}
                <div
                  className="flex-1 flex items-center justify-center w-full h-full text-gray-700 text-sm cursor-pointer"
                  onClick={() => setShowCalendarModal(true)} // Open calendar modal
                >
                  {reserveDateTo ? (
                    <div className="h-full flex flex-col items-center justify-center w-full ">
                      <p>خروج</p>
                      <p>{`${toPersianNumber(
                        reserveDateTo.year
                      )}/${toPersianNumber(
                        reserveDateTo.month
                      )}/${toPersianNumber(reserveDateTo.day)}`}</p>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center w-full">
                      <p>تاریخ خروج</p>
                    </div>
                  )}
                </div>
              </div>

              {/* People Dropdown */}
              <div className="text-sm flex justify-center w-full my-2 mt-4">
                <PeopleDropdown />
              </div>

              {/* Reserve Button */}
              <div className="w-full my-3 mt-6">
                <button className="w-full btn rounded-3xl bg-primary-500 hover:bg-primary-600 transition-all duration-300 px-3 py-1.5">
                  رزرو
                </button>
              </div>
            </div>
          ) : (
            // Collapsed content
            <div
              className="flex w-full justify-between items-center pb-4 cursor-pointer"
              onClick={handleToggle}
            >
              <div className="flex gap-2 text-primary-800  px-3 py-1.5 xs:mr-10 rounded-3xl">
                <p className="font-bold xs:text-lg">قیمت هر شب از :</p>
                <p className="font-bold xs:text-lg">
                  {toPersianNumber("3,500,000")}
                </p>
              </div>

              <button className="btn text-xs xs:text-md bg-primary-600 px-4 py-2">
                رزرو اقامتگاه
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HouseReservationMenu;
