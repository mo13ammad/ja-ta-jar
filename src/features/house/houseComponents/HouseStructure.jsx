import React from 'react';

function HouseStructure({ houseStructure }) {
 
  return (
    <div className="flex items-center mr-3 gap-0.5 py-1 px-2 lg:p-2 mb-0.5 rounded-2xl bg-secondary-100 shadow-centered">
      <img
        src={houseStructure.icon}
        alt={houseStructure.label}
        className="w-5 h-5 object-contain"
      />
      <span className="text-sm lg:text-md">{houseStructure.label}</span>

    </div>
  );
}

export default HouseStructure;
