import React from "react";
import HouseVendorBadge from "./houseComponents/HouseVendorBadge";
import { MapPinIcon,StarIcon } from '@heroicons/react/24/solid';
import HouseInformation from "./houseComponents/HouseInformation";
import HouseStructure from "./houseComponents/HouseStructure";

function HouseHeader() {
  return (
    <div className="w-full flex justify-start items-start  lg:w-1/3 ">
   
      {/* City and Province */}
      <div className="flex w-full flex-col sm:flex-row lg:flex-col 2xl:flex-row justify-start items-start gap-1.5 ">
        <div className="flex gap-1.5">
        <HouseVendorBadge />
         <HouseInformation/>   
        </div>
    
      <div className="w-full">
         <HouseStructure/>   
      </div>
    </div>
    </div>
  );
}

export default HouseHeader;
