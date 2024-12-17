import React, { Fragment, useMemo, useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import Loading from "../../ui/Loading";
import { Listbox, Transition, Tab } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useHouseCalendarData } from "../calendar/useHouseCalenderData";
import { useAllRoomsCalendarData } from "../calendar/useAllRoomsCalendarData";
import useFetchHouse from './../house/useShowHouse';
import PeakDaysTab from '../dashboard/veondorCalendar/PeakDaysTab';
import ReservationTab from '../dashboard/veondorCalendar/ReservationTab';
import PriceChangeTab from '../dashboard/veondorCalendar/PriceChangeTab';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const VendorCalendar = ({
  isOpen,
  onClose,
  houseUuid,
  reserveDateFrom,
  setReserveDateFrom,
  reserveDateTo,
  setReserveDateTo,
  instantBooking = false,
}) => {
  // Fetch house details
  const { data: houseData, isLoading: loadingHouse, isError: isErrorHouse, error: errorHouse } = useFetchHouse(houseUuid);

  // Determine isRentRoom and roomOptions after house is loaded
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

  const rentRoomPrefetchCount = 2;
  const housePrefetchCount = 2;

  const {
    isLoading: isLoadingCalendarHouse,
    isError: isErrorCalendarHouse,
    error: errorCalendarHouse,
    calendarData: houseCalendarData,
  } = useHouseCalendarData({
    uuid: houseUuid,
    isRentRoom,
    enabled: isOpen && Boolean(houseData) && !isRentRoom,
    prefetchCount: housePrefetchCount,
  });

  const {
    isLoading: isLoadingAllRooms,
    isError: isErrorAllRooms,
    error: errorAllRooms,
    calendarData: allRoomsCalendarData,
  } = useAllRoomsCalendarData({
    uuid: houseUuid,
    isRentRoom,
    enabled: isOpen && Boolean(houseData) && isRentRoom,
    prefetchCount: rentRoomPrefetchCount,
    roomOptions,
  });

  const isLoadingCalendar = isRentRoom ? isLoadingAllRooms : isLoadingCalendarHouse;
  const isErrorCalendar = isRentRoom ? isErrorAllRooms : isErrorCalendarHouse;
  const errorCalendar = isRentRoom ? errorAllRooms : errorCalendarHouse;
  const calendarData = isRentRoom ? allRoomsCalendarData : houseCalendarData;

  const selectedRoom = isRentRoom
    ? roomOptions.find((r) => r.uuid === selectedRoomUuid) || null
    : null;

  const combinedError = isErrorHouse
    ? (errorHouse?.message || "خطا در بارگذاری اطلاعات اقامتگاه")
    : isErrorCalendar
      ? (errorCalendar?.message || "خطا در بارگذاری تقویم")
      : null;

  const loading = loadingHouse || (isOpen && isLoadingCalendar);

  // Track the selected tab index and a state for transition effect
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [changing, setChanging] = useState(false);

  // Trigger the blur and opacity effect on tab change
  useEffect(() => {
    if (!isOpen) return;
    setChanging(true);
    const timeout = setTimeout(() => {
      setChanging(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [selectedIndex, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تقویم اقامتگاه">
      <div className="p-1 space-y-4">
        {loadingHouse && (
          <div className="w-full h-6 bg-gray-200 rounded-3xl px-2 animate-pulse"></div>
        )}

        {!loadingHouse && isErrorHouse && (
          <div className="text-center text-red-600 py-4">{combinedError}</div>
        )}

        {!loadingHouse && !isErrorHouse && houseData && (
          <div className="text-lg font-bold text-gray-800">
            {houseData.name || "بدون نام"} - {houseData.structure?.label || "بدون ساختار"}
          </div>
        )}

        {!loadingHouse && !isErrorHouse && isRentRoom && roomOptions.length > 0 && (
          <div className="mb-4 w-56">
            <Listbox
              value={selectedRoom}
              onChange={(newValue) => setSelectedRoomUuid(newValue.uuid)}
            >
              {({ open }) => (
                <div className="relative bg-white rounded-xl border border-primary-600">
                  <Listbox.Button className="flex justify-between items-center px-3 py-2 w-full rounded-xl text-right text-gray-700">
                    <span>{selectedRoom ? selectedRoom.name : "انتخاب اتاق"}</span>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        open ? "rotate-180" : "rotate-0"
                      }`}
                      aria-hidden="true"
                    />
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-75"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto focus:outline-none">
                      {roomOptions.map((room) => (
                        <Listbox.Option
                          key={room.uuid}
                          value={room}
                          className={({ active }) =>
                            `cursor-pointer select-none relative py-2 pr-4 pl-10 ${
                              active ? "bg-primary-400 text-white" : "text-gray-900"
                            }`
                          }
                        >
                          <span className="block truncate font-normal">
                            {room.name}
                          </span>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>
        )}

        {isOpen && loading && (
          <div className="w-full h-48 bg-gray-200 rounded-3xl animate-pulse"></div>
        )}

        {!loadingHouse && !isErrorHouse && !loading && combinedError && (
          <div className="text-center text-red-600 py-4">{combinedError}</div>
        )}

        {!loadingHouse && !isErrorHouse && !loading && !combinedError && calendarData && calendarData.length > 0 && (
          <Tab.Group
            selectedIndex={selectedIndex}
            onChange={(index) => setSelectedIndex(index)}
          >
            <Tab.List className="relative flex p-1 bg-gray-100 rounded-2xl max-w-4xl mx-auto">
              {/* Animated background highlight for selected tab, anchored to the right */}
              <div
                className="absolute top-1 bottom-1 right-1 rounded-2xl bg-primary-500 transition-transform duration-500 ease-in-out"
                style={{
                  width: 'calc((100%/3))',
                  transform: `translateX(-${selectedIndex * 100}%)`,
                }}
              ></div>

              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-2xl py-2.5 text-xs font-medium leading-5 relative z-10 transition-colors duration-200 text-center',
                    selected ? 'text-white' : 'text-gray-700'
                  )
                }
              >
                ایام پیک
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-2xl py-2.5 text-xs font-medium leading-5 relative z-10 transition-colors duration-200 text-center',
                    selected ? 'text-white' : 'text-gray-700'
                  )
                }
              >
                تغییر وضعیت
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-2xl py-2.5 text-xs font-medium leading-5 relative z-10 transition-colors duration-200 text-center',
                    selected ? 'text-white' : 'text-gray-700'
                  )
                }
              >
                <p className="mr-3">تغییر قیمت</p>
              </Tab>
            </Tab.List>

            <Tab.Panels
              className={classNames(
                "mt-2 transition-all duration-200 ease-in-out",
                changing ? "opacity-50 blur-sm" : "opacity-100 blur-0"
              )}
            >
              <Tab.Panel>
                <PeakDaysTab
                  calendarData={calendarData}
                  isRentRoom={isRentRoom}
                  roomOptions={roomOptions}
                  selectedRoomUuid={selectedRoomUuid}
                  setSelectedRoomUuid={setSelectedRoomUuid}
                  reserveDateFrom={reserveDateFrom}
                  setReserveDateFrom={setReserveDateFrom}
                  reserveDateTo={reserveDateTo}
                  setReserveDateTo={setReserveDateTo}
                  instantBooking={instantBooking}
                  loadingCalendar={false}
                  dropdown="true"
                />
              </Tab.Panel>
              <Tab.Panel>
                <ReservationTab
                  calendarData={calendarData}
                  isRentRoom={isRentRoom}
                  roomOptions={roomOptions}
                  selectedRoomUuid={selectedRoomUuid}
                  setSelectedRoomUuid={setSelectedRoomUuid}
                  reserveDateFrom={reserveDateFrom}
                  setReserveDateFrom={setReserveDateFrom}
                  reserveDateTo={reserveDateTo}
                  setReserveDateTo={setReserveDateTo}
                  instantBooking={instantBooking}
                  loadingCalendar={false}
                  dropdown="true"
                />
              </Tab.Panel>
              <Tab.Panel>
                <PriceChangeTab
                  calendarData={calendarData}
                  isRentRoom={isRentRoom}
                  roomOptions={roomOptions}
                  selectedRoomUuid={selectedRoomUuid}
                  setSelectedRoomUuid={setSelectedRoomUuid}
                  reserveDateFrom={reserveDateFrom}
                  setReserveDateFrom={setReserveDateFrom}
                  reserveDateTo={reserveDateTo}
                  setReserveDateTo={setReserveDateTo}
                  instantBooking={instantBooking}
                  loadingCalendar={false}
                  dropdown="true"
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        )}

        {!loadingHouse && !isErrorHouse && !loading && !combinedError && calendarData && calendarData.length === 0 && (
          <div className="text-center py-8">
            هیچ داده‌ای موجود نیست
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VendorCalendar;
