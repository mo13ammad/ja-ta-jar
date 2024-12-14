// src/features/house/HouseContainer.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import useShowHouse from "./useShowHouse";
import Loading from "../../ui/Loading";
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
import HouseTopLocation from "./houseComponents/HouseTopLocation";
import Separator from "../../ui/Separator";
import { useHouseCalendarData } from "../calendar/useHouseCalenderData";
import HouseCalendar from "./houseComponents/HouseCalendar";
import { useQueryClient } from "@tanstack/react-query";
import { useAllRoomsCalendarData } from "../calendar/useAllRoomsCalendarData"; // new hook
import HouseSimilarHouses from "./houseComponents/HouseSimilarHouses";

function HouseContainer() {
  const { uuid } = useParams();

  const {
    data: houseData,
    isLoading: loadingHouse,
    isError: isErrorHouse,
    error: errorHouse,
  } = useShowHouse(uuid);

  const isRentRoom = useMemo(() => houseData?.is_rent_room || false, [houseData]);

  const roomOptions = useMemo(() => {
    if (!isRentRoom || !houseData?.room) return [];
    return houseData.room
      .filter((room) => !room.is_living_room)
      .map((r) => ({ uuid: r.uuid, name: r.name }));
  }, [houseData, isRentRoom]);

  const [selectedRoomUuid, setSelectedRoomUuid] = useState(null);

  useEffect(() => {
    if (isRentRoom && roomOptions.length > 0 && !selectedRoomUuid) {
      setSelectedRoomUuid(roomOptions[0].uuid);
    }
  }, [isRentRoom, roomOptions, selectedRoomUuid]);

  const [reserveDateFrom, setReserveDateFrom] = useState(null);
  const [reserveDateTo, setReserveDateTo] = useState(null);

  const rentRoomPrefetchCount = 2;
  const housePrefetchCount = 2;

  const queryClient = useQueryClient();

  const {
    isLoading: isLoadingCalendarHouse,
    isError: isErrorCalendarHouse,
    error: errorCalendarHouse,
    calendarData: houseCalendarData,
  } = useHouseCalendarData({
    uuid,
    isRentRoom,
    enabled: Boolean(houseData),
    prefetchCount: housePrefetchCount,
  });

  const {
    isLoading: isLoadingAllRooms,
    isError: isErrorAllRooms,
    error: errorAllRooms,
    calendarData: allRoomsCalendarData,
  } = useAllRoomsCalendarData({
    uuid,
    isRentRoom,
    enabled: Boolean(houseData),
    prefetchCount: rentRoomPrefetchCount,
    roomOptions,
  });

  const isLoading = isRentRoom ? isLoadingAllRooms : isLoadingCalendarHouse;
  const isError = isRentRoom ? isErrorAllRooms : isErrorCalendarHouse;
  const error = isRentRoom ? errorAllRooms : errorCalendarHouse;
  const calendarData = isRentRoom ? allRoomsCalendarData : houseCalendarData;

  if (loadingHouse) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (isError) {
    console.error("HouseContainer: Error fetching calendar data:", error);
    return <div>Error: {error?.message || "خطا در بارگذاری اطلاعات"}</div>;
  }

  if (!houseData) {
    console.warn("HouseContainer: No house data found.");
    return <div>No house data available.</div>;
  }

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

          <div className="w-full px-4 mb-2"><Separator /></div>
          <HouseSpace houseData={houseData} />
          <div className="w-full px-4 my-3"><Separator /></div>

          <HouseRooms houseData={houseData} />
          <div className="w-full px-4 my-3"><Separator /></div>

          <HouseFacilities houseData={houseData} />

          <div className="w-full px-4 my-3"><Separator /></div>
          <HouseSanitaries houseData={houseData} />
          {/* Handle Calendar Loading / No Data / Display here */}
          {
            // If still loading calendar data, show a skeleton:
            isLoading && (
              <div className="my-3 px-4">
                <Separator />
                <h3 className="text-lg font-bold text-gray-800 my-2">تقویم اقامتگاه</h3>
                <div className="w-full px-2 h-48 bg-gray-100 animate-pulse rounded-3xl my-3"></div>
                <Separator />
              </div>
            )
          }

          {
            // If not loading, but have data, show the HouseCalendar
            !isLoading && calendarData && calendarData.length > 0 && (
              <>
                <div className="w-full px-4 my-3"><Separator /></div>
                <HouseCalendar
                  calendarData={calendarData}
                  isRentRoom={isRentRoom}
                  roomOptions={roomOptions}
                  selectedRoomUuid={selectedRoomUuid}
                  setSelectedRoomUuid={setSelectedRoomUuid}
                  reserveDateFrom={reserveDateFrom}
                  setReserveDateFrom={setReserveDateFrom}
                  reserveDateTo={reserveDateTo}
                  setReserveDateTo={setReserveDateTo}
                />
                <div className="w-full px-4 my-3"><Separator /></div>
              </>
            )
          }

          {
            // If not loading and no data available for the calendar, show a message
            !isLoading && (!calendarData || calendarData.length === 0) && (
              <div className="w-full px-4 my-3">
                <Separator />
                <div className="text-center py-8">
                  هیچ داده‌ای موجود نیست
                </div>
                <Separator />
              </div>
            )
          }

          <HouseRules houseData={houseData} />
          <div className="w-full px-4 my-3"><Separator /></div>

          <HouseCancellationRules houseData={houseData} />
          <div className="w-full px-4 my-3"><Separator /></div>

          <HouseComments houseData={houseData} />
          <div className="w-full px-4 my-3"><Separator /></div>

          <HouseTopLocation topLocations={houseData?.top_locations} />
         
           <HouseSimilarHouses houseData={houseData}/>
        
        </div>

        <div className="hidden top-0 md:flex items-start justify-center w-2/5 xl:w-1/4 h-full">
          <ReserveMenuDesktop
            houseData={houseData}
            roomOptions={roomOptions}
            selectedRoomUuid={selectedRoomUuid}
            setSelectedRoomUuid={setSelectedRoomUuid}
            reserveDateFrom={reserveDateFrom}
            reserveDateTo={reserveDateTo}
            setReserveDateFrom={setReserveDateFrom}
            setReserveDateTo={setReserveDateTo}
            uuid={uuid}
            calendarData={calendarData}
            isRentRoom={isRentRoom}
          />
        </div>
      </div>

      <HouseReservationMenu
        houseData={houseData}
        roomOptions={roomOptions}
        selectedRoomUuid={selectedRoomUuid}
        setSelectedRoomUuid={setSelectedRoomUuid}
        reserveDateFrom={reserveDateFrom}
        reserveDateTo={reserveDateTo}
        setReserveDateFrom={setReserveDateFrom}
        setReserveDateTo={setReserveDateTo}
        uuid={uuid}
        calendarData={calendarData}
        isRentRoom={isRentRoom}
      />
    </div>
  );
}

export default HouseContainer;
