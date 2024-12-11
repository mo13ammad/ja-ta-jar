// HouseCalendar.jsx

import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import toPersianNumber from "../../../utils/toPersianNumber";

function HouseCalendar({ calendarData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [monthsPerView, setMonthsPerView] = useState(1);

  // Determine how many months to show based on window width
  const updateMonthsPerView = () => {
    const width = window.innerWidth;
    // If width >= 1280px (XL), show 2 months, else show 1 month
    setMonthsPerView(width >= 1280 ? 2 : 1);
  };

  useEffect(() => {
    updateMonthsPerView();
    window.addEventListener("resize", updateMonthsPerView);
    return () => window.removeEventListener("resize", updateMonthsPerView);
  }, []);

  if (!calendarData || calendarData.length === 0) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  const displayedData = calendarData;
  const totalMonths = displayedData.length;
  const maxIndex = Math.max(0, totalMonths - monthsPerView);

  const formatPrice = (price) => {
    return toPersianNumber(price.toLocaleString());
  };

  const getDayStyles = (day) => {
    let styles = [];
    if (day.isBlank) styles.push("invisible");
    if (day.isDisable || day.isLock) {
      styles.push("bg-gray-200 text-gray-400");
      if (day.isDisable) {
        styles.push("diagonal-stripes");
      }
    }
    if (day.isToDay) styles.push("border-2 border-primary-600");
    if (day.isHoliday) styles.push("text-red-600 border-red-600");
    return styles;
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const translatePercentage = 100 / monthsPerView;
  const translateX = -currentIndex * translatePercentage;

  const activeMonth = displayedData[currentIndex];

  return (
    <div className="max-w-7xl  w-full mx-auto p-4 relative rounded-2xl overflow-hidden">
      <h3 className="text-lg font-bold text-gray-800 mb-2" >قیمت</h3>
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-1 rounded-full bg-white shadow-lg ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
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
          className={`p-1 rounded-full bg-white shadow-lg ${currentIndex === maxIndex ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(${-translateX}%)` }}
      >
        {displayedData.map((data, dataIndex) => (
          <div
            key={dataIndex}
            className="flex-shrink-0 w-full md:w-full xl:w-1/2 px-2"
          >
            <div className="flex flex-col space-y-2">
              {monthsPerView === 2 && (
                <div className="text-center font-bold mb-2">
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

              <div className="grid grid-cols-7 gap-0.5">
                {data.days.map((day, index) => {
                  const styles = getDayStyles(day).join(" ");
                  return (
                    <div
                      key={index}
                      className={`border rounded-2xl p-1 text-center flex flex-col items-center justify-center relative aspect-square overflow-hidden ${styles}`}
                    >
                      {!day.isBlank && (
                        <div className="font-bold w-full flex justify-center items-center relative text-xs sm:text-lg">
                          {day.has_discount && !day.isLock && !day.isDisable && (
                            <span className="absolute left-1 sm:text-lg text-primary-600 pr-1">
                              %
                            </span>
                          )}
                          <p className="md:text-sm lg:text-md 2xl:text-lg" >{toPersianNumber(day.day)}</p>
                        </div>
                      )}
                      {!day.isDisable && !day.isLock && !day.isBlank && (
                        <div className="text-2xs">
                          {day.has_discount ? (
                            <div className="relative xs:static">
                              <div className="line-through text-3xs sm:text-xs absolute xs:static -top-1.5 right-1 text-gray-500">
                                {formatPrice(day.original_price)}
                              </div>
                              <div className="text-2xs xs:text-xs sm:text-md md:text-xs lg:text-md xl:text-sm 2xl:text-md">
                                {formatPrice(day.effective_price)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-2xs xs:text-xs sm:text-md md:text-xs lg:text-md xl:text-sm 2xl:text-md">
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default HouseCalendar;
