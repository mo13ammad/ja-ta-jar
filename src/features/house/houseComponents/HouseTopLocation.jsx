// HouseTopLocation.jsx

import React from 'react';
import toPersianNumber from './../../../utils/toPersianNumber';
import CustomInfoIcon from './../../../ui/CustomInfoIcon';

function HouseTopLocation({ topLocations }) {
  if (!topLocations || topLocations.length === 0) {
    return null; // Handle the case when there are no top locations
  }

  return (
    <div className="px-3 mb-2">
      <h2 className="text-lg font-semibold mb-2">مکان‌های تفریحی نزدیک اقامتگاه :</h2>
      <div className="flex flex-wrap gap-4">
        {topLocations.map((location, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 bg-primary-50 px-1.5 py-1 rounded-3xl cursor-pointer hover:bg-primary-75"
            onClick={() => window.open(location.link, '_blank')}
          >
            {/* Badge with Image */}
            <img
              src={location.image}
              alt={location.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {/* Location Details */}
            <div className="flex flex-col ">
              <div className="flex  items-center mr-2">
                <h3 className="text-base font-semibold">{location.name}</h3>
                {/* Info Icon with Tooltip */}
                <CustomInfoIcon
                  tooltipText={location.short_detail}
                  className="h-5 w-5 ml-2"
                />
              </div>
              <span className="text-sm text-gray-600 mr-2">
                فاصله: {toPersianNumber(location.distance.toFixed(1))} کیلومتر
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HouseTopLocation;
