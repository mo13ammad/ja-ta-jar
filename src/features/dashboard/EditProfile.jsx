// src/components/EditProfile.jsx

import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { toast } from 'react-hot-toast';
import TextField from '../../ui/TextField';
import TextArea from '../../ui/TextArea';
import Loading from '../../ui/Loading';
import { editUser } from '../../services/userService';
import { useMutation } from '@tanstack/react-query';
import useUser from './useUser';
import jalaali from 'jalaali-js';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import useFetchProvinces from './useFetchProvinces';
import useFetchCities from './useFetchCities';

// Functions for date conversion
const gregorianToPersian = (gregorianDate) => {
  if (!gregorianDate) return { year: "", month: "", day: "" };
  const dateWithoutTime = gregorianDate.split('T')[0];
  const [year, month, day] = dateWithoutTime.split('-');
  const persianDate = jalaali.toJalaali(parseInt(year), parseInt(month), parseInt(day));
  return { 
    year: persianDate.jy, 
    month: String(persianDate.jm).padStart(2, '0'), 
    day: String(persianDate.jd).padStart(2, '0') 
  };
};

const persianToGregorian = (year, month, day) => {
  if (!year || !month || !day) return "";
  const gregorianDate = jalaali.toGregorian(parseInt(year), parseInt(month), parseInt(day));
  return `${gregorianDate.gy}-${String(gregorianDate.gm).padStart(2, '0')}-${String(gregorianDate.gd).padStart(2, '0')}`;
};

const genderMap = {
  'مرد': 'Male',
  'زن': 'Female',
  'دیگر': 'Other',
};

