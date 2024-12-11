// ReserveMenuDesktop.jsx

import React, { useState, useEffect, useRef, useMemo } from "react";
import PeopleDropdown from "./PeopleNumberDropDown";
import toPersianNumber from "../../../utils/toPersianNumber";
import { Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import CalendarContainer from "../../calendar/CalendarContainer";

function ReserveMenuDesktop({
  reserveDateFrom,
  reserveDateTo,
  setReserveDateFrom,
  setReserveDateTo,
  houseData,
  uuid,
  calendarData,
}) {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const modalRef = useRef(null);

  console.log("ReserveMenuDesktop - calendarData:", calendarData);

  // If you only want the first valid day's price:
  const firstValidPrice = useMemo(() => {
    if (!calendarData || calendarData.length === 0) {
      console.log("No calendarData available, returning null");
      return null;
    }

    for (const month of calendarData) {
      console.log("Checking month:", month);
      for (const day of month.days) {
        console.log(
          `Day ${day.day}: isDisable=${day.isDisable}, isLock=${day.isLock}, isBlank=${day.isBlank}, effective_price=${day.effective_price}`
        );
        if (!day.isDisable && !day.isLock && !day.isBlank && day.effective_price > 0) {
          console.log(`First valid day found: Day ${day.day} with price ${day.effective_price}`);
          // Return the first valid price and stop searching
          return day.effective_price;
        }
      }
    }

    // If no valid day found:
    return null;
  }, [calendarData]);

  console.log("Computed firstValidPrice:", firstValidPrice);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCalendarModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        console.log("Click outside modal detected, closing calendar modal.");
        setShowCalendarModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      console.log("Cleaning up event listener for click outside modal.");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendarModal]);

  return (
    <div>
      <Transition
        show={showCalendarModal}
        as={React.Fragment}
        unmount={true}
        enter="transition ease-out duration-300 transform"
        enterFrom="opacity-0 translate-x-full"
        enterTo="opacity-100 translate-x-0"
        leave="transition ease-in duration-200 transform"
        leaveFrom="opacity-100  translate-x-0"
        leaveTo="opacity-0  translate-x-full"
      >
        <div
          ref={modalRef}
          className="fixed inset-y-0 right-0 z-50 flex rounded-l-3xl flex-col overflow-auto max-h-full scrollbar-thin w-3/5 lg:w-1/2 xl:w-1/3 shadow-lg"
        >
          <div className="flex justify-between bg-gray-50 p-4">
            <button
              onClick={() => {
                console.log("Clearing selected dates.");
                setReserveDateFrom(null);
                setReserveDateTo(null);
              }}
              className="mr-4 py-1.5 px-3 border rounded-2xl border-gray-400 flex items-center"
            >
              <TrashIcon className="w-5 h-5 ml-2" />
              پاک کردن
            </button>
            <button
              onClick={() => {
                console.log("Closing calendar modal from top-right button.");
                setShowCalendarModal(false);
              }}
            >
              <span className="text-gray-700 text-xl">&times;</span>
            </button>
          </div>
          <CalendarContainer
            reserveDateFrom={reserveDateFrom}
            setReserveDateFrom={setReserveDateFrom}
            reserveDateTo={reserveDateTo}
            setReserveDateTo={setReserveDateTo}
            closeModal={() => {
              console.log("Closing calendar modal from CalendarContainer.");
              setShowCalendarModal(false);
            }}
            instantBooking={houseData.instant_booking}
            calendarData={calendarData}
          />
        </div>
      </Transition>

      <div className="flex flex-col w-full px-4">
        <div className="w-full rounded-b rounded-3xl px-1 md:px-3 lg:px-8 flex justify-between py-3 mb-4 bg-primary-500 mt-4 rounded-3xl">
          <p className="text-white text-sm lg:text-lg">قیمت هر شب از</p>
          <p className="text-white text-sm lg:text-lg">
            {firstValidPrice
              ? `${toPersianNumber(firstValidPrice.toLocaleString())} تومان`
              : "ناموجود"}
          </p>
        </div>

        <p className="my-1">تاریخ رزرو</p>
        <div className="h-12 my-1.5 w-full flex items-center justify-between rounded-xl shadow-sm bg-white px-4 border">
          <div
            className="flex-1 flex items-center justify-center w-full h-full text-gray-700 text-sm cursor-pointer"
            onClick={() => {
              console.log("Opening calendar modal for start date selection.");
              setShowCalendarModal(true);
            }}
          >
            {reserveDateFrom ? (
              <div className="h-full flex flex-col items-center justify-center w-full">
                <p className="text-md">ورود</p>
                <p>{`${toPersianNumber(
                  reserveDateFrom.year
                )}/${toPersianNumber(
                  reserveDateFrom.month
                )}/${toPersianNumber(reserveDateFrom.day)}`}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center w-full">
                <p className="text-md">تاریخ ورود</p>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-400 mx-2"></div>

          <div
            className="flex-1 flex items-center justify-center w-full h-full text-gray-700 text-sm cursor-pointer"
            onClick={() => {
              console.log("Opening calendar modal for end date selection.");
              setShowCalendarModal(true);
            }}
          >
            {reserveDateTo ? (
              <div className="h-full flex flex-col items-center justify-center w-full">
                <p className="text-md">خروج</p>
                <p>{`${toPersianNumber(
                  reserveDateTo.year
                )}/${toPersianNumber(
                  reserveDateTo.month
                )}/${toPersianNumber(reserveDateTo.day)}`}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center w-full">
                <p className="text-md">تاریخ خروج</p>
              </div>
            )}
          </div>
        </div>

        <div className="my-2 mt-4">
          <p className="mb-1">تعداد نفرات :</p>
          <div className="text-sm bg-white border rounded-xl">
            <PeopleDropdown />
          </div>
        </div>

        <div className="w-full my-3 mt-6">
          <button
            className="w-full btn rounded-3xl bg-primary-500 hover:bg-primary-600 transition-all duration-300 px-4 py-2"
            onClick={() => {
              console.log("Reserve button clicked with selected dates:", reserveDateFrom, reserveDateTo);
            }}
          >
            رزرو
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReserveMenuDesktop;
