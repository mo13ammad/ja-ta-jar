// EditHouseSidebar.jsx
import React from "react";
import { Disclosure, Tab } from "@headlessui/react";

const ChevronIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`size-6 ${open ? "transform rotate-180" : ""}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const EditHouseSidebar = ({ tabs }) => {
  const sections = [
    { label: "اطلاعات اقامتگاه", keys: ["general", "equipment", "costs"] },
    { label: "جزئیات", keys: ["size", "interiorDesign", "security"] },
    { label: "موقعیت مکانی", keys: ["address", "accessibility", "surroundings"] }
  ];

  return (
    <Tab.List>
      <div className="border w-full min-h-[80vh] lg:max-h-[80vh] overflow-auto rounded-xl flex flex-col justify-start pt-10 items-center bg-white py-4 gap-y-5">
        {sections.map((section) => (
          <Disclosure key={section.label}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-green-900  rounded-lg focus:outline-none">
                  <span>{section.label}</span>
                  <ChevronIcon open={open} />
                </Disclosure.Button>
                <Disclosure.Panel className="pr-8 pb-2 text-sm text-gray-500  w-full">
                  <ul>
                    {section.keys.map((key) => {
                      const tab = tabs.find((tab) => tab.key === key);
                      return (
                        <Tab as="li" key={key} className="w-full text-right p-2">
                          <button>{tab.label}</button>
                        </Tab>
                      );
                    })}
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </Tab.List>
  );
};

export default EditHouseSidebar;