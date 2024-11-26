// HouseFacilities.jsx

import React, { useState } from 'react';
import { useFetchFacilities } from '../../../services/fetchDataService';
import CustomInfoIcon from '../../../ui/CustomInfoIcon';

function HouseFacilities({ houseData }) {
  if (!houseData) {
    return null;
  }

  const { data: allFacilities = [], isLoading, isError } = useFetchFacilities();
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        {/* You can use a spinner component here */}
        <div>در حال بارگذاری...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500">
        خطایی در بارگذاری امکانات رخ داده است.
      </div>
    );
  }

  if (!allFacilities || allFacilities.length === 0) {
    return null;
  }

  const availableFacilitiesSet = new Set(
    houseData.facilities?.map((facility) => facility.key)
  );

  let facilitiesWithStatus = allFacilities.map((facility) => ({
    ...facility,
    isAvailable: availableFacilitiesSet.has(facility.key),
    houseFacility: houseData.facilities?.find((f) => f.key === facility.key),
  }));

  facilitiesWithStatus.sort((a, b) => {
    if (a.isAvailable === b.isAvailable) {
      return 0;
    }
    return a.isAvailable ? -1 : 1;
  });

  const initialFacilitiesCount = 10;
  const facilitiesToShow = showAll
    ? facilitiesWithStatus
    : facilitiesWithStatus.slice(0, initialFacilitiesCount);

  return (
    <div className="my-3 px-2">
      <h3 className="text-lg font-bold text-gray-800 mb-2">امکانات</h3>

      <ul className="flex flex-wrap">
        {facilitiesToShow.map((facility) => (
          <FacilityItem key={facility.key} facility={facility} />
        ))}
      </ul>

      {facilitiesWithStatus.length > initialFacilitiesCount && (
        <div className="mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-primary-600 hover:underline focus:outline-none"
          >
            {showAll ? 'بستن' : 'مشاهده بیشتر...'}
          </button>
        </div>
      )}
    </div>
  );
}

function FacilityItem({ facility }) {
  const { icon, label, isAvailable, houseFacility } = facility;

  const additionalInfo = isAvailable
    ? getAdditionalInfo(houseFacility?.fields)
    : null;

  return (
    <li
      className={`flex items-center m-2 ${
        isAvailable ? '' : 'opacity-50 line-through'
      }`}
    >
      <div className="w-8 h-8 flex-shrink-0">
        <img src={icon} alt={label} className="w-full h-full object-contain" />
      </div>

      <span className="mx-2">{label}</span>

      {additionalInfo && (
        <CustomInfoIcon
          tooltipText={additionalInfo}
          className="w-4 h-4 text-gray-500 cursor-pointer"
        />
      )}
    </li>
  );
}

function getAdditionalInfo(fields) {
  if (!fields || fields.length === 0) {
    return null;
  }

  const infoParts = [];

  const countFields = fields.filter(
    (field) =>
      (field.value === true ||
        field.value === 'true' ||
        typeof field.value === 'number') &&
      field.title.match(/عدد$/)
  );
  if (countFields.length > 0) {
    const counts = countFields.map((field) => field.title);
    infoParts.push(counts.join(', '));
  }

  const descriptionField = fields.find(
    (field) => field.title.trim() === 'توضیحات' && field.value
  );
  if (descriptionField) {
    infoParts.push(descriptionField.value);
  }

  return infoParts.length > 0 ? infoParts.join(' - ') : null;
}

export default HouseFacilities;
