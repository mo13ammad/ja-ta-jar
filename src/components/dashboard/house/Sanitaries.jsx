import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Spinner from './Spinner'; // Assuming you have a Spinner component

const Sanitaries = ({ token, houseUuid, data }) => {
  const [sanitaryOptions, setSanitaryOptions] = useState([]);
  const [selectedSanitaries, setSelectedSanitaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchSanitaryOptions = async () => {
      try {
        const response = await axios.get('https://portal1.jatajar.com/api/assets/types/sanitaryFacilities/detail', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
          setSanitaryOptions(response.data.data);
        }

        if (Array.isArray(data?.sanitaries)) {
          setSelectedSanitaries(data.sanitaries.map(sanitary => sanitary.key));
        }
      } catch (error) {
        toast.error('Error fetching sanitary options');
      } finally {
        setLoading(false);
      }
    };

    fetchSanitaryOptions();
  }, [token, data]);

  const toggleSanitary = (key) => {
    setSelectedSanitaries((prevSelected) =>
      prevSelected.includes(key)
        ? prevSelected.filter((sanitary) => sanitary !== key)
        : [...prevSelected, key]
    );
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);

    const requestData = {
      sanitaries: selectedSanitaries,
    };

    try {
      const response = await axios.post(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}`,
        {
          ...requestData,
          _method: 'PUT',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.success('اطلاعات بهداشتی با موفقیت ثبت شد');
      } else {
        toast.error('خطایی در ثبت اطلاعات پیش آمد');
      }
    } catch (error) {
      toast.error('متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner /> {/* Content area spinner */}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto scrollbar-thin max-h-full pl-4">
            <div className="grid grid-cols-2 gap-4">
              {sanitaryOptions.map((option) => (
                <div key={option.key} className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <div className="relative inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSanitaries.includes(option.key)}
                        onChange={() => toggleSanitary(option.key)}
                        className="sr-only"
                      />
                      <div
                        className={`h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 
                          ${selectedSanitaries.includes(option.key) ? 'bg-green-500' : 'bg-gray-200'}
                        `}
                      >
                        {selectedSanitaries.includes(option.key) && (
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
                      </div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              onClick={handleSubmit}
              className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? 'در حال بارگذاری...' : 'ثبت اطلاعات'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sanitaries;
