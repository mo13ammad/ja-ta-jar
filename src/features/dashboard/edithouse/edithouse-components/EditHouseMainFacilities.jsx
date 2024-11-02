import React, { useState, useEffect } from 'react';
import Spinner from '../../../../ui/Loading';
import TextField from '../../../../ui/TextField';
import TextArea from '../../../../ui/TextArea';
import ToggleSwitch from '../../../../ui/ToggleSwitch';
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
    setSelectedFacilities((prevSelected) => {
      const isCurrentlyChecked = prevSelected[key]?.checked;
      const updatedState = {
        ...prevSelected,
        [key]: {
          ...prevSelected[key],
          checked: !isCurrentlyChecked,
          fields: !isCurrentlyChecked ? prevSelected[key]?.fields : {}, // Clear fields if unchecking
        },
      };
      console.log("Updated selectedFacilities:", updatedState);
      return updatedState;
    });
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
    console.log("Final Selected Facilities Data:", selectedFacilities);
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
    <div className="px-2 py-1">
      <div className="text-right font-bold lg:text-lg mb-2">امکانات اصلی</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-auto">
        {facilitiesData.map((facility) => (
          <div 
            key={facility.key} 
            className="p-2 md:p-4   rounded-xl flex flex-col shadow-centered bg-white"
          >
            <ToggleSwitch
              checked={selectedFacilities[facility.key]?.checked || false}
              onChange={() => toggleFacility(facility.key)}
              label={facility.label}
              icon={facility.icon}
            />

            {/* Show fields only if the facility is checked */}
            {selectedFacilities[facility.key]?.checked && (
              <div className="mt-4 bg-white p-2 rounded-xl ">
                {facility.fields?.map((field, index) => (
                  <div key={index} className="mb-4 ">
                    {field.type === 'toggle' ? (
                      <ToggleSwitch
                        checked={selectedFacilities[facility.key]?.fields?.[field.title.trim()] || false}
                        onChange={() =>
                          handleInputChange(
                            facility.key,
                            field.title,
                            !selectedFacilities[facility.key]?.fields?.[field.title.trim()]
                          )
                        }
                        label={field.title}
                      />
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
      <div className="mt-4 w-full lg:col-span-2 flex justify-end">
        <button
          className="btn bg-primary-600 text-white px-4 py-2 shadow-centered hover:bg-primary-600 transition-colors duration-200"
          onClick={handleSubmit}
        >
          ثبت اطلاعات
        </button>
      </div>
    </div>
  );
};

export default EditHouseMainFacilities;
