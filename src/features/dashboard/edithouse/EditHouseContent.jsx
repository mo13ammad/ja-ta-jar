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
import useUser from '../useUser';


const EditHouseContent = ({ selectedTab }) => {
  const { data: userData, isLoading: loadingUser } = useUser();
  const renderContent = () => {
    switch (selectedTab) {
      case 'address':
        return <AddressDetails  userData={userData} loadingUser={loadingUser}/>;
      case 'location':
        return <LocationDetails  userData={userData} loadingUser={loadingUser}/>; 
      case 'generalInfo':
        return <GeneralInfo  userData={userData} loadingUser={loadingUser}/>;
      case 'environmentInfo':
        return <EnvironmentInfo  userData={userData} loadingUser={loadingUser}/>; 
      case 'mainFacilities':
        return <MainFacilities  userData={userData} loadingUser={loadingUser}/>;
      case 'rooms':
        return <Rooms  userData={userData} loadingUser={loadingUser}/>;
      case 'sanitaries':
        return <Sanitaries  userData={userData} loadingUser={loadingUser}/>;
      case 'reservationRules':
        return <ReservationRules userData={userData} loadingUser={loadingUser}/>;
      case 'stayRules':
        return <StayRules  userData={userData} loadingUser={loadingUser}/>;
      case 'pricing':
        return <Pricing  userData={userData} loadingUser={loadingUser}/>;
      case 'images':
        return <Images  userData={userData} loadingUser={loadingUser}/>;
      case 'finalSubmit':
        return <div>FinalSubmit</div>;
      default:
        return <AddressDetails  userData={userData} loadingUser={loadingUser}/>; // Default case
    }
  };

  return <div>{renderContent()}</div>;
};

export default EditHouseContent;
