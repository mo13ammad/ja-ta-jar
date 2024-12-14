import React from "react";
import { useFetchSanitaryOptions } from "../../../services/fetchDataService";
import { Disclosure } from "@headlessui/react";

function HouseSanitaries({ houseData }) {
  if (!houseData) {
    return null;
  }

  const { data: allSanitaries = [], isLoading, isError } = useFetchSanitaryOptions();

  if (isLoading) {
    return (
      <div className="px-2 my-3">
        <h3 className="text-lg font-bold text-gray-800 mb-2">بهداشت و نظافت</h3>
        {/* Skeleton Loader */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-8 bg-gray-100 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-2 my-3 text-red-500">
        خطایی در بارگذاری موارد بهداشتی رخ داده است.
      </div>
    );
  }

  if (!allSanitaries || allSanitaries.length === 0) {
    return null;
  }

  const availableSanitarySet = new Set(
    houseData.sanitaries?.map((sanitary) => sanitary.key)
  );

  let sanitariesWithStatus = allSanitaries.map((sanitary) => ({
    ...sanitary,
    isAvailable: availableSanitarySet.has(sanitary.key),
  }));

  sanitariesWithStatus.sort((a, b) => {
    if (a.isAvailable === b.isAvailable) return 0;
    return a.isAvailable ? -1 : 1;
  });

  return (
    <div className="px-2 my-3">
      <h3 className="text-lg font-bold text-gray-800 mb-2 pr-2">بهداشت و نظافت</h3>
      <Disclosure>
        {({ open }) => (
          <>
            {/* Sanitization Items */}
            <div
              className={`relative flex flex-col gap-2 bg-gray-50 p-4 rounded-2xl overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                open ? "max-h-[1000px]" : "max-h-32"
              }`}
              dir="rtl"
            >
              {sanitariesWithStatus.map((sanitary) => (
                <SanitaryItem key={sanitary.key} sanitary={sanitary} />
              ))}

              {/* Fade-out effect when collapsed */}
              {!open && (
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
              )}
            </div>

            {/* Show More / Show Less Button */}
            <div className="mt-2 text-right">
              <Disclosure.Button
                className="px-4 text-primary-600 hover:underline focus:outline-none"
                aria-expanded={open}
              >
                {open ? "بستن" : "مشاهده بیشتر..."}
              </Disclosure.Button>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}

function SanitaryItem({ sanitary }) {
  const { icon, label, isAvailable } = sanitary;
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-opacity duration-300 ${
        isAvailable ? "" : "opacity-50 line-through"
      }`}
    >
      <div className="w-8 h-8 flex-shrink-0">
        <img src={icon} alt={label} className="w-full h-full object-contain" />
      </div>
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default HouseSanitaries;
