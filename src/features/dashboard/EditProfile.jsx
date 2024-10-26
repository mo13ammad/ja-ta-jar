import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import TextField from '../../ui/TextField';
import TextArea from '../../ui/TextArea';
import FormSelect from '../../ui/FormSelect';
import useFetchProvinces from './useFetchProvinces';
import useFetchCities from './useFetchCities';
import Loading from '../../ui/Loading';
import { editUser } from '../../services/userService';
import { useMutation } from '@tanstack/react-query';
import useUser from './useUser';
import jalaali from 'jalaali-js';

// Functions for date conversion
const gregorianToPersian = (gregorianDate) => {
  if (!gregorianDate) return { year: "", month: "", day: "" };
  const dateWithoutTime = gregorianDate.split('T')[0];
  const [year, month, day] = dateWithoutTime.split('-');
  const persianDate = jalaali.toJalaali(parseInt(year), parseInt(month), parseInt(day));
  return { year: persianDate.jy, month: String(persianDate.jm).padStart(2, '0'), day: String(persianDate.jd).padStart(2, '0') };
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
  const { data: provinces = [], isLoading: fetchProvincesLoading } = useFetchProvinces();
  const initialBirthDate = user?.birth_date ? gregorianToPersian(user.birth_date) : { day: '', month: '', year: '' };
  
  const { refetch } = useUser(); // Import refetch function

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

  const { data: cities = [], isLoading: fetchCitiesLoading } = useFetchCities(formData.province);

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
    }
  }, [user]);

  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const { mutateAsync, isPending: isSubmitting, isError, error } = useMutation({
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
    }
  };

  if (fetchProvincesLoading) {
    return (
      <div className="min-h-[65vh] flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  const cityOptions = fetchCitiesLoading
    ? [{ value: '', label: 'در حال بارگزاری ...' }]
    : formData.province
    ? cities.cities?.map((city) => ({ value: city.id, label: city.name })) || [{ value: '', label: 'No cities available' }]
    : [{ value: '', label: 'لطفا ابتدا استان را انتخاب کنید' }];

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col md:grid grid-cols-2 gap-6 p-1.5">
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

        <FormSelect
          label="استان"
          name="province"
          value={formData.province}
          onChange={handleInputChange}
          options={provinces.map((province) => ({ value: province.id, label: province.name }))}
        />

        <FormSelect
          label="شهر"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          options={cityOptions}
        />

        <BirthDateFields formData={formData} setFormData={setFormData} />

        <FormSelect
          label="جنسیت"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          options={[
            { value: 'مرد', label: 'مرد' },
            { value: 'زن', label: 'زن' },
            { value: 'دیگر', label: 'دیگر' },
          ]}
        />

        <TextField
          label="شماره دوم"
          name="secondPhone"
          value={formData.secondPhone}
          onChange={handleInputChange}
          placeholder="شماره دوم"
        />
        
        <div>
        <label htmlFor="avatar" className='mb-2 font-medium'>عکس پروفایل</label>
        <input type="file" name="avatar" className='bg-white w-full   px-2 py-1.5 border rounded-2xl shadow-centered' onChange={handleAvatarChange} />
        </div>

        <TextArea
          label="درباره شما"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          placeholder="درباره شما"
          rows={4}
        />

        {isError && (
          <div className="text-red-500 mb-4">
            {error?.response?.data?.message || 'مشکلی در ثبت اطلاعات وجود دارد.'}
          </div>
        )}
          
        <button type="submit" className="btn block bg-primary-800 max-w-36 h-10">
          {isSubmitting ? 'در حال ارسال...' : 'ذخیره اطلاعات'}
        </button>
      </form>
    </div>
  );
}

const BirthDateFields = ({ formData, setFormData }) => {
  const handleBirthDateChange = (part, value) => {
    setFormData((prev) => ({ ...prev, [part]: value }));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="block font-medium text-gray-700">تاریخ تولد</label>
      <div className="flex gap-2">
        <TextField
          name="birthDay"
          value={formData.birthDay}
          onChange={(e) => handleBirthDateChange('birthDay', e.target.value)}
          placeholder="روز"
        />
        <TextField
          name="birthMonth"
          value={formData.birthMonth}
          onChange={(e) => handleBirthDateChange('birthMonth', e.target.value)}
          placeholder="ماه"
        />
        <TextField
          name="birthYear"
          value={formData.birthYear}
          onChange={(e) => handleBirthDateChange('birthYear', e.target.value)}
          placeholder="سال"
        />
      </div>
    </div>
  );
};

export default EditProfile;
