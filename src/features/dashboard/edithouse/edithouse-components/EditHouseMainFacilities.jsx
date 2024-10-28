import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import Spinner from '../../../../ui/Loading';
import TextField from '../../../../ui/TextField';  // Import TextField component
import TextArea from '../../../../ui/TextArea';    // Import TextArea component
import { useFetchFacilities } from '../../../../services/fetchDataService';

const EditHouseMainFacilities = ({ houseData, loadingHouse }) => {
  const { data: facilitiesData = [], isLoading: loadingFacilities } = useFetchFacilities();
  const [selectedFacilities, setSelectedFacilities] = useState({});

  useEffect(() => {
    if (facilitiesData) {
      console.log("Fetched facilities data:", facilitiesData);
    }
  }, [facilitiesData]);

  const toggleFacility = (key) => {
    setSelectedFacilities((prevSelected) => ({
      ...prevSelected,
      [key]: {
        ...prevSelected[key],
        checked: !prevSelected[key]?.checked,
      },
    }));
  };

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
    console.log("Selected Facilities Data:", selectedFacilities);
    alert("Facilities saved successfully!");
  };

  if (loadingHouse || loadingFacilities) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-center font-bold text-xl my-4">امکانات اصلی</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-auto">
        {facilitiesData.map((facility) => (
          <div key={facility.key} className="p-4 border rounded-xl flex flex-col shadow-centered">
            <Switch.Group as="div" className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <Switch
                  checked={selectedFacilities[facility.key]?.checked || false}
                  onChange={() => toggleFacility(facility.key)}
                  className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                    selectedFacilities[facility.key]?.checked ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
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
                <span className="ml-3 text-lg lg:text-xl font-medium text-gray-700">
                  {facility.label}
                </span>
              </label>
            </Switch.Group>

            {/* Show fields only if the facility is checked */}
            {selectedFacilities[facility.key]?.checked && (
              <div className="mt-4 bg-gray-50 p-2 rounded-xl">
                {facility.fields?.map((field, index) => (
                  <div key={index} className="mb-4">
                    {field.type === 'toggle' ? (
                      <div className="flex items-center">
                        <Switch.Group as="div" className="flex items-center space-x-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <Switch
                              checked={selectedFacilities[facility.key]?.fields?.[field.title.trim()] || false}
                              onChange={() =>
                                handleInputChange(
                                  facility.key,
                                  field.title,
                                  !selectedFacilities[facility.key]?.fields?.[field.title.trim()]
                                )
                              }
                              className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                                selectedFacilities[facility.key]?.fields?.[field.title.trim()] ? 'bg-primary-600' : 'bg-gray-200'
                              }`}
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
                            <span className="ml-3 text-sm font-medium text-gray-700">{field.title}</span>
                          </label>
                        </Switch.Group>
                      </div>
                    ) : field.type === 'textarea' ? (
                      <TextArea
                        label={field.title}
                        placeholder={field.placeholder}
                        value={selectedFacilities[facility.key]?.fields?.[field.title.trim()] || ''}
                        onChange={(e) =>
                          handleInputChange(facility.key, field.title, e.target.value.trim())
                        }
                      />
                    ) : (
                      <TextField
                        label={field.title}
                        type={field.type === 'number' ? 'number' : 'text'}
                        placeholder={field.placeholder}
                        value={selectedFacilities[facility.key]?.fields?.[field.title.trim()] || ''}
                        onChange={(e) =>
                          handleInputChange(facility.key, field.title, e.target.value.trim())
                        }
                      />
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
          className="bg-primary-800 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl transition-all duration-200 hover:bg-primary-900"
        >
          ثبت اطلاعات
        </button>
      </div>
    </div>
  );
};

export default EditHouseMainFacilities;
