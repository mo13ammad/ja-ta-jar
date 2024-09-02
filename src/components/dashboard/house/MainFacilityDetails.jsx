import React, { useState } from 'react';

const facilitiesData = [
  {
    key: 'Sofa',
    label: 'مبلمان',
    color: '#006eff',
    icon: 'https://portal1.jatajar.com/storage/svg/cache/hugeicons-sofa-03.svg',
    fields: [
      {
        title: 'توضیحات',
        type: 'text',
        placeholder: 'مبلمان راحتی برای 7 نفر',
      },
    ],
  },
  {
    key: 'Refrigerator',
    label: 'یخچال',
    color: '#006eff',
    icon: 'https://portal1.jatajar.com/storage/svg/cache/lucide-refrigerator.svg',
    fields: null,
  },
  {
    key: 'SwimmingPool',
    label: 'استخر',
    color: '#006eff',
    icon: 'https://portal1.jatajar.com/storage/svg/cache/lineawesome-swimming-pool-solid.svg',
    fields: [
      { title: 'آب گرم', type: 'toggle', placeholder: null },
      { title: 'تصفیه اتوماتیک', type: 'toggle', placeholder: null },
      { title: 'سرپوشیده', type: 'toggle', placeholder: null },
      { title: 'طول', type: 'number', placeholder: 'متر' },
      { title: 'عرض', type: 'number', placeholder: 'متر' },
      { title: 'عمق', type: 'float1', placeholder: 'متر' },
    ],
  },
  {
    key: 'Watercity',
    label: 'آب لوله کشی',
    color: '#e81f1f',
    icon: null,
    fields: [
      { title: 'آب لوله کشی', type: 'toggle', placeholder: null },
    ],
  },
  {
    key: 'Electricite',
    label: 'برق و روشنایی',
    color: '#e61e1e',
    icon: null,
    fields: [
      { title: 'برق و روشنایی', type: 'toggle', placeholder: null },
    ],
  },
  {
    key: 'Hotwater',
    label: 'آب گرم',
    color: '#e81f1f',
    icon: null,
    fields: [
      { title: 'آب گرم کن زمینی', type: 'toggle', placeholder: null },
      { title: 'آب گرم کن دیواری', type: 'toggle', placeholder: null },
      { title: 'پکیج رادیاتور', type: 'toggle', placeholder: null },
      { title: 'موتورخانه', type: 'toggle', placeholder: null },
    ],
  },
  {
    key: 'Parking',
    label: 'پارکینگ مسقف',
    color: '#a16262',
    icon: null,
    fields: [
      { title: 'توضیحات', type: 'textarea', placeholder: null },
    ],
  },
  {
    key: 'Terrace',
    label: 'تراس',
    color: '#145912',
    icon: null,
    fields: [
      { title: 'روبه', type: 'textarea', placeholder: null },
    ],
  },
  {
    key: 'Parkingnoroof',
    label: 'پارکینگ غیر مسقف',
    color: '#ba1919',
    icon: null,
    fields: [
      { title: 'توضیحات', type: 'text', placeholder: null },
    ],
  },
];

function MainFacilityDetails() {
  const [selectedFacilities, setSelectedFacilities] = useState({});

  // Handle checkbox toggle for each facility
  const handleToggleFacility = (key) => {
    setSelectedFacilities((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  // Handle input changes for each facility field
  const handleInputChange = (facilityKey, fieldTitle, value) => {
    setSelectedFacilities((prevState) => ({
      ...prevState,
      [facilityKey]: {
        ...prevState[facilityKey],
        [fieldTitle]: value,
      },
    }));
  };

  return (
    <div className="p-4">
      {facilitiesData.map((facility) => (
        <div key={facility.key} className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id={facility.key}
              checked={!!selectedFacilities[facility.key]}
              onChange={() => handleToggleFacility(facility.key)}
              className="mr-2"
            />
            <label htmlFor={facility.key} className="font-medium">
              {facility.label}
            </label>
          </div>
          {selectedFacilities[facility.key] && facility.fields && (
            <div className="ml-6 mt-2">
              {facility.fields.map((field, index) => (
                <div key={index} className="mb-4">
                  {field.type === 'toggle' ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${facility.key}-${index}`}
                        checked={
                          !!(selectedFacilities[facility.key] && selectedFacilities[facility.key][field.title])
                        }
                        onChange={(e) =>
                          handleInputChange(facility.key, field.title, e.target.checked)
                        }
                        className="mr-2"
                      />
                      <label htmlFor={`${facility.key}-${index}`} className="font-medium">
                        {field.title}
                      </label>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.title}
                      </label>
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        placeholder={field.placeholder}
                        value={selectedFacilities[facility.key]?.[field.title] || ''}
                        onChange={(e) =>
                          handleInputChange(facility.key, field.title, e.target.value)
                        }
                        className="block w-full p-2 border rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MainFacilityDetails;
