// src/features/house/houseComponents/ReserveMenuDesktop.jsx

import React, { useState, useEffect, useRef, useMemo } from "react";
import PeopleDropdown from "./PeopleNumberDropDown";
import toPersianNumber from "../../../utils/toPersianNumber";
import { Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import CalendarContainer from "../../calendar/CalendarContainer";
import Loading from "../../../ui/Loading";

function ReserveMenuDesktop({
  reserveDateFrom,
  reserveDateTo,
  setReserveDateFrom,
  setReserveDateTo,
  houseData,
  uuid,
  calendarData,
  isRentRoom,
  roomOptions,
  selectedRoomUuid,
  setSelectedRoomUuid,
}) {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const modalRef = useRef(null);

  // If you only want the first valid day's price:
  const firstValidPrice = useMemo(() => {
    if (!calendarData || calendarData.length === 0) {
      return null;
    }

    if (isRentRoom) {
      // Rent-room scenario: calendarData is array of rooms
      // Each room has a calendar property which is an array of month objects.
      for (const room of calendarData) {
        if (!room.calendar || !Array.isArray(room.calendar)) continue;

        for (const month of room.calendar) {
          if (!month.days) continue;
          for (const day of month.days) {
            if (!day.isDisable && !day.isLock && !day.isBlank && day.effective_price > 0) {
              return day.effective_price;
            }
          }
        }
      }
    } else {
      // House scenario: calendarData is array of months directly
      for (const month of calendarData) {
        if (!month.days) continue;
        for (const day of month.days) {
          if (!day.isDisable && !day.isLock && !day.isBlank && day.effective_price > 0) {
            return day.effective_price;
          }
        }
      }
    }

    return null;
  }, [calendarData, isRentRoom]);

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
    <div className="w-full bg-gray-50 pb-4 rounded-3xl">
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
              setShowCalendarModal(false);
            }}
            instantBooking={houseData.instant_booking}
            calendarData={calendarData}
            loadingCalendar={false} // Assuming loading is handled outside
            isRentRoom={isRentRoom}
            roomOptions={roomOptions}
            selectedRoomUuid={selectedRoomUuid}
            setSelectedRoomUuid={setSelectedRoomUuid}
          />
        </div>
      </Transition>

      <div className="flex flex-col w-full">
      <div className="w-full rounded-b rounded-3xl px-1 md:px-3 lg:px-8 flex justify-between py-3  bg-primary-500  ">
  <p className="text-white text-sm lg:text-lg">قیمت هر شب از</p>
  {firstValidPrice ? (
    <p className="text-white text-sm lg:text-lg">
      {`${toPersianNumber(firstValidPrice.toLocaleString())} تومان`}
    </p>
  ) : (
    <div className="flex justify-center items-center w-1/2">
      <Loading type="beat" size={6} />
    </div>
  )}
</div>

         <div className=" mx-2">
        <p className="my-1 mx-2">تاریخ رزرو</p>
        <div className="h-12 my-1.5 w-full flex items-center justify-between rounded-3xl shadow-sm bg-white px-4 border">
          <div
            className="flex-1 flex items-center justify-center w-full h-full text-gray-700 text-sm cursor-pointer"
            onClick={() => {
              setShowCalendarModal(true);
            }}
          >
            {reserveDateFrom ? (
              <div className="h-full flex  flex-col items-center justify-center w-full">
                <p className="text-md">ورود</p>
                <p>{`${toPersianNumber(
                  reserveDateFrom.year
                )}/${toPersianNumber(
                  reserveDateFrom.month
                )}/${toPersianNumber(reserveDateFrom.day)}`}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center w-full">
                <p className="text-sm xl:text-md">تاریخ ورود</p>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-400 mx-2"></div>

          <div
            className="flex-1 flex items-center justify-center w-full h-full text-gray-700 text-sm cursor-pointer"
            onClick={() => {
              setShowCalendarModal(true);
            }}
          >
            {reserveDateTo ? (
              <div className="h-full flex  flex-col items-center justify-center w-full">
                <p className="text-md">خروج</p>
                <p>{`${toPersianNumber(
                  reserveDateTo.year
                )}/${toPersianNumber(
                  reserveDateTo.month
                )}/${toPersianNumber(reserveDateTo.day)}`}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center w-full">
                <p className="text-sm xl:text-md">تاریخ خروج</p>
              </div>
            )}
          </div>
        </div>

        <div className="my-2 mt-4">
          <p className="mb-1">تعداد نفرات :</p>
          <div className="text-sm bg-white border rounded-3xl">
            <PeopleDropdown />
          </div>
        </div>
        </div>
        <div className="w-full my-3 px-3 mt-6">
          <button
            className="w-full btn rounded-3xl bg-primary-500 hover:bg-primary-600 transition-all duration-300 px-4 py-2"
            onClick={() => {
              console.log("Reserve button clicked");
              // Implement your reservation logic here
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
