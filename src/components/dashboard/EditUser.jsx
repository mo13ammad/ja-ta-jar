// EditUser.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jalaali from "jalaali-js";
import { Listbox } from "@headlessui/react";
import Spinner from "../Spinner";

const genderOptions = [
  { key: 'Male', label: 'مرد' },
  { key: 'Female', label: 'زن' },
  { key: 'Other', label: 'دیگر' }
];

const persianToGregorian = (year, month, day) => {
  if (!year || !month || !day) return "";
  const gregorianDate = jalaali.toGregorian(parseInt(year), parseInt(month), parseInt(day));
  return `${gregorianDate.gy}-${String(gregorianDate.gm).padStart(2, '0')}-${String(gregorianDate.gd).padStart(2, '0')}`;
};

const gregorianToPersian = (gregorianDate) => {
  if (!gregorianDate) return { year: "", month: "", day: "" };
  const [year, month, day] = gregorianDate.split('-');
  const persianDate = jalaali.toJalaali(parseInt(year), parseInt(month), parseInt(day));
  return { year: persianDate.jy, month: String(persianDate.jm).padStart(2, '0'), day: String(persianDate.jd).padStart(2, '0') };
};

const EditUser = ({ user, token, onUpdate, onEditStart, onEditEnd }) => {
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [nationalCode, setNationalCode] = useState(user.national_code || "");
  const [email, setEmail] = useState(user.email || "");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState(user.sex?.key || "");
  const [secondPhone, setSecondPhone] = useState(user.second_phone || "");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(user.city?.province.id || "");
  const [selectedCity, setSelectedCity] = useState(user.city?.id || "");
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [bio, setBio] = useState(user.bio || "");

  useEffect(() => {
    const { year, month, day } = gregorianToPersian(user.birth_date);
    setBirthYear(year);
    setBirthMonth(month);
    setBirthDay(day);
  }, [user.birth_date]);

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingFetch(true);
      try {
        const response = await axios.get("https://portal1.jatajar.com/api/assets/province");
        setProvinces(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        toast.error("خطا در بارگذاری استان‌ها");
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchCities = async () => {
        setLoadingFetch(true);
        try {
          const response = await axios.get(`https://portal1.jatajar.com/api/assets/province/${selectedProvince}/cities`);
          setCities(response.data.data.cities || []);
        } catch (error) {
          console.error("Error fetching cities:", error);
          toast.error("خطا در بارگذاری شهرها");
        } finally {
          setLoadingFetch(false);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedProvince]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    onEditStart();
    setErrors({});

    // Create FormData object
    const formData = new FormData();
    formData.append('_method', 'PUT');

    // Append original and updated values
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('national_code', nationalCode);
    formData.append('email', email);
    formData.append('birth_date', persianToGregorian(birthYear, birthMonth, birthDay));
    formData.append('second_phone', secondPhone);
    formData.append('sex', gender);
    formData.append('province_id', selectedProvince);
    formData.append('city_id', selectedCity);
    if (avatar) formData.append('avatar', avatar); // Append the file if provided
    formData.append('bio', bio);

    try {
      const response = await axios.post("https://portal1.jatajar.com/api/client/profile", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      onUpdate();
      toast.success("اطلاعات شما با موفقیت ویرایش شد");
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.errors) {
          setErrors(data.errors.fields || {});
        }
        toast.error(data.message || "An unexpected error occurred.");
      } else {
        toast.error("متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید");
      }
    } finally {
      setLoadingSubmit(false);
      onEditEnd();
    }
  };

  const renderErrorMessages = (fieldErrors) => {
    if (!fieldErrors) return null;
    return (
      <div className="mt-0.5 text-red-500 text-sm">
        {Array.isArray(fieldErrors) ? (
          fieldErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))
        ) : (
          <p>{fieldErrors}</p>
        )}
      </div>
    );
  };

  const isVendor = user.type === "Vendor";
  const isDisabled = (field) => isVendor && !["bio", "avatar", "secondPhone", "email"].includes(field);

  return (
    <div className="relative">
      {loadingFetch && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center z-10">
          <Spinner />
        </div>
      )}
      <form onSubmit={handleEditSubmit} className={`flex flex-col md:grid grid-cols-2 gap-6 p-1.5 ${loadingSubmit ? 'pointer-events-none' : ''}`}>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">نام</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onFocus={() => setFocusedField('firstName')}
            onBlur={() => setFocusedField('')}
            className={`mt-1 p-2 border rounded-xl w-full ${errors.first_name ? 'border-red-500' : ''} ${focusedField === 'firstName' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
            required
            disabled={isDisabled("firstName")}
          />
          {renderErrorMessages(errors.first_name)}
        </div>

        {/* Family Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">نام خانوادگی</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onFocus={() => setFocusedField('lastName')}
            onBlur={() => setFocusedField('')}
            className={`mt-1 p-2 border rounded-xl w-full ${errors.last_name ? 'border-red-500' : ''} ${focusedField === 'lastName' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
            required
            disabled={isDisabled("lastName")}
          />
          {renderErrorMessages(errors.last_name)}
        </div>

        {/* National Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">کد ملی</label>
          <input
            type="text"
            value={nationalCode}
            onChange={(e) => setNationalCode(e.target.value)}
            onFocus={() => setFocusedField('nationalCode')}
            onBlur={() => setFocusedField('')}
            className={`mt-1 p-2 border rounded-xl w-full ${errors.national_code ? 'border-red-500' : ''} ${focusedField === 'nationalCode' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
            required
            disabled={isDisabled("nationalCode")}
          />
          {renderErrorMessages(errors.national_code)}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ایمیل</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
            className={`mt-1 p-2 border rounded-xl w-full ${errors.email ? 'border-red-500' : ''} ${focusedField === 'email' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
            disabled={isDisabled("email")}
          />
          {renderErrorMessages(errors.email)}
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-gray-700">استان</label>
          <Listbox value={selectedProvince} onChange={setSelectedProvince} disabled={isVendor} >
            {({ open }) => (
              <div className="relative">
                <div className="relative w-full cursor-pointer">
                  <Listbox.Button
                    className={`block p-2 border rounded-xl w-full text-left flex justify-between items-center ${errors.province_id ? 'border-red-500' : ''} ${focusedField === 'province_id' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
                  >
                    {provinces.find(province => province.id === selectedProvince)?.name || 'انتخاب استان'}
                    <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Listbox.Button>
                  <Listbox.Options className={`absolute mt-2 w-full border rounded-xl bg-white shadow-lg ${open ? 'block z-10' : 'hidden'} max-h-60 overflow-y-auto`}>
                    {provinces.map((province) => (
                      <Listbox.Option key={province.id} value={province.id} className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${province.id === selectedProvince ? 'bg-gray-100' : ''}`}>
                        {province.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </div>
            )}
          </Listbox>
          {renderErrorMessages(errors.province_id)}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700">شهر</label>
          <Listbox value={selectedCity} onChange={setSelectedCity} disabled={!selectedProvince || isDisabled("city")}>
            {({ open }) => (
              <div className="relative">
                <div className="relative w-full cursor-pointer">
                  <Listbox.Button
                    className={`block p-2 border rounded-xl w-full text-left flex justify-between items-center ${errors.city_id ? 'border-red-500' : ''} ${focusedField === 'city_id' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
                  >
                    {cities.find(city => city.id === selectedCity)?.name || 'انتخاب شهر'}
                    <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Listbox.Button>
                  <Listbox.Options className={`absolute mt-2 w-full border rounded-xl bg-white shadow-lg ${open ? 'block z-10' : 'hidden'} max-h-60 overflow-y-auto`}>
                    {cities.map((city) => (
                      <Listbox.Option key={city.id} value={city.id} className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${city.id === selectedCity ? 'bg-gray-100' : ''}`}>
                        {city.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </div>
            )}
          </Listbox>
          {renderErrorMessages(errors.city_id)}
        </div>

        {/* Birth Date */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-700">تاریخ تولد</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              onFocus={() => setFocusedField('birthYear')}
              onBlur={() => setFocusedField('')}
              className={`mt-1 p-2 border rounded-xl w-full ${errors.birth_date ? 'border-red-500' : ''} ${focusedField === 'birthYear' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
              placeholder="سال 1367"
              disabled={isDisabled("birthYear")}
            />
            <input
              type="text"
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              onFocus={() => setFocusedField('birthMonth')}
              onBlur={() => setFocusedField('')}
              className={`mt-1 p-2 border rounded-xl w-full ${errors.birth_date ? 'border-red-500' : ''} ${focusedField === 'birthMonth' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
              placeholder="ماه"
              disabled={isDisabled("birthMonth")}
            />
            <input
              type="text"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              onFocus={() => setFocusedField('birthDay')}
              onBlur={() => setFocusedField('')}
              className={`mt-1 p-2 border rounded-xl w-full ${errors.birth_date ? 'border-red-500' : ''} ${focusedField === 'birthDay' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
              placeholder="روز"
              disabled={isDisabled("birthDay")}
            />
          </div>
          {renderErrorMessages(errors.birth_date)}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700">جنسیت</label>
          <Listbox value={gender} onChange={setGender} disabled={isVendor}>
            {({ open }) => (
              <div className="relative">
                <div className="relative w-full cursor-pointer">
                  <Listbox.Button
                    className={`block p-2 border rounded-xl w-full text-left flex justify-between items-center ${errors.sex ? 'border-red-500' : ''} ${focusedField === 'sex' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
                  >
                    {genderOptions.find(option => option.key === gender)?.label || 'انتخاب جنسیت'}
                    <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Listbox.Button>
                  <Listbox.Options className={`absolute mt-2 w-full border rounded-xl bg-white shadow-lg ${open ? 'block z-10' : 'hidden'} max-h-60 overflow-y-auto`}>
                    {genderOptions.map((option) => (
                      <Listbox.Option key={option.key} value={option.key} className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${option.key === gender ? 'bg-gray-100' : ''}`}>
                        {option.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </div>
            )}
          </Listbox>
          {renderErrorMessages(errors.sex)}
        </div>

        {/* Second Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">شماره دوم</label>
          <input
            type="text"
            value={secondPhone}
            onChange={(e) => setSecondPhone(e.target.value)}
            onFocus={() => setFocusedField('secondPhone')}
            onBlur={() => setFocusedField('')}
            className={`mt-1 p-2 border rounded-xl w-full ${errors.second_phone ? 'border-red-500' : ''} ${focusedField === 'secondPhone' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
            disabled={isDisabled("secondPhone")}
          />
          {renderErrorMessages(errors.second_phone)}
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700">عکس پروفایل</label>
          <input
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="mt-1 p-2 border rounded-xl w-full"
            accept="image/png, image/jpeg"
          />
          {renderErrorMessages(errors.avatar)}
        </div>

        {/* Biography */}
        <div>
          <label className="block text-sm font-medium text-gray-700">درباره شما</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 p-2 border rounded-xl w-full"
            rows="4"
          />
          {renderErrorMessages(errors.bio)}
        </div>

        <button type="submit" className="max-w-44 max-h-12 mt-6 py-2 md:py-0 px-2 bg-green-600 text-white rounded-lg" disabled={loadingSubmit}>
          {loadingSubmit ? 'در حال بارگذاری...' : 'ذخیره اطلاعات'}
        </button>
      </form>
    </div>
  );
};

export default EditUser;
