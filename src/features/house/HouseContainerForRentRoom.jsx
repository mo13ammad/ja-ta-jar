// HouseContainerForRentRoom.jsx

import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../ui/Loading";
import HouseHeader from "./HouseHeader";
import HouseComments from "./houseComponents/HouseComments";
import HouseFacilities from "./houseComponents/HouseFacilities";
import HouseImages from "./houseComponents/HouseImages";
import HouseLocation from "./houseComponents/HouseLocation";
import HouseReservationMenu from "./houseComponents/HouseReservationMenu";
import HouseDescription from "./houseComponents/HouseDescription";
import HouseSpace from "./houseComponents/HouseSpace";
import HouseRooms from "./houseComponents/HouseRooms";
import Separator from "../../ui/Separator";
import toPersianNumber from "../../utils/toPersianNumber";
import HouseCancellationRules from "./houseComponents/HouseCancellationRules";
import HouseTopLocation from "./houseComponents/HouseTopLocation";
import HouseSanitaries from "./houseComponents/HouseSanitaries";
import HouseCalendar from "./houseComponents/houseCalendar";
import { useQuery, useQueries } from "@tanstack/react-query";
import { getRoomCalendar, getRoomCalendarByMonth } from "../../services/houseService";
import ReserveMenuDesktop from "./houseComponents/ReserveMenuDesktop";

function HouseContainerForRentRoom({ houseData }) {
  const { uuid } = useParams();

  const [reserveDateFrom, setReserveDateFrom] = useState(null);
  const [reserveDateTo, setReserveDateTo] = useState(null);

  const rooms = useMemo(() => {
    return houseData?.room?.map((r) => ({ uuid: r.uuid, name: r.name })) || [];
  }, [houseData]);

  const initialRoomUuid = rooms.length > 0 ? rooms[0].uuid : null;
  const [selectedRoomUuid, setSelectedRoomUuid] = useState(initialRoomUuid);

  const isRoomCalendarEnabled = !!uuid && !!selectedRoomUuid;

  const { data: initialCalendarData, isLoading: loadingInitialCalendar } = useQuery({
    queryKey: ["get-room-calendar-initial", uuid, selectedRoomUuid],
    queryFn: () => getRoomCalendar(uuid, selectedRoomUuid),
    enabled: isRoomCalendarEnabled,
    retry: false,
  });

  let monthsToFetch = [];
  if (initialCalendarData) {
    let { year, month } = initialCalendarData;
    for (let i = 0; i < 1; i++) {
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
      monthsToFetch.push({ year, month });
    }
  }

  const calendarQueries = useQueries({
    queries: monthsToFetch.map(({ year, month }) => ({
      queryKey: ["get-room-calendar-by-month", uuid, selectedRoomUuid, year, month],
      queryFn: () => getRoomCalendarByMonth(uuid, selectedRoomUuid, year, month),
      enabled: !!uuid && !!initialCalendarData && !!selectedRoomUuid,
    })),
  });

  const isLoadingCalendar = calendarQueries.some((q) => q.isLoading) || loadingInitialCalendar;

  if (loadingInitialCalendar || isLoadingCalendar) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  const additionalCalendarData = calendarQueries.map((q) => q.data).filter(Boolean);

  let finalCalendarData = [];
  if (initialCalendarData) {
    finalCalendarData.push(initialCalendarData);
  }
  finalCalendarData = [...finalCalendarData, ...additionalCalendarData];

  return (
    <div className="mt-7 lg:mt-0 flex overflow-hidden items-start flex-col w-full shadow-centered rounded-2xl md:p-2">
      <div className="w-full md:mb-3">
        <HouseImages houseData={houseData} />
      </div>

      <div className="w-full bg-white rounded-t-2xl pt-2 xs:pt-3 -top-2 z-10 flex relative px-1 xs:px-2 py-1 lg:pt-3 xl:pt-6 flex-row">
        <div className="flex flex-col w-full md:w-3/5 xl:w-3/4">
          <div className="flex flex-col xl:flex-row w-full">
            <div className="flex flex-col xl:w-1/2">
              <HouseHeader houseData={houseData} />
              <HouseTopLocation topLocations={houseData?.top_locations} />
              <HouseDescription houseData={houseData} />
            </div>
            <div className="flex flex-col xl:mt-4 justify-center p-4 xl:h-full xl:w-1/2">
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">موقعیت اقامتگاه :</h3>
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

          <HouseCalendar
            calendarData={finalCalendarData}
          />

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
                calendarData={finalCalendarData} 
              />
            </div>
          </div>
        </div>
      </div>

      <HouseReservationMenu
        houseData={houseData}
        reserveDateFrom={reserveDateFrom}
        reserveDateTo={reserveDateTo}
        setReserveDateFrom={setReserveDateFrom}
        setReserveDateTo={setReserveDateTo}
        uuid={uuid}
        calendarData={finalCalendarData}
      />
    </div>
  );
}

export default HouseContainerForRentRoom;
