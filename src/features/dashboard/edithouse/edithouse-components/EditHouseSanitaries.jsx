import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Loading from '../../../../ui/Loading';
import { useFetchSanitaryOptions } from '../../../../services/fetchDataService';
import useEditHouse from '../useEditHouse';

const EditHouseSanitaries = ({ houseId, data }) => {
  const { data: sanitaryOptions = [], isLoading } = useFetchSanitaryOptions();
  const [selectedSanitaries, setSelectedSanitaries] = useState([]);
  const { mutateAsync: editHouseAsync, isLoading: editLoading } = useEditHouse();

  useEffect(() => {
    if (Array.isArray(data?.sanitaries)) {
      setSelectedSanitaries(data.sanitaries.map((sanitary) => sanitary.key));
    }
  }, [data]);

  const toggleSanitary = (key) => {
    setSelectedSanitaries((prevSelected) =>
      prevSelected.includes(key)
        ? prevSelected.filter((sanitary) => sanitary !== key)
        : [...prevSelected, key]
    );
  };

  const handleSubmit = async () => {
    const updatedData = { sanitaries: selectedSanitaries };

    try {
      await editHouseAsync({ houseId, houseData: updatedData });
      toast.success('اطلاعات بهداشتی با موفقیت ثبت شد');
    } catch (error) {
      toast.error('خطایی در ثبت اطلاعات پیش آمد');
    }
  };

  return (
    <div className="relative flex flex-col h-full p-2">
      {isLoading || editLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading />
        </div>
      ) : (
        <>
          <form className="flex-1 overflow-y-auto scrollbar-thin max-h-full">
            <h4 className="text-right font-bold lg:text-lg mb-2 px-1">امکانات بهداشتی :</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sanitaryOptions.map((option) => (
                <div key={option.key} className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSanitaries.includes(option.key)}
                      onChange={() => toggleSanitary(option.key)}
                      className="sr-only"
                    />
                    <div
                      className={`h-6 w-6 rounded-full transition-colors ease-in-out duration-200 
                        ${selectedSanitaries.includes(option.key) ? 'bg-primary-800' : 'bg-gray-200'}
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
                    <span className="ml-3 text-sm font-medium text-gray-700">{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </form>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              className="btn bg-primary-600 text-white px-4 py-2 shadow-centered hover:bg-primary-600 transition-colors duration-200"
              disabled={isLoading || editLoading}
            >
              {editLoading ? 'در حال بارگذاری...' : 'ثبت اطلاعات'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditHouseSanitaries;
