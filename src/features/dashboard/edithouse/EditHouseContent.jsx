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

  const [houseData, setHouseData] = useState(null); // Initially null
  const [isSaving, setIsSaving] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // State for info modal

  const childRef = useRef(null); // Reference to child component

  // Log initialization
  console.log('Initializing EditHouseContent component...');
  console.log('Selected Tab:', selectedTab);
  console.log('Tab Sections:', tabSections);

  // Initialize houseData only once
  useEffect(() => {
    if (fetchedHouseData && houseData === null) {
      console.log('Fetched house data:', fetchedHouseData);
      setHouseData(fetchedHouseData);
    }
  }, [fetchedHouseData, houseData]);

  const handleEditHouse = async (updatedData) => {
    console.log('handleEditHouse called with data:', updatedData);
    try {
      const response = await editHouseAsync({
        houseId: uuid,
        houseData: updatedData,
      });
  
      setHouseData((prev) => ({
        ...prev,
        ...response, // Merge updated fields
      }));
  
      console.log('Edit response received and merged:', response);
      return true; // Indicate success
    } catch (error) {
      console.error('Edit House Error:', error.response?.data || error.message);
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
    console.log('Rendering content for tab:', selectedTab);
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
        return <Images {...commonProps} />;
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
    console.log('Next button clicked. Starting validation and submission...');
    try {
      if (childRef.current?.validateAndSubmit) {
        const success = await childRef.current.validateAndSubmit();
        console.log('Validation success:', success);
        if (success) {
          handleNextTab(); // Navigate to next tab
          console.log('Moved to next tab');
        }
      } else {
        handleNextTab();
        console.log('Moved to next tab without validation');
      }
    } catch (error) {
      console.error('Error during next click:', error);
    } finally {
      setIsSaving(false); // End saving
    }
  };

  const handlePreviousClick = async () => {
    setIsSaving(true); // Start saving
    console.log('Previous button clicked. Starting validation and submission...');
    try {
      if (childRef.current?.validateAndSubmit) {
        const success = await childRef.current.validateAndSubmit();
        console.log('Validation success:', success);
        if (success) {
          handlePreviousTab(); // Navigate to previous tab
          console.log('Moved to previous tab');
        }
      } else {
        handlePreviousTab();
        console.log('Moved to previous tab without validation');
      }
    } catch (error) {
      console.error('Error during previous click:', error);
    } finally {
      setIsSaving(false); // End saving
    }
  };

  const infoContent = {
    address: 'اطلاعات مربوط به آدرس اقامتگاه خود را وارد کنید. آدرس اقامتگاه: استان و شهر محل اقامت را وارد کنید. روستا/محله: در صورتی که اقامتگاه در روستا یا محله خاصی است، نام آن را ذکر کنید. اقامتگاه در طبقه: شماره طبقه‌ای که اقامتگاه در آن قرار دارد را وارد کنید. شماره پلاک: شماره پلاک اقامتگاه را درج کنید. کد پستی: کد پستی دقیق اقامتگاه را وارد کنید تا مهمانان بتوانند به‌راحتی محل آن را پیدا کنند.',
    location: 'بعد از انتخاب استان و نزدیکترین شهر ، محل اقامتگاه خود را در نقشه مشخص نمایید ',
    generalInfo: 'نوع اجاره و قیمت‌گذاری را انتخاب کنید. نوع اجاره: ۱. اقامتگاه کامل، یعنی کل اقامتگاه یک‌جا اجاره داده شود مانند ویلا و سوئیت. ۲. اتاق، یعنی بخشی یا اتاقی از اقامتگاه اجاره داده شود مثل اتاقی از هتل، اقامتگاه بوم‌گردی، یا مهمان‌خانه. قیمت‌گذاری: ۱. هر شب، یعنی قیمت برای کل اقامتگاه به‌ازای هر شب تعیین شود. ۲. نفر شب، یعنی مبلغ اقامت برای هر نفر در هر شب دریافت شود، مانند برخی اقامتگاه‌های بوم‌گردی و کلبه‌ها.',
    environmentInfo: 'اطلاعات مربوط به محیط اطراف اقامتگاه خود را تکمیل کنید. بافت محیط: نوع بافت محیطی را انتخاب کنید، مثلاً جنگلی، ساحلی، شهری، و غیره. منظره اقامتگاه: منظره‌ای که اقامتگاه رو به آن دارد را انتخاب کنید، مانند جنگل، کوهستان، دریا، و غیره. توضیحات منظره اقامتگاه: در صورت نیاز، توضیحات بیشتری در مورد منظره اقامتگاه بنویسید. همسایگی: مشخص کنید که همسایگان اقامتگاه از چه نوع مکان‌هایی هستند، مثلاً روستایی یا شهری. مسیر دسترسی: نوع مسیر دسترسی به اقامتگاه، مثلاً آسفالت یا خاکی را مشخص کنید. توضیحات شیوه دسترسی: در صورت نیاز، توضیحاتی درباره نحوه دسترسی به اقامتگاه اضافه کنید.',
    mainFacilities: 'در این بخش، امکانات اقامتگاه خود را انتخاب کنید. هر کدام از امکاناتی را که اقامتگاه شما داراست، علامت بزنید. در صورتی که هر گزینه‌ای نیاز به توضیحات بیشتری دارد، اطلاعات تکمیلی را در کادر مربوطه بنویسید. مثلاً برای امکاناتی مانند اینترنت، نوع سرویس یا سرعت آن را ذکر کنید؛ یا برای پارکینگ، ظرفیت و نوع پارکینگ را توضیح دهید.',
    rooms: 'میزبان عزیز توجه داشته باشید چند خوابه بودن و فضای خواب اقامتگاه شما به تعداد اضافه شدن اتاق خواب و تخت‌ها در این صفحه بستگی دارد. در صورت انتخاب نوع اجاره بر اساس اتاق در مرحله قبل، اتاق‌های اضافه شده در این بخش مبنای اجاره و قیمت‌گذاری خواهند بود.',
    sanitaries: 'در این بخش، امکانات بهداشتی اقامتگاه خود را مشخص کنید. هر کدام از موارد بهداشتی که اقامتگاه شما داراست، مانند تعویض ملحفه و روبالشی، ضدعفونی اقامتگاه، و ارائه لوازم بهداشتی را انتخاب کنید. در صورتی که هر گزینه‌ای نیاز به توضیحات بیشتری دارد، جزئیات را در کادر مربوطه وارد نمایید. این اطلاعات به مهمانان کمک می‌کند تا از شرایط بهداشتی اقامتگاه شما مطلع شوند.',
    reservationRules: 'در این بخش، قوانین رزرو را تعیین کنید: تعداد شب‌های تخفیف کوتاه‌مدت و بلندمدت، زمان‌های ورود و تخلیه، ظرفیت استاندارد و حداکثر ظرفیت، روزهای آخر هفته، و حداقل شب‌های اقامت برای هر روز هفته را مشخص کنید؛ مثلاً اگر حداقل شب رزرو برای یکشنبه ۲ شب باشد، مهمانان باید حداقل ۲ شب رزرو کنند تا بتوانند اقامت داشته باشند.',
    stayRules: 'میزبان عزیز مبنای نمایش اطلاعات در صفحه اقامتگاه برای قوانین ، انتخاب گزینه های غیر مجاز یا نیاز است توسط شماست  که میهمان را از کاری منع یا موظف به انجام کاری میکند.',
    cancellationRules: 'در این بخش، قوانین کنسلی اقامتگاه خود را مشخص کنید. سه گزینه مختلف برای سیاست‌های کنسلی وجود دارد: سخت‌گیرانه، متعادل، و سهل‌گیرانه. هر گزینه، شرایط متفاوتی برای دریافت هزینه کنسلی بر اساس زمان لغو رزرو توسط مهمان دارد. با انتخاب هر یک از این گزینه‌ها، سیاست کنسلی مورد نظر شما بر اقامتگاه اعمال می‌شود. لطفاً توجه کنید که شرایط دقیق ممکن است بنا به سیاست‌های سایت تغییر کند.',
    pricing: 'در این بخش، قیمت‌گذاری اقامتگاه خود را بر اساس نوع اجاره تعیین کنید. اگر اجاره بر اساس اتاق باشد، لیست اتاق‌هایی که قبلاً وارد کرده‌اید نمایش داده می‌شود و می‌توانید برای هر اتاق به صورت جداگانه قیمت تعیین کنید. اما اگر اجاره بر اساس کل اقامتگاه باشد، قیمت‌گذاری فقط یک‌بار برای کل اقامتگاه ثبت می‌شود و تقویم اقامتگاه بر اساس این تنظیمات به صورت کلی اعمال می‌شود. لطفاً قیمت هر شب را برای روزهای مختلف هفته و ایام خاص وارد کنید تا مهمانان با نرخ‌ها آشنا شوند.',
    images: 'لطفاً تصاویر اقامتگاه خود را با بهترین کیفیت و رعایت شئونات اسلامی و قوانین جمهوری اسلامی ایران آپلود کنید. می‌توانید در زمان آپلود یا در این بخش، یکی از تصاویر را به عنوان تصویر اصلی انتخاب کنید تا در تمام سایت به عنوان نمای اصلی اقامتگاه شما نمایش داده شود. همچنین، برای حذف هر تصویر می‌توانید از دکمه حذف استفاده کنید.',
    documents: 'برای ثبت اقامتگاه، لطفاً مدارک مالکیت خود را آپلود کنید. مدارک مورد نیاز شامل تصویر شناسنامه یا کارت ملی و تصویر سند یا قول‌نامه خانه می‌باشد. وضعیت هر فایل پس از بارگذاری به صورت "در حال بررسی" نمایش داده خواهد شد. پس از اطمینان از آپلود تمامی مدارک، دکمه "ثبت همه مدارک" را فشار دهید تا مراحل ثبت مالکیت شما تکمیل شود.',
    finalSubmit: 'در این بخش، لطفاً قوانین و تعهدنامه مربوط به ثبت اقامتگاه را با دقت مطالعه کنید. برای ثبت نهایی، لازم است گزینه تأیید قوانین و تعهدنامه را انتخاب کنید. پس از ثبت نهایی، اطلاعات اقامتگاه شما برای بررسی و تأیید به کارشناسان سایت ارسال خواهد شد. در صورت تأیید، پیامک تأیید به شما ارسال می‌شود و اقامتگاه شما به صورت فعال در سایت نمایش داده خواهد شد.',
    // Add more as needed
  };

  console.log('Loading house data:', loadingHouse, 'House data:', houseData);

  return (
    <div className="flex flex-col h-full">
      {loadingHouse || houseData === null ? (
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
