import React, { useState, useEffect } from "react";
import toPersianNumber from "../../utils/toPersianNumber";

function CalendarContainer({
  reserveDateFrom,
  setReserveDateFrom,
  reserveDateTo,
  setReserveDateTo,
  closeModal,
  instantBooking,
  calendarData, // Receive calendar data as prop
}) {
  console.log(calendarData);
  const [hoverDate, setHoverDate] = useState(null);
  const [validRangeEnd, setValidRangeEnd] = useState(null);
 
  const formatPrice = (price) => {
    const formattedPrice = toPersianNumber(price.toLocaleString());
    return formattedPrice;
  };

  const handleDateClick = (year, month, day, dayData) => {
    if (dayData.isDisable || dayData.isBlank || dayData.isLock) return;

    const selectedDate = { year, month, day };

    if (!reserveDateFrom || (reserveDateFrom && reserveDateTo)) {
      // Set start date
      setReserveDateFrom(selectedDate);
      setReserveDateTo(null);
      setHoverDate(null);

      // Update the valid range for the second date
      updateValidRange(selectedDate, calendarData);
    } else {
      // Ensure the selected date is within the valid range
      if (
        isBeforeDate(selectedDate, reserveDateFrom) ||
        isAfterDate(selectedDate, validRangeEnd)
      ) {
        return; // Invalid selection
      }

      // Set end date
      setReserveDateTo(selectedDate);
      closeModal();
      setHoverDate(null);
    }
  };

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
          foundValidRangeEnd = date; // Start searching from this date
        } else if (foundValidRangeEnd && (day.isDisable || day.isLock)) {
          setValidRangeEnd(foundValidRangeEnd);
          return;
        }

        if (foundValidRangeEnd) {
          foundValidRangeEnd = date;
        }
      }
    }

    setValidRangeEnd(foundValidRangeEnd); // If no `isDisable` is found, allow until the last day
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

  const getDayStyles = (day, date) => {
    let styles = [];

    if (day.isBlank) styles.push("invisible");
    if (day.isDisable || day.isLock)
      styles.push("bg-gray-200 text-gray-400 cursor-not-allowed");
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

    // Additional rule: Disable dates beyond validRangeEnd
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

  return (
    <div className="max-w-7xl bg-gray-50 w-full mx-auto p-4">
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
                        const hoverDateObj = {
                          year: data.year,
                          month: data.month,
                          day: day.day,
                        };
                        setHoverDate(hoverDateObj);
                      }
                    }}
                    onMouseLeave={() => {
                      if (hoverDate) {
                        setHoverDate(null);
                      }
                    }}
                  >
                    {/* Triangle Indicator for Instant Booking */}
                    {instantBooking &&
                      !day.isDisable &&
                      !day.isLock && (
                        <div className="absolute -top-3 -right-1 w-8 h-8">
                          <div className="w-1/2 h-full -rotate-45 bg-primary-600"></div>
                        </div>
                      )}

                    {/* Day Number */}
                    <div className="font-bold w-full flex justify-center items-center relative text-xs sm:text-lg">
                      {/* Discount Indicator */}
                      {day.has_discount && !day.isLock && !day.isDisable && (
                        <span className="absolute left-1 sm:text-lg text-primary-600 pr-1">
                          %
                        </span>
                      )}
                      {/* Day Number */}
                      <p>{toPersianNumber(day.day)}</p>
                    </div>

                    {/* Prices */}
                    {!day.isDisable && !day.isLock && (
                      <div className="text-2xs">
                        {day.has_discount ? (
                          <div className="relative xs:static">
                            {/* Original Price */}
                            <div className="line-through text-3xs sm:text-xs absolute xs:static -top-1.5 right-1 text-gray-500">
                              {formatPrice(day.original_price)}
                            </div>
                            {/* Discounted Price */}
                            <div className="text-2xs xs:text-xs sm:text-md">
                              {formatPrice(day.effective_price)}
                            </div>
                          </div>
                        ) : (
                          // Regular Price
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
