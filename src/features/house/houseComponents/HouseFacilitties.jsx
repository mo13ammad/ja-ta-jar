import React from "react";
import { Disclosure } from "@headlessui/react";
import { useFetchFacilities } from "../../../services/fetchDataService";
import CustomInfoIcon from "../../../ui/CustomInfoIcon";

function HouseFacilities({ houseData }) {
  if (!houseData) {
    return null;
  }

  const { data: allFacilities = [], isLoading, isError } = useFetchFacilities();

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
      <div className="text-red-500">خطایی در بارگذاری امکانات رخ داده است.</div>
    );
  }

  if (!allFacilities || allFacilities.length === 0) {
    return null;
  }

  const availableFacilitiesSet = new Set(
    houseData.facilities?.map((facility) => facility.key),
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

  // Determine the number of facilities to show initially
  const initialFacilitiesCount = 10;

  return (
    <div className="my-3 px-3">
      <h3 className="text-lg font-bold text-gray-800 mb-2">امکانات</h3>

      {/* Use Disclosure for expand/collapse functionality */}
      <Disclosure>
        {({ open }) => (
          <>
            {/* Facilities List */}
            <div className="relative">
              <Disclosure.Panel
                static
                className={`flex flex-wrap overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                  open ? "max-h-[1000px]" : "max-h-32"
                }`}
                dir="rtl"
              >
                {facilitiesWithStatus.map((facility) => (
                  <FacilityItem key={facility.key} facility={facility} />
                ))}
              </Disclosure.Panel>

              {/* Fade-out effect when content is collapsed */}
              {!open && (
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-gray-100 to-transparent"></div>
              )}
            </div>

            {/* Show More / Show Less Button */}
            {facilitiesWithStatus.length > initialFacilitiesCount && (
              <div className="mt-2">
                <Disclosure.Button
                  className="text-primary-600  hover:underline focus:outline-none"
                  aria-expanded={open}
                >
                  {open ? "بستن" : "مشاهده بیشتر..."}
                </Disclosure.Button>
              </div>
            )}
          </>
        )}
      </Disclosure>
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
      className={`flex items-center m-2 transition-opacity duration-300 ${
        isAvailable ? "" : "opacity-50 line-through"
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
        field.value === "true" ||
        typeof field.value === "number") &&
      field.title.match(/عدد$/),
  );
  if (countFields.length > 0) {
    const counts = countFields.map((field) => field.title);
    infoParts.push(counts.join(", "));
  }

  const descriptionField = fields.find(
    (field) => field.title.trim() === "توضیحات" && field.value,
  );
  if (descriptionField) {
    infoParts.push(descriptionField.value);
  }

  return infoParts.length > 0 ? infoParts.join(" - ") : null;
}

export default HouseFacilities;
