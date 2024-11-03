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
import useFetchHouse from '../useFetchHouse'; // Adjust the path based on your project structure
import useEditHouse from './useEditHouse'; // Adjust the path based on your project structure
import Loading from '../../../ui/Loading'; // Adjust the path based on your project structure

const EditHouseContent = ({ selectedTab }) => {
  const { uuid } = useParams(); // Retrieve uuid from the URL parameters

  const {
    data: houseData,
    isLoading: loadingHouse,
    isFetching, // Added isFetching
  } = useFetchHouse(uuid);

  // Use the useEditHouse hook
  const {
    mutateAsync: editHouseAsync,
    isLoading: editLoading,
    error: editError,
  } = useEditHouse();

  // Function to handle the edit operation
  const handleEditHouse = async (updatedData) => {
    console.log('handleEditHouse - Data to be sent:', updatedData);
    try {
      const response = await editHouseAsync({ houseId: uuid, houseData: updatedData });
      console.log('handleEditHouse - Response received:', response);
      // houseData will be automatically updated due to query invalidation in the useEditHouse hook
    } catch (error) {
      console.error('Edit House Error:', error);
      throw error; // Re-throw the error to propagate it back to handleSubmit
    }
  };

  // Destructure data once for easier access in child components
  const house = houseData?.data || {};

  const commonProps = {
    houseData: house,
    loadingHouse,
    isFetching, // Pass isFetching to child components
    editLoading,
    editError,
    handleEditHouse,
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
