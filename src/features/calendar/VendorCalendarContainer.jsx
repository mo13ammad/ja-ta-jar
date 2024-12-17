import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import toPersianNumber from "../../utils/toPersianNumber";
import Loading from "../../ui/Loading";

function VendorCalendarContainer({
  calendarData,
  isRentRoom = false,
  roomOptions = [],
  selectedRoomUuid,
  setSelectedRoomUuid,
  reserveDateFrom,
  setReserveDateFrom,
  reserveDateTo,
  setReserveDateTo,
  closeModal,
  instantBooking = false,
  loadingCalendar = false,
  dropdown = "true",
}) {
  const showDropdown = dropdown !== "false";

  const [hoverDate, setHoverDate] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [monthsPerView, setMonthsPerView] = useState(1);

  const updateMonthsPerView = () => {
    const width = window.innerWidth;
    setMonthsPerView(width >= 1280 ? 2 : 1);
  };

  useEffect(() => {
    updateMonthsPerView();
    window.addEventListener("resize", updateMonthsPerView);
    return () => window.removeEventListener("resize", updateMonthsPerView);
  }, []);

  const formatPrice = (price) => toPersianNumber(price.toLocaleString());

  const isSameDate = (date1, date2) => {
    return (
      date1 && date2 &&
      date1.year === date2.year &&
      date1.month === date2.month &&
      parseInt(date1.day) === parseInt(date2.day)
    );
  };

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

  function handleDateClick(year, month, day, dayData) {
    if (dayData.isDisable || dayData.isBlank || dayData.isLock) return;
  
    const selectedDate = { year, month, day };
  
    // If no start date or both dates are selected, start fresh
    if (!reserveDateFrom || (reserveDateFrom && reserveDateTo)) {
      setReserveDateFrom(selectedDate);
      setReserveDateTo(null);
      setHoverDate(null);
      return;
    }
  
    // If we have a start date but no end date
    if (reserveDateFrom && !reserveDateTo) {
      const start = new Date(reserveDateFrom.year, reserveDateFrom.month - 1, reserveDateFrom.day);
      const end = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
  
      // Only select if end date is the same or after start date
      if (end < start) {
        return; 
      }
  
      setReserveDateTo(selectedDate);
      setHoverDate(null);
      // Removed the line that closes the modal
    }
  }
  

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

    const isSelectedStart = isSameDate(date, reserveDateFrom);
    const isSelectedEnd = isSameDate(date, reserveDateTo);

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

    return styles;
  }

  const displayedData = useMemo(() => {
    if (!calendarData || calendarData.length === 0) return [];
    if (isRentRoom) {
      if (!selectedRoomUuid) return [];
      const selectedRoom = calendarData.find((room) => room.roomUuid === selectedRoomUuid);
      if (!selectedRoom) return [];
      return selectedRoom.calendar;
    } else {
      return calendarData;
    }
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
    <div className="max-w-7xl w-full mx-auto  xs:px-1.5 sm:px-2 md:px-4 relative rounded-2xl overflow-hidden">
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
        className="flex transition-transform duration-300"
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
            <div className="grid grid-cols-7 text-center font-semibold mb-2">
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
                const date = { year: data.year, month: data.month, day: day.day };
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
                      <>
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
                          <div className="text-2xs xs:text-xs sm:text-md">
                            {formatPrice(day.effective_price)}
                          </div>
                        )}
                      </>
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

export default VendorCalendarContainer;
