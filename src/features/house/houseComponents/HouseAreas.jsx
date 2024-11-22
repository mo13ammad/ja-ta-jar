import React from 'react';


const HouseAreas = ({houseAreas}) => {
  const areas = houseAreas || [] ;
  return (
    <div>
        <p>بافت محیط :</p>
    <div className="flex flex-wrap w-full gap-1 my-1">
        
      {areas.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-primary-50 shadow"
          
        >
          <img
            src={item.icon}
            alt={item.label}
            className="w-6 h-6"
          />
          <span className="font-medium">{item.label}</span>
        </div>
      ))}
    </div>
    </div>
  );
};

export default HouseAreas;
