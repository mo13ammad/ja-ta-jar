// src/pages/calendar/CalendarContainer.jsx

import React, { useState, useEffect } from "react";
import toPersianNumber from "../../utils/toPersianNumber";
import { Listbox } from "@headlessui/react";
import "../../index.css"; // For diagonal-stripes CSS

function CalendarContainer({
  reserveDateFrom,
  setReserveDateFrom,
  reserveDateTo,
  setReserveDateTo,
  closeModal,
  instantBooking,
  calendarData,
  isRentRoom = false,
  roomUuids = [],
  roomOptions = [],
  selectedRoomUuid,
  setSelectedRoomUuid,
}) {
  const [hoverDate, setHoverDate] = useState(null);
  const [validRangeEnd, setValidRangeEnd] = useState(null);

  // Format price with Persian numbers and comma separators
  const formatPrice = (price) => {
    return toPersianNumber(price.toLocaleString());
  };

  // Handle clicking on a date
  const handleDateClick = (year, month, day, dayData) => {
    if (dayData.isDisable || dayData.isBlank || dayData.isLock) return;

    const selectedDate = { year, month, day };

    // If no start date chosen or a full range already chosen, pick new start
    if (!reserveDateFrom || (reserveDateFrom && reserveDateTo)) {
      setReserveDateFrom(selectedDate);
      setReserveDateTo(null);
      setHoverDate(null);
      updateValidRange(selectedDate, calendarData);
    } else {
      // We have a start date and we're choosing the end date
      // Ensure end date is after start date and within valid range
      if (
        isBeforeDate(selectedDate, reserveDateFrom) ||
        isAfterDate(selectedDate, validRangeEnd)
      ) {
        return; // Invalid selection
      }

      setReserveDateTo(selectedDate);
      if (closeModal) closeModal();
      setHoverDate(null);
    }
  };

  // Update the valid range for the second date after selecting a start date
  const updateValidRange = (startDate, calendarData) => {
    let foundValidRangeEnd = null;

    for (const monthData of calendarData) {
      for (const day of monthData.days) {
        const date = {
          year: monthData.year,
          month: monthData.month,
          day: day.day,
        };

        if (isSameDate(date, startDate)) {
          foundValidRangeEnd = date;
        } else if (foundValidRangeEnd && (day.isDisable || day.isLock)) {
          setValidRangeEnd(foundValidRangeEnd);
          return;
        }

        if (foundValidRangeEnd) foundValidRangeEnd = date;
      }
    }

    // If no disabled day found, entire range is valid
    setValidRangeEnd(foundValidRangeEnd);
  };

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

  const isSameDate = (date1, date2) => {
    return (
      date1.year === date2.year &&
      date1.month === date2.month &&
      parseInt(date1.day) === parseInt(date2.day)
    );
  };

  const isBetweenDates = (date, startDate, endDate) => {
    const d = new Date(date.year, date.month - 1, date.day);
    const s = new Date(startDate.year, startDate.month - 1, startDate.day);
    const e = new Date(endDate.year, endDate.month - 1, endDate.day);
    return d > s && d < e;
  };

  // Determine classes for each day cell based on state
  const getDayStyles = (day, date) => {
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

    // Disable dates beyond validRangeEnd
    if (reserveDateFrom && isAfterDate(date, validRangeEnd)) {
      styles.push("bg-gray-200 text-gray-400 cursor-not-allowed");
    }

    return styles;
  };

  useEffect(() => {
    if (reserveDateFrom) {
      updateValidRange(reserveDateFrom, calendarData);
    }
  }, [reserveDateFrom, calendarData]);

  if (!calendarData || calendarData.length === 0) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  // For room selection
  const selectedRoom = roomOptions?.find((r) => r.uuid === selectedRoomUuid);

  return (
    <div className="max-w-7xl bg-gray-50 w-full mx-auto p-4">
      {isRentRoom && roomOptions?.length > 0 && (
        <div className="mb-4 w-56">
          <Listbox
            value={selectedRoom}
            onChange={(newValue) => setSelectedRoomUuid(newValue.uuid)}
          >
            <Listbox.Button className="w-full rounded border px-2 py-1 text-right bg-white">
              {selectedRoom ? selectedRoom.name : "انتخاب اتاق"}
            </Listbox.Button>
            <Listbox.Options className="mt-1 rounded bg-white border shadow-lg max-h-60 overflow-auto">
              {roomOptions.map((room) => (
                <Listbox.Option
                  key={room.uuid}
                  value={room}
                  className={({ active }) =>
                    `cursor-pointer select-none py-1 px-2 ${
                      active ? "bg-primary-500 text-white" : "text-gray-900"
                    }`
                  }
                >
                  {room.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
      )}

      <div className="flex flex-col space-y-8">
        {calendarData.map((data, idx) => (
          <div key={idx}>
            <div className="text-center font-bold mb-2">
              {data.month_name} {toPersianNumber(data.year)}
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
                      handleDateClick(data.year, data.month, day.day, day)
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

                    <div className="font-bold w-full flex justify-center items-center relative text-xs sm:text-lg">
                      {day.has_discount && !day.isLock && !day.isDisable && (
                        <span className="absolute left-1 sm:text-lg text-primary-600 pr-1">
                          %
                        </span>
                      )}
                      <p>{toPersianNumber(day.day)}</p>
                    </div>

                    {!day.isDisable && !day.isLock && (
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
