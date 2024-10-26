import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, RadioGroup, Label } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import HouseCard from './HouseCard';
import useFetchHouses from './useFetchHouses';
import useFetchHouseTypes from './useFetchHouseTypes';
import Loading from '../../ui/Loading';
import { createHouse } from '../../services/houseService';

const Houses = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch houses and house types
  const { data: houses = [], isLoading: isHousesLoading, isError: isHousesError } = useFetchHouses();
  const { data: houseTypes = [], isLoading: isHouseTypesLoading, isError: isHouseTypesError } = useFetchHouseTypes();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [dialogErrorMessage, setDialogErrorMessage] = useState('');

  // Set default option when opening dialog
  useEffect(() => {
    if (isAddDialogOpen && houseTypes.length > 0) {
      setSelectedOption(houseTypes[0].key);
    }
  }, [isAddDialogOpen, houseTypes]);

  // Mutation for creating a house with proper destructuring
  const createHouseMutation = useMutation(createHouse, {
    onSuccess: async (response) => {
      console.log("House created successfully:", response);
      const uuid = response.uuid;
      toast.success('اقامتگاه با موفقیت اضافه شد!');
      navigate(`/dashboard/edit-house/${uuid}`);
      await queryClient.invalidateQueries(['houses']);
    },
    onError: (error) => {
      console.error("Error creating house:", error);
      const errorMessage = error.response?.data?.message || 'خطا در اضافه کردن اقامتگاه. لطفاً دوباره تلاش کنید.';
      setDialogErrorMessage(errorMessage);
      toast.error(errorMessage);
    },
  });

  const handleAddHouse = async () => {
    setDialogErrorMessage('');
    await createHouseMutation.mutateAsync({ structure: selectedOption });
    setIsAddDialogOpen(false);
  };

  // Show loading state when houses or house types are loading
  if (isHousesLoading || isHouseTypesLoading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Display error message if there is an error in fetching houses or house types
  if (isHousesError || isHouseTypesError) {
    return (
      <div className="text-center text-red-500">
        خطا در بارگذاری اقامتگاه‌ها یا نوع اقامتگاه. لطفا دوباره امتحان کنید.
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <div className="w-full flex justify-between items-center mb-2 lg:mb-4">
        <h2 className="text-xl">اقامتگاه ها :</h2>
        <button
          className="btn bg-primary-600 hover:opacity-100"
          onClick={() => setIsAddDialogOpen(true)}
        >
          اضافه کردن اقامتگاه
        </button>
      </div>

      {/* Houses List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {houses.map((house) => (
          <HouseCard key={house.uuid} house={house} onDelete={() => setIsAddDialogOpen(true)} />
        ))}
      </div>

      {/* Add House Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-3xl w-full">
            <DialogTitle className="font-bold text-xl">افزودن اقامتگاه</DialogTitle>
            <p>لطفاً نوع اقامتگاه خود را وارد کنید :</p>
            <div className="w-full">
              <RadioGroup value={selectedOption} onChange={setSelectedOption} className="grid grid-cols-2 gap-2">
                {houseTypes.map((option) => (
                  <RadioGroup.Option key={option.key} value={option.key} className="flex items-center">
                    {({ checked }) => (
                      <div
                        className={`flex items-center p-4 border rounded-lg cursor-pointer w-full ${
                          checked ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <img src={option.icon} alt={option.label} className="w-6 h-6" />
                        </div>
                        <div className="ml-3 flex flex-col">
                          <Label className="text-lg font-medium mr-2">{option.label}</Label>
                        </div>
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </RadioGroup>
            </div>
            {dialogErrorMessage && (
              <p className="text-red-500 mt-2">{dialogErrorMessage}</p>
            )}
            <div className="flex gap-4 mt-4">
              <button
                className="btn bg-gray-300 text-gray-800"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={createHouseMutation.isLoading}
              >
                لغو
              </button>
              <button
                className="btn bg-primary-600 hover:opacity-100"
                onClick={handleAddHouse}
                disabled={createHouseMutation.isLoading}
              >
                {createHouseMutation.isLoading ? 'در حال اضافه کردن ...' : 'اضافه کردن'}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default Houses;
