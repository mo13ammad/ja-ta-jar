import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import toPersianNumber from "./../../../utils/toPersianNumber";
import Loading from "./../../../ui/Loading";

function PeakDayCalendarContainer({
  calendarData,
  isRentRoom = false,
  roomOptions = [],
  selectedRoomUuid,
  setSelectedRoomUuid,
  instantBooking = false,
  loadingCalendar = false,
  dropdown = "true",
  onDayClick,
  reserveDateFrom,
  setReserveDateFrom,
  reserveDateTo,
  setReserveDateTo,
  closeModal
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [monthsPerView, setMonthsPerView] = useState(1);
  const [hoverDate, setHoverDate] = useState(null);

  useEffect(() => {
    const updateMonthsPerView = () => {
      const width = window.innerWidth;
      setMonthsPerView(width >= 1280 ? 2 : 1);
    };
    updateMonthsPerView();
    window.addEventListener("resize", updateMonthsPerView);
    return () => window.removeEventListener("resize", updateMonthsPerView);
  }, []);

  const isSameDate = (date1, date2) =>
    date1 && date2 &&
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

  // Find the "today" date from the calendarData
  const todayDate = useMemo(() => {
    for (const monthData of (calendarData || [])) {
      for (const day of monthData.days) {
        if (day.isToday) {
          return { year: monthData.year, month: monthData.month, day: day.day };
        }
      }
    }
    return null;
  }, [calendarData]);

  function handleDayClick(year, month, day, dayData) {
    // If day is in the current month, treat as invisible (like previous logic)
    // Only allow clicking if day.isCurrentMonth is false
    if (day.isDisable || day.isLock || day.isCurrentMonth) return;

    const selectedDate = { year, month, day };

    // CalendarContainer-like selection logic:
    if (!reserveDateFrom || (reserveDateFrom && reserveDateTo)) {
      setReserveDateFrom(selectedDate);
      setReserveDateTo(null);
      setHoverDate(null);
    } else {
      // We have a start date, need to set end date if valid
      if (isBeforeDate(selectedDate, reserveDateFrom)) return;
      setReserveDateTo(selectedDate);
      setHoverDate(null);
      if (closeModal) closeModal();
    }

    if (onDayClick) {
      onDayClick(selectedDate);
    }
  }

  function getDayStyles(day, year, month) {
    let styles = [];

    // If day.isCurrentMonth is true, treat it as invisible
    if (day.isCurrentMonth) {
      styles.push("invisible");
      return styles;
    }

    // Check if this day is before today (if today exists)
    const date = { year, month, day: day.day };
    if (todayDate && isBeforeDate(date, todayDate)) {
      // Day is before today
      styles.push("bg-gray-100");
    }

    if (day.isDisable || day.isLock) {
      styles.push("bg-gray-200 text-gray-400 cursor-not-allowed");
      if (day.isDisable) {
        styles.push("diagonal-stripes");
      }
    }

    // If this is today, add border and text-primary-600
    if (day.isToday) {
      styles.push("border-2 border-primary-600 text-primary-600");
    }

    // Holiday styling (only if visible and not locked/disabled)
    if (day.isHoliday && !styles.includes("cursor-not-allowed")) {
      styles.push("text-red-600 border-red-600");
    }

    // Check selection range styling (like CalendarContainer)
    const isSelectedStart = reserveDateFrom && isSameDate(date, reserveDateFrom);
    const isSelectedEnd = reserveDateTo && isSameDate(date, reserveDateTo);

    let isBetweenRange = false;
    if (reserveDateFrom && reserveDateTo) {
      isBetweenRange = isBetweenDates(date, reserveDateFrom, reserveDateTo);
    } else if (reserveDateFrom && hoverDate) {
      let startDate = reserveDateFrom;
      let endDate = hoverDate;
      if (isBeforeDate(endDate, startDate)) {
        const temp = startDate;
        startDate = endDate;
        endDate = temp;
      }
      isBetweenRange =
        isBetweenDates(date, startDate, endDate) ||
        isSameDate(date, startDate) ||
        isSameDate(date, endDate);
    }

    if (isSelectedStart || isSelectedEnd) {
      // Override any previous styling for start/end date
      styles = styles.filter((s) => !s.startsWith("bg-") && !s.startsWith("text-"));
      styles.push("bg-primary-500 text-white");
    } else if (isBetweenRange) {
      styles = styles.filter((s) => !s.startsWith("bg-") && !s.startsWith("text-"));
      styles.push("bg-primary-300 text-white");
    }

    return styles;
  }

  const displayedData = useMemo(() => {
    if (!calendarData || calendarData.length === 0) return [];
    if (isRentRoom && !selectedRoomUuid) return [];
    return calendarData;
  }, [calendarData, isRentRoom, selectedRoomUuid]);

  if (loadingCalendar) {
    return (
      <div className="text-center w-full h-full bg-white py-8">
        <Loading />
      </div>
    );
  }

  if (!displayedData || displayedData.length === 0) {
    return <div className="text-center py-8">هیچ داده‌ای موجود نیست</div>;
  }

  const totalMonths = displayedData.length;
  const maxIndex = Math.max(0, totalMonths - monthsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const translatePercentage = 100 / monthsPerView;
  const translateX = currentIndex * translatePercentage;
  const activeMonth = displayedData[currentIndex];

  return (
    <div className="max-w-7xl w-full mx-auto xs:px-1.5 sm:px-2 md:px-4 relative rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-1 rounded-full bg-white shadow-centered ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-700" />
        </button>

        {monthsPerView === 1 && activeMonth && (
          <h3 className="text-md font-bold text-gray-800">
            {activeMonth.month_name} {toPersianNumber(activeMonth.year)}
          </h3>
        )}

        <button
          onClick={handleNext}
          disabled={currentIndex === maxIndex}
          className={`p-1 rounded-full bg-white shadow-centered ${
            currentIndex === maxIndex ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div
        className="flex transition-transform duration-300 mt-2"
        style={{ transform: `translateX(${translateX}%)` }}
      >
        {displayedData.map((data, dataIndex) => (
          <div
            key={dataIndex}
            className="flex-shrink-0 w-full md:w-full xl:w-1/2 xs:px-1.5 md:px-3"
          >
            {monthsPerView === 2 && (
              <div className="text-center font-bold mb-1">
                {data.month_name} {toPersianNumber(data.year)}
              </div>
            )}
            <div className="grid grid-cols-7 text-center font-semibold mb-2 mt-2">
              <div>ش</div>
              <div>ی</div>
              <div>د</div>
              <div>س</div>
              <div>چ</div>
              <div>پ</div>
              <div>ج</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {data.days.map((day, index) => {
                const styles = getDayStyles(day, data.year, data.month).join(" ");
                let circleColor = null;
                if (day.isPeakDay) {
                  circleColor = "bg-primary-300";
                } else if (day.isPeakDayCreatedByAdmin) {
                  circleColor = "bg-blue-400";
                }

                const date = { year: data.year, month: data.month, day: day.day };
                let isBetweenHover = false;
                if (reserveDateFrom && !reserveDateTo && hoverDate) {
                  let startDate = reserveDateFrom;
                  let endDate = hoverDate;
                  if (isBeforeDate(endDate, startDate)) {
                    const temp = startDate;
                    startDate = endDate;
                    endDate = temp;
                  }
                  isBetweenHover =
                    isBetweenDates(date, startDate, endDate) ||
                    isSameDate(date, startDate) ||
                    isSameDate(date, endDate);
                }

                const selectable = !styles.includes("cursor-not-allowed") && !styles.includes("invisible");
                const hoverClass = selectable && isBetweenHover ? "bg-primary-300 text-white" : "";

                return (
                  <div
                    key={index}
                    className={`border rounded-2xl p-1 text-center flex flex-col items-center justify-center relative aspect-square overflow-hidden ${styles} ${hoverClass}`}
                    onMouseEnter={() => {
                      const currentDate = { year: data.year, month: data.month, day: day.day };
                      if (reserveDateFrom && !reserveDateTo && selectable) {
                        setHoverDate(currentDate);
                      }
                    }}
                    onMouseLeave={() => {
                      if (hoverDate) setHoverDate(null);
                    }}
                    onClick={() => {
                      if (selectable) handleDayClick(data.year, data.month, day.day, day);
                    }}
                  >
                    {circleColor && (
                      <div className={`absolute top-1.5 right-1.5 lg:top-1.5 right-1.5 w-2 h-2 rounded-full ${circleColor}`} />
                    )}
                    {!day.isBlank && !day.isCurrentMonth && (
                      <div className={`font-bold w-full flex justify-center items-center relative text-xs sm:text-lg 
                      ${day.isHoliday && !styles.includes("cursor-not-allowed") ? 'text-red-600' : ''}`}>
                        <p>{toPersianNumber(day.day)}</p>
                      </div>
                    )}
                    {/* No prices shown */}
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

export default PeakDayCalendarContainer;
