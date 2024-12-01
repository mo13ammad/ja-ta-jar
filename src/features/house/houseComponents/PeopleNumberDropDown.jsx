import React, { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import toPersianNumber from "../../../utils/toPersianNumber";

const PeopleDropdown = () => {
  const [selectedPeople, setSelectedPeople] = useState(1);

  // Handle increment
  const handleIncrement = () => {
    if (selectedPeople < 12) {
      setSelectedPeople((prev) => prev + 1);
    }
  };

  // Handle decrement
  const handleDecrement = () => {
    if (selectedPeople > 1) {
      setSelectedPeople((prev) => prev - 1);
    }
  };

  return (
    <div className="flex items-center bg-white  justify-between  text-gray-700 py-2 px-4 rounded-xl  w-full ">
      {/* Decrement Button */}
      <button
        className={`flex items-center justify-center text-gray-700 px-2 py-1 ${
          selectedPeople > 1 ? "cursor-pointer" : "cursor-not-allowed text-gray-400"
        }`}
        onClick={handleDecrement}
        disabled={selectedPeople <= 1}
      >
        <MinusIcon className="w-5 h-5" />
      </button>

      {/* Display Number */}
      <span className="font-semibold">
        {toPersianNumber(selectedPeople)} نفر
      </span>

      {/* Increment Button */}
      <button
        className={`flex items-center justify-center text-gray-700 px-2 py-1 ${
          selectedPeople < 12 ? "cursor-pointer" : "cursor-not-allowed text-gray-400"
        }`}
        onClick={handleIncrement}
        disabled={selectedPeople >= 12}
      >
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PeopleDropdown;
