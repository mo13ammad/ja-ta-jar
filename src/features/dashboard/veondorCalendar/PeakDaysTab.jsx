import React, { useEffect, useMemo } from 'react';
import { getPeakDays, addPeakDays, removePeakDays } from '../../../services/houseService';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { TrashIcon } from '@heroicons/react/24/solid';

import PeakDayCalendarContainer from './PeakDayCalendarContainer';

function formatSelectedDate(dateObj) {
  if (!dateObj) return '';
  const { year, month, day } = dateObj;
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function PeakDaysTab({
  isOpen,
  calendarData,
  isRentRoom,
  roomOptions,
  selectedRoomUuid,
  setSelectedRoomUuid,
  reserveDateFrom,
  setReserveDateFrom,
  reserveDateTo,
  setReserveDateTo,
  closeModal,
  instantBooking,
  loadingCalendar,
  dropdown = "true",
}) {
  const queryClient = useQueryClient();

  const initialMonthData = useMemo(() => {
    if (!calendarData || calendarData.length === 0) return null;
    if (isRentRoom) {
      const firstRoom = calendarData[0];
      if (firstRoom && firstRoom.calendar && firstRoom.calendar.length > 0) {
        return firstRoom.calendar[0];
      }
      return null;
    } else {
      return calendarData[0];
    }
  }, [calendarData, isRentRoom]);

  const houseId = initialMonthData?.houseUuid || initialMonthData?.uuid || null;
  const year = initialMonthData?.year;
  const month = initialMonthData?.month;

  const { data: peakDays, refetch: refetchPeakDays } = useQuery(
    ['peakDays', houseId, year, month],
    () => getPeakDays(houseId, year, month),
    {
      enabled: isOpen && !!(houseId && year && month),
      onSuccess: (data) => {
        console.log("Peak days fetched:", data);
      }
    }
  );

  const addMutation = useMutation(
    ({ from_date, to_date }) => addPeakDays(houseId, from_date, to_date),
    {
      onSuccess: () => {
        refetchPeakDays();
      }
    }
  );

  const removeMutation = useMutation(
    ({ from_date, to_date }) => removePeakDays(houseId, from_date, to_date),
    {
      onSuccess: () => {
        refetchPeakDays();
      }
    }
  );

  const fromDateStr = formatSelectedDate(reserveDateFrom);
  const toDateStr = formatSelectedDate(reserveDateTo);

  useEffect(() => {
    if (reserveDateFrom && reserveDateTo) {
      const fromDate = new Date(reserveDateFrom.year, reserveDateFrom.month - 1, reserveDateFrom.day);
      const toDate = new Date(reserveDateTo.year, reserveDateTo.month - 1, reserveDateTo.day);
      if (toDate < fromDate) {
        setReserveDateTo({ ...reserveDateFrom });
      }
    }
  }, [reserveDateFrom, reserveDateTo, setReserveDateTo]);

  const handleClearSelection = () => {
    setReserveDateFrom(null);
    setReserveDateTo(null);
  };

  return (
    <div className="space-y-4 mx-auto">
      <div className="flex justify-end mt-2 ml-2 md:ml-6 lg:ml-10 2xl:ml-32">
        <button
          onClick={handleClearSelection}
          className="flex items-center gap-2 border border-red-500 px-4 py-2 rounded-3xl text-sm md:text-md"
        >
          <TrashIcon className="w-5 h-5 sm:w-5 sm:h-5 text-red-500" />
          <p className='pt-0.5'>پاک کردن</p>
        </button>
      </div>

      <div className="flex sm:flex-row gap-4 items-center justify-center">
        <div className="flex flex-col gap-2 items-center">
          <label className="text-xs sm:text-sm md:text-md font-medium text-gray-700">تاریخ از</label>
          <div
            className={`w-36 h-10 pt-1 border rounded-3xl flex items-center justify-center text-xs sm:text-sm md:text-md
            ${fromDateStr ? 'bg-primary-200 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {fromDateStr || '---'}
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <label className="text-xs sm:text-sm md:text-md font-medium text-gray-700">تاریخ تا</label>
          <div
            className={`w-36 h-10 border pt-1 rounded-3xl flex items-center justify-center text-xs sm:text-sm md:text-md
            ${toDateStr ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {toDateStr || '---'}
          </div>
        </div>
      </div>

      <PeakDayCalendarContainer
        calendarData={calendarData}
        isRentRoom={isRentRoom}
        roomOptions={roomOptions}
        selectedRoomUuid={selectedRoomUuid}
        setSelectedRoomUuid={setSelectedRoomUuid}
        instantBooking={instantBooking}
        loadingCalendar={loadingCalendar}
        dropdown={dropdown}
        reserveDateFrom={reserveDateFrom}
        setReserveDateFrom={setReserveDateFrom}
        reserveDateTo={reserveDateTo}
        setReserveDateTo={setReserveDateTo}
        closeModal={closeModal}
        onDayClick={(selectedDate) => {
          // Same selection logic as CalendarContainer:
          if (!reserveDateFrom || (reserveDateFrom && reserveDateTo)) {
            setReserveDateFrom({ year: selectedDate.year, month: selectedDate.month, day: selectedDate.day });
            setReserveDateTo(null);
          } else {
            const start = new Date(reserveDateFrom.year, reserveDateFrom.month - 1, reserveDateFrom.day);
            const end = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
            if (end >= start) {
              setReserveDateTo({ year: selectedDate.year, month: selectedDate.month, day: selectedDate.day });
            }
          }
        }}
      />

      <div className="flex flex-col sm:flex-row justify-end gap-4 mx-4 mt-4">
        <button
          onClick={() => {
            if (!fromDateStr || !toDateStr) return;
            addMutation.mutate({ from_date: fromDateStr, to_date: toDateStr });
          }}
          disabled={!fromDateStr || !toDateStr || addMutation.isLoading}
          className="bg-primary-600 text-white px-4 py-2 rounded-3xl text-xs sm:text-sm md:text-md"
        >
          اضافه کردن ایام پیک
        </button>

        <button
          onClick={() => {
            if (!fromDateStr || !toDateStr) return;
            removeMutation.mutate({ from_date: fromDateStr, to_date: toDateStr });
          }}
          disabled={!fromDateStr || !toDateStr || removeMutation.isLoading}
          className="bg-red-500 text-white px-4 py-2 rounded-3xl text-xs sm:text-sm md:text-md"
        >
          حذف کردن ایام پیک
        </button>
      </div>
    </div>
  );
}

export default PeakDaysTab;
