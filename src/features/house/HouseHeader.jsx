import React from "react";
import HouseVendorBadge from "./houseComponents/HouseVendorBadge";
import { MapPinIcon,StarIcon } from '@heroicons/react/24/solid';

function HouseHeader() {
  return (
    <div className="w-full lg:w-1/3">
   

      {/* City and Province */}
      <div className="flex flex-row items-center gap-3 container ">
      <div className="">
      <HouseVendorBadge />
      </div>
      <div className="flex flex-col bg-primary-50 rounded-3xl py-1 px-3">
              <div className="flex justify-self-end items-center flex-row  gap-1 ">
                 <MapPinIcon className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600"/>
                 <p className="text-sm">خوزستان , <span>اهواز</span></p>
              </div> 
              <div className='text-primary-500 flex items-center justify-start rounded-2xl  w-full'>
                  <StarIcon className="h-5 w-5 text-primary-600" />
                  <StarIcon className="h-5 w-5 text-primary-600" />
                  <StarIcon className="h-5 w-5 text-primary-600" />
                  <StarIcon className="h-5 w-5 text-primary-600" />
                  <StarIcon className="h-5 w-5 text-primary-100" />
                  <p className='text-sm px-1 py-0.5'>۴,۱</p>
              </div>
      </div>
    </div>
    </div>
  );
}

export default HouseHeader;
