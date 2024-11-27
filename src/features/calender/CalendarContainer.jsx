// src/components/CalendarContainer.jsx

import React, { useState, useEffect, useRef } from 'react';
import toPersianNumber from '../../utils/toPersianNumber';
import useGetCalendar from './useGetCalendar';
import { getHouseCalendarByMonth } from '../../services/houseService';
import { useParams } from 'react-router-dom';

function CalendarContainer() {
  // Extract the UUID from URL parameters
  const { uuid } = useParams();

  // State to hold the calendar data to display
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize loading to true

  // State to hold current year and month
  const [currentYear, setCurrentYear] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);

  // State to hold initial current year and month
  const [initialCurrentYear, setInitialCurrentYear] = useState(null);
  const [initialCurrentMonth, setInitialCurrentMonth] = useState(null);

  // State to hold maximum allowed year and month (3 months ahead)
  const [maxYear, setMaxYear] = useState(null);
  const [maxMonth, setMaxMonth] = useState(null);

  // Cache for calendar data
  const calendarDataCache = useRef({});

  // Fetch initial calendar data using useGetCalendar
  const { data: initialCalendarData, isLoading: initialLoading } = useGetCalendar(uuid);

  // Helper functions to compare months and years
  const isAfter = (year1, month1, year2, month2) => {
    if (year1 > year2) return true;
    if (year1 < year2) return false;
    return month1 > month2;
  };

  const isBefore = (year1, month1, year2, month2) => {
    if (year1 < year2) return true;
    if (year1 > year2) return false;
    return month1 < month2;
  };

  const isSame = (year1, month1, year2, month2) => {
    return year1 === year2 && month1 === month2;
  };

  // useEffect to handle initial data and set currentYear and currentMonth
  useEffect(() => {
    if (initialCalendarData) {
      console.log('Initial Calendar Data:', initialCalendarData);
      setCurrentYear(initialCalendarData.year);
      setCurrentMonth(initialCalendarData.month);

      // Store initial data in cache
      const key = `${initialCalendarData.year}-${initialCalendarData.month}`;
      calendarDataCache.current[key] = initialCalendarData;

      // Set initial current year and month
      setInitialCurrentYear(initialCalendarData.year);
      setInitialCurrentMonth(initialCalendarData.month);

      // Calculate maximum allowed year and month (3 months ahead)
      let mMonth = initialCalendarData.month + 2; // Since we display two months
      let mYear = initialCalendarData.year;
      if (mMonth > 12) {
        mMonth -= 12;
        mYear += 1;
      }
      setMaxYear(mYear);
      setMaxMonth(mMonth);
    }
  }, [initialCalendarData]);

  // useEffect to fetch current and next month data when currentYear or currentMonth changes
  useEffect(() => {
    const fetchData = async () => {
      if (currentYear && currentMonth) {
        console.log('Fetching data for year:', currentYear, 'month:', currentMonth);
        setLoading(true);
        try {
          // Prepare an array to hold data for current and next month
          const newCalendarData = [];

          // Determine months and years to fetch
          const monthsToFetch = [
            { year: currentYear, month: currentMonth },
            // Next month
            (() => {
              let nextMonth = currentMonth + 1;
              let nextYear = currentYear;
              if (nextMonth > 12) {
                nextMonth = 1;
                nextYear += 1;
              }
              return { year: nextYear, month: nextMonth };
            })(),
          ];

          for (let { year, month } of monthsToFetch) {
            const key = `${year}-${month}`;
            if (calendarDataCache.current[key]) {
              console.log(`Using cached data for ${year}-${month}`);
              newCalendarData.push(calendarDataCache.current[key]);
            } else {
              console.log(`Fetching data for ${year}-${month}`);
              const monthData = await getHouseCalendarByMonth(uuid, year, month);
              console.log('Fetched Month Data:', monthData);
              // Update cache
              calendarDataCache.current[key] = monthData;
              newCalendarData.push(monthData);
            }
          }

          setCalendarData(newCalendarData);
        } catch (error) {
          console.error('Error fetching calendar data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [uuid, currentYear, currentMonth]);

  // Helper function to format prices
  const formatPrice = (price) => {
    const formattedPrice = toPersianNumber(price.toLocaleString());
    console.log('Formatted Price:', formattedPrice);
    return formattedPrice;
  };

  // Function to handle next month click
  const handleNextMonth = () => {
    console.log('Next Month Clicked');
    // Increment currentMonth by 1
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    // Check if the new month is after the maximum allowed month
    if (isAfter(newYear, newMonth, maxYear, maxMonth)) {
      // Do not allow navigation beyond the maximum allowed month
      return;
    }
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
  };

  // Function to handle previous month click
  const handlePrevMonth = () => {
    console.log('Previous Month Clicked');
    // Decrement currentMonth by 1
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    // Check if the new month is before the initial current month
    if (isBefore(newYear, newMonth, initialCurrentYear, initialCurrentMonth)) {
      // Do not allow navigation before the initial current month
      return;
    }
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
  };

  // Determine if previous and next buttons should be disabled
  let nextMonthCheck = currentMonth + 1;
  let nextYearCheck = currentYear;
  if (nextMonthCheck > 12) {
    nextMonthCheck = 1;
    nextYearCheck += 1;
  }
  const isNextDisabled = isAfter(nextYearCheck, nextMonthCheck, maxYear, maxMonth);

  let prevMonthCheck = currentMonth - 1;
  let prevYearCheck = currentYear;
  if (prevMonthCheck < 1) {
    prevMonthCheck = 12;
    prevYearCheck -= 1;
  }
  const isPrevDisabled = isBefore(prevYearCheck, prevMonthCheck, initialCurrentYear, initialCurrentMonth);

  // Render the calendar UI
  if (initialLoading || loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      {calendarData.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          {/* Previous Month Button */}
          <button
            className={`text-2xl p-2 ${
              isPrevDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'
            }`}
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
          >
            &#8594;
          </button>
         
          {/* Next Month Button */}
          <button
            className={`text-2xl p-2 ${
              isNextDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'
            }`}
            onClick={handleNextMonth}
            disabled={isNextDisabled}
          >
            &#8592;
          </button>
        </div>
      )}

      <div className={`flex lg:flex-row space-x-4 gap-4 flex-col`}>
        {calendarData.map((data, idx) => (
          <div key={idx} className="flex-grow">
            {/* Month Name */}
            <div className="text-center font-bold mb-2">
              {data.month_name} {toPersianNumber(data.year)}
            </div>
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
                  // Return an empty placeholder
                  return (
                    <div
                      key={index}
                      className="invisible border rounded-2xl p-1 aspect-square"
                    ></div>
                  );
                }

                // Build class names based on day properties
                let classNames =
                  'border rounded-2xl p-1 text-center flex flex-col items-center justify-center relative aspect-square';

                if (day.isDisable) {
                  classNames += ' bg-gray-200 text-gray-400 cursor-not-allowed';
                } else {
                  classNames += ' bg-white text-gray-800';
                }

                if (day.isToDay) {
                  classNames += ' border-2 border-primary-600';
                } else {
                  classNames += ' border-gray-200';
                }

                if (day.isHoliday) {
                  classNames += ' text-red-600 border-red-600';
                }

                return (
                  <div key={index} className={classNames}>
                    {/* Only render content if isBlank is false */}
                    {!day.isBlank && (
                      <>
                        {/* Peak Indicator */}
                        {day.isPeak && (
                          <div className="absolute top-1 right-1 w-7 h-7 rounded-lg">
                            <div className="w-full h-full border-t-2 border-primary-600 rotate-45 rounded"></div>
                          </div>
                        )}
                        {/* Day Number */}
                        <div className="font-bold w-full flex justify-center items-center relative text-xs sm:text-lg">
                          {/* Discount Indicator */}
                          {day.has_discount && (
                            <span className="absolute left-1 text-primary-600 px-1">%</span>
                          )}
                          {/* The number centered */}
                          <p>{toPersianNumber(day.day)}</p>
                        </div>

                        {/* Prices */}
                        {!day.isDisable && (
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

                        {/* Lock Icon for Disabled Days */}
                        {day.isDisable && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            {/* Add a lock icon if needed */}
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

export default CalendarContainer;
