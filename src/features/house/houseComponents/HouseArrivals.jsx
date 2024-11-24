import React from 'react';
import CustomInfoIcon from '../../../ui/CustomInfoIcon';

const HouseArrivals = ({ arrivals, tip ,structure}) => {
  const arrivalTypes = arrivals?.types || [];
  const description = arrivals?.description || "";

  return (
    <div className="mt-1 flex gap-4 items-center ">
      {/* Arrivals Section */}
      <div >
        <div className="flex items-center gap-1 mb-2">
          <p className='font-bold'>شیوه دسترسی به اقامتگاه :</p>
          {description && (
            <CustomInfoIcon
              className="w-5 h-5 text-gray-500 cursor-pointer"
              tooltipText={description} // Display description as a tooltip
            />
          )}
        </div>
        <div className="flex flex-wrap w-full gap-1">
          {arrivalTypes.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-primary-50 shadow-centered"
            >
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default HouseArrivals;
