
import HouseVendorBadge from "./houseComponents/HouseVendorBadge";

import HouseInformation from "./houseComponents/HouseInformation";
import HouseViews from './houseComponents/HouseViews';
import HouseAreas from "./houseComponents/HouseAreas";
import HouseArrivals from "./houseComponents/HouseArrivals";
import HouseStructure from "./houseComponents/HouseStructure";
import HouseCode from "./houseComponents/HouseCode";

function HouseHeader({houseData}) {
 
  return (
    <div className="w-full flex flex-col gap-1 lg:gap-2 justify-start items-start  lg:w-1/3 ">
      <div className="flex  items-center p-1 gap-1">
        <h1 className="text-2xl font-bold mb-1.5 w-full md:w-auto">
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
        {/* Tip Section */}
      { (
        <div  className='w-1/2 xs:w-auto lg:w-1/2 xl:w-auto'>
          <div className="flex items-center gap-1 mb-2">
            <p className='font-bold'>نوع اقامتگاه :</p>
          </div>
          <div className='flex gap-1'>
          <div className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-primary-50 shadow-centered">
            <img src={houseData.structure.icon} alt={houseData.structure.label} className="w-6 h-6" />
            <span className="font-medium">{houseData.structure.label}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-primary-50 shadow-centered">
            <img src={houseData.tip.icon} alt={houseData.tip.label} className="w-6 h-6" />
            <span className="font-medium truncate">{houseData.tip.label}</span>
          </div>
         
          </div>
        </div>
      )}
       <HouseAreas houseAreas={houseData.areas}/>  
      <HouseViews houseViews={houseData.views.types}/>  
       <HouseArrivals arrivals={houseData.arrivals} tip={houseData.tip} structure={houseData.structure}  />  
      
      </div>
    </div>
  );
}

export default HouseHeader;
