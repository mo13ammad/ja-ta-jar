import React, { useState } from "react";

const GeneralDetails = () => {
  const [name, setName] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [buildingArea, setBuildingArea] = useState('');
  const [numberOfFloors, setNumberOfFloors] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [structureType, setStructureType] = useState('');
  const [numberOfSteps, setNumberOfSteps] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="relative md:w-5/6 md:h-5/6">
      <div className="overflow-auto scrollbar-thin max-h-[80vh] pr-2 w-full min-h-[70vh]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Name */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">نام اقامتگاه</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="نام اقامتگاه"
            />
          </div>

          {/* Total Area */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">متراژ کل</label>
            <input
              type="text"
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="متراژ کل"
            />
          </div>

          {/* Building Area */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">متراژ زیر بنا</label>
            <input
              type="text"
              value={buildingArea}
              onChange={(e) => setBuildingArea(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="متراژ زیر بنا"
            />
          </div>

          {/* Number of Floors */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">تعداد طبقات</label>
            <input
              type="text"
              value={numberOfFloors}
              onChange={(e) => setNumberOfFloors(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="تعداد طبقات"
            />
          </div>

          {/* Ownership Type */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع مالکیت</label>
            <input
              type="text"
              value={ownershipType}
              onChange={(e) => setOwnershipType(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="نوع مالکیت"
            />
          </div>

          {/* Structure Type */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">تیپ سازه</label>
            <input
              type="text"
              value={structureType}
              onChange={(e) => setStructureType(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="تیپ سازه"
            />
          </div>

          {/* Number of Steps */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">تعداد پله</label>
            <input
              type="text"
              value={numberOfSteps}
              onChange={(e) => setNumberOfSteps(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="تعداد پله"
            />
          </div>

          {/* Description */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="توضیحات"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralDetails;
