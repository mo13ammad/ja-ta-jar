import React, { useState } from 'react';
import { Switch } from '@headlessui/react';

const EditHouseMainFacilities = () => {
  // Static data for facilities
  const facilitiesData = [
    {
      key: 'pool',
      label: 'استخر',
      fields: [
        { title: 'اندازه استخر', type: 'text', placeholder: 'مثلا 3 متر' },
        { title: 'عمق استخر', type: 'number', placeholder: 'مثلا 1.5 متر' },
        { title: 'استخر سرپوشیده', type: 'toggle' }
      ]
    },
    {
      key: 'gym',
      label: 'سالن بدنسازی',
      fields: [
        { title: 'تجهیزات', type: 'textarea', placeholder: 'توضیحات تجهیزات' },
        { title: 'باز بودن در 24 ساعت', type: 'toggle' }
      ]
    }
  ];

  // State for selected facilities
  const [selectedFacilities, setSelectedFacilities] = useState({});

  // Handle facility toggle
  const toggleFacility = (key) => {
    setSelectedFacilities((prevSelected) => ({
      ...prevSelected,
      [key]: {
        ...prevSelected[key],
        checked: !prevSelected[key]?.checked,
      },
    }));
  };

  // Handle input change for fields
  const handleInputChange = (facilityKey, fieldTitle, value) => {
    setSelectedFacilities((prevState) => ({
      ...prevState,
      [facilityKey]: {
        ...prevState[facilityKey],
        fields: {
          ...prevState[facilityKey]?.fields,
          [fieldTitle.trim()]: value,
        },
      },
    }));
  };

  const handleSubmit = () => {
    alert("Facilities saved successfully!");
  };

  return (
    <div className="p-4">
      <div className="text-center font-bold text-xl my-4">
        امکانات اصلی
      </div>
      <div className="flex flex-col gap-4">
        {facilitiesData.map((facility) => (
          <div key={facility.key} className="mb-6">
            <Switch.Group as="div" className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <Switch
                  checked={selectedFacilities[facility.key]?.checked || false}
                  onChange={() => toggleFacility(facility.key)}
                  className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1
                    ${selectedFacilities[facility.key]?.checked ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  {selectedFacilities[facility.key]?.checked && (
                    <svg
                      className="w-4 h-4 text-white absolute inset-0 m-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </Switch>
                <span className="ml-3 text-lg lg:text-xl mb-1 font-medium text-gray-700">
                  {facility.label}
                </span>
              </label>
            </Switch.Group>

            {/* Show fields only if the facility is checked */}
            {selectedFacilities[facility.key]?.checked && (
              <div className="ml-6 mt-2">
                {facility.fields?.map((field, index) => (
                  <div key={index} className="mb-4">
                    {field.type === 'toggle' ? (
                      <div className="flex items-center">
                        <Switch.Group as="div" className="flex items-center space-x-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <span className="ml-3 text-sm font-medium text-gray-700">
                              {field.title}
                            </span>
                            <Switch
                              checked={selectedFacilities[facility.key]?.fields?.[field.title.trim()] || false}
                              onChange={() =>
                                handleInputChange(
                                  facility.key,
                                  field.title,
                                  !selectedFacilities[facility.key]?.fields?.[field.title.trim()]
                                )
                              }
                              className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1
                                ${selectedFacilities[facility.key]?.fields?.[field.title.trim()]
                                  ? 'bg-green-500'
                                  : 'bg-gray-200'}`}
                            >
                              {selectedFacilities[facility.key]?.fields?.[field.title.trim()] && (
                                <svg
                                  className="w-4 h-4 text-white absolute inset-0 m-auto"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </Switch>
                          </label>
                        </Switch.Group>
                      </div>
                    ) : field.type === 'textarea' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.title}
                        </label>
                        <textarea
                          placeholder={field.placeholder}
                          value={selectedFacilities[facility.key]?.fields?.[field.title.trim()] || ''}
                          onChange={(e) =>
                            handleInputChange(facility.key, field.title, e.target.value.trim())
                          }
                          className="block w-full p-2 border rounded-lg focus:outline-none"
                          rows={3}
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.title}
                        </label>
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          placeholder={field.placeholder}
                          value={selectedFacilities[facility.key]?.fields?.[field.title.trim()] || ''}
                          onChange={(e) =>
                            handleInputChange(facility.key, field.title, e.target.value.trim())
                          }
                          className="block w-full p-2 border rounded-lg focus:outline-none"
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

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl"
        >
          ثبت اطلاعات
        </button>
      </div>
    </div>
  );
};

export default EditHouseMainFacilities;
