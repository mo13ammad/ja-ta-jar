
import HouseVendorBadge from "./houseComponents/HouseVendorBadge";

import HouseInformation from "./houseComponents/HouseInformation";
import HouseViews from './houseComponents/HouseViews';

import HouseArrivals from "./houseComponents/HouseArrivals";
import HouseStructure from "./houseComponents/HouseStructure";


function HouseHeader({houseData}) {
 
  return (
    <div className="w-full flex flex-col gap-1 lg:gap-2 justify-start items-start px-2  lg:w-1/3 ">
      <div className="flex  items-center p-1 gap-1">
        <h1 className="text-xl xs:text-2xl  font-bold mb-1.5 w-full md:w-auto">
          {houseData?.name ?? 'نام اقامتگاه مشخص نشده است'}
        </h1>      
          <p className="text-sm bg-primary-50 px-2 flex items-center mb-1 justify-center pt-1 rounded-2xl">{houseData.uuid}</p>  
      </div>
   
      {/* City and Province */}
      <div className="flex w-full flex-col sm:flex-row lg:flex-col  justify-start items-start gap-1.5 ">
        <div className="flex flex-col xs:flex-row lg:flex-col xl:flex-row gap-1.5">
        <HouseVendorBadge hostInfo={houseData.vendor }/>
         <HouseInformation houseData={houseData}/>   
        </div>
    
      <div className="w-full">
        
      </div>
    </div>
      <div className="w-full flex flex-col gap-2 md:gap-3">
      <HouseViews houseViews={houseData.views.types}/>  
      <div className="flex flex-col gap-2 md:flex-row md:gap-4 lg:gap-6 md:items-center">
       <HouseArrivals arrivals={houseData.arrivals} tip={houseData.tip} structure={houseData.structure}  />  
      </div>
      </div>
    </div>
  );
}

export default HouseHeader;
