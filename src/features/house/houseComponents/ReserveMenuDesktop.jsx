import React, { useEffect, useRef, useState } from "react";
import PeopleDropdown from "./PeopleNumberDropDown";
import toPersianNumber from "../../../utils/toPersianNumber";
import { Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import CalendarContainer from "../../calender/CalendarContainer";

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

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCalendarModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setShowCalendarModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendarModal]);

 

  return (
    <div>
      {/* Modal Transition */}
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
          className="fixed inset-y-0 right-0 z-50 flex   rounded-l-3xl flex-col overflow-auto max-h-full scrollbar-thin w-3/5 lg:w-1/2 xl:w-1/3 shadow-lg"
        >
          {/* Header with Close and Clear buttons */}
          <div className="flex justify-between bg-gray-50 p-4">
            {/* Clear Button */}
            <button
              onClick={() => {
                setReserveDateFrom(null);
                setReserveDateTo(null);
              }}
              className="mr-4 py-1.5 px-3 border rounded-2xl border-gray-400 flex items-center"
            >
              <TrashIcon className="w-5 h-5 ml-2" />
              پاک کردن
            </button>
            {/* Close Button */}
            <button onClick={() => setShowCalendarModal(false)}>
              <span className="text-gray-700 text-xl">&times;</span>
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
            calendarData={calendarData}
          />
        </div>
      </Transition>

      <div className="flex flex-col w-full px-4">
        {/* Reservation Dates */}
        <p className="my-1">تاریخ رزرو</p>
        <div className="h-12 my-1.5 w-full flex items-center justify-between rounded-xl shadow-sm bg-white px-4 border">
          {/* Date From */}
          <div
            className="flex-1 flex items-center justify-center w-full h-full text-gray-700 text-sm cursor-pointer"
            onClick={() => setShowCalendarModal(true)}
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

          {/* Separator */}
          <div className="w-px h-6 bg-gray-400 mx-2"></div>

          {/* Date To */}
          <div
            className="flex-1 flex items-center justify-center w-full h-full text-gray-700 text-sm cursor-pointer"
            onClick={() => setShowCalendarModal(true)}
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

        {/* People Dropdown */}
        <div className="my-2 mt-4">
          <p className="mb-1">تعداد نفرات :</p>
          <div className="text-sm bg-white border rounded-xl">
            <PeopleDropdown />
          </div>
        </div>

        {/* Reserve Button */}
        <div className="w-full my-3 mt-6">
          <button className="w-full btn rounded-3xl bg-primary-500 hover:bg-primary-600 transition-all duration-300 px-4 py-2">
            رزرو
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReserveMenuDesktop;
