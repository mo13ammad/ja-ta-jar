import React from 'react';
import AddressDetails from './edithouse-components/EditHouseAddressDetails';
import GeneralInfo from './edithouse-components/EditHouseGeneralInfo';
import MainFacilities from './edithouse-components/EditHouseMainFacilities';
import Rooms from './edithouse-components/EditHouseRooms';
import Sanitaries from './edithouse-components/EditHouseSanitaries';
import ReservationRules from './edithouse-components/EditHouseReservationRules';
import StayRules from './edithouse-components/EditHouseStayRules';
import Pricing from './edithouse-components/EditHousePricing';
import Images from './edithouse-components/EditHouseImages';
import LocationDetails from './edithouse-components/EditHouseLocationDetails';
import EnvironmentInfo  from './edithouse-components/EditHouseEnvironmentInfo ';


const EditHouseContent = ({ selectedTab }) => {
  const renderContent = () => {
    switch (selectedTab) {
      case 'address':
        return <AddressDetails />;
      case 'location':
        return <LocationDetails />; 
      case 'generalInfo':
        return <GeneralInfo />;
      case 'environmentInfo':
        return <EnvironmentInfo />; 
      case 'mainFacilities':
        return <MainFacilities />;
      case 'rooms':
        return <Rooms />;
      case 'sanitaries':
        return <Sanitaries />;
      case 'reservationRules':
        return <ReservationRules />;
      case 'stayRules':
        return <StayRules />;
      case 'pricing':
        return <Pricing />;
      case 'images':
        return <Images />;
      case 'finalSubmit':
        return <div>FinalSubmit</div>;
      default:
        return <AddressDetails />; // Default case
    }
  };

  return <div>{renderContent()}</div>;
};

export default EditHouseContent;
