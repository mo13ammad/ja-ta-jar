// EditHouseContent.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AddressDetails from './edithouse-components/EditHouseAddressDetails';
import EditHouseLocationDetails from './edithouse-components/EditHouseLocationDetails';
import GeneralInfo from './edithouse-components/EditHouseGeneralInfo';
import MainFacilities from './edithouse-components/EditHouseMainFacilities';
import Rooms from './edithouse-components/EditHouseRooms';
import Sanitaries from './edithouse-components/EditHouseSanitaries';
import ReservationRules from './edithouse-components/EditHouseReservationRules';
import StayRules from './edithouse-components/EditHouseStayRules';
import Pricing from './edithouse-components/EditHousePricing';
import Images from './edithouse-components/EditHouseImages';
import EnvironmentInfo from './edithouse-components/EditHouseEnvironmentInfo ';
import useFetchHouse from '../useFetchHouse';
import useEditHouse from './useEditHouse';
import Loading from '../../../ui/Loading';
import EditHouseDocuments from './edithouse-components/EditHouseDocuments';
import EditHouseFinalSubmit from './edithouse-components/EditHouseFinalSubmit';
import EditHouseCancellationRules from './edithouse-components/EditHouseCancellationRules';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

const EditHouseContent = ({
  selectedTab,
  handleNextTab,
  handlePreviousTab,
  tabSections,
}) => {
  const { uuid } = useParams();

  const {
    data: fetchedHouseData,
    isLoading: loadingHouse,
    isFetching,
    refetch: refetchHouseData,
  } = useFetchHouse(uuid);

  const { mutateAsync: editHouseAsync } = useEditHouse();

  const [houseData, setHouseData] = useState(fetchedHouseData);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const childRef = useRef(null); // Reference to child component

  useEffect(() => {
    if (fetchedHouseData) {
      console.log('Fetched house data:', fetchedHouseData);
      setHouseData(fetchedHouseData);
      setIsRefetching(false); // Move this here to ensure it's set after data is fetched
    }
  }, [fetchedHouseData]);

  const handleEditHouse = async (updatedData) => {
    console.log('handleEditHouse called with data:', updatedData);
    try {
      const response = await editHouseAsync({
        houseId: uuid,
        houseData: updatedData,
      });
      console.log('Edit response:', response);

      // Update houseData with the response from edit
      setHouseData(response);

      // Set refetching to true and refetch the latest data
      setIsRefetching(true);
      await refetchHouseData();

      // Ensure isRefetching is set back to false after refetch completes
      setIsRefetching(false);
    } catch (error) {
      console.error('Edit House Error:', error.response?.data || error.message);
      setIsRefetching(false); // Set isRefetching to false in case of error
      throw error.response?.data || error;
    }
  };

  const commonProps = {
    houseData,
    setHouseData,
    houseId: uuid,
    loadingHouse,
    isFetching,
    handleEditHouse,
    refetchHouseData,
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'address':
        return <AddressDetails ref={childRef} {...commonProps} />;
      case 'location':
        return <EditHouseLocationDetails ref={childRef} {...commonProps} />;
      case 'generalInfo':
        return <GeneralInfo ref={childRef} {...commonProps} />;
      case 'environmentInfo':
        return <EnvironmentInfo ref={childRef} {...commonProps} />;
      case 'mainFacilities':
        return <MainFacilities ref={childRef} {...commonProps} />;
      case 'rooms':
        return <Rooms  {...commonProps} />;
      case 'sanitaries':
        return <Sanitaries ref={childRef} {...commonProps} />;
      case 'reservationRules':
        return <ReservationRules ref={childRef} {...commonProps} />;
      case 'stayRules':
        return <StayRules ref={childRef} {...commonProps} />;
      case 'cancellationRules':
        return <EditHouseCancellationRules ref={childRef} {...commonProps} />;
      case 'pricing':
        return <Pricing ref={childRef} {...commonProps} />;
      case 'images':
        return <Images ref={childRef} {...commonProps} />;
      case 'documents':
        return <EditHouseDocuments ref={childRef} {...commonProps} />;
      case 'finalSubmit':
        return <EditHouseFinalSubmit {...commonProps} />;
      default:
        return <AddressDetails ref={childRef} {...commonProps} />;
    }
  };

  const handleNextClick = async () => {
    setIsSaving(true); // Start saving
    try {
      console.log('Next button clicked.');
      console.log('childRef.current:', childRef.current);
      if (childRef.current && childRef.current.validateAndSubmit) {
        const success = await childRef.current.validateAndSubmit();
        if (success) {
          handleNextTab(); // Navigate to next tab
        }
      } else {
        // If childRef or validateAndSubmit is not available, proceed
        handleNextTab();
      }
    } catch (error) {
      console.error('Error during next click:', error);
    } finally {
      setIsSaving(false); // End saving
    }
  };

  const handlePreviousClick = async () => {
    setIsSaving(true); // Start saving
    try {
      console.log('Previous button clicked.');
      if (childRef.current && childRef.current.validateAndSubmit) {
        const success = await childRef.current.validateAndSubmit();
        if (success) {
          handlePreviousTab(); // Navigate to previous tab
        }
      } else {
        // If childRef or validateAndSubmit is not available, proceed
        handlePreviousTab();
      }
    } catch (error) {
      console.error('Error during previous click:', error);
    } finally {
      setIsSaving(false); // End saving
    }
  };

  return (
    <div className="flex flex-col h-full">
      {loadingHouse || isRefetching ? (
        <div className="min-h-[60vh] flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="flex-grow overflow-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent pr-2">
            {renderContent()}
          </div>
          <div className="flex justify-between items-center p-2 py-3 lg:p-3">
            <button
              onClick={handlePreviousClick}
              disabled={selectedTab === 'address' || isSaving}
              className={`btn flex text-sm py-1 lg:py-1.5 lg:text-md items-center ${
                selectedTab === 'address' || isSaving
                  ? 'bg-primary-100 cursor-not-allowed'
                  : 'bg-primary-500'
              }`}
            >
              <ArrowRightIcon className="w-4 h-4 ml-1" />
              صفحه قبل
            </button>

            {isSaving && (
              <span className="text-gray-500 text-sm">در حال ارسال اطلاعات</span>
            )}

            <button
              onClick={handleNextClick}
              disabled={selectedTab === 'finalSubmit' || isSaving}
              className={`btn flex text-sm py-1 lg:py-1.5 lg:text-md items-center ${
                selectedTab === 'finalSubmit' || isSaving
                  ? ' bg-primary-100 cursor-not-allowed'
                  : 'bg-primary-500'
              }`}
            >
              صفحه بعد
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditHouseContent;
