import React, { useState } from 'react';
import EditHouseSidebar from './EditHouseSidebar';
import EditHouseContent from './EditHouseContent';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

const tabSections = [
  {
    label: 'آدرس و موقعیت مکانی',
    keys: [
      { key: 'address', label: 'آدرس' },
      { key: 'location', label: 'موقعیت مکانی' },
    ],
  },
  {
    label: 'اطلاعات کلی',
    keys: [
      { key: 'generalInfo', label: 'اطلاعات اقامتگاه' },
      { key: 'environmentInfo', label: 'اطلاعات محیطی' },
    ],
  },
  {
    label: 'مشخصات اقامتگاه',
    keys: [
      { key: 'mainFacilities', label: 'امکانات اقامتگاه' },
      { key: 'rooms', label: 'اتاق‌ها' },
      { key: 'sanitaries', label: 'امکانات بهداشتی' },
    ],
  },
  {
    label: 'قوانین اقامتگاه',
    keys: [
      { key: 'reservationRules', label: 'قوانین رزرو' },
      { key: 'stayRules', label: 'قوانین اقامت' },
    ],
  },
  {
    label: 'قیمت گذاری',
    keys: [{ key: 'pricing', label: 'قیمت گذاری' }],
  },
  {
    label: 'تصاویر اقامتگاه',
    keys: [{ key: 'images', label: 'تصاویر اقامتگاه' }],
  },
  {
    label: 'ثبت نهایی اقامتگاه',
    keys: [{ key: 'finalSubmit', label: 'ثبت نهایی اقامتگاه' }],
  },
];

function EditHouseContainer() {
  const [selectedTab, setSelectedTab] = useState('address');

  const handleNextTab = () => {
    const flatKeys = tabSections.flatMap((section) => section.keys);
    const currentIndex = flatKeys.findIndex((tab) => tab.key === selectedTab);
    if (currentIndex < flatKeys.length - 1) {
      console.log(`Navigating to next tab: ${flatKeys[currentIndex + 1].key}`);
      setSelectedTab(flatKeys[currentIndex + 1].key);
    }
  };

  const handlePreviousTab = () => {
    const flatKeys = tabSections.flatMap((section) => section.keys);
    const currentIndex = flatKeys.findIndex((tab) => tab.key === selectedTab);
    if (currentIndex > 0) {
      console.log(`Navigating to previous tab: ${flatKeys[currentIndex - 1].key}`);
      setSelectedTab(flatKeys[currentIndex - 1].key);
    }
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-2 lg:gap-4 w-full min-h-[83vh] h-full">
      <div className="md:col-span-3 w-full bg-gray-50 border-gray-200 border-t border-opacity-50 shadow-centered rounded-xl p-1.5 md:p-3 mt-5 md:mt-0">
        <EditHouseSidebar
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
          tabSections={tabSections}
        />
      </div>

      <div className="md:col-span-9 flex-grow w-full bg-gray-50 border-gray-200 border-t border-opacity-50 shadow-centered rounded-xl">
       
        <div className=''>
        <EditHouseContent selectedTab={selectedTab} />
        </div>
        <div className=" flex justify-between items-center p-2 py-3 lg:p-3 ">
          <button
            onClick={handlePreviousTab}
            disabled={selectedTab === 'address'}
            className={`btn flex text-sm py-1 lg:py-1.5 lg:text-md items-center ${selectedTab === 'address' ? 'bg-primary-100 cursor-not-allowed' : 'bg-primary-500'}`}
          >
            <ArrowRightIcon className="w-4 h-4 ml-1" />
            صفحه قبل
          </button>
          <button
            onClick={handleNextTab}
            disabled={selectedTab === 'finalSubmit'}
            className={`btn flex text-sm py-1 lg:py-1.5 lg:text-md items-center ${selectedTab === 'finalSubmit' ? ' bg-primary-100 cursor-not-allowed' : 'bg-primary-500'}`}
          >
            صفحه بعد
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditHouseContainer;
