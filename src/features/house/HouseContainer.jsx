import { useNavigate, useParams } from "react-router-dom";
import useShowHouse from "./useShowHouse";
import HouseHeader from "./HouseHeader";
import HouseComments from "./houseComponents/HouseComments";
import HouseFacilitties from "./houseComponents/HouseFacilitties";
import HouseImages from "./houseComponents/HouseImages";
import HouseLocation from "./houseComponents/HouseLocation";
import HouseReservation from "./houseComponents/HouseReservation";
import HouseRules from "./houseComponents/HouseRules";
import Loading from "../../ui/Loading";

import toast from "react-hot-toast";
import { useEffect } from "react";
import HouseDescribtion from "./houseComponents/HouseDescribtion";
import HouseSpace from "./houseComponents/HouseSpace";

import HouseRooms from "./houseComponents/HouseRooms";
import Separator from "./../../ui/Separator";
import HouseCancelationRules from "./houseComponents/HouseCancelationRules";
import HouseReserveMenu from "./houseComponents/ReserveMenu";
import CalendarContainer from "../calender/CalendarContainer";
import ReserveMenuDesktop from "./houseComponents/ReserveMenuDesktop";
import toPersianNumber from './../../utils/toPersianNumber';

function HouseContainer() {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const { data: houseData, isLoading: loadingHouse } = useShowHouse(uuid);

  // // Redirect if the house is not published
  // useEffect(() => {
  //   if (!loadingHouse && houseData && houseData.status.key !== "Publish") {
  //     toast.error("اطلاعات اقامتگاه موجود نمیباشد.")
  //     navigate("/");
  //   }
  // }, [loadingHouse, houseData, navigate]);

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
    <div className="mt-7 lg:mt-0 flex overflow-hidden items-start flex-col w-full bg-gray-100 shadow-centered rounded-2xl md:p-2 mb-24">
        <div className="w-full">
        <HouseImages houseData={houseData} />
        </div>

        <div className="w-full flex relative px-2 py-1 lg:pt-6 flex-row">
         <div className="flex flex-col lg:w-3/5 xl:w-3/4"> 
      <HouseHeader houseData={houseData} />
            <HouseDescribtion houseData={houseData} />
      <div className="w-full px-4 mb-2">
        <Separator />
      </div>
      <HouseSpace houseData={houseData} />
      <div className="w-full px-4 my-3">
        <Separator />
      </div>
      <HouseRooms houseData={houseData} />
      <div className="w-full px-4 my-3">
        <Separator />
      </div>
      <HouseFacilitties houseData={houseData} />
      <div className="w-full px-4 my-3">
        <Separator />
      </div>
      <HouseCancelationRules houseData={houseData} />
      <div className="w-full px-4 my-3">
        <Separator />
      </div>
      <HouseRules houseData={houseData} />
      <HouseReservation />
      <HouseLocation />
      <HouseComments />
         </div>
         <div className="hidden top-0 lg:flex items-center justify-center w-2/5 xl:w-1/4 h-full  ">
           <div className="w-full rounded-3xl relative  bg-gray-200 px-2 py-1"> 
            <div className="w-full rounded-b rounded-3xl px-8 flex justify-between absolute right-0 top-0  py-3 mb-4  bg-primary-500">
              <p className="text-white text-lg">قیمت هر شب از</p>
              <p className="text-white text-lg">{`${toPersianNumber("800,000")} تومان`}</p>
            </div>
            <div className="mt-14">
            <ReserveMenuDesktop/>
            </div>
            </div>
         </div>


         </div>



      
      <HouseReserveMenu houseData={houseData} />
      {/* <CalendarContainer/> */}
    </div>
  );
}

export default HouseContainer;
