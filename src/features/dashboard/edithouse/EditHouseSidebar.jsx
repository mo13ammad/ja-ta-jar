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
    <div className="w-full overflow-auto rounded-xl flex flex-col justify-start pt-10 items-center py-4 gap-y-5">
      <Tab.Group className="w-full">
        <Tab.List className="rounded-xl flex flex-col justify-center items-center p-2 gap-y-2">
          {sections.map((section) => (
            <Disclosure key={section.label} as="div" className="w-full">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-lg font-bold text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <span>{section.label}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } w-5 h-5 text-gray-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-2 pb-2 text-sm text-gray-500">
                    {section.children.map((child) => (
                      <Tab
                        key={child.key}
                        as="div"
                        className={({ selected }) =>
                          `tab ${selected ? 'tab-selected' : 'tab-hover'}`
                        }
                        onClick={() => setSelectedTab(child.key)} // Set selected tab to corresponding key
                      >
                        {({ selected }) => (
                          <div className="flex items-center gap-2">
                            <HomeIcon
                              className={`${svgClasses} ${
                                selected
                                  ? 'text-secondary-100'
                                  : 'text-gray-700'
                              }`}
                            />
                            <span>{child.label}</span>
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