function EditProfile({ user, onUpdateUser }) {
  // Fetch provinces
  const { data: provinces = [], isLoading: fetchProvincesLoading, error: fetchProvincesError } = useFetchProvinces();
  
  // Memoize initial birth date in Persian calendar
  const initialBirthDate = useMemo(() => {
    return user?.birth_date
      ? gregorianToPersian(user.birth_date)
      : { day: '', month: '', year: '' };
  }, [user?.birth_date]);
  
  // Refetch function from useUser
  const { refetch } = useUser();

  // State for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalCode: '',
    email: '',
    province: '',
    city: '',
    birthDay: initialBirthDate.day,
    birthMonth: initialBirthDate.month,
    birthYear: initialBirthDate.year,
    gender: 'مرد',
    secondPhone: '',
    bio: '',
    avatar: null,
  });

  // State for selected province and city
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Fetch cities based on selected province
  const { data: citiesData, isLoading: fetchCitiesLoading, error: fetchCitiesError } = useFetchCities(formData.province);

  // State for field errors
  const [fieldErrors, setFieldErrors] = useState({});

  // Initialize form data and selected options from user prop
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        nationalCode: user?.national_code || '',
        email: user?.email || '',
        province: user?.city?.province?.id || '',
        city: user?.city?.id || '',
        birthDay: initialBirthDate.day,
        birthMonth: initialBirthDate.month,
        birthYear: initialBirthDate.year,
        gender: user?.sex?.label || 'مرد',
        secondPhone: user?.second_phone || '',
        bio: user?.bio || '',
        avatar: null,
      });

      // Set selected province
      if (user.city?.province) {
        setSelectedProvince({
          value: user.city.province.id,
          label: user.city.province.name,
        });
      }

      // Set selected city
      if (user.city) {
        setSelectedCity({
          value: user.city.id,
          label: user.city.name,
        });
      }
    }
  }, [user, initialBirthDate]);

  // Handler for regular input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for avatar upload
  const handleAvatarChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  // Handler for select fields (province, city, gender)
  const handleSelectChange = (name, option) => {
    if (name === 'province') {
      setSelectedProvince(option);
      setFormData((prevData) => ({
        ...prevData,
        province: option.value,
        city: '',
      }));
      setSelectedCity(null);
    } else if (name === 'city') {
      setSelectedCity(option);
      setFormData((prevData) => ({
        ...prevData,
        city: option.value,
      }));
    } else if (name === 'gender') {
      setFormData((prevData) => ({
        ...prevData,
        gender: option.value,
      }));
    }

    // Clear related errors
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
      ...(name === 'province' ? { city: undefined } : {}),
    }));
  };

  // Mutation for editing user
  const { mutateAsync, isLoading: isSubmitting, isError, error } = useMutation({
    mutationFn: editUser,
    onError: (error) => {
      console.error('Error updating profile:', error); 
      
      if (error.response && error.response.data && error.response.data.errors) {
        const serverErrors = error.response.data.errors.fields || {};
        setFieldErrors(serverErrors);
        toast.error(error.response.data.message || 'خطایی رخ داده است');
      }
    },
    onSuccess: (data) => {
      onUpdateUser(data); // Update with the new user data
      refetch(); // Fetch updated user data
      toast.success('اطلاعات با موفقیت بروزرسانی شد');
    },
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const birthDateGregorian = persianToGregorian(formData.birthYear, formData.birthMonth, formData.birthDay);
    const genderValue = genderMap[formData.gender] || 'Male';

    const updatedData = new FormData();
    updatedData.append('_method', 'PUT');
    updatedData.append('first_name', formData.firstName);
    updatedData.append('last_name', formData.lastName);
    updatedData.append('national_code', formData.nationalCode);
    updatedData.append('email', formData.email);
    updatedData.append('birth_date', birthDateGregorian);
    updatedData.append('second_phone', formData.secondPhone);
    updatedData.append('sex', genderValue);
    updatedData.append('province_id', formData.province);
    updatedData.append('city_id', formData.city);

    if (formData.avatar) {
      updatedData.append('avatar', formData.avatar);
    }

    updatedData.append('bio', formData.bio);

    try {
      await mutateAsync(updatedData);
    } catch (error) {
      console.error('Error updating profile:', error);
      // Errors are handled in onError
    }
  };

  // Loading state
  if (fetchProvincesLoading) {
    return (
      <div className="min-h-[65vh] flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  // Handle fetching errors
  if (fetchProvincesError) {
    toast.error('خطا در بارگزاری استان‌ها');
    return null;
  }

  // Prepare province options
  const provinceOptions = provinces.map((province) => ({
    value: province.id,
    label: province.name,
  }));

  // Prepare city options
  const cityOptions = fetchCitiesLoading
    ? [{ value: '', label: 'در حال بارگزاری ...' }]
    : formData.province
    ? (citiesData?.cities?.map((city) => ({ value: city.id, label: city.name })) || [{ value: '', label: 'شهر موجود نیست' }])
    : [{ value: '', label: 'لطفاً ابتدا استان را انتخاب کنید' }];

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col md:grid grid-cols-2 gap-6 p-6">
        {/* First Name */}
        <div>
          <TextField
            label="نام"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="نام"
          />
          {fieldErrors.first_name && fieldErrors.first_name.map((msg, idx) => (
            <div key={idx} className="text-red-500 text-sm pt-2">{msg}</div>
          ))}
        </div>

        {/* Last Name */}
        <div>
          <TextField
            label="نام خانوادگی"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="نام خانوادگی"
          />
          {fieldErrors.last_name && fieldErrors.last_name.map((msg, idx) => (
            <div key={idx} className="text-red-500 text-sm pt-2">{msg}</div>
          ))}
        </div>

        {/* National Code */}
        <div>
          <TextField
            label="کد ملی"
            name="nationalCode"
            value={formData.nationalCode}
            onChange={handleInputChange}
            placeholder="کد ملی"
          />
          {fieldErrors.national_code && fieldErrors.national_code.map((msg, idx) => (
            <div key={idx} className="text-red-500 text-sm pt-2">{msg}</div>
          ))}
        </div>

        {/* Email */}
        <div>
          <TextField
            label="ایمیل"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="ایمیل"
            type="email"
          />
          {fieldErrors.email && fieldErrors.email.map((msg, idx) => (
            <div key={idx} className="text-red-500 text-sm pt-2">{msg}</div>
          ))}
        </div>

        {/* Province Select */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">استان</label>
          <Listbox
            value={selectedProvince}
            onChange={(value) => handleSelectChange('province', value)}
            disabled={false} // Set to true if needed
          >
            {({ open }) => (
              <div className="relative bg-white rounded-xl ">
                <Listbox.Button className={`listbox__button ${false ? 'cursor-not-allowed bg-gray-100' : ''}`}>
                  <span>
                    {selectedProvince
                      ? selectedProvince.label
                      : 'انتخاب استان'}
                  </span>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      open ? 'rotate-180' : 'rotate-0'
                    }`}
                    aria-hidden="true"
                  />
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-50 w-full mt-1 scrollbar-thin  bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {provinceOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-secondary-100 text-secondary-700'
                              : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {option.label}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-secondary-600' : 'text-secondary-600'
                                }`}
                              >
                                {/* Optional: Add a checkmark icon here */}
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
          {fieldErrors.province_id && fieldErrors.province_id.map((msg, idx) => (
            <div key={idx} className="text-red-500 text-sm pt-2">{msg}</div>
          ))}
        </div>

        {/* City Select */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">شهر</label>
          <Listbox
            value={selectedCity}
            onChange={(value) => handleSelectChange('city', value)}
            disabled={!selectedProvince || fetchCitiesLoading}
          >
            {({ open }) => (
              <div className="relative bg-white rounded-xl">
                <Listbox.Button className={`listbox__button ${(!selectedProvince || fetchCitiesLoading) ? 'cursor-not-allowed bg-gray-100' : ''}`}>
                  <span>
                    {selectedCity
                      ? selectedCity.label
                      : !selectedProvince
                      ? 'لطفاً ابتدا استان را انتخاب کنید'
                      : fetchCitiesLoading
                      ? 'در حال بارگزاری ...'
                      : 'انتخاب شهر'}
                  </span>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      open ? 'rotate-180' : 'rotate-0'
                    }`}
                    aria-hidden="true"
                  />
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-50 w-full mt-1 scrollbar-thin bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {cityOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-secondary-100 text-secondary-700'
                              : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {option.label}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-secondary-600' : 'text-secondary-600'
                                }`}
                              >
                                {/* Optional: Add a checkmark icon here */}
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
          {fieldErrors.city_id && fieldErrors.city_id.map((msg, idx) => (
            <div key={idx} className="text-red-500 text-sm pt-2">{msg}</div>
          ))}
        </div>

        {/* Birth Date Fields */}
        <div className="col-span-2">
          <BirthDateFields formData={formData} setFormData={setFormData} />
        </div>

        {/* Gender Select */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">جنسیت</label>
          <Listbox
            value={{ value: formData.gender, label: formData.gender }}
            onChange={(value) => handleSelectChange('gender', value)}
            disabled={false} // Set to true if needed
          >
            {({ open }) => (
              <div className="relative bg-white rounded-xl">
                <Listbox.Button className={`listbox__button ${false ? 'cursor-not-allowed bg-gray-100' : ''}`}>
                  <span>
                    {formData.gender
                      ? formData.gender
                      : 'انتخاب جنسیت'}
                  </span>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      open ? 'rotate-180' : 'rotate-0'
                    }`}
                    aria-hidden="true"
                  />
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {[
                      { value: 'مرد', label: 'مرد' },
                      { value: 'زن', label: 'زن' },
                      { value: 'دیگر', label: 'دیگر' },
                    ].map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-secondary-100 text-secondary-700'
                              : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {option.label}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-secondary-600' : 'text-secondary-600'
                                }`}
                              >
                                {/* Optional: Add a checkmark icon here */}
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
          {fieldErrors.sex && fieldErrors.sex.map((msg, idx) => (
            <div key={idx} className="text-red-500 text-sm pt-2">{msg}</div>
          ))}
        </div>

        {/* Second Phone */}
        <div>
          <TextField
            label="شماره دوم"
            name="secondPhone"
            value={formData.secondPhone}
            onChange={handleInputChange}
            placeholder="شماره دوم"
          />
          {fieldErrors.second_phone && fieldErrors.second_phone.map((msg, idx) => (
            <div key={idx} className="text-red-500 text-sm pt-2">{msg}</div>
          ))}
        </div>

        {/* Avatar Upload */}
        <div className="col-span-2">
          <label htmlFor="avatar" className='mb-2 font-medium block'>عکس پروفایل</label>
          <input 
            type="file" 
            name="avatar" 
            className='bg-white w-full px-2 py-1.5 border rounded-2xl shadow-centered' 
            onChange={handleAvatarChange} 
            accept="image/*"
          />
          {fieldErrors.avatar && fieldErrors.avatar.map((msg, idx) => (
            <div key={idx} className="text-red-500 text-sm pt-2">{msg}</div>
          ))}
        </div>

        {/* Bio TextArea */}
        <div className="col-span-2">
          <TextArea
            label="درباره شما"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="درباره شما"
            rows={4}
          />
          {fieldErrors.bio && fieldErrors.bio.map((msg, idx) => (
            <div key={idx} className="text-red-500 text-sm pt-2">{msg}</div>
          ))}
        </div>

        {/* General Errors */}
        {isError && (
          <div className="text-red-500 mb-4 col-span-2">
            {error?.response?.data?.message || 'مشکلی در ثبت اطلاعات وجود دارد.'}
          </div>
        )}

        {/* Submit Button */}
        <div className="col-span-2">
          <button 
            type="submit" 
            className="btn block bg-primary-800 h-10 text-white "
            disabled={isSubmitting}
          >
            {isSubmitting ? 'در حال ارسال...' : 'ذخیره اطلاعات'}
          </button>
        </div>
      </form>
    </div>
  );
}

const BirthDateFields = ({ formData, setFormData }) => {
  const handleBirthDateChange = (part, value) => {
    setFormData((prev) => ({ ...prev, [part]: value }));
  };

  return (
    <div className="flex flex-col w-1/2 gap-2">
      <label className="block font-medium text-gray-700">تاریخ تولد</label>
      <div className="flex gap-2">
        <TextField
          name="birthDay"
          value={formData.birthDay}
          onChange={(e) => handleBirthDateChange('birthDay', e.target.value)}
          placeholder="روز"
          maxLength={2}
          pattern="\d*"
        />
        <TextField
          name="birthMonth"
          value={formData.birthMonth}
          onChange={(e) => handleBirthDateChange('birthMonth', e.target.value)}
          placeholder="ماه"
          maxLength={2}
          pattern="\d*"
        />
        <TextField
          name="birthYear"
          value={formData.birthYear}
          onChange={(e) => handleBirthDateChange('birthYear', e.target.value)}
          placeholder="سال"
          maxLength={4}
          pattern="\d*"
        />
      </div>
    </div>
  );
};

export default EditProfile;
