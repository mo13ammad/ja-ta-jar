import { useParams } from 'react-router-dom';
import useFetchHouse from '../dashboard/useFetchHouse';
import HouseHeader from './HouseHeader';
import HouseComments from './houseComponents/HouseComments';
import HouseFacilitties from './houseComponents/HouseFacilitties';
import HouseImages from './houseComponents/HouseImages';
import HouseLocation from './houseComponents/HouseLocation';
import HouseReservation from './houseComponents/HouseReservation';
import HouseRules from './houseComponents/HouseRules';
import Loading from '../../ui/Loading';

function HouseContainer() {
  const { uuid } = useParams();

  const {
    data: houseData,
    isLoading: loadingHouse,
  } = useFetchHouse(uuid);

  if (loadingHouse) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }
  console.log(houseData);
  return (
    <div className="mt-7 lg:mt-0 flex items-start flex-col">
      <h1 className="text-2xl font-bold mb-1.5">{houseData.name}</h1>
      <div className="w-full flex lg:flex-row-reverse gap-1 flex-col">
        <HouseImages houseData={houseData}/>
        <HouseHeader houseData={houseData}/>
      </div>
      <HouseReservation />
      <HouseFacilitties />
      <HouseRules />
      <HouseLocation />
      <HouseComments />
    </div>
  );
}

export default HouseContainer;
