import React from 'react';

function HouseCode({ houseCode }) {
 
  return (
    <div className="flex items-center mr-1 gap-0.5 py-0 px-2 lg:px-1.5   rounded-2xl bg-primary-50 shadow-centered">
      <p className='text-sm'>کد اقامتگاه  </p>
      <p className="font-bold">{houseCode}</p>

    </div>
  );
}

export default HouseCode;
