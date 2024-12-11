// HouseContainer.jsx

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useShowHouse from "./useShowHouse";
import Loading from "../../ui/Loading";
import HouseContainerForHouse from "./HouseContainerForHouse";
import HouseContainerForRentRoom from "./HouseContainerForRentRoom";

function HouseContainer() {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const { data: houseData, isLoading: loadingHouse } = useShowHouse(uuid);

  if (loadingHouse) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (!houseData) {
    return null;
  }

  if (houseData.is_rent_room) {
    return <HouseContainerForRentRoom houseData={houseData} />;
  } else {
    return <HouseContainerForHouse houseData={houseData} />;
  }
}

export default HouseContainer;
