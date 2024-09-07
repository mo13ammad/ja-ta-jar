import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Switch } from '@headlessui/react';
import Spinner from './Spinner';

function MainFacilityDetails({ token, houseUuid, facilities }) {
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchFacilitiesData = async () => {
      try {
        const response = await axios.get(
          'https://portal1.jatajar.com/api/assets/types/houseFacilities/detail',
          {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          }
        );

        if (response.status === 200) {
          const facilitiesList = response.data.data;

          // Initialize selectedFacilities with existing house data
          const initialSelectedFacilities = facilitiesList.reduce((acc, facility) => {
            const existingFacility = facilities.find((f) => f.key === facility.key);

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

          setFacilitiesData(facilitiesList);
          setSelectedFacilities(initialSelectedFacilities);
        } else {
          toast.error('Failed to fetch facilities data');
        }
      } catch (error) {
        console.error('Error fetching facilities data:', error);
        toast.error('Error fetching facilities data');
      } finally {
        setLoading(false);
      }
    };

    fetchFacilitiesData();
  }, [token, facilities]);

  const toggleFacility = (key) => {
    setSelectedFacilities((prevSelected) => ({
      ...prevSelected,
      [key]: {
        ...prevSelected[key],
        checked: !prevSelected[key].checked,
      },
    }));
  };

  const handleInputChange = (facilityKey, fieldTitle, value) => {
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
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    try {
      const requestData = {
        facilities: Object.keys(selectedFacilities).map((key) => ({
          type: key,
          fields: Object.entries(selectedFacilities[key].fields || {}).map(
            ([fieldKey, fieldValue]) => ({
              key: fieldKey.trim(),
              value: typeof fieldValue === 'string' && !isNaN(fieldValue.trim()) 
                ? parseFloat(fieldValue.trim()) 
                : fieldValue === "true" || fieldValue === true || fieldValue,
            })
          ),
        })),
      };

      console.log("Request Data:", requestData);

      const response = await axios.put(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}/facility`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Response:", response);

      if (response.status === 200) {
        toast.success('اطلاعات با موفقیت ثبت شد');
      } else {
        toast.error('خطایی در ثبت اطلاعات پیش آمد');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید');
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4">
        {facilitiesData.map((facility) => (
          <div key={facility.key} className="mb-6">
            <Switch.Group as="div" className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <Switch
                  checked={selectedFacilities[facility.key]?.checked || false}
                  onChange={() => toggleFacility(facility.key)}
                  className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1
                    ${selectedFacilities[facility.key]?.checked ? 'bg-green-500' : 'bg-gray-200'}
                  `}
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

            <div className="ml-6 mt-2">
              {facility.fields?.map((field, index) => {
                if (field.title.trim() === facility.label.trim()) {
                  return null;
                }

                return (
                  <div key={index} className="mb-4">
                    {field.type === 'toggle' ? (
                      <div className="flex items-center">
                        <Switch.Group as="div" className="flex items-center space-x-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <span className="ml-3 text-sm font-medium text-gray-700">
                              {field.title}
                            </span>
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
                            <Switch
                              checked={selectedFacilities[facility.key]?.fields?.[field.title.trim()] || false}
                              onChange={() =>
                                handleInputChange(
                                  facility.key,
                                  field.title,
                                  !selectedFacilities[facility.key].fields[field.title.trim()]
                                )
                              }
                              className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1
                                ${
                                  selectedFacilities[facility.key]?.fields?.[field.title.trim()]
                                    ? 'bg-green-500'
                                    : 'bg-gray-200'
                                }
                              `}
                            >
                              
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
                          type={field.type === 'number' || field.type === 'float1' ? 'number' : 'text'}
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
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? 'در حال بارگذاری...' : 'ثبت اطلاعات'}
        </button>
      </div>
    </div>
  );
}

export default MainFacilityDetails;
