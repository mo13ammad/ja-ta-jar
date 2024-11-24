import { useNavigate, useParams } from 'react-router-dom';
import useShowHouse from './useShowHouse';
import HouseHeader from './HouseHeader';
import HouseComments from './houseComponents/HouseComments';
import HouseFacilitties from './houseComponents/HouseFacilitties';
import HouseImages from './houseComponents/HouseImages';
import HouseLocation from './houseComponents/HouseLocation';
import HouseReservation from './houseComponents/HouseReservation';
import HouseRules from './houseComponents/HouseRules';
import Loading from '../../ui/Loading';

import toast from 'react-hot-toast';
import { useEffect } from 'react';

function HouseContainer() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const {
    data: houseData,
    isLoading: loadingHouse,
  } = useShowHouse(uuid);

  // Redirect if the house is not published
  useEffect(() => {
    if (!loadingHouse && houseData && houseData.status.key !== "Publish") {
      toast.error("اطلاعات اقامتگاه موجود نمیباشد.")
      navigate("/");
    }
  }, [loadingHouse, houseData, navigate]);

  // Show loading screen while fetching house data
  if (loadingHouse) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  // Log the house data for debugging
  console.log(houseData);

  // Render the house details
  return (
    <div className="mt-7 lg:mt-0 flex items-start flex-col bg-gray-100 shadow-centered rounded-2xl p-1 md:p-2"> 
      <div className="w-full flex lg:flex-row-reverse gap-1 flex-col">
        <HouseImages houseData={houseData} />
        <HouseHeader houseData={houseData} />
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
