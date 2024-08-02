import React from "react";
import { Disclosure, Tab } from "@headlessui/react";

const ChevronIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`size-6 ${open ? "transform rotate-180" : ""}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const EditHouseSidebar = () => {
  return (
    <Tab.List>
      <div className="border w-full min-h-[80vh] lg:max-h-[80vh] overflow-auto rounded-xl flex flex-col justify-start pt-10 items-center bg-white py-4 gap-y-5">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-green-900  rounded-lg focus:outline-none">
                <span>اطلاعات اقامتگاه</span>
                <ChevronIcon open={open} />
              </Disclosure.Button>
              <Disclosure.Panel className="pr-8 pb-2 text-sm text-gray-500  w-full">
                <ul>
                  <Tab as="li" className="w-full text-right p-2">
                    <button>جزئیات عمومی</button>
                  </Tab>
                  <Tab as="li" className="w-full text-right p-2">
                    <button>تجهیزات</button>
                  </Tab>
                  <Tab as="li" className="w-full text-right p-2">
                    <button>هزینه‌ها</button>
                  </Tab>
                </ul>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-green-900  rounded-lg focus:outline-none">
                <span>جزئیات</span>
                <ChevronIcon open={open} />
              </Disclosure.Button>
              <Disclosure.Panel className="pr-8 pb-2 text-sm text-gray-500  w-full">
                <ul>
                  <Tab as="li" className="w-full text-right p-2">
                    <button>اندازه</button>
                  </Tab>
                  <Tab as="li" className="w-full text-right p-2">
                    <button>طراحی داخلی</button>
                  </Tab>
                  <Tab as="li" className="w-full text-right p-2">
                    <button>امنیت</button>
                  </Tab>
                </ul>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-green-900  rounded-lg focus:outline-none">
                <span>موقعیت مکانی</span>
                <ChevronIcon open={open} />
              </Disclosure.Button>
              <Disclosure.Panel className="pr-8 pb-2 text-sm text-gray-500  w-full">
                <ul>
                  <Tab as="li" className="w-full text-right p-2">
                    <button>آدرس</button>
                  </Tab>
                  <Tab as="li" className="w-full text-right p-2">
                    <button>دسترسی‌ها</button>
                  </Tab>
                  <Tab as="li" className="w-full text-right p-2">
                    <button>محیط اطراف</button>
                  </Tab>
                </ul>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </Tab.List>
  );
};

export default EditHouseSidebar;
