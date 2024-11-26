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
import CalenderContainer from "../calender/CalenderContainer";
import HouseRooms from "./houseComponents/HouseRooms";
import Separator from "./../../ui/Separator";
import HouseCancelationRules from "./houseComponents/HouseCancelationRules";
import HouseReserveMenu from "./houseComponents/ReserveMenu";

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
      <div className="w-full flex lg:flex-row-reverse gap-1 flex-col">
        <HouseImages houseData={houseData} />
        <HouseHeader houseData={houseData} />
      </div>
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
      {/* <CalenderContainer /> */}
      <div className=" bg-red-700">
      </div>
      <HouseReserveMenu houseData={houseData} />
    </div>
  );
}

export default HouseContainer;
