// src/components/edithouse-components/EditHouseAddressDetails.jsx

import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import TextField from '../../../../ui/TextField';
import Loading from '../../../../ui/Loading';

const EditHouseAddressDetails = ({
  houseData,
  loadingHouse,
  handleEditHouse,
  editLoading,
}) => {
  const [formData, setFormData] = useState({
    address: '',
    neighborhood: '',
    floor: '',
    plaqueNumber: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState({});
  const [errorList, setErrorList] = useState([]);

  useEffect(() => {
    if (houseData?.address) {
      setFormData({
        address: houseData.address.address || '',
        neighborhood: houseData.address.village || '',
        floor: houseData.address.floor || '',
        plaqueNumber: houseData.address.house_number || '',
        postalCode: houseData.address.postal_code || '',
      });
    }
  }, [houseData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setErrorList([]);

    // Client-side validation for postal code
    if (formData.postalCode && !/^\d{10}$/.test(formData.postalCode)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        postal_code: ['کد پستی باید یک عدد ۱۰ رقمی باشد.'],
      }));
      toast.error('کد پستی معتبر نمی باشد.');
      return;
    }

    const dataToSend = {
      address: formData.address,
      village_name: formData.neighborhood,
      floor: formData.floor,
      house_number: formData.plaqueNumber,
      postal_code: formData.postalCode,
    };

    try {
      await handleEditHouse(dataToSend);
      toast.success('آدرس با موفقیت به‌روزرسانی شد');
    } catch (errorData) {
      console.error('Edit House Error:', errorData);

      if (errorData.errors || errorData.message) {
        if (errorData.errors?.fields) {
          const fieldErrors = errorData.errors.fields;
          const updatedErrors = {};
          const errorsArray = Object.values(fieldErrors).flat();

          for (let field in fieldErrors) {
            updatedErrors[field] = fieldErrors[field];
          }
          setErrors(updatedErrors);
          setErrorList(errorsArray);
          
        }

        if (errorData.message) {
          toast.error(errorData.message);
        }
      } else {
        toast.error('متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید');
      }
    }
  };

  if (loadingHouse) {
    return <Loading message='در حال بارگذاری اطلاعات آدرس...' />;
  }

  return (
    <div className='relative'>
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className='flex flex-col md:grid grid-cols-2 overflow-auto gap-x-2 gap-y-4 p-2 scrollbar-thin w-full'
      >
        <TextField
          label='آدرس اقامتگاه'
          name='address'
          value={formData.address}
          onChange={handleInputChange}
          placeholder='آدرس اقامتگاه'
          errorMessages={errors.address} // Pass the address-specific errors
        />

        <TextField
          label='روستا / محله'
          name='neighborhood'
          value={formData.neighborhood}
          onChange={handleInputChange}
          placeholder='روستا / محله'
          errorMessages={errors.village_name} // Pass the neighborhood-specific errors
        />

        <TextField
          label='اقامتگاه در طبقه'
          name='floor'
          value={formData.floor}
          onChange={handleInputChange}
          placeholder='اقامتگاه در طبقه'
          errorMessages={errors.floor} // Pass the floor-specific errors
        />

        <TextField
          label='شماره پلاک'
          name='plaqueNumber'
          value={formData.plaqueNumber}
          onChange={handleInputChange}
          placeholder='شماره پلاک'
          errorMessages={errors.house_number} // Pass the plaqueNumber-specific errors
        />

        <TextField
          label='کد پستی'
          name='postalCode'
          value={formData.postalCode}
          onChange={handleInputChange}
          placeholder='کد پستی'
          errorMessages={errors.postal_code} // Pass the postalCode-specific errors
        />

       

        <div className='mt-4 w-full lg:col-span-2 flex justify-end'>
          <button
            type='submit'
            className='btn bg-primary-600 text-white px-3 py-1.5 shadow-xl hover:bg-primary-800 transition-colors duration-200'
            disabled={editLoading}
          >
            {editLoading ? 'در حال ذخیره...' : 'ثبت اطلاعات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHouseAddressDetails;
