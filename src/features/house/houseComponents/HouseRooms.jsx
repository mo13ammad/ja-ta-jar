import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FaBed, FaCouch } from 'react-icons/fa';

function HouseRooms({ houseData }) {
  const rooms = houseData.room;

  if (!rooms || rooms.length === 0) {
    return null;
  }

  // Helper function to get the bed icon
  const getBedIcon = (room) => {
    if (room.number_double_beds > 0) {
      return <FaBed className="text-primary-600 text-3xl" />;
    } else if (room.number_single_beds > 0) {
      return <FaBed className="text-primary-600 text-3xl" />;
    } else if (room.number_sofa_beds > 0) {
      return <FaCouch className="text-primary-600 text-3xl" />;
    } else {
      return <FaBed className="text-primary-600 text-3xl" />;
    }
  };

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

  // Function to convert numbers to Persian digits
  const toPersianNumber = (num) => {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return num.toString().replace(/\d/g, (digit) => persianDigits[digit]);
  };

  return (
    <div className=' px-3'>
      {/* Header */}
      <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
        فضای خواب
        <div className="mr-2 bg-gray-200 text-gray-800 rounded-full px-2 py-1 text-sm">
          {toPersianNumber(rooms.length)} اتاق خواب
        </div>
      </h3>

      {/* Rooms Carousel */}
      <Swiper
        spaceBetween={10}
        slidesPerView={'auto'}
        className="my-4"
      >
        {rooms.map((room, index) => (
          <SwiperSlide
            key={room.uuid || index}
            style={{ width: 'auto' }}
            className="flex-shrink-0"
          >
            <div className="border rounded-lg p-4 flex flex-col items-center">
              {/* Icon */}
              <div className="mb-2 flex items-center gap-2">
                {getBedIcon(room)}
              <p className="font-semibold">{room.name}</p>
              </div>
              {/* Room Name */}
              {/* Bed Information */}
              <p className="text-sm text-gray-600">
                {toPersianNumber(getBedInfo(room))}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default HouseRooms;
