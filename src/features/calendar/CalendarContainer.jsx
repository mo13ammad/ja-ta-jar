// src/features/calendar/CalendarContainer.jsx
import React, { useState, useEffect, Fragment } from "react";
import toPersianNumber from "../../utils/toPersianNumber";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import "../../index.css"; // For diagonal-stripes CSS
import Loading from "../../ui/Loading";

function CalendarContainer({
  reserveDateFrom,
  setReserveDateFrom,
  reserveDateTo,
  setReserveDateTo,
  closeModal,
  instantBooking,
  calendarData,
  loadingCalendar,
  isRentRoom = false,
  roomOptions = [],
  selectedRoomUuid,
  setSelectedRoomUuid,
  dropdown = "true",
}) {
  const [hoverDate, setHoverDate] = useState(null);
  const showDropdown = dropdown !== "false"; // true if dropdown is not explicitly "false"

  // --- Utility functions --- //
  
  const formatPrice = (price) => toPersianNumber(price.toLocaleString());

  const isSameDate = (date1, date2) =>
    date1.year === date2.year &&
    date1.month === date2.month &&
    parseInt(date1.day) === parseInt(date2.day);

  const isBeforeDate = (date1, date2) => {
    if (!date2) return false;
    if (date1.year < date2.year) return true;
    if (date1.year > date2.year) return false;
    if (date1.month < date2.month) return true;
    if (date1.month > date2.month) return false;
    return parseInt(date1.day) < parseInt(date2.day);
  };

  const isBetweenDates = (date, startDate, endDate) => {
    const d = new Date(date.year, date.month - 1, date.day);
    const s = new Date(startDate.year, startDate.month - 1, startDate.day);
    const e = new Date(endDate.year, endDate.month - 1, endDate.day);
    return d > s && d < e;
  };

  /**
   * Determine day cell styles based on its status and selected/hovered dates.
   */
  function getDayStyles(day, date) {
    let styles = [];

    // Invisible if blank
    if (day.isBlank) styles.push("invisible");

    // Disabled or locked days
    if (day.isDisable || day.isLock) {
      styles.push("bg-gray-200 text-gray-400 cursor-not-allowed");
      if (day.isDisable) {
        styles.push("diagonal-stripes");
      }
    }

    // Today's date highlighting
    if (day.isToDay) styles.push("border-2 border-primary-600");

    // Holiday styling
    if (day.isHoliday) styles.push("text-red-600 border-red-600");

    const isSelectedStart = reserveDateFrom && isSameDate(date, reserveDateFrom);
    const isSelectedEnd = reserveDateTo && isSameDate(date, reserveDateTo);

    // Determine if this date is between the selected start and end
    let isBetween = false;
    if (reserveDateFrom && reserveDateTo) {
      isBetween = isBetweenDates(date, reserveDateFrom, reserveDateTo);
    } else if (reserveDateFrom && hoverDate) {
      // If we're hovering over a second date without final selection
      let startDate = reserveDateFrom;
      let endDate = hoverDate;
      if (isBeforeDate(endDate, startDate)) {
        const temp = startDate;
        startDate = endDate;
        endDate = temp;
      }
      isBetween =
        isBetweenDates(date, startDate, endDate) ||
        isSameDate(date, startDate) ||
        isSameDate(date, endDate);
    }

    // Selected start or end date styling
    if (isSelectedStart || isSelectedEnd) {
      styles.push("bg-primary-500 text-white");
    } else if (isBetween) {
      // Dates between start and end
      styles.push("bg-primary-300 text-white");
    }

    return styles;
  }

  /**
   * Handle clicking on a date cell.
   * If no start date selected, set this as `reserveDateFrom`.
   * If a start date is selected but no end date, choose this as `reserveDateTo` if it's valid.
   */
  function handleDateClick(year, month, day, dayData) {
    if (dayData.isDisable || dayData.isBlank || dayData.isLock) return;

    const selectedDate = { year, month, day };

    // If we have no start date or we already have a complete range,
    // reset and pick this date as the start.
    if (!reserveDateFrom || (reserveDateFrom && reserveDateTo)) {
      setReserveDateFrom(selectedDate);
      setReserveDateTo(null);
      setHoverDate(null);
    } else {
      // If we already have a start date, ensure the chosen date is after the start date
      // and not disabled.
      if (isBeforeDate(selectedDate, reserveDateFrom)) {
        return;
      }

      // Valid second date - select it
      setReserveDateTo(selectedDate);
      if (closeModal) closeModal();
      setHoverDate(null);
    }
  }

  // --- Early returns based on loading or missing data --- //
  
  if (loadingCalendar) {
    return (
      <div className="text-center w-full h-full bg-white py-8">
        <Loading />
      </div>
    );
  }

  if (!calendarData || (isRentRoom && calendarData.length === 0)) {
    return (
      <div className="text-center w-full h-full bg-white py-8">
        هیچ داده‌ای موجود نیست
      </div>
    );
  }

  const selectedRoom = isRentRoom ? roomOptions.find((r) => r.uuid === selectedRoomUuid) : null;

  let displayedCalendarData = calendarData;
  if (isRentRoom) {
    displayedCalendarData = calendarData.filter(({ roomUuid }) => roomUuid === selectedRoomUuid);
  }

  return (
    <div className="max-w-7xl bg-gray-50 w-full mx-auto p-4">
      {showDropdown && isRentRoom && roomOptions.length > 0 && (
        <div className="mb-4 w-56">
          <Listbox
            value={selectedRoom}
            onChange={(newValue) => setSelectedRoomUuid(newValue.uuid)}
          >
            {({ open }) => (
              <div className="relative bg-white rounded-xl">
                <Listbox.Button className="flex justify-between items-center px-3 py-2 w-full rounded-xl border border-primary-600 text-right text-gray-700">
                  <span>{selectedRoom ? selectedRoom.name : "انتخاب اتاق"}</span>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      open ? "rotate-180" : "rotate-0"
                    }`}
                    aria-hidden="true"
                  />
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto focus:outline-none">
                    {roomOptions.map((room) => (
                      <Listbox.Option
                        key={room.uuid}
                        value={room}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 pr-4 pl-10 ${
                            active ? "bg-primary-400 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        <span className="block truncate font-normal">{room.name}</span>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
        </div>
      )}

      <div className="flex flex-col space-y-8">
        {isRentRoom
          ? displayedCalendarData.map(({ calendar }) =>
              calendar
                .filter((monthData) => monthData !== null)
                .map((monthData, idx) => (
                  <div key={idx}>
                    <div className="text-center font-bold mb-2">
                      {monthData.month_name} {toPersianNumber(monthData.year)}
                    </div>
                    <div className="grid grid-cols-7 text-center font-semibold mb-2">
                      <div>ش</div>
                      <div>ی</div>
                      <div>د</div>
                      <div>س</div>
                      <div>چ</div>
                      <div>پ</div>
                      <div>ج</div>
                    </div>
                    <div className="grid grid-cols-7 gap-0.5">
                      {monthData.days.map((day, index) => {
                        const date = {
                          year: monthData.year,
                          month: monthData.month,
                          day: day.day,
                        };
                        const styles = getDayStyles(day, date).join(" ");
                        return (
                          <div
                            key={index}
                            className={`border rounded-2xl p-1 text-center flex flex-col items-center justify-center relative aspect-square overflow-hidden ${styles}`}
                            onClick={() =>
                              !day.isDisable &&
                              !day.isLock &&
                              !day.isBlank &&
                              handleDateClick(monthData.year, monthData.month, day.day, day)
                            }
                            onMouseEnter={() => {
                              if (
                                reserveDateFrom &&
                                !reserveDateTo &&
                                !day.isDisable &&
                                !day.isLock
                              ) {
                                setHoverDate(date);
                              }
                            }}
                            onMouseLeave={() => {
                              if (hoverDate) {
                                setHoverDate(null);
                              }
                            }}
                          >
                            {instantBooking && !day.isDisable && !day.isLock && (
                              <div className="absolute -top-3 -right-1 w-8 h-8">
                                <div className="w-1/2 h-full -rotate-45 bg-primary-600"></div>
                              </div>
                            )}

                            {!day.isBlank && (
                              <div className="font-bold w-full flex justify-center items-center relative text-xs sm:text-lg">
                                {day.has_discount && !day.isLock && !day.isDisable && (
                                  <span className="absolute left-1 sm:text-lg text-primary-600 pr-1">
                                    %
                                  </span>
                                )}
                                <p>{toPersianNumber(day.day)}</p>
                              </div>
                            )}

                            {!day.isDisable && !day.isLock && !day.isBlank && (
                              <div className="text-2xs">
                                {day.has_discount ? (
                                  <div className="relative xs:static">
                                    <div className="line-through text-4xs sm:text-2xs absolute xs:static -top-1.5 right-1 text-gray-500">
                                      {formatPrice(day.original_price)}
                                    </div>
                                    <div className="text-2xs xs:text-xs sm:text-md">
                                      {formatPrice(day.effective_price)}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-3xs xs:text-xs sm:text-md">
                                    {formatPrice(day.effective_price)}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
            )
          : calendarData.map((data, idx) => (
              <div key={idx}>
                <div className="text-center font-bold mb-2">
                  {toPersianNumber(data.month_name)} {toPersianNumber(data.year)}
                </div>
                <div className="grid grid-cols-7 text-center font-semibold mb-2">
                  <div>ش</div>
                  <div>ی</div>
                  <div>د</div>
                  <div>س</div>
                  <div>چ</div>
                  <div>پ</div>
                  <div>ج</div>
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {data.days.map((day, index) => {
                    const date = {
                      year: data.year,
                      month: data.month,
                      day: day.day,
                    };
                    const styles = getDayStyles(day, date).join(" ");
                    return (
                      <div
                        key={index}
                        className={`border rounded-2xl p-1 text-center flex flex-col items-center justify-center relative aspect-square overflow-hidden ${styles}`}
                        onClick={() =>
                          !day.isDisable &&
                          !day.isLock &&
                          !day.isBlank &&
                          handleDateClick(data.year, data.month, day.day, day)
                        }
                        onMouseEnter={() => {
                          if (reserveDateFrom && !reserveDateTo && !day.isDisable && !day.isLock) {
                            setHoverDate(date);
                          }
                        }}
                        onMouseLeave={() => {
                          if (hoverDate) {
                            setHoverDate(null);
                          }
                        }}
                      >
                        {instantBooking && !day.isDisable && !day.isLock && (
                          <div className="absolute -top-3 -right-1 w-8 h-8">
                            <div className="w-1/2 h-full -rotate-45 bg-primary-600"></div>
                          </div>
                        )}

                        {!day.isBlank && (
                          <div className="font-bold w-full flex justify-center items-center relative text-xs sm:text-lg">
                            {day.has_discount && !day.isLock && !day.isDisable && (
                              <span className="absolute left-1 text-3xs xs:text-sm md:text-lg text-primary-600 pr-1">
                                %
                              </span>
                            )}
                            <p>{toPersianNumber(day.day)}</p>
                          </div>
                        )}

                        {!day.isDisable && !day.isLock && !day.isBlank && (
                          <div className="text-2xs">
                            {day.has_discount ? (
                              <div className="relative xs:static">
                                <div className="line-through text-3xs sm:text-2xs absolute xs:static -top-1.5 right-1 text-gray-500">
                                  {formatPrice(day.original_price)}
                                </div>
                                <div className="text-3xs xs:text-xs sm:text-md">
                                  {formatPrice(day.effective_price)}
                                </div>
                              </div>
                            ) : (
                              <div className="text-3xs xs:text-xs sm:text-md">
                                {formatPrice(day.effective_price)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default CalendarContainer;
