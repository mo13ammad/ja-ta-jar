// HouseContainerForHouse.jsx

import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import HouseHeader from "./HouseHeader";
import HouseFacilities from "./houseComponents/HouseFacilities";
import HouseImages from "./houseComponents/HouseImages";
import HouseLocation from "./houseComponents/HouseLocation";
import HouseReservationMenu from "./houseComponents/HouseReservationMenu";
import ReserveMenuDesktop from "./houseComponents/ReserveMenuDesktop";
import HouseDescription from "./houseComponents/HouseDescription";
import HouseSpace from "./houseComponents/HouseSpace";
import HouseRooms from "./houseComponents/HouseRooms";
import HouseRules from "./houseComponents/HouseRules";
import HouseCancellationRules from "./houseComponents/HouseCancellationRules";
import HouseComments from "./houseComponents/HouseComments";
import HouseSanitaries from "./houseComponents/HouseSanitaries";
import HouseCalendar from "./houseComponents/houseCalendar";
import HouseTopLocation from "./houseComponents/HouseTopLocation";

import Separator from "../../ui/Separator";
import Loading from "../../ui/Loading";
import toPersianNumber from "../../utils/toPersianNumber";

// Hooks
import useGetCalendar from "../calendar/useGetCalendar";
import { useQueries } from "@tanstack/react-query";
import { getHouseCalendarByMonth } from "../../services/houseService";

function HouseContainerForHouse({ houseData }) {
  const { uuid } = useParams();

  const [reserveDateFrom, setReserveDateFrom] = useState(null);
  const [reserveDateTo, setReserveDateTo] = useState(null);

  const { data: initialCalendarData, isLoading: loadingCalendar } = useGetCalendar(uuid);

  const monthsToFetch = useMemo(() => {
    if (!initialCalendarData) return [];
    let { year, month } = initialCalendarData;
    let result = [];
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
    result.push({ year, month });
    return result;
  }, [initialCalendarData]);

  const calendarQueries = useQueries({
    queries: monthsToFetch.map(({ year, month }) => ({
      queryKey: ["get-house-calendar-by-month", uuid, year, month],
      queryFn: () => getHouseCalendarByMonth(uuid, year, month),
      enabled: !!uuid && !!initialCalendarData
    })),
  });

  const isLoadingAdditional = calendarQueries.some(q => q.isLoading);

  if (loadingCalendar || isLoadingAdditional) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  const additionalCalendarData = calendarQueries
    .map(q => q.data)
    .filter(Boolean);

  let calendarArray = [];
  if (initialCalendarData) {
    calendarArray.push(initialCalendarData);
  }
  calendarArray = [...calendarArray, ...additionalCalendarData];

  return (
    <div className="mt-7 lg:mt-0 flex overflow-hidden items-start flex-col w-full shadow-centered rounded-2xl md:p-2">
      {/* House Images */}
      <div className="w-full md:mb-3">
        <HouseImages houseData={houseData} />
      </div>

      <div className="w-full bg-white rounded-t-2xl pt-2 xs:pt-3 -top-2 z-10 flex relative px-1 xs:px-2 py-1 lg:pt-3 xl:pt-6 flex-row">
        {/* Left Column */}
        <div className="flex flex-col w-full md:w-3/5 xl:w-3/4">
          <div className="flex flex-col xl:flex-row w-full">
            <div className="flex flex-col xl:w-1/2">
              <HouseHeader houseData={houseData} />
              <HouseTopLocation topLocations={houseData?.top_locations} />
              <HouseDescription houseData={houseData} />
            </div>
            <div className="flex flex-col xl:mt-4 justify-center p-4 xl:h-full xl:w-1/2">
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                موقعیت اقامتگاه :
              </h3>
              <div className="w-full h-full flex relative">
                <HouseLocation cords={houseData?.address?.geography} />
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

          <HouseSanitaries houseData={houseData} />
          <div className="w-full px-4 my-3">
            <Separator />
          </div>

          {/* House Calendar */}
          {calendarArray.length > 0 && (
            <HouseCalendar calendarData={calendarArray} />
          )}

          <div className="w-full px-4 my-3 mt-40">
            <Separator />
          </div>
        </div>
       
        {/* Right Column (Desktop Reservation Menu) */}
        <div className="hidden top-0 md:flex items-start justify-center w-2/5 xl:w-1/4 h-full">
          <div className="w-full rounded-3xl relative bg-white lg:px-2 py-1 shadow-centered">
            {/* Removed the "قیمت هر شب از" section from here */}
            <div className="mt-14">
              <ReserveMenuDesktop
                houseData={houseData}
                reserveDateFrom={reserveDateFrom}
                reserveDateTo={reserveDateTo}
                setReserveDateFrom={setReserveDateFrom}
                setReserveDateTo={setReserveDateTo}
                uuid={uuid}
                calendarData={calendarArray}
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
        calendarData={calendarArray}
      />
    </div>
  );
}

export default HouseContainerForHouse;
