import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import React from 'react';

function HouseInformation({ houseData }) {
  const city = houseData?.address?.city?.name || 'نامشخص';
  const province = houseData?.address?.city?.province?.name || 'نامشخص';

  return (
    <div className="flex flex-col  bg-primary-50 rounded-3xl py-1 px-3">
      <div className="flex justify-self-end items-center flex-row gap-1">
        <MapPinIcon className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600" />
        <p className="text-sm truncate">
          {province}, <span>{city}</span>
        </p>
      </div>
      <div className="text-primary-500 flex items-center justify-start rounded-2xl w-full">
        <StarIcon className="h-5 w-5 text-primary-600" />
        
        <p className="text-primary-800 px-1 py-0.5">۴,۱</p>
      </div>
    </div>
  );
}

export default HouseInformation;
