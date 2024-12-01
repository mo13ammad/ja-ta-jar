// HouseContainer.jsx

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useShowHouse from "./useShowHouse";
import HouseHeader from "./HouseHeader";
import HouseComments from "./houseComponents/HouseComments";
import HouseFacilities from "./houseComponents/HouseFacilities";
import HouseImages from "./houseComponents/HouseImages";
import HouseLocation from "./houseComponents/HouseLocation";
import HouseReservation from "./houseComponents/HouseReservation";
import HouseRules from "./houseComponents/HouseRules";
import Loading from "../../ui/Loading";
import HouseDescription from "./houseComponents/HouseDescription";
import HouseSpace from "./houseComponents/HouseSpace";
import HouseRooms from "./houseComponents/HouseRooms";
import Separator from "../../ui/Separator";
import HouseReservationMenu from "./houseComponents/HouseReservationMenu";
import ReserveMenuDesktop from "./houseComponents/ReserveMenuDesktop";
import toPersianNumber from "../../utils/toPersianNumber";
import { useQueries } from "@tanstack/react-query";
import { getHouseCalendarByMonth } from "../../services/houseService";
import HouseCancellationRules from "./houseComponents/HouseCancellationRules";
import useGetCalendar from './../calender/useGetCalendar';

function HouseContainer() {
  const navigate = useNavigate();
  const { uuid } = useParams();

  // Fetch house data using custom hook
  const { data: houseData, isLoading: loadingHouse } = useShowHouse(uuid);

  // Fetch initial calendar data
  const {
    data: initialCalendarData,
    isLoading: loadingInitialCalendar,
  } = useGetCalendar(uuid);

  // State for selected reservation dates
  const [reserveDateFrom, setReserveDateFrom] = useState(null);
  const [reserveDateTo, setReserveDateTo] = useState(null);

  // Calculate months to fetch based on initial calendar data
  let monthsToFetch = [];

  if (initialCalendarData) {
    // Extract the current year and month from the initial data
    let year = initialCalendarData.year;
    let month = initialCalendarData.month;

    // Fetch data for the current month and the next two months
    for (let i = 0; i < 3; i++) {
      monthsToFetch.push({ year, month });
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
  }

  // Use useQueries to fetch data for each month
  const calendarQueries = useQueries({
    queries: monthsToFetch.map(({ year, month }) => ({
      queryKey: ["get-house-calendar-by-month", uuid, year, month],
      queryFn: () => getHouseCalendarByMonth(uuid, year, month),
      enabled: !!uuid && !!initialCalendarData, // Ensure initial data is loaded
    })),
  });

  // Check if any of the queries are loading
  const isLoadingCalendar = calendarQueries.some((query) => query.isLoading);

  // Combine data from queries
  const calendarData = calendarQueries
    .map((query) => query.data)
    .filter(Boolean);

  // Show loading screen while fetching house data or calendar data
  if (loadingHouse || loadingInitialCalendar || isLoadingCalendar) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  // Render the house details
  return (
    <div className="mt-7 lg:mt-0 flex overflow-hidden items-start flex-col w-full bg-white shadow-centered rounded-2xl md:p-2 mb-24">
      {/* House Images */}
      <div className="w-full">
        <HouseImages houseData={houseData} />
      </div>

      <div className="w-full flex relative px-2 py-1 lg:pt-6 flex-row">
        {/* Left Column */}
        <div className="flex flex-col lg:w-3/5 xl:w-3/4">
          <HouseHeader houseData={houseData} />
          <HouseDescription houseData={houseData} />
          <div className="w-full px-4 mb-2">
            <Separator />
          </div>
          <HouseSpace houseData={houseData} />
          <div className="w-full px-4 my-3">
            <Separator />
          </div>
          <HouseRooms houseData={houseData} />
          <div className="w-full px-4 my-3">
            <Separator />
          </div>
          <HouseFacilities houseData={houseData} />
          <div className="w-full px-4 my-3">
            <Separator />
          </div>
          <HouseCancellationRules houseData={houseData} />
          <div className="w-full px-4 my-3">
            <Separator />
          </div>
          <HouseRules houseData={houseData} />
          <HouseReservation />
          <HouseLocation />
          <HouseComments />
        </div>

        {/* Right Column (Desktop Reservation Menu) */}
        <div className="hidden top-0 md:flex items-start justify-center w-2/5 xl:w-1/4 h-full">
          <div className="w-full rounded-3xl relative bg-white lg:px-2 py-1 shadow-lg">
            {/* Price Header */}
            <div className="w-full rounded-b rounded-3xl px-1 lg:px-8 flex justify-between absolute right-0 top-0 py-3 mb-4 bg-primary-500">
              <p className="text-white lg:text-lg">قیمت هر شب از</p>
              <p className="text-white lg:text-lg">{`${toPersianNumber(
                "800,000"
              )} تومان`}</p>
            </div>
            <div className="mt-14">
              {/* Pass selected dates and calendar data to ReserveMenuDesktop */}
              <ReserveMenuDesktop
                houseData={houseData}
                reserveDateFrom={reserveDateFrom}
                reserveDateTo={reserveDateTo}
                setReserveDateFrom={setReserveDateFrom}
                setReserveDateTo={setReserveDateTo}
                uuid={uuid}
                calendarData={calendarData} // Pass calendar data
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Reservation Menu */}
      <HouseReservationMenu
        houseData={houseData}
        reserveDateFrom={reserveDateFrom}
        reserveDateTo={reserveDateTo}
        setReserveDateFrom={setReserveDateFrom}
        setReserveDateTo={setReserveDateTo}
        uuid={uuid}
        calendarData={calendarData} // Pass calendar data
      />
    </div>
  );
}

export default HouseContainer;
