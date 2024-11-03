// src/components/edithouse-components/EditHouseGeneralInfo.jsx

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Spinner from '../../../../ui/Loading';
import TextField from '../../../../ui/TextField';
import TextArea from '../../../../ui/TextArea';
import FormSelect from '../../../../ui/FormSelect';
import ToggleSwitch from '../../../../ui/ToggleSwitch';
import { useFetchHouseFloors, useFetchPrivacyOptions } from '../../../../services/fetchDataService';
import useEditHouse from '../useEditHouse';

const EditHouseGeneralInfo = ({ houseData, loadingUser, houseId }) => {
  console.log("House Data:", houseData);
  console.log("EditHouseGeneralInfo received houseId:", houseId); // Debugging

  const [formData, setFormData] = useState({
    name: houseData?.name || '',
    land_size: houseData?.structure?.land_size || '',
    structure_size: houseData?.structure?.size || '',
    number_stairs: houseData?.structure?.number_stairs || '',
    description: houseData?.description || '',
    tip: houseData?.tip?.key || '',
    privacy: houseData?.privacy?.key || '',
    rentType: houseData?.structure?.can_rent_room ? 'Rooms' : 'House',
    price_handle_by: houseData?.price_handle_by?.key || 'PerNight',
  });

  const { data: houseFloorOptions = [], isLoading: loadingHouseFloors } = useFetchHouseFloors();
  const { data: privacyOptions = [], isLoading: loadingPrivacyOptions } = useFetchPrivacyOptions();
  const { mutateAsync, isLoading: editLoading } = useEditHouse();

  const rentTypeOptions = [
    { key: 'House', label: 'اقامتگاه' },
    { key: 'Rooms', label: 'اتاق' },
  ];

  const priceHandleOptions = [
    { key: 'PerNight', label: 'براساس هر شب' },
    { key: 'PerPerson', label: 'براساس هر نفر-شب' },
  ];

  useEffect(() => {
    if (houseData) {
      setFormData({
        name: houseData.name || '',
        land_size: houseData.structure?.land_size || '',
        structure_size: houseData.structure?.size || '',
        number_stairs: houseData.structure?.number_stairs || '',
        description: houseData.description || '',
        tip: houseData.tip?.key || '',
        privacy: houseData.privacy?.key || '',
        rentType: houseData.structure?.can_rent_room ? 'Rooms' : 'House',
        price_handle_by: houseData.price_handle_by?.key || 'PerNight',
      });
    }
  }, [houseData]);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting with data:", formData);
    console.log("House ID:", houseId); // Debugging
    if (!houseId) {
      console.error("Error: houseId is undefined.");
      toast.error("شناسه اقامتگاه موجود نیست. امکان ارسال داده وجود ندارد.");
      return;
    }
    try {
      await mutateAsync({ houseId, houseData: formData });
      toast.success('جزئیات اقامتگاه با موفقیت به‌روزرسانی شد!');
    } catch (error) {
      toast.error('به‌روزرسانی جزئیات اقامتگاه ناموفق بود. لطفاً دوباره تلاش کنید.');
    }
  };

  if (loadingUser || loadingHouseFloors || loadingPrivacyOptions) {
    return <Spinner />;
  }

  return (
    <div className="relative">
      <div className="overflow-auto scrollbar-thin pt-2 px-2 lg:px-4 w-full h-full">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TextField
            label="نام اقامتگاه"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="نام اقامتگاه"
          />
          <TextField
            label="متراژ کل"
            name="land_size"
            value={formData.land_size}
            onChange={(e) => handleInputChange("land_size", e.target.value)}
            placeholder="متراژ کل به متر مربع"
          />
          <TextField
            label="متراژ زیر بنا"
            name="structure_size"
            value={formData.structure_size}
            onChange={(e) => handleInputChange("structure_size", e.target.value)}
            placeholder="متراژ زیر بنا به متر مربع"
          />
          <TextField
            label="تعداد پله"
            name="number_stairs"
            value={formData.number_stairs}
            onChange={(e) => handleInputChange("number_stairs", e.target.value)}
            placeholder="تعداد پله"
          />
          <TextArea
            label="درباره اقامتگاه"
            name="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="امکاناتی که میخواهید به مهمانان نمایش داده شود را بنویسید"
            className="lg:col-span-2"
          />
          <FormSelect
            label="تیپ سازه"
            name="tip"
            value={formData.tip}
            onChange={(e) => handleInputChange("tip", e.target.value)}
            options={loadingHouseFloors ? [{ value: '', label: 'در حال بارگذاری...' }] : [{ value: '', label: 'انتخاب نوع' }, ...houseFloorOptions.map((option) => ({
              value: option.key,
              label: option.label,
            }))]}
          />
          <FormSelect
            label="وضعیت حریم"
            name="privacy"
            value={formData.privacy}
            onChange={(e) => handleInputChange("privacy", e.target.value)}
            options={loadingPrivacyOptions ? [{ value: '', label: 'در حال بارگذاری...' }] : [{ value: '', label: 'انتخاب حریم' }, ...privacyOptions.map((option) => ({
              value: option.key,
              label: option.label,
            }))]}
          />
          {/* Conditionally render the Rent Type section */}
          {houseData.is_rent_room && (
            <div className="mt-4 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">اجاره بر اساس</label>
              <div className="flex space-x-4">
                {rentTypeOptions.map((option) => (
                  <ToggleSwitch
                    key={option.key}
                    checked={formData.rentType === option.key}
                    onChange={() => handleInputChange("rentType", option.key)}
                    label={option.label}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">قیمت گذاری بر اساس</label>
            <div className="flex space-x-4">
              {priceHandleOptions.map((option) => (
                <ToggleSwitch
                  key={option.key}
                  checked={formData.price_handle_by === option.key}
                  onChange={() => handleInputChange("price_handle_by", option.key)}
                  label={option.label}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 w-full lg:col-span-2 flex justify-end">
            <button
              type="submit"
              className="btn bg-primary-600 text-white px-3 py-1.6 shadow-xl hover:bg-primary-800 transition-colors duration-200"
              disabled={editLoading}
            >
              {editLoading ? 'در حال ذخیره...' : 'ثبت اطلاعات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHouseGeneralInfo;
