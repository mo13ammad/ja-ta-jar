import React from 'react';

const ChevronIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`size-4 lg:size-5 ml-2 md:ml-1 xl:ml-2 transition duration-300 ${open ? 'transform rotate-180' : ''}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const sections = [
  {
    label: 'آدرس و موقعیت مکانی',
    keys: ['address', 'location'],
    children: [
      { key: 'address', label: 'آدرس' },
      { key: 'location', label: 'موقعیت مکانی' },
    ],
  },
  {
    label: 'اطلاعات کلی',
    keys: ['generalInfo', 'environmentInfo'],
    children: [
      { key: 'generalInfo', label: 'اطلاعات اقامتگاه' },
      { key: 'environmentInfo', label: 'اطلاعات محیطی' },
    ],
  },
  {
    label: 'مشخصات اقامتگاه',
    keys: ['mainFacilities', 'rooms', 'sanitaries'],
    children: [
      { key: 'mainFacilities', label: 'امکانات اقامتگاه' },
      { key: 'rooms', label: 'اتاق‌ها و پذیرایی' },
      { key: 'sanitaries', label: 'امکانات بهداشتی' },
    ],
  },
  {
    label: 'قوانین اقامتگاه',
    keys: ['reservationRules', 'stayRules'],
    children: [
      { key: 'reservationRules', label: 'قوانین رزرو' }, // Added new tab here
      { key: 'stayRules', label: 'قوانین اقامت' },
    ],
  },
  {
    label: 'قیمت گذاری',
    keys: ['pricing'],
    children: [{ key: 'pricing', label: 'قیمت گذاری' }],
  },
  {
    label: 'تصاویر اقامتگاه',
    keys: ['images'],
    children: [{ key: 'images', label: 'تصاویر اقامتگاه' }],
  },
  {
    label: 'اطلاعات فردی',
    keys: ['personalInfo'],
    children: [{ key: 'personalInfo', label: 'اطلاعات فردی' }],
  },
  {
    label: 'اطلاعات مالکیت',
    keys: ['ownershipInfo'],
    children: [{ key: 'ownershipInfo', label: 'اطلاعات مالکیت' }],
  },
];

const EditHouseSidebar = ({ activeTab, setActiveTab }) => {
  const [openSections, setOpenSections] = React.useState({});

  React.useEffect(() => {
    const newOpenSections = {};
    sections.forEach((section) => {
      if (section.keys.includes(activeTab)) {
        newOpenSections[section.label] = true;
      }
    });
    setOpenSections((prev) => ({ ...prev, ...newOpenSections }));
  }, [activeTab]);

  const handleToggle = (label) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label], // Toggle the specific section's open state without affecting others
    }));
  };

  return (
    <div className="border w-full max-h-72 md:min-h-[80vh] lg:max-h-[80vh] overflow-auto rounded-xl flex flex-col justify-start items-center bg-white py-4 gap-y-2 px-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
      {sections.map((section) => (
        <div key={section.label} className="w-full">
          <button
            onClick={() => handleToggle(section.label)}
            className={`flex justify-between items-center w-full lg:px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg focus:outline-none ${section.keys.includes(activeTab) ? 'text-green-600' : ''}`}
          >
            <div className="flex items-center gap-1">
              <span className="md:text-xs lg:text-sm truncate">{section.label}</span>
            </div>
            <ChevronIcon open={openSections[section.label]} />
          </button>
          {openSections[section.label] && (
            <div className="pr-8 pb-2 text-sm text-gray-800 w-full">
              <ul className="list-disc pl-5">
                {section.children.map((child) => (
                  <li
                    key={child.key}
                    className={`w-full text-right p-2 md:text-xs xl:text-sm lg:p-2 ${activeTab === child.key ? 'text-green-600' : ''}`}
                    onClick={() => {
                      setActiveTab(child.key);
                      console.log(`Active tab key: ${child.key}`);
                    }}
                  >
                    <button>{child.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EditHouseSidebar;
