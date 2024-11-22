import React from 'react';
import HotelIcon from './../imgs/hugeicons-hotel-01.SVG'; 

function HouseStructure() {
  return (
    <div className='w-full flex flex-col gap-1 max-w-44 md:max-w-48 h-14 rounded-3xl bg-gray-200 '>
      <div className='flex flex-row  justify-center gap-1.5  items-center  pt-1'>
        {/* Display the SVG */}
        <img src={HotelIcon} alt="House Icon" className="w-5 h-5" />
        <p className=' font-bold truncate text-sm '>هتل</p>
      </div>
      <div className='flex w-full  gap-1.5 items-center justify-center'>
        <p>کد اقامتگاه :</p>
        <p className='font-bold'>6076K9</p>
      </div>
    </div>
  );
}

export default HouseStructure;
