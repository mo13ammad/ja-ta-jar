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
}) {
  const [hoverDate, setHoverDate] = useState(null);
  const [validRangeEnd, setValidRangeEnd] = useState(null);
  console.log({ calendarData });

  useEffect(() => {
    if (reserveDateFrom) {
      updateValidRange(reserveDateFrom, calendarData);
    }
  }, [reserveDateFrom, calendarData]);

  const formatPrice = (price) => toPersianNumber(price.toLocaleString());

  const isSameDate = (date1, date2) => {
    return (
      date1.year === date2.year &&
      date1.month === date2.month &&
      parseInt(date1.day) === parseInt(date2.day)
    );
  };

  function updateValidRange(startDate, calendarArray) {
    if (!calendarArray) return;
    let foundValidRangeEnd = null;

    if (isRentRoom) {
      const selectedRoomData = calendarArray.find((r) => r.roomUuid === selectedRoomUuid);
      if (!selectedRoomData || !selectedRoomData.calendar) return;

      for (const monthData of selectedRoomData.calendar) {
        if (!monthData || !monthData.days) continue;
        for (const day of monthData.days || []) {
          const date = { year: monthData.year, month: monthData.month, day: day.day };
          if (isSameDate(date, startDate)) {
            foundValidRangeEnd = date;
          } else if (foundValidRangeEnd && (day.isDisable || day.isLock)) {
            setValidRangeEnd(foundValidRangeEnd);
            return;
          }
          if (foundValidRangeEnd) foundValidRangeEnd = date;
        }
      }
      setValidRangeEnd(foundValidRangeEnd);
    } else {
      for (const monthData of calendarArray) {
        if (!monthData || !monthData.days) continue;
        for (const day of monthData.days || []) {
          const date = { year: monthData.year, month: monthData.month, day: day.day };
          if (isSameDate(date, startDate)) {
            foundValidRangeEnd = date;
          } else if (foundValidRangeEnd && (day.isDisable || day.isLock)) {
            setValidRangeEnd(foundValidRangeEnd);
            return;
          }
          if (foundValidRangeEnd) foundValidRangeEnd = date;
        }
      }
      setValidRangeEnd(foundValidRangeEnd);
    }
  }

  const isBeforeDate = (date1, date2) => {
    if (!date2) return false;
    if (date1.year < date2.year) return true;
    if (date1.year > date2.year) return false;
    if (date1.month < date2.month) return true;
    if (date1.month > date2.month) return false;
    return parseInt(date1.day) < parseInt(date2.day);
  };

  const isAfterDate = (date1, date2) => {
    if (!date2) return false;
    return isBeforeDate(date2, date1);
  };

  const isBetweenDates = (date, startDate, endDate) => {
    const d = new Date(date.year, date.month - 1, date.day);
    const s = new Date(startDate.year, startDate.month - 1, startDate.day);
    const e = new Date(endDate.year, endDate.month - 1, endDate.day);
    return d > s && d < e;
  };

  function getDayStyles(day, date) {
    let styles = [];

    if (day.isBlank) styles.push("invisible");
    if (day.isDisable || day.isLock) {
      styles.push("bg-gray-200 text-gray-400 cursor-not-allowed");
      if (day.isDisable) {
        styles.push("diagonal-stripes");
      }
    }
    if (day.isToDay) styles.push("border-2 border-primary-600");
    if (day.isHoliday) styles.push("text-red-600 border-red-600");

    const isSelectedStart = reserveDateFrom && isSameDate(date, reserveDateFrom);
    const isSelectedEnd = reserveDateTo && isSameDate(date, reserveDateTo);

    let isBetween = false;
    if (reserveDateFrom && reserveDateTo) {
      isBetween = isBetweenDates(date, reserveDateFrom, reserveDateTo);
    } else if (reserveDateFrom && hoverDate) {
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

    if (isSelectedStart || isSelectedEnd) {
      styles.push("bg-primary-500 text-white");
    } else if (isBetween) {
      styles.push("bg-primary-300 text-white");
    }

    if (reserveDateFrom && validRangeEnd && isAfterDate(date, validRangeEnd)) {
      styles.push("bg-gray-200 text-gray-400 cursor-not-allowed");
    }

    return styles;
  }

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

  function handleDateClick(year, month, day, dayData) {
    if (dayData.isDisable || dayData.isBlank || dayData.isLock) return;

    const selectedDate = { year, month, day };

    if (!reserveDateFrom || (reserveDateFrom && reserveDateTo)) {
      setReserveDateFrom(selectedDate);
      setReserveDateTo(null);
      setHoverDate(null);
      updateValidRange(selectedDate, calendarData);
    } else {
      if (isBeforeDate(selectedDate, reserveDateFrom) || isAfterDate(selectedDate, validRangeEnd)) {
        return;
      }

      setReserveDateTo(selectedDate);
      if (closeModal) closeModal();
      setHoverDate(null);
    }
  }

  return (
    <div className="max-w-7xl bg-gray-50 w-full mx-auto p-4">
      {isRentRoom && roomOptions.length > 0 && (
        <div className="mb-4 w-56">
          <Listbox
            value={selectedRoom}
            onChange={(newValue) => setSelectedRoomUuid(newValue.uuid)}
          >
            {({ open }) => (
              <div className="relative bg-white rounded-xl">
                <Listbox.Button className="flex justify-between items-center px-3 py-2 w-full rounded-xl border border-primary-600 text-right text-gray-700">
                  <span>
                    {selectedRoom ? selectedRoom.name : "انتخاب اتاق"}
                  </span>
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
                              !day.isDisable && !day.isLock && !day.isBlank &&
                              handleDateClick(monthData.year, monthData.month, day.day, day)
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
                                    <div className="line-through text-3xs sm:text-xs absolute xs:static -top-1.5 right-1 text-gray-500">
                                      {formatPrice(day.original_price)}
                                    </div>
                                    <div className="text-2xs xs:text-xs sm:text-md">
                                      {formatPrice(day.effective_price)}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-2xs xs:text-xs sm:text-md">
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
                          !day.isDisable && !day.isLock && !day.isBlank &&
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
                                <div className="line-through text-3xs sm:text-xs absolute xs:static -top-1.5 right-1 text-gray-500">
                                  {formatPrice(day.original_price)}
                                </div>
                                <div className="text-2xs xs:text-xs sm:text-md">
                                  {formatPrice(day.effective_price)}
                                </div>
                              </div>
                            ) : (
                              <div className="text-2xs xs:text-xs sm:text-md">
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
