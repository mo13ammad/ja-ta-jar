import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const PeopleDropdown = () => {
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [isOpen, setIsOpen] = useState(false); // State to track menu open/close

  const handleSelect = (number) => {
    setSelectedPeople(number);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="text-sm my-2 mt-3 z-50">
      
      <Menu as="div" className="relative inline-block w-full">
        {/* Dropdown Button */}
        <Menu.Button
          className="flex justify-between items-center w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-xl shadow-centered"
          onClick={() => setIsOpen(!isOpen)} // Toggle rotation
        >
          <span>{selectedPeople} نفر</span>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </Menu.Button>

        {/* Dropdown Items */}
        <Menu.Items
          className="absolute z-10 w-full mt-2 bg-white shadow-lg rounded-xl ring-1 ring-black ring-opacity-5 focus:outline-none max-h-40 overflow-y-auto"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
            <Menu.Item key={number}>
              {({ active }) => (
                <div
                  onClick={() => handleSelect(number)}
                  className={`cursor-pointer px-4 z-50 py-2 ${
                    active ? "bg-gray-100 text-primary-600" : "text-gray-700"
                  }`}
                >
                  {number} نفر
                </div>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default PeopleDropdown;
