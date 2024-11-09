// src/components/edithouse-components/EditHouseGeneralInfo.jsx

import React, { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-hot-toast';
import Spinner from '../../../../ui/Loading';
import TextField from '../../../../ui/TextField';
import TextArea from '../../../../ui/TextArea';
import FormSelect from '../../../../ui/FormSelect';
import ToggleSwitch from '../../../../ui/ToggleSwitch';
import { useFetchHouseFloors, useFetchPrivacyOptions } from '../../../../services/fetchDataService';
import useEditHouse from '../useEditHouse';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

// Ownership Options
const ownershipOptions = [
  { key: 'Owner', label: 'مالک', value: 'Owner' },
  { key: 'LongTermTenant', label: 'مستأجر بلند مدت', value: 'LongTermTenant' },
  { key: 'Intermediary', label: 'واسطه', value: 'Intermediary' },
  { key: 'FamiliarWithTheOwner', label: 'آشنا با مالک', value: 'FamiliarWithTheOwner' },
  { key: 'Gatekeeper', label: 'سرایدار', value: 'Gatekeeper' },
];

// OwnershipSelect Component
function OwnershipSelect({ label, value, onChange }) {
  return (
    <div className="w-full">
      <label className="block font-medium text-gray-700 mb-2">{label}</label>
      <Listbox value={value} onChange={(val) => onChange(val)}>
        {({ open }) => (
          <div className="relative bg-white rounded-xl">
            <Listbox.Button className="listbox__button">
              <span>
                {ownershipOptions.find((option) => option.value === value)?.label || 'انتخاب کنید'}
              </span>
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                  open ? 'rotate-180' : 'rotate-0'
                }`}
                aria-hidden="true"
              />
            </Listbox.Button>

            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                {ownershipOptions.map((option) => (
                  <Listbox.Option
                    key={option.key}
                    value={option.value}
                    className={({ active }) =>
                      `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                        active ? 'bg-secondary-100 text-secondary-700' : 'text-gray-900'
                      }`
                    }
                  >
                    <span className="block truncate font-normal">{option.label}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
}

// Main EditHouseGeneralInfo Component
const EditHouseGeneralInfo = ({ houseData, loadingUser, houseId }) => {


  const [formData, setFormData] = useState({
    name: houseData?.name || '',
    land_size: houseData?.structure?.land_size || '',
    structure_size: houseData?.structure?.size || '',
    number_stairs: houseData?.structure?.number_stairs || '',
    description: houseData?.description || '',
    tip: houseData?.tip?.key || '',
    privacy: houseData?.privacy?.key || '',
    rentType: houseData?.structure?.can_rent_room
      ? (houseData?.is_rent_room ? 'Rooms' : 'House')
      : 'House',
    price_handle_by: houseData?.price_handle_by?.key || 'PerNight',
    ownership: houseData?.ownership || '', // Set initial ownership directly
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
    { key: 'PerPerson', label: 'براساس هر نفر - شب' },
  ];

  useEffect(() => {
    if (houseData) {
      setFormData((prevData) => ({
        ...prevData,
        ownership: houseData.ownership || '', // Set ownership based on houseData
      }));
    }
  }, [houseData]);


  const handleInputChange = (name, value) => {
    console.log(`Input Change - Field: ${name}, Value: ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!houseId) {
      toast.error("شناسه اقامتگاه موجود نیست. امکان ارسال داده وجود ندارد.");
      return;
    }

    console.log("Submitting formData:", formData);
    try {
      const response = await mutateAsync({ houseId, houseData: formData });
      toast.success('جزئیات اقامتگاه با موفقیت به‌روزرسانی شد!');
    } catch (error) {
      toast.error('به‌روزرسانی جزئیات اقامتگاه ناموفق بود. لطفاً دوباره تلاش کنید.');
    }
  };

  if (loadingUser || loadingHouseFloors || loadingPrivacyOptions) {
    return <div className="flex justify-center items-center min-h-[50vh]"><Spinner /></div>;
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

          <FormSelect
            label="تیپ سازه"
            name="tip"
            value={formData.tip || ''} // Ensure controlled input
            onChange={(e) => handleInputChange("tip", e.target.value)}
            options={loadingHouseFloors ? [{ key: 'loading', value: '', label: 'در حال بارگذاری...' }] : [{ key: 'default', value: '', label: 'انتخاب نوع' }, ...houseFloorOptions.map((option) => ({
              key: option.key,
              value: option.key,
              label: option.label,
            }))]}
          />
          <FormSelect
            label="وضعیت حریم"
            name="privacy"
            value={formData.privacy || ''} // Ensure controlled input
            onChange={(e) => handleInputChange("privacy", e.target.value)}
            options={loadingPrivacyOptions ? [{ key: 'loading', value: '', label: 'در حال بارگذاری...' }] : [{ key: 'default', value: '', label: 'انتخاب حریم' }, ...privacyOptions.map((option) => ({
              key: option.key,
              value: option.key,
              label: option.label,
            }))]}
          />

          <OwnershipSelect
            label="نوع ارتباط مالک با اقامتگاه"
            value={formData.ownership || ''}
            onChange={(value) => handleInputChange("ownership", value)}
          />

          <TextArea
            label="درباره اقامتگاه"
            name="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="امکاناتی که میخواهید به مهمانان نمایش داده شود را بنویسید"
            className="lg:col-span-2"
          />

          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع اجاره دهی اقامتگاه بر چه اساسی باشد</label>
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

          {houseData?.structure?.can_rent_room && (
            <div className="mt-4 lg:col-span-2 border-t pt-2">
              <label className="block font-bold text-gray-700 mb-2">نوع اجاره دهی اقامتگاه بر چه اساسی باشد</label>
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
