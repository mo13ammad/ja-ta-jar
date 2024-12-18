import React from "react";
import { Disclosure } from "@headlessui/react";
import { useFetchFacilities } from "../../../services/fetchDataService";
import FacilitiesCustomIcon from "../../../ui/FacilitiesCustomIcon";

function HouseFacilities({ houseData }) {
  if (!houseData) {
    return null;
  }

  const { data: allFacilities = [], isLoading, isError } = useFetchFacilities();

  if (isLoading) {
    return (
      <div className="my-3 px-3">
      <h3 className="text-lg font-bold text-gray-800 mb-2">امکانات</h3>
      {/* Single full-width skeleton loader */}
      <div className="w-full h-32 rounded-2xl bg-gray-100 animate-pulse"></div>
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
    <div className="px-2">
      <h3 className="text-lg font-bold text-gray-800 mb-2">امکانات</h3>
      <div className="my-3 px-3 bg-gray-50 rounded-2xl p-1 lg:pt-2">
        <Disclosure>
          {({ open }) => (
            <>
              <div className="relative">
                <Disclosure.Panel
                  static
                  className={`grid grid-cols-1 md:grid-cols-2 gap-2 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
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
                  <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t rounded-b-xl from-gray-50 to-transparent"></div>
                )}
              </div>

              {facilitiesWithStatus.length > initialFacilitiesCount && (
                <div className="mt-2">
                  <Disclosure.Button
                    className="text-primary-600 hover:underline focus:outline-none"
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
        <FacilitiesCustomIcon
          tooltipText={additionalInfo}
          className="w-4 h-4 text-gray-500 cursor-pointer"
        />
      )}
    </li>
  );
}

function SkeletonFacilityItem() {
  return (
    <div className="flex w-full">
      <div className="animate-pulse flex h-2 bg-gray-300 rounded w-full"></div>
      <div className="animate-pulse flex h-2 bg-gray-300 rounded w-full"></div>
    </div>
  );
}

function getAdditionalInfo(fields) {
  if (!fields || fields.length === 0) return null;

  const infoParts = fields
    .filter((field) => {
      const val = field.value;
      // Filter out non-truthy values and explicit "false"
      if (val === false || val === null || val === "" || val === "false") {
        return false;
      }
      return true;
    })
    .map((field) => {
      const val = field.value;
      if (val === true || val === "true") {
        // Just show the title if value is boolean true
        return field.title;
      } else {
        // If it's a number or a non-empty string, show "title: value"
        return `${field.title}${val ? `: ${val}` : ""}`;
      }
    });

  return infoParts.length > 0 ? infoParts.join(" - ") : null;
}

export default HouseFacilities;
