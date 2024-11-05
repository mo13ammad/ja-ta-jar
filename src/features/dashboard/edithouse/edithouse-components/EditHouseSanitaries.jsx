import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Loading from '../../../../ui/Loading';
import { useFetchSanitaryOptions } from '../../../../services/fetchDataService';
import useEditHouse from '../useEditHouse';
import ToggleSwitch from '../../../../ui/ToggleSwitch';

const EditHouseSanitaries = ({ houseId, houseData }) => {
  const { data: sanitaryOptions = [], isLoading } = useFetchSanitaryOptions();
  const [selectedSanitaries, setSelectedSanitaries] = useState([]);
  const { mutateAsync: editHouseAsync, isLoading: editLoading } = useEditHouse();

  useEffect(() => {
    if (Array.isArray(houseData?.sanitaries)) {
      setSelectedSanitaries(houseData.sanitaries.map((sanitary) => sanitary.key));
    }
  }, [houseData]);

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
                  <ToggleSwitch
                    checked={selectedSanitaries.includes(option.key)}
                    onChange={() => toggleSanitary(option.key)}
                    label={option.label}
                    icon={option.icon}
                  />
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
