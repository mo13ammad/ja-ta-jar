// HouseReservationMenu.jsx

import React, { useState, useEffect, useRef, useMemo } from "react";
import toPersianNumber from "../../../utils/toPersianNumber";
import { MinusIcon, TrashIcon } from "@heroicons/react/24/outline";
import PeopleDropdown from "./PeopleNumberDropDown";
import CalendarContainer from "../../calendar/CalendarContainer";
import { Transition } from "@headlessui/react";

function HouseReservationMenu({
  houseData,
  reserveDateFrom,
  reserveDateTo,
  setReserveDateFrom,
  setReserveDateTo,
  uuid,
  calendarData,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const reserveMenuRef = useRef(null);
  const calendarModalRef = useRef(null);

  // Compute the price from the first encountered valid day
  const firstValidPrice = useMemo(() => {
    if (!calendarData || calendarData.length === 0) return null;

    for (const month of calendarData) {
      for (const day of month.days) {
        if (!day.isDisable && !day.isLock && !day.isBlank && day.effective_price > 0) {
          // Return the first valid price and stop searching
          return day.effective_price;
        }
      }
    }

    return null; // No valid day found
  }, [calendarData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCalendarModal &&
        calendarModalRef.current &&
        !calendarModalRef.current.contains(event.target)
      ) {
        setShowCalendarModal(false);
      } else if (
        !showCalendarModal &&
        isExpanded &&
        reserveMenuRef.current &&
        !reserveMenuRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendarModal, isExpanded]);

  useEffect(() => {
    if (reserveDateFrom && reserveDateTo) {
      setShowCalendarModal(false);
      setIsExpanded(true);
    }
  }, [reserveDateFrom, reserveDateTo]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {showCalendarModal && (
        <div
          className="fixed inset-0 opacity-50 z-40"
          onClick={() => {
            setShowCalendarModal(false);
          }}
        ></div>
      )}

      {isExpanded && !showCalendarModal && (
        <div
          className="fixed inset-0 opacity-50 z-30"
          onClick={() => {
            setIsExpanded(false);
          }}
        ></div>
      )}

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
          <div className="flex justify-between items-center p-4">
            <button onClick={() => setShowCalendarModal(false)}>
              <MinusIcon className="w-7 h-7 text-gray-700 mb-1" />
            </button>
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
          <CalendarContainer
            reserveDateFrom={reserveDateFrom}
            setReserveDateFrom={setReserveDateFrom}
            reserveDateTo={reserveDateTo}
            setReserveDateTo={setReserveDateTo}
            closeModal={() => setShowCalendarModal(false)}
            instantBooking={houseData.instant_booking}
            calendarData={calendarData}
          />
        </div>
      </Transition>

      <div
        ref={reserveMenuRef}
        className={`z-50 px-4 pt-1 w-full shadow-centered flex flex-col bg-primary-50 rounded-t-3xl md:hidden fixed bottom-0 transition-all duration-300`}
        style={{
          zIndex: 500,
          maxHeight: isExpanded ? "80vh" : "6rem",
        }}
      >
        <div className="flex w-full justify-center items-center px-4">
          <div
            className="flex justify-center w-full cursor-pointer"
            onClick={() => setIsExpanded((v) => !v)}
          >
            <MinusIcon className="w-7 h-7 text-primary-800 mb-1" />
          </div>
          <div className="w-7 h-7"></div>
        </div>

        <div className="overflow-hidden transition-all duration-300">
          {isExpanded ? (
            // Expanded content
            <div className="flex-1 overflow-y-auto px-4">
              <p className="text-sm ">تاریخ رزرو</p>
              <div
                className="h-12 my-1.5 w-full flex items-center justify-between rounded-xl shadow-sm bg-white px-4 border"
                onClick={() => setShowCalendarModal(true)}
              >
                <div className="flex-1 flex items-center justify-center w-full h-full text-gray-700 text-sm cursor-pointer">
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

                <div className="w-px h-6 bg-gray-400 mx-2"></div>

                <div className="flex-1 flex items-center justify-center w-full h-full text-gray-700 text-sm cursor-pointer">
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

              <div className="text-sm flex justify-center w-full my-2 mt-4">
                <PeopleDropdown />
              </div>

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
              <div className="flex gap-2 text-primary-800 px-3 py-1.5 xs:mr-10 rounded-3xl">
                <p className="font-bold xs:text-lg">قیمت هر شب از :</p>
                <p className="font-bold xs:text-lg">
                  {firstValidPrice
                    ? toPersianNumber(firstValidPrice.toLocaleString())
                    : "ناموجود"}
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
