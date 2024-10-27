import React from 'react';
import { Tab, Disclosure } from '@headlessui/react';
import { HomeIcon, ChevronUpIcon } from '@heroicons/react/24/solid'; // Icons for example

function EditHouseSidebar({ setSelectedTab }) {
  const svgClasses = 'ml-1 w-5 h-5 text-current'; // Common classes for icons

  // Destructure sections object
  const sections = [
    {
      label: 'آدرس و موقعیت مکانی',
      keys: ['address', 'location'],
      children: [
        { key: 'address', label: 'آدرس' },
        { key: 'location', label: 'موقعیت مکانی' },
      ],
    },
    {
      label: 'اطلاعات کلی',
      keys: ['generalInfo', 'environmentInfo'],
      children: [
        { key: 'generalInfo', label: 'اطلاعات اقامتگاه' },
        { key: 'environmentInfo', label: 'اطلاعات محیطی' },
      ],
    },
    {
      label: 'مشخصات اقامتگاه',
      keys: ['mainFacilities', 'rooms', 'sanitaries'],
      children: [
        { key: 'mainFacilities', label: 'امکانات اقامتگاه' },
        { key: 'rooms', label: 'اتاق‌ها' },
        { key: 'sanitaries', label: 'امکانات بهداشتی' },
      ],
    },
    {
      label: 'قوانین اقامتگاه',
      keys: ['reservationRules', 'stayRules'],
      children: [
        { key: 'reservationRules', label: 'قوانین رزرو' },
        { key: 'stayRules', label: 'قوانین اقامت' },
      ],
    },
    {
      label: 'قیمت گذاری',
      keys: ['pricing'],
      children: [{ key: 'pricing', label: 'قیمت گذاری' }],
    },
    {
      label: 'تصاویر اقامتگاه',
      keys: ['images'],
      children: [{ key: 'images', label: 'تصاویر اقامتگاه' }],
    },
    {
      label: 'ثبت نهایی اقامتگاه',
      keys: ['finalSubmit'],
      children: [{ key: 'finalSubmit', label: 'ثبت نهایی اقامتگاه' }],
    },
  ];

  return (
    <div className="w-full overflow-auto rounded-xl flex flex-col justify-start  items-center gap-y-2">
      <Tab.Group className="w-full">
        <Tab.List className="rounded-xl flex flex-col justify-center items-center gap-y-1">
          {sections.map((section) => (
            <Disclosure key={section.label} as="div" className="w-full">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between items-center w-full px-2 py-1.5 lg:px-4 lg:py-3    text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <span className='text-xs lg:text-sm  font-bold truncate '>{section.label}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'rotate-180 transform ' : ''
                      } w-4 h-4 lg:w-5 lg:h-5 text-gray-500  transition-all duration-300`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="py-1 px-1 md:px-2 lg:px-3 text-gray-500">
                    {section.children.map((child) => (
                      <Tab
                        key={child.key}
                        as="div"
                        className={({ selected }) =>
                          `tab  my-1 ${selected ? 'tab-selected' : 'tab-hover'}`
                        }
                        onClick={() => setSelectedTab(child.key)} // Set selected tab to corresponding key
                      >
                        {({ selected }) => (
                          <div className="flex items-center">
                            <HomeIcon
                              className={`${svgClasses} ${
                                selected
                                  ? 'text-secondary-100'
                                  : 'text-gray-700'
                              }`}
                            />
                            <span className='text-xs lg:text-sm truncate'>{child.label}</span>
                          </div>
                        )}
                      </Tab>
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
}

export default EditHouseSidebar;
