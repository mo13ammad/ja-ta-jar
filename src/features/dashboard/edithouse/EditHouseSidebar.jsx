import React, { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { HomeIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

function EditHouseSidebar({ setSelectedTab, selectedTab, tabSections }) {
  const [openSection, setOpenSection] = useState('آدرس و موقعیت مکانی');

  useEffect(() => {
    // Find the section containing the selected tab and set it as openSection
    const relevantSection = tabSections.find((section) =>
      section.keys.some((keyObj) => keyObj.key === selectedTab)
    );
    if (relevantSection) {
      console.log(`Updating open section to: ${relevantSection.label}`);
      setOpenSection(relevantSection.label);
    }
    console.log(`Selected tab: ${selectedTab}, Open section: ${openSection}`);
  }, [selectedTab]);

  const handleChildClick = (key, sectionLabel) => {
    console.log(`Child clicked - Key: ${key}, Parent section: ${sectionLabel}`);
    setSelectedTab(key);
    setOpenSection(sectionLabel); // Open only the clicked child's parent section
  };

  return (
    <div className="w-full overflow-auto rounded-xl flex flex-col justify-start items-center gap-y-2">
      {tabSections.map((section) => {
        const isSectionOpen = openSection === section.label;

        console.log(`Rendering section: ${section.label}, isSectionOpen: ${isSectionOpen}`);

        return (
          <Disclosure key={`${section.label}-${isSectionOpen}`} as="div" className="w-full" defaultOpen={isSectionOpen}>
            {({ open }) => (
              <>
                <Disclosure.Button
                  onClick={() => {
                    console.log(`Toggling section: ${section.label}`);
                    setOpenSection(section.label);
                  }}
                  className="flex justify-between items-center w-full px-2 py-1.5 lg:px-4 lg:py-3 text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <span className="text-xs lg:text-sm font-bold truncate">{section.label}</span>
                  <ChevronUpIcon
                    className={`${open ? 'rotate-180 transform' : ''} w-4 h-4 lg:w-5 lg:h-5 text-gray-500 transition-all duration-300`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="py-1 px-1 md:px-2 lg:px-3 text-gray-500">
                  {section.keys.map((keyObj) => (
                    <div
                      key={keyObj.key}
                      className={`tab my-1 cursor-pointer ${
                        selectedTab === keyObj.key ? 'tab-selected bg-primary-500' : 'tab-hover'
                      }`}
                      onClick={() => handleChildClick(keyObj.key, section.label)}
                    >
                      <div className="flex items-center">
                        <HomeIcon className={`ml-1 w-5 h-5 text-current ${selectedTab === keyObj.key ? 'text-secondary-100' : 'text-gray-700'}`} />
                        <span className="text-xs lg:text-sm truncate">{keyObj.label}</span>
                      </div>
                    </div>
                  ))}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        );
      })}
    </div>
  );
}

export default EditHouseSidebar;
