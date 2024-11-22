

import HouseHeader from './HouseHeader';
import HouseComments from './houseComponents/HouseComments';
import HouseFacilitties from './houseComponents/HouseFacilitties';
import HouseImages from './houseComponents/HouseImages';
import HouseLocation from './houseComponents/HouseLocation';
import HouseReservation from './houseComponents/HouseReservation';
import HouseRules from './houseComponents/HouseRules';

function HouseContainer() {
  return (
    <>
    <div className='mt-7 lg:mt-0 flex items-start flex-col '>
    <h1 className="text-2xl font-bold mb-1.5">عنوان اقامتگاه</h1>
      <div className='w-full flex  lg:flex-row-reverse gap-1 flex-col '>
        <HouseImages/>
        <HouseHeader/>
      </div>
     
       <HouseReservation/>
        <HouseFacilitties/>
        <HouseRules/>
        <HouseLocation/>
        <HouseComments/>
    </div>
   </>
  );
}

export default HouseContainer;
