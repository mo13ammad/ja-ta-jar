import React, { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { HomeIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

function EditHouseSidebar({ setSelectedTab, selectedTab, tabSections }) {
  const [openSection, setOpenSection] = useState('آدرس و موقعیت مکانی');

  useEffect(() => {
    const relevantSection = tabSections.find((section) =>
      section.keys.some((keyObj) => keyObj.key === selectedTab)
    );
    if (relevantSection) {
      setOpenSection(relevantSection.label);
    }
  }, [selectedTab]);

  const handleParentClick = (section) => {
    setOpenSection(section.label);
    setSelectedTab(section.keys[0].key); // Set selectedTab to the first child of the section
  };

  const handleChildClick = (key, sectionLabel) => {
    setSelectedTab(key);
    setOpenSection(sectionLabel);
  };

  return (
    <div className="w-full overflow-auto rounded-xl flex flex-col justify-start items-center gap-y-2">
      {tabSections.map((section) => {
        const isSectionOpen = openSection === section.label;

        return (
          <Disclosure key={`${section.label}-${isSectionOpen}`} as="div" className="w-full" defaultOpen={isSectionOpen}>
            {({ open }) => (
              <>
                <Disclosure.Button
                  onClick={() => handleParentClick(section)}
                  className="flex justify-between items-center w-full px-2 py-1.5 lg:px-4 lg:py-3 text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <span className="text-xs lg:text-sm font-bold truncate">{section.label}</span>
                  <ChevronUpIcon
                    className={`${open ? 'rotate-180 transform' : ''} w-4 h-4 lg:w-5 lg:h-5 text-gray-500 transition-all duration-300`}
                  />
                </Disclosure.Button>
                
                <Disclosure.Panel>
                  <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="py-1 px-1 md:px-2 lg:px-3 text-gray-500">
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
                    </div>
                  </div>
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
