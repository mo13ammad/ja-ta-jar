import React from 'react';
import { useParams } from 'react-router-dom';
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
import useFetchHouse from '../useFetchHouse';
import Loading from '../../../ui/Loading'; // Assuming Loading is a component for showing the loading state

const EditHouseContent = ({ selectedTab }) => {
  const { uuid } = useParams(); // Retrieve uuid from the URL parameters
  const { data: houseData, isLoading: loadingHouse } = useFetchHouse(uuid);
  console.log(houseData);

  const renderContent = () => {
    switch (selectedTab) {
      case 'address':
        return <AddressDetails houseData={houseData} loadingHouse={loadingHouse} />;
      case 'location':
        return <LocationDetails houseData={houseData} loadingHouse={loadingHouse} />;
      case 'generalInfo':
        return <GeneralInfo houseData={houseData} loadingHouse={loadingHouse} />;
      case 'environmentInfo':
        return <EnvironmentInfo houseData={houseData} loadingHouse={loadingHouse} />;
      case 'mainFacilities':
        return <MainFacilities houseData={houseData} loadingHouse={loadingHouse} />;
      case 'rooms':
        return <Rooms houseData={houseData} loadingHouse={loadingHouse} />;
      case 'sanitaries':
        return <Sanitaries houseData={houseData} loadingHouse={loadingHouse} />;
      case 'reservationRules':
        return <ReservationRules houseData={houseData} loadingHouse={loadingHouse} />;
      case 'stayRules':
        return <StayRules houseData={houseData} loadingHouse={loadingHouse} />;
      case 'pricing':
        return <Pricing houseData={houseData} loadingHouse={loadingHouse} />;
      case 'images':
        return <Images houseData={houseData} loadingHouse={loadingHouse} />;
      case 'finalSubmit':
        return <div>Final Submit</div>;
      default:
        return <AddressDetails houseData={houseData} loadingHouse={loadingHouse} />;
    }
  };

  return (
    <div>
      {loadingHouse ? (
        <Loading message="در حال بارگذاری اطلاعات اقامتگاه..." />
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default EditHouseContent;
