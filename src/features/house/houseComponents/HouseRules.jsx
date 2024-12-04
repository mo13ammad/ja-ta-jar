// HouseRules.jsx

import React from "react";
import { Disclosure } from "@headlessui/react";
import toPersianNumber from "../../../utils/toPersianNumber";

function HouseRules({ houseData }) {
  // Handle the case where houseData or houseData.rules might be undefined
  if (!houseData || !houseData.rules) {
    return null;
  }

  // Extract rules and timing information
  const rules = houseData.rules.types || [];
  const checkInTimeFrom =
    houseData.reservation?.timing?.enter?.from || "نامشخص";
  const checkInTimeto = houseData.reservation?.timing?.enter?.to || "نامشخص";
  const checkoutTime = houseData.reservation?.timing?.leave || "نامشخص";

  // Additional rules (if any)
  const additionalRules = houseData.rules.description;

  // Function to render each rule
  const renderRule = (rule, index) => (
    <div key={index} className="flex items-start mb-2">
      {/* Icon */}
      <img src={rule.icon} alt={rule.label} className="w-6 h-6 ml-2" />

      {/* Rule description */}
      <p className="text-gray-700 text-sm">
        {rule.label} {rule.status.label}
        {rule.description && ` (${rule.description})`}.
      </p>
    </div>
  );

  return (
    <div className="px-2">
      <h3
        className="text-lg font-bold text-gray-800 mb-2"
        title="مقررات اقامتگاه"
      >
        مقررات اقامتگاه
      </h3>
    <div className="my-4 w-full px-5 bg-gray-50 rounded-2xl">
      {/* Title */}

      {/* Timing Information */}
      <div className="flex flex-row p-4 rounded mb-4">
        {/*checkIn*/}
        <div className="flex flex-col">
          {/* Check-in Time From*/}
          <div className="flex items-center mb-2 md:mb-0">
            <i className="icon_clock w-6 h-6 text-gray-500 ml-2"></i>
            <p className="text-gray-700 text-sm font-bold">
              ساعت ورود از:
              <span className="font-medium mr-2">
                {toPersianNumber(checkInTimeFrom)}
              </span>
            </p>
          </div>
          {/* Check-in Time To */}
          <div className="flex items-center">
            <i className="icon_clock w-6 h-6 text-gray-500 ml-2"></i>
            <p className="text-gray-700 text-sm font-bold">
              ساعت ورود تا:
              <span className="font-medium mr-2">
                {toPersianNumber(checkInTimeto)}
              </span>
            </p>
          </div>
        </div>
        <div>
          {/*Check out time*/}
          <div className="flex items-center">
            <i className="icon_clock w-6 h-6 text-gray-500 ml-2"></i>
            <p className="text-gray-700 text-sm font-bold">
              ساعت خروج :
              <span className="font-medium mr-2">
                {toPersianNumber(checkInTimeto)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Rules List with Disclosure for expand/collapse */}
      <Disclosure>
        {({ open }) => (
          <>
            <div className="relative">
              <Disclosure.Panel
                static
                className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                  open ? "max-h-[1000px]" : "max-h-32"
                }`}
                dir="rtl"
              >
                <div className="flex flex-col">
                  {/* Render Rules */}
                  {rules.map((rule, index) => renderRule(rule, index))}

                  {/* Additional Rules */}
                  {additionalRules && (
                    <div className="mt-4">
                      <div className="flex items-start">
                        <i className="icon_edit-paper w-6 h-6 text-gray-500 ml-2"></i>
                        <p className="text-gray-700 text-sm">سایر مقررات </p>
                      </div>
                      <ul className="list-disc list-inside mt-2">
                        {additionalRules.split("\n").map((item, idx) => (
                          <li key={idx} className="text-gray-700 text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Disclosure.Panel>

              {/* Fade-out effect when content is collapsed */}
              {!open && (
                <div className="absolute bottom-0 left-0 w-full rounded-b-xl h-8 bg-gradient-to-t from-gray-50 to-transparent"></div>
              )}
            </div>

            {/* Show More / Show Less Button */}
            {rules.length > 3 && (
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

export default HouseRules;
