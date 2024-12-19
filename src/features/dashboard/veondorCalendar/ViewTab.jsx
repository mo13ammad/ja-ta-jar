// src/features/dashboard/veondorCalendar/ViewTab.jsx
import React, { useState, Fragment } from 'react';
import ReactDOM from 'react-dom';
import VendorCalendarContainer from '../../calendar/VendorCalendarContainer';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function ViewTab({
  isOpen,
  calendarData,
  isRentRoom,
  roomOptions,
  selectedRoomUuid,
  setSelectedRoomUuid,
  instantBooking,
  viewOnly = false
}) {
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);

  const handleDayClick = (dayData) => {
    setSelectedDayDetails(dayData);
    setShowDayModal(true);
  };

  console.log(calendarData);

  const detailModal = (
    <Transition show={showDayModal} as={Fragment}>
      <div>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-50"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-50"
          leaveTo="opacity-0"
        >
          {/* Add onClick here to close modal when clicking outside */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-[9998]"
            onClick={() => setShowDayModal(false)}
          />
        </Transition.Child>
        
        {/* Panel */}
        <Transition.Child
          as={Fragment}
          enter="transition ease-out duration-300 transform"
          enterFrom="opacity-0 translate-x-full"
          enterTo="opacity-100 translate-x-0"
          leave="transition ease-in duration-200 transform"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-full"
          className="rounded-l-3xl"
        >
          <div 
            className="fixed top-0 right-0 z-[9999] flex flex-col bg-white shadow-xl overflow-auto h-screen 
                       w-2/3  lg:w-1/4 transform transition-transform"
          >
            <div className="flex justify-between items-center p-4  border-b ">
              <h2 className="text-lg font-bold">جزئیات روز</h2>
              <button
                onClick={() => setShowDayModal(false)}
                className="rounded-full w-10 h-10 bg-primary-500 hover:bg-primary-100 text-white hover:text-primary-700 transition duration-150 ease-in-out flex items-center justify-center"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 space-y-2 text-sm">
              {selectedDayDetails && (
                <>
                  <p>
                    <span className="font-bold">تاریخ: </span>
                    {selectedDayDetails.readAbleDate}
                  </p>
                  <p>
                    <span className="font-bold">قیمت: </span>
                    {selectedDayDetails.price != null
                      ? selectedDayDetails.price.toLocaleString()
                      : 'نامشخص'}
                  </p>
                  <p>
                    <span className="font-bold">قیمت ویژه: </span>
                    {selectedDayDetails.specialPrice != null
                      ? selectedDayDetails.specialPrice.toLocaleString()
                      : 'ندارد'}
                  </p>
                  <p>
                    <span className="font-bold">روز پیک: </span>
                    {selectedDayDetails.isPeakDay ? 'بله' : 'خیر'}
                  </p>
                  <p>
                    <span className="font-bold">خارج از سایت: </span>
                    {selectedDayDetails.isBookingOffSite ? 'بله' : 'خیر'}
                  </p>
                  <p>
                    <span className="font-bold">توضیحات: </span>
                    {selectedDayDetails.HolidayText || '---'}
                  </p>
                  <p>
                    <span className="font-bold">اتاق های آزاد: </span>
                    {selectedDayDetails.numberFreeRoom != null
                      ? selectedDayDetails.numberFreeRoom
                      : 'نامشخص'}
                  </p>
                  <p>
                    <span className="font-bold">نوع قیمت: </span>
                    {selectedDayDetails.priceFrom || 'نامشخص'}
                  </p>
                  <p>
                    <span className="font-bold">تعطیل: </span>
                    {selectedDayDetails.isHoliday ? 'بله' : 'خیر'}
                  </p>
                  <p>
                    <span className="font-bold">آخر هفته: </span>
                    {selectedDayDetails.isWeekend ? 'بله' : 'خیر'}
                  </p>
                  {/* Add more fields as needed from the day object */}
                </>
              )}
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );

  return (
    <div className="relative">
      <VendorCalendarContainer
        calendarData={calendarData}
        isRentRoom={isRentRoom}
        roomOptions={roomOptions}
        selectedRoomUuid={selectedRoomUuid}
        setSelectedRoomUuid={setSelectedRoomUuid}
        instantBooking={instantBooking}
        viewOnly={viewOnly}
        onDayClick={handleDayClick}
      />

      {ReactDOM.createPortal(detailModal, document.body)}
    </div>
  );
}
