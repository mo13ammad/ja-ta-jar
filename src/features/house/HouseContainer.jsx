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
import HouseTopLocation from "./houseComponents/HouseTopLocation";
import HouseSanitaries from "./houseComponents/HouseSanitaries";
import HouseCalender from "./houseComponents/HouseCalender";

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
  console.log(houseData)
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
  if (loadingHouse) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  // Render the house details
  return (
    <div className="mt-7 lg:mt-0 flex   overflow-hidden items-start  flex-col w-full   shadow-centered rounded-2xl md:p-2 ">
      {/* House Images */}
      <div className="w-full md:mb-3">
        <HouseImages houseData={houseData} />
      </div>

      <div className="w-full bg-white rounded-t-2xl pt-2 xs:pt-3  -top-2 z-10 flex relative px-1 xs:px-2 py-1 lg:pt-3 xl:pt-6 flex-row">
        {/* Left Column */}
        <div className="flex flex-col w-full md:w-3/5 xl:w-3/4 ">
        <div className="flex flex-col xl:flex-row  w-full ">
           <div className="flex flex-col xl:w-1/2  ">
          <HouseHeader houseData={houseData} />
          <HouseTopLocation topLocations={houseData?.top_locations}/>
          <HouseDescription houseData={houseData} />
          </div>
          <div className=" flex flex-col   xl:mt-4 justify-center p-4  xl:h-full xl:w-1/2 ">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">موقعیت اقامتگاه :</h3>
            <div className="w-full h-full  flex  relative">
            <HouseLocation cords={houseData?.address?.geography}/>
            </div>
          </div>
        </div>
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
          <HouseRules houseData={houseData} />
          
          <div className="w-full px-4 my-3">
            <Separator />
          </div>
          <HouseCancellationRules houseData={houseData} />
          <div className="w-full px-4 my-3">
            <Separator />
          </div>
          <HouseComments houseData={houseData} />
          <div className="w-full px-4 my-3">
            <Separator />
          </div>
          <HouseSanitaries houseData={houseData}/>
          <div className="w-full px-4 my-3">
            <Separator />
          </div>
          <HouseCalender calendarData={calendarData}/>
          <div className="w-full px-4 my-3 mt-40">
            <Separator />
          </div>
          
        </div>

        {/* Right Column (Desktop Reservation Menu) */}
        <div className="hidden top-0 md:flex items-start justify-center w-2/5 xl:w-1/4 h-full">
          <div className="w-full rounded-3xl relative bg-white lg:px-2 py-1 shadow-centered">
            {/* Price Header */}
            <div className="w-full rounded-b rounded-3xl px-1 md:px-3 lg:px-8 flex justify-between absolute right-0 top-0 py-3 mb-4 bg-primary-500">
              <p className="text-white text-sm lg:text-lg">قیمت هر شب از</p>
              <p className="text-white text-sm lg:text-lg">{`${toPersianNumber(
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
