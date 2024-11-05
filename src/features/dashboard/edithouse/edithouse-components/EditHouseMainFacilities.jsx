import React, { useState, useEffect } from 'react';
import Spinner from '../../../../ui/Loading';
import TextField from '../../../../ui/TextField';
import TextArea from '../../../../ui/TextArea';
import ToggleSwitch from '../../../../ui/ToggleSwitch';
import { useFetchFacilities } from '../../../../services/fetchDataService';
import { toast } from 'react-hot-toast';
import { editHouseFacilities } from '../../../../services/houseService';

const EditHouseMainFacilities = ({ houseId, houseData, loadingHouse }) => {
  const { data: facilitiesData = [], isLoading: loadingFacilities } = useFetchFacilities();
  const [selectedFacilities, setSelectedFacilities] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (houseData && facilitiesData.length > 0) {
      const initialSelectedFacilities = facilitiesData.reduce((acc, facility) => {
        const existingFacility = houseData.facilities?.find((f) => f.key === facility.key);

        acc[facility.key] = {
          checked: !!existingFacility,
          fields: facility.fields?.reduce((fieldAcc, field) => {
            const existingField = existingFacility?.fields?.find(
              (f) => f.title.trim() === field.title.trim()
            );
            fieldAcc[field.title.trim()] = existingField
              ? existingField.value === "true" || existingField.value === true || existingField.value
              : field.type === 'toggle'
              ? false
              : '';
            return fieldAcc;
          }, {}),
        };
        return acc;
      }, {});

      console.log("Initialized selected facilities:", initialSelectedFacilities);
      setSelectedFacilities(initialSelectedFacilities);
    }
  }, [houseData, facilitiesData]);

  const toggleFacility = (key) => {
    console.log(`Toggling facility ${key}`);
    setSelectedFacilities((prevSelected) => ({
      ...prevSelected,
      [key]: {
        ...prevSelected[key],
        checked: !prevSelected[key].checked,
        fields: !prevSelected[key].checked ? {} : prevSelected[key].fields, // Clear fields if unchecked
      },
    }));
    console.log("Updated selected facilities after toggle:", selectedFacilities);
  };

  const handleInputChange = (facilityKey, fieldTitle, value) => {
    console.log(`Changing field ${fieldTitle} of facility ${facilityKey} to`, value);
    setSelectedFacilities((prevState) => ({
      ...prevState,
      [facilityKey]: {
        ...prevState[facilityKey],
        fields: {
          ...prevState[facilityKey].fields,
          [fieldTitle.trim()]: value,
        },
      },
    }));
    console.log("Updated selected facilities after input change:", selectedFacilities);
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    try {
      // Filter out only checked facilities
      const facilitiesData = Object.keys(selectedFacilities)
        .filter((key) => selectedFacilities[key].checked) // Include only checked facilities
        .map((key) => ({
          type: key,
          fields: Object.entries(selectedFacilities[key].fields || {}).map(
            ([fieldKey, fieldValue]) => ({
              key: fieldKey.trim(),
              value:
                typeof fieldValue === 'string' && !isNaN(fieldValue.trim())
                  ? parseFloat(fieldValue.trim())
                  : fieldValue === 'true' || fieldValue === true || fieldValue,
            })
          ),
        }));

      console.log("Sending facilities data to API:", facilitiesData);
      const response = await editHouseFacilities(houseId, facilitiesData);
      console.log("Received response from API:", response);

      toast.success('اطلاعات با موفقیت ثبت شد');
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('خطایی در ثبت اطلاعات پیش آمد');
    } finally {
      setLoadingSubmit(false);
    }
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
            className="p-2 md:p-4 rounded-xl flex flex-col shadow-centered bg-white"
          >
            <ToggleSwitch
              checked={selectedFacilities[facility.key]?.checked || false}
              onChange={() => toggleFacility(facility.key)}
              label={facility.label}
              icon={facility.icon}
            />

            {/* Show fields only if the facility is checked */}
            {selectedFacilities[facility.key]?.checked && (
              <div className="mt-4 bg-white p-2 rounded-xl">
                {facility.fields?.map((field, index) => (
                  <div key={index} className="mb-4">
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
          className="btn bg-primary-600 text-white px-4 py-2 shadow-centered hover:bg-primary-700 transition-colors duration-200"
          onClick={handleSubmit}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? 'در حال بارگذاری...' : 'ثبت اطلاعات'}
        </button>
      </div>
    </div>
  );
};

export default EditHouseMainFacilities;
