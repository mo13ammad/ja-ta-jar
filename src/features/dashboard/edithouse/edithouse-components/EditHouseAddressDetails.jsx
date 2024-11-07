// src/components/edithouse-components/EditHouseAddressDetails.jsx

import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import TextField from '../../../../ui/TextField'; // Adjust the path based on your project structure
import Loading from '../../../../ui/Loading'; // Adjust the path based on your project structure

const EditHouseAddressDetails = ({
  houseData,
  loadingHouse,
  handleEditHouse,
  editLoading,
  editError,
}) => {
  const [formData, setFormData] = useState({
    address: '',
    neighborhood: '',
    floor: '',
    plaqueNumber: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState({});
 console.log(houseData)


  useEffect(() => {
    if (houseData?.address) {
      setFormData({
        address: houseData.address.address || '',
        neighborhood: houseData.address.village || '', // Use 'village' when receiving data
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
    setErrors({}); // Reset errors

    // Client-side validation for postal code
    if (formData.postalCode && !/^\d{10}$/.test(formData.postalCode)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        postal_code: ['کد پستی باید یک عدد ۱۰ رقمی باشد.'],
      }));
      toast.error('کد پستی معتبر نمی باشد.');
      return;
    }

    // Prepare data to send
    const dataToSend = {
      address: formData.address,
      village_name: formData.neighborhood, // Use 'village_name' when sending data
      floor: formData.floor,
      house_number: formData.plaqueNumber,
      postal_code: formData.postalCode,
    };

    console.log('handleSubmit - Form data to be sent:', dataToSend); // Log data being sent

    try {
      await handleEditHouse(dataToSend);
      toast.success('آدرس با موفقیت به‌روزرسانی شد');
    } catch (error) {
      console.error('Error submitting data:', error);
      if (error.response && error.response.data) {
        const { data } = error.response;
        console.log('Error response data:', data); // Log the error response data for debugging

        if (data.errors && data.errors.fields) {
          setErrors(data.errors.fields);
        }

        toast.error(data.message || 'خطایی رخ داده است.');
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
          errorMessages={errors.address}
        />

        <TextField
          label='روستا / محله'
          name='neighborhood'
          value={formData.neighborhood}
          onChange={handleInputChange}
          placeholder='روستا / محله'
          errorMessages={errors.village_name} // Use 'village_name' to match the error key from the server
        />

        <TextField
          label='اقامتگاه در طبقه'
          name='floor'
          value={formData.floor}
          onChange={handleInputChange}
          placeholder='اقامتگاه در طبقه'
          errorMessages={errors.floor}
        />

        <TextField
          label='شماره پلاک'
          name='plaqueNumber'
          value={formData.plaqueNumber}
          onChange={handleInputChange}
          placeholder='شماره پلاک'
          errorMessages={errors.house_number}
        />

        <TextField
          label='کد پستی'
          name='postalCode'
          value={formData.postalCode}
          onChange={handleInputChange}
          placeholder='کد پستی'
          errorMessages={errors.postal_code}
        />

        {Object.keys(errors).length > 0 && (
          <div className='text-red-500 col-span-2'>
            خطایی در ثبت اطلاعات وجود دارد. لطفا موارد زیر را بررسی کنید.
          </div>
        )}

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
