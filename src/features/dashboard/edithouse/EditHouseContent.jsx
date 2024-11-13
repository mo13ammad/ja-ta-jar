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
import { Dialog } from '@headlessui/react';
import CustomInfoIcon from '../../../ui/CustomInfoIcon'; // Adjust the import path as necessary

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
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // State for info modal

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
      return true; // Return success status
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
        return <Rooms {...commonProps} />;
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
        return <Images  {...commonProps} />;
      case 'documents':
        return <EditHouseDocuments {...commonProps} />;
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
      if (childRef.current && childRef.current.validateAndSubmit) {
        const success = await childRef.current.validateAndSubmit();
        if (success) {
          await handleNextTab(); // Navigate to next tab after successful save
        }
      } else {
        // If childRef or validateAndSubmit is not available, proceed
        await handleNextTab();
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
          await handlePreviousTab(); // Navigate to previous tab after successful save
        }
      } else {
        // If childRef or validateAndSubmit is not available, proceed
        await handlePreviousTab();
      }
    } catch (error) {
      console.error('Error during previous click:', error);
    } finally {
      setIsSaving(false); // End saving
    }
  };

  // Content for the info modal based on selectedTab
  const infoContent = {
    address: 'این بخش مربوط به اطلاعات آدرس می‌باشد.',
    location: 'بعد از انتخاب استان و نزدیکترین شهر ، محل اقامتگاه خود را در نقشه مشخص نمایید ',
    generalInfo: 'نوع اجاره و نوع قیمت‌گذاری را انتخاب کنید (بهتر است در یک تب جداگانه گذاشته شود). نوع اجاره: ۱. بر اساس اقامتگاه یعنی تمام اقامتگاه یک‌جا اجاره داده شود مانند ویلا، سوئیت و ... . ۲. براساس اتاق یعنی قسمتی یا اتاقی از کل یک اقامتگاه اجاره داده شود مثل اتاقی از یک هتل، اقامتگاه بوم‌گردی، مهمان‌خانه و ... . قیمت‌گذاری بر اساس: ۱. براساس هر شب یعنی کل اقامتگاه برای هر شب قیمت‌گذاری شود. ۲. براساس نفر شب یعنی صاحب اقامتگاه بابت اقامت هر نفر در هر شب مبلغی دریافت می‌کند؛ مانند بعضی از اقامتگاه‌های بوم‌گردی یا کلبه‌ها یا مجتمع‌ها از این نوع قیمت‌گذاری استفاده می‌کنند.',
    environmentInfo: 'این بخش مربوط به اطلاعات محیطی می‌باشد.',
    mainFacilities: 'این بخش مربوط به امکانات اصلی می‌باشد.',
    rooms: 'میزبان عزیز توجه داشته باشید چند خوابه بودن و فضای خواب اقامتگاه شما به تعداد اضافه شدن اتاق خواب و تخت‌ها در این صفحه بستگی دارد. در صورت انتخاب نوع اجاره بر اساس اتاق در مرحله قبل، اتاق‌های اضافه شده در این بخش مبنای اجاره و قیمت‌گذاری خواهند بود.',
    sanitaries: 'این بخش مربوط به سرویس‌های بهداشتی می‌باشد.',
    reservationRules: 'این بخش مربوط به قوانین رزرو می‌باشد.',
    stayRules: 'میزبان عزیز مبنای نمایش اطلاعات در صفحه اقامتگاه برای قوانین ، انتخاب گزینه های غیر مجاز یا نیاز است توسط شماست  که میهمان را از کاری منع یا موظف به انجام کاری میکند.',
    cancellationRules: 'این بخش مربوط به قوانین کنسلی می‌باشد.',
    pricing: 'برای بسته شدنه تقویم قیمت اقامتگاه یا اتاق لطفا با دقت تمامی بخشهای قیمتی پر شوند .',
    images: 'میزبان عزیز از عکس هایی با نور و کیفیت خوب و ترجیحا عرضی برای نمایش بهتر اقامتگاه خود استفاده بفرمایید',
    documents: 'این بخش مربوط به مدارک مورد نیاز می‌باشد.',
    finalSubmit: 'این بخش مربوط به ثبت نهایی اطلاعات می‌باشد.',
    // Add more as needed
  };

  return (
    <div className="flex flex-col h-full">
      {loadingHouse || isRefetching ? (
        <div className="min-h-[60vh] flex flex-col justify-center items-center">
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
              <span className="text-gray-500 text-sm">در حال ارسال اطلاعات ...</span>
            )}

            <div className="flex items-center">
              <CustomInfoIcon
                className="w-6 h-6 text-gray-500 cursor-pointer ml-2"
                onClick={() => setIsInfoModalOpen(true)}
              />
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
          </div>

          {/* Info Modal */}
          <Dialog open={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)}>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4">
              <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl p-6">
                <Dialog.Title className="text-lg font-medium">اطلاعات بیشتر</Dialog.Title>
                <div className="mt-4">
                  <p>{infoContent[selectedTab]}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsInfoModalOpen(false)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-2xl"
                  >
                    بستن
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default EditHouseContent;
