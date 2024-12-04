import React from "react";
import { Disclosure } from "@headlessui/react";

function HouseCancellationRules({ houseData }) {
  // Handle the case where cancellation_rule might be undefined
  if (!houseData || !houseData.cancellation_rule) {
    return null;
  }

  const { title, guest_description } = houseData.cancellation_rule;

  return (
    <div className="px-3">
      {/* Header */}
      <h3
        className="text-lg font-bold text-gray-800 mb-2"
        title="مقررات لغو رزرو"
      >
        مقررات لغو رزرو
      </h3>

      {/* Use Disclosure for expand/collapse functionality */}
      <Disclosure>
        {({ open }) => (
          <>
            {/* Cancellation Rules Content */}
            <div className="relative bg-gray-50 p-4 rounded-2xl">
              <Disclosure.Panel
                static
                className={`text-gray-700 text-sm overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                  open ? "max-h-[1000px]" : "max-h-32"
                }`}
                dir="rtl"
              >
                <strong>سیاست {title}: </strong>
                <span dangerouslySetInnerHTML={{ __html: guest_description }} />
              </Disclosure.Panel>

              {/* Fade-out effect when content is collapsed */}
              {!open && (
                <div className="absolute bottom-0 left-0 w-full rounded-b-xl h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
              )}
            </div>

            {/* Show More / Show Less Button */}
            <div className="">
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

export default HouseCancellationRules;
