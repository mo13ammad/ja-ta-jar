import React from "react";
import HouseVendorBadge from "./houseComponents/HouseVendorBadge";

import HouseInformation from "./houseComponents/HouseInformation";
import HouseStructure from "./houseComponents/HouseStructure";
import HouseViews from './houseComponents/HouseViews';
import HouseAreas from "./houseComponents/HouseAreas";

function HouseHeader({houseData}) {
 
  return (
    <div className="w-full flex flex-col justify-start items-start  lg:w-1/3 ">
   
      {/* City and Province */}
      <div className="flex w-full flex-col sm:flex-row lg:flex-col  justify-start items-start gap-1.5 ">
        <div className="flex flex-col xs:flex-row lg:flex-col xl:flex-row gap-1.5">
        <HouseVendorBadge hostInfo={houseData.vendor}/>
         <HouseInformation houseData={houseData}/>   
        </div>
    
      <div className="w-full">
        
      </div>
    </div>
      <div className="w-full">
      <HouseViews houseViews={houseData.views.types}/>  
      </div>
      <div className="w-full">
      <HouseAreas houseAreas={houseData.areas}/>  
      </div>
    </div>
  );
}

export default HouseHeader;
