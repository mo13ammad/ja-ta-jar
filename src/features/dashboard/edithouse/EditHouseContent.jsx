// src/components/EditHouseContent.jsx

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
import EnvironmentInfo from './edithouse-components/EditHouseEnvironmentInfo ';
import useFetchHouse from '../useFetchHouse';
import useEditHouse from './useEditHouse';
import Loading from '../../../ui/Loading';

const EditHouseContent = ({ selectedTab }) => {
  const { uuid } = useParams();
  
  const {
    data: houseData,
    isLoading: loadingHouse,
    isFetching,
    refetch: refetchHouseData, // Add refetch to manually refresh data
  } = useFetchHouse(uuid);

  const {
    mutateAsync: editHouseAsync,
    isLoading: editLoading,
    error: editError,
  } = useEditHouse();

  const handleEditHouse = async (updatedData) => {
    try {
      const response = await editHouseAsync({ houseId: uuid, houseData: updatedData });
      console.log('Edit response:', response);
      refetchHouseData(); // Trigger refetch on successful edit
    } catch (error) {
      console.error('Edit House Error:', error);
    }
  };

  const commonProps = {
    houseData: houseData?.data || {},
    houseId: uuid,
    loadingHouse,
    isFetching,
    editLoading,
    editError,
    handleEditHouse,
    refetchHouseData, // Pass refetchHouseData to child components
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'address':
        return <AddressDetails {...commonProps} />;
      case 'location':
        return <LocationDetails {...commonProps} />;
      case 'generalInfo':
        return <GeneralInfo {...commonProps} />;
      case 'environmentInfo':
        return <EnvironmentInfo {...commonProps} />;
      case 'mainFacilities':
        return <MainFacilities {...commonProps} />;
      case 'rooms':
        return <Rooms {...commonProps} />;
      case 'sanitaries':
        return <Sanitaries {...commonProps} />;
      case 'reservationRules':
        return <ReservationRules {...commonProps} />;
      case 'stayRules':
        return <StayRules {...commonProps} />;
      case 'pricing':
        return <Pricing {...commonProps} />;
      case 'images':
        return <Images {...commonProps} />;
      case 'finalSubmit':
        return <div>Final Submit</div>;
      default:
        return <AddressDetails {...commonProps} />;
    }
  };

  return (
    <div>
      {loadingHouse ? (
        <div className="min-h-[60vh] flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default EditHouseContent;
