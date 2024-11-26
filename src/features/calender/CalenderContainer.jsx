import React, { useState, useEffect } from "react";
import toPersianNumber from "./../../utils/toPersianNumber";

function CalendarContainer() {
  // Initial calendar data (replace with your actual data)
  const initialCalendarData = {
    from: "2024-11-21",
    to: "2024-12-20",
    year: 1403,
    month: 9,
    month_name: "آذر",
    previous_month: null,
    next_month: {
      month: 10,
      month_name: "دی",
      year: 1403,
      link: "https://portal1.jatajar.com/api/house/80317/calendar?year=1403&month=10",
    },
    current_month:
      "https://portal1.jatajar.com/api/house/80317/calendar?year=1403&month=9",
    days: [
      {
        gregorianDate: "2024-11-16",
        jalaliDate: "1403-08-26",
        day: 26,
        week: 4,
        dayOfWeek: 0,
        isBlank: true,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 0,
        original_price: 0,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-17",
        jalaliDate: "1403-08-27",
        day: 27,
        week: 4,
        dayOfWeek: 1,
        isBlank: true,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 0,
        original_price: 0,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-18",
        jalaliDate: "1403-08-28",
        day: 28,
        week: 4,
        dayOfWeek: 2,
        isBlank: true,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 0,
        original_price: 0,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-19",
        jalaliDate: "1403-08-29",
        day: 29,
        week: 4,
        dayOfWeek: 3,
        isBlank: true,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 0,
        original_price: 0,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-20",
        jalaliDate: "1403-08-30",
        day: 30,
        week: 4,
        dayOfWeek: 4,
        isBlank: true,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 0,
        original_price: 0,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-21",
        jalaliDate: "1403-09-01",
        day: 1,
        week: 0,
        dayOfWeek: 5,
        isBlank: false,
        isDisable: true,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 30000000,
        original_price: 30000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-22",
        jalaliDate: "1403-09-02",
        day: 2,
        week: 0,
        dayOfWeek: 6,
        isBlank: false,
        isDisable: true,
        isHoliday: true,
        isPeak: false,
        isToDay: false,
        effective_price: 30000000,
        original_price: 30000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-23",
        jalaliDate: "1403-09-03",
        day: 3,
        week: 1,
        dayOfWeek: 0,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: true,
        effective_price: 2000000,
        original_price: 3000000,
        has_discount: true,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-24",
        jalaliDate: "1403-09-04",
        day: 4,
        week: 1,
        dayOfWeek: 1,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 3000000,
        has_discount: true,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-25",
        jalaliDate: "1403-09-05",
        day: 5,
        week: 1,
        dayOfWeek: 2,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-26",
        jalaliDate: "1403-09-06",
        day: 6,
        week: 1,
        dayOfWeek: 3,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: true,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-27",
        jalaliDate: "1403-09-07",
        day: 7,
        week: 1,
        dayOfWeek: 4,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: true,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-28",
        jalaliDate: "1403-09-08",
        day: 8,
        week: 1,
        dayOfWeek: 5,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 30000000,
        original_price: 30000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-29",
        jalaliDate: "1403-09-09",
        day: 9,
        week: 1,
        dayOfWeek: 6,
        isBlank: false,
        isDisable: false,
        isHoliday: true,
        isPeak: false,
        isToDay: false,
        effective_price: 30000000,
        original_price: 30000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-11-30",
        jalaliDate: "1403-09-10",
        day: 10,
        week: 2,
        dayOfWeek: 0,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-01",
        jalaliDate: "1403-09-11",
        day: 11,
        week: 2,
        dayOfWeek: 1,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-02",
        jalaliDate: "1403-09-12",
        day: 12,
        week: 2,
        dayOfWeek: 2,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-03",
        jalaliDate: "1403-09-13",
        day: 13,
        week: 2,
        dayOfWeek: 3,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-04",
        jalaliDate: "1403-09-14",
        day: 14,
        week: 2,
        dayOfWeek: 4,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-05",
        jalaliDate: "1403-09-15",
        day: 15,
        week: 2,
        dayOfWeek: 5,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 30000000,
        original_price: 30000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-06",
        jalaliDate: "1403-09-16",
        day: 16,
        week: 2,
        dayOfWeek: 6,
        isBlank: false,
        isDisable: false,
        isHoliday: true,
        isPeak: false,
        isToDay: false,
        effective_price: 30000000,
        original_price: 30000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-07",
        jalaliDate: "1403-09-17",
        day: 17,
        week: 3,
        dayOfWeek: 0,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-08",
        jalaliDate: "1403-09-18",
        day: 18,
        week: 3,
        dayOfWeek: 1,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-09",
        jalaliDate: "1403-09-19",
        day: 19,
        week: 3,
        dayOfWeek: 2,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-10",
        jalaliDate: "1403-09-20",
        day: 20,
        week: 3,
        dayOfWeek: 3,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-11",
        jalaliDate: "1403-09-21",
        day: 21,
        week: 3,
        dayOfWeek: 4,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-12",
        jalaliDate: "1403-09-22",
        day: 22,
        week: 3,
        dayOfWeek: 5,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 30000000,
        original_price: 30000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-13",
        jalaliDate: "1403-09-23",
        day: 23,
        week: 3,
        dayOfWeek: 6,
        isBlank: false,
        isDisable: false,
        isHoliday: true,
        isPeak: false,
        isToDay: false,
        effective_price: 30000000,
        original_price: 30000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-14",
        jalaliDate: "1403-09-24",
        day: 24,
        week: 4,
        dayOfWeek: 0,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-15",
        jalaliDate: "1403-09-25",
        day: 25,
        week: 4,
        dayOfWeek: 1,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-16",
        jalaliDate: "1403-09-26",
        day: 26,
        week: 4,
        dayOfWeek: 2,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-17",
        jalaliDate: "1403-09-27",
        day: 27,
        week: 4,
        dayOfWeek: 3,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-18",
        jalaliDate: "1403-09-28",
        day: 28,
        week: 4,
        dayOfWeek: 4,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 2000000,
        original_price: 2000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-19",
        jalaliDate: "1403-09-29",
        day: 29,
        week: 4,
        dayOfWeek: 5,
        isBlank: false,
        isDisable: false,
        isHoliday: false,
        isPeak: false,
        isToDay: false,
        effective_price: 30000000,
        original_price: 30000000,
        has_discount: false,
        isLock: false,
      },
      {
        gregorianDate: "2024-12-20",
        jalaliDate: "1403-09-30",
        day: 30,
        week: 4,
        dayOfWeek: 6,
        isBlank: false,
        isDisable: false,
        isHoliday: true,
        isPeak: false,
        isToDay: false,
        effective_price: 30000000,
        original_price: 30000000,
        has_discount: false,
        isLock: false,
      },
    ],
  };

  // State for calendar data (array to hold one or two months)
  const [calendarData, setCalendarData] = useState([initialCalendarData]);
  const [loading, setLoading] = useState(false);

  // Fetch calendar data from a given link
  const fetchCalendarData = async (link) => {
    setLoading(true);
    try {
      const response = await fetch(link);
      const data = await response.json();
      if (data.data) {
        setCalendarData([data.data]);
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
    setLoading(false);
  };

  // Handle previous month click
  const handlePrevMonth = () => {
    if (calendarData[0].previous_month && calendarData[0].previous_month.link) {
      fetchCalendarData(calendarData[0].previous_month.link);
    }
  };

  // Handle next month click
  const handleNextMonth = () => {
    if (
      calendarData[calendarData.length - 1].next_month &&
      calendarData[calendarData.length - 1].next_month.link
    ) {
      fetchCalendarData(calendarData[calendarData.length - 1].next_month.link);
    }
  };

  // Helper function to format prices
  const formatPrice = (price) => {
    return toPersianNumber(price.toLocaleString());
  };

  // Determine if we should show two months side by side
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // // Fetch next month's data if on large screen
  // useEffect(() => {
  //   if (isLargeScreen && calendarData.length === 1) {
  //     const nextMonthLink = calendarData[0].next_month?.link;
  //     if (nextMonthLink) {
  //       setLoading(true);
  //       fetch(nextMonthLink)
  //         .then((response) => response.json())
  //         .then((data) => {
  //           if (data.data) {
  //             setCalendarData([calendarData[0], data.data]);
  //           }
  //         })
  //         .catch((error) => console.error('Error fetching next month:', error))
  //         .finally(() => setLoading(false));
  //     }
  //   } else if (!isLargeScreen && calendarData.length > 1) {
  //     // If screen size is small, show only one month
  //     setCalendarData([calendarData[0]]);
  //   }
  // }, [isLargeScreen]);

  // Render the calendar UI
  return (
    <div className="max-w-7xl mx-auto  p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          className={`text-2xl p-2 ${
            !calendarData[calendarData.length - 1].next_month
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700"
          }`}
          onClick={handleNextMonth}
          disabled={!calendarData[calendarData.length - 1].next_month}
        >
          &#8594;
        </button>
        <div className="text-xl font-bold">
          {calendarData[0].month_name} {toPersianNumber(calendarData[0].year)}
        </div>
        <button
          className={`text-2xl p-2 ${
            !calendarData[0].previous_month
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700"
          }`}
          onClick={handlePrevMonth}
          disabled={!calendarData[0].previous_month}
        >
          &#8592;
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">در حال بارگذاری...</div>
      ) : (
        <div
          className={`flex ${isLargeScreen ? "flex-row space-x-4" : "flex-col"}`}
        >
          {calendarData.map((data, idx) => (
            <div key={idx} className="flex-grow">
              {/* Weekday names */}
              <div className="grid grid-cols-7 text-center font-semibold mb-2">
                <div>ش</div> {/* Saturday */}
                <div>ی</div> {/* Sunday */}
                <div>د</div> {/* Monday */}
                <div>س</div> {/* Tuesday */}
                <div>چ</div> {/* Wednesday */}
                <div>پ</div> {/* Thursday */}
                <div>ج</div> {/* Friday */}
              </div>
              {/* Days */}
              <div className="grid grid-cols-7 gap-0.5">
                {data.days.map((day, index) => {
                  if (day.isBlank) {
                    // Return an empty placeholder for blank days
                    return <div key={index} className="h-0"></div>;
                  }

                  // Build class names based on day properties
                  let classNames =
                    "border rounded-2xl p-1  text-center  flex flex-col items-center justify-center";

                  if (day.isDisable) {
                    classNames +=
                      " bg-gray-200 text-gray-400 cursor-not-allowed";
                  } else {
                    classNames += " bg-white text-gray-800";
                  }

                  if (day.isToDay) {
                    classNames += " border-2 border-primary-600";
                  } else {
                    classNames += " border-gray-200";
                  }

                  if (day.isHoliday) {
                    classNames += " text-red-600 border-red-600";
                  }

                  return (
                    <div key={index} className={`${classNames} aspect-square`}>
                      {/* Day Number */}
                      <div className="font-bold text-xs sm:text-lg">
                        {toPersianNumber(day.day)}
                      </div>

                      {/* Prices */}
                      {!day.isDisable && (
                        <div className="text-2xs">
                          {day.has_discount ? (
                            <div className="relative xs:static">
                              <div className="line-through text-3xs sm:text-xs absolute xs:static -top-1.5 right-1 text-gray-500 ">
                                {formatPrice(day.original_price)}
                              </div>
                              <div className="text-2xs xs:text-xs sm:text-md">
                                {formatPrice(day.effective_price)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-2xs xs:text-xs  sm:text-md">
                              {formatPrice(day.effective_price)}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Lock Icon for Disabled Days */}
                      {day.isDisable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          {/* You can add a lock icon here if needed */}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CalendarContainer;
