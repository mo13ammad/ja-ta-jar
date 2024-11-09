import React, { useState, useEffect } from 'react';
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
import EditHouseDocuments from './edithouse-components/EditHouseDocuments';
import EditHouseFinalSubmit from './edithouse-components/EditHouseFinalSubmit';
import EditHouseCancellationRules from './edithouse-components/EditHouseCancellationRules';

const EditHouseContent = ({ selectedTab }) => {
  const { uuid } = useParams();
  
  const {
    data: fetchedHouseData,
    isLoading: loadingHouse,
    isFetching,
    refetch: refetchHouseData,
  } = useFetchHouse(uuid);

  const {
    mutateAsync: editHouseAsync,
    isLoading: editLoading,
  } = useEditHouse();

  // Local state to store the house data, initialized with fetched data
  const [houseData, setHouseData] = useState(fetchedHouseData);

  // Update local state when fetchedHouseData changes
  useEffect(() => {
    if (fetchedHouseData) {
      setHouseData(fetchedHouseData);
    }
  }, [fetchedHouseData]);

  const handleEditHouse = async (updatedData) => {
    try {
      const response = await editHouseAsync({ houseId: uuid, houseData: updatedData });
      console.log('Edit response:', response);

      // Update houseData with the response from edit
      setHouseData(response);

      // Optionally refetch to ensure the data is in sync with the server
      refetchHouseData();
    } catch (error) {
      console.error('Edit House Error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };

  const commonProps = {
    houseData,
    houseId: uuid,
    loadingHouse,
    isFetching,
    editLoading,
    handleEditHouse,
    refetchHouseData,
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
      case 'cancellationRules':
        return <EditHouseCancellationRules {...commonProps} />;
      case 'pricing':
        return <Pricing {...commonProps} />;
      case 'images':
        return <Images {...commonProps} />;
      case 'documents':
        return <EditHouseDocuments {...commonProps} />;
      case 'finalSubmit':
        return <EditHouseFinalSubmit {...commonProps} />;
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
