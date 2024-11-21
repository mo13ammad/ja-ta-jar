
import HouseBody from './HouseBody';
import HouseHeader from './HouseHeader';
import HouseImages from './houseComponents/HouseImages';

function HouseContainer() {
  return (
    <>
    <div className='mt-7 lg:mt-0 flex items-start flex-col '>
    <h1 className="text-2xl font-bold mb-1.5">عنوان اقامتگاه</h1>
      <div className='w-full flex lg:flex-row-reverse gap-1 flex-col '>
    <HouseImages/>
     <HouseHeader/>
    </div>
   <HouseBody/>
   </div>
   </>
  );
}

export default HouseContainer;
