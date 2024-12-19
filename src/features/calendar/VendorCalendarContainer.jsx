// src/features/calendar/VendorCalendarContainer.jsx

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
  instantBooking = false,
  loadingCalendar = false,
  dropdown = "true",
  onDayClick,
  viewOnly = false
}) {
  const showDropdown = dropdown !== "false";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [monthsPerView, setMonthsPerView] = useState(1);

  useEffect(() => {
    const updateMonthsPerView = () => {
      const width = window.innerWidth;
      setMonthsPerView(width >= 1280 ? 2 : 1);
    };
    updateMonthsPerView();
    window.addEventListener("resize", updateMonthsPerView);
    return () => window.removeEventListener("resize", updateMonthsPerView);
  }, []);

  function formatPrice(price) {
    if (price == null) return "";
    return toPersianNumber(price.toLocaleString());
  }

  function handleDateClick(year, month, day, dayData) {
    // If day is disabled, locked, blank, or not in the current month, do not proceed
    if (dayData.isDisable || dayData.isBlank || dayData.isLock || dayData.isCurrentMonth) return;

    if (onDayClick) {
      const selectedDate = { year, month, day, ...dayData };
      onDayClick(selectedDate);
    }
  }

  function getDayStyles(day) {
    let styles = [];

    // If the day is in the current month, we treat it as invisible
    // (so it mimics the behavior requested similar to the peak days container)
    if (day.isCurrentMonth) {
      styles.push("invisible");
      return styles;
    }

    if (day.isDisable || day.isLock) {
      styles.push("bg-gray-200 text-gray-400 cursor-not-allowed");
      if (day.isDisable) {
        styles.push("diagonal-stripes");
      }
    }

    // Today's date highlighting
    if (day.isToday) styles.push("border-2 border-primary-600");

    // Holiday styling
    if (day.isHoliday) styles.push("text-red-600 border-red-600");

    // Weekend highlight
    if (day.isWeekend) {
      styles.push("bg-primary-600 text-white");
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
      {/* Header with prev/next controls */}
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

      {/* Months container */}
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
                const styles = getDayStyles(day).join(" ");

                return (
                  <div
                    key={index}
                    className={`border rounded-2xl p-1 text-center flex flex-col items-center justify-center relative aspect-square overflow-hidden ${styles}`}
                    onClick={() =>
                      !day.isDisable && !day.isLock && !day.isBlank && !day.isCurrentMonth &&
                      handleDateClick(data.year, data.month, day.day, day)
                    }
                  >
                    {instantBooking && !day.isDisable && !day.isLock && !viewOnly && !day.isCurrentMonth && (
                      <div className="absolute -top-3 -right-1 w-8 h-8">
                        <div className="w-1/2 h-full -rotate-45 bg-primary-600"></div>
                      </div>
                    )}

                    {!day.isBlank && !day.isCurrentMonth && (
                      <div className={`font-bold w-full flex justify-center items-center relative text-xs sm:text-lg 
                        ${viewOnly && day.isHoliday ? 'text-red-600' : ''}`}>
                        {!viewOnly && day.has_discount && !day.isLock && !day.isDisable && (
                          <span className="absolute left-1 sm:text-lg text-primary-600 pr-1">
                            %
                          </span>
                        )}
                        <p>{toPersianNumber(day.day)}</p>
                      </div>
                    )}

                    {!viewOnly && !day.isDisable && !day.isLock && !day.isBlank && !day.isCurrentMonth && (
                      (() => {
                        const showPrice = day.specialPrice != null ? day.specialPrice : day.effective_price;
                        const showOriginalPrice = day.has_discount && day.original_price != null;
                        return (
                          <div className="text-2xs xs:text-xs sm:text-md">
                            {showOriginalPrice ? (
                              <div className="relative xs:static">
                                <div className="line-through text-4xs sm:text-2xs absolute xs:static -top-1.5 right-1 text-gray-500">
                                  {formatPrice(day.original_price)}
                                </div>
                                <div>{formatPrice(showPrice)}</div>
                              </div>
                            ) : (
                              <div>{formatPrice(showPrice)}</div>
                            )}
                          </div>
                        );
                      })()
                    )}

                    {!viewOnly && day.isPeakDay && !day.isBlank && !day.isDisable && !day.isLock && !day.isCurrentMonth && (
                      <div className="absolute bottom-1 left-1 text-[8px] text-red-500 font-bold">
                        پیک
                      </div>
                    )}

                    {!viewOnly && day.isBookingOffSite && !day.isCurrentMonth && (
                      <div className="absolute top-1 left-1 text-[8px] text-blue-500 font-semibold">
                        خارج سایت
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

export default VendorCalendarContainer;
