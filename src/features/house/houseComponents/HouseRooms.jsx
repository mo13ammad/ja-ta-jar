import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FaBed, FaCouch } from 'react-icons/fa';
import toPersianNumber from '../../../utils/toPersianNumber';

function HouseRooms({ houseData }) {
  const rooms = houseData.room;

  if (!rooms || rooms.length === 0) {
    return null;
  }

  const [activeRoomIndex, setActiveRoomIndex] = useState(0);



  // Helper function to get the bed information
  const getBedInfo = (room) => {
    const bedInfo = [];

    if (room.number_double_beds > 0) {
      bedInfo.push(`${room.number_double_beds} تخت دونفره`);
    }
    if (room.number_single_beds > 0) {
      bedInfo.push(`${room.number_single_beds} تخت یک‌نفره`);
    }
    if (room.number_sofa_beds > 0) {
      bedInfo.push(`${room.number_sofa_beds} مبل تخت‌خواب‌شو`);
    }

    return bedInfo.join('، ');
  };

  const activeRoom = rooms[activeRoomIndex];

  // Prepare bed info and floor service
  const bedInfoStr = activeRoom ? getBedInfo(activeRoom) : '';
  const showBedSection = bedInfoStr || (activeRoom && activeRoom.number_floor_service > 0);

  return (
    <div className="my-3 px-2">
      {/* Header */}
      <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
        فضای خواب
        <div className="mr-2 bg-gray-200 text-gray-800 rounded-full px-2 py-1 text-sm">
          {toPersianNumber(rooms.length)} اتاق خواب
        </div>
      </h3>

      {/* Rooms Carousel */}
      <Swiper spaceBetween={10} slidesPerView={'auto'} className="my-4">
        {rooms.map((room, index) => (
          <SwiperSlide
            key={room.uuid || index}
            style={{ width: 'auto' }}
            className={`flex-shrink-0 cursor-pointer ${
              activeRoomIndex === index ? 'bg-primary-50' : 'bg-white'
            } border rounded-lg p-4 flex flex-col items-center`}
            onClick={() => setActiveRoomIndex(index)}
          >
            {/* Icon and Room Name */}
            <div className="mb-2 flex items-center gap-2">
            <FaBed className="text-primary-600 text-3xl" />
              <p className="font-semibold">{room.name}</p>
            </div>
            {/* Removed bed info from here */}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Room Details (اطلاعات اتاق) */}
      {activeRoom && (
        <div className="mt-4 bg-gray-50 p-3 rounded-xl">
          <h4 className="text-md font-bold text-gray-800 mb-2">اطلاعات اتاق</h4>

          {/* Description */}
          {activeRoom.description && (
            <p className="text-sm text-gray-700 mb-4">
              {activeRoom.description}
            </p>
          )}

          {/* Bed and Floor Service Info */}
          {showBedSection && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-700 mb-1">خواب</h5>
              <p className="text-sm text-gray-700">
                {bedInfoStr && toPersianNumber(bedInfoStr)}
                {activeRoom.number_floor_service > 0 && (
                  <>
                    {bedInfoStr ? ' - ' : ''}
                    {toPersianNumber(activeRoom.number_floor_service)} سرویس کف خواب
                  </>
                )}
              </p>
            </div>
          )}

          {/* Facilities */}
          {activeRoom.facilities && activeRoom.facilities.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-700 mb-1">امکانات</h5>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activeRoom.facilities.map((fac) => (
                  <li key={fac.key} className="flex items-center">
                    <div className="w-6 h-6 flex-shrink-0 mr-2">
                      <img
                        src={fac.icon}
                        alt={fac.label}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-sm text-gray-700 mr-1">{fac.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Air Conditions */}
          {activeRoom.airConditions && activeRoom.airConditions.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-1">سیستم سرمایش و گرمایش</h5>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activeRoom.airConditions.map((air) => (
                  <li key={air.key} className="flex items-center">
                    <div className="w-6 h-6 flex-shrink-0 mr-2">
                      <img
                        src={air.icon}
                        alt={air.label}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-sm text-gray-700 mr-1">{air.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HouseRooms;
