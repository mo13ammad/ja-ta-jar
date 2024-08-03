import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jalaali from "jalaali-js";
import { Listbox } from "@headlessui/react";

const genderOptions = [
  { key: '', label: 'انتخاب جنسیت' },
  { key: 'Male', label: 'مرد' },
  { key: 'Female', label: 'زن' },
  { key: 'Other', label: 'دیگر' }
];

const genderMap = {
  'مرد': 'Male',
  'زن': 'Female',
  'دیگر': 'Other'
};

const monthOptions = [
  { key: '1', label: 'فروردین' },
  { key: '2', label: 'اردیبهشت' },
  { key: '3', label: 'خرداد' },
  { key: '4', label: 'تیر' },
  { key: '5', label: 'مرداد' },
  { key: '6', label: 'شهریور' },
  { key: '7', label: 'مهر' },
  { key: '8', label: 'آبان' },
  { key: '9', label: 'آذر' },
  { key: '10', label: 'دی' },
  { key: '11', label: 'بهمن' },
  { key: '12', label: 'اسفند' }
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
  const [gender, setGender] = useState(genderMap[user.sex] || "");
  const [secondPhone, setSecondPhone] = useState(user.second_phone || "");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(user.province_id || "");
  const [selectedCity, setSelectedCity] = useState(user.city_id || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState("");
  const [initialGender, setInitialGender] = useState(gender);
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
      try {
        const response = await axios.get("https://portal1.jatajar.com/api/assets/province");
        setProvinces(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        toast.error("خطا در بارگذاری استان‌ها");
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(`https://portal1.jatajar.com/api/assets/province/${selectedProvince}/cities`);
          setCities(response.data.data.cities || []);
        } catch (error) {
          console.error("Error fetching cities:", error);
          toast.error("خطا در بارگذاری شهرها");
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedProvince]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onEditStart();
    setErrors({});

    // Create FormData object
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('_method', "PUT");
    formData.append('last_name', lastName);
    formData.append('national_code', nationalCode);

    // Check and append only if values have changed
    if (email !== user.email) formData.append('email', email);
    if (birthYear || birthMonth || birthDay) {
      const birthDate = persianToGregorian(birthYear, birthMonth, birthDay);
      formData.append('birth_date', birthDate);
    }
    if (secondPhone !== user.second_phone) formData.append('second_phone', secondPhone);
    if (gender !== genderMap[user.sex]) formData.append('sex', gender);
    if (selectedProvince !== user.province_id) formData.append('province_id', selectedProvince);
    if (selectedCity !== user.city_id) formData.append('city_id', selectedCity);
    if (avatar) formData.append('avatar', avatar); // Append the file if provided
    if (bio !== user.bio) formData.append('bio', bio);

    try {
      const response = await axios.post("https://portal1.jatajar.com/api/client/profile", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      onUpdate();
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.errors) {
          setErrors(data.errors.fields || {});
        }
        toast.error(data.message || "An unexpected error occurred.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
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

  return (
    <form onSubmit={handleEditSubmit} className="flex flex-col md:grid grid-cols-2 gap-6 p-1.5">
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
        />
        {renderErrorMessages(errors.email)}
      </div>

      {/* Province */}
      <div>
        <label className="block text-sm font-medium text-gray-700">استان</label>
        <Listbox value={selectedProvince} onChange={setSelectedProvince}>
          {({ open }) => (
            <>
              <div className="relative mt-1">
                <span className="block p-2 border rounded-xl w-full cursor-pointer">
                  {provinces.find(province => province.id === selectedProvince)?.name || 'انتخاب استان'}
                </span>
                <Listbox.Button className="absolute inset-y-0 left-4 flex items-center pr-2">
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
            </>
          )}
        </Listbox>
        {renderErrorMessages(errors.province_id)}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700">شهر</label>
        <Listbox value={selectedCity} onChange={setSelectedCity} disabled={!selectedProvince}>
          {({ open }) => (
            <>
              <div className="relative mt-1">
                <span className="block p-2 border rounded-xl w-full cursor-pointer">
                  {cities.find(city => city.id === selectedCity)?.name || 'انتخاب شهر'}
                </span>
                <Listbox.Button className="absolute inset-y-0 left-4 flex items-center pr-2">
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
            </>
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
            placeholder="سال"
          />
          <Listbox value={birthMonth} onChange={setBirthMonth}>
            {({ open }) => (
              <>
                <div className="relative mt-1 w-full">
                  <span className="block p-2 border rounded-xl w-full cursor-pointer">
                    {monthOptions.find(option => option.key === birthMonth)?.label || 'ماه'}
                  </span>
                  <Listbox.Button className="absolute inset-y-0 left-4 flex items-center pr-2">
                    <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Listbox.Button>
                  <Listbox.Options className={`absolute mt-2 w-full border rounded-xl bg-white shadow-lg ${open ? 'block z-10' : 'hidden'} max-h-60 overflow-y-auto`}>
                    {monthOptions.map((option) => (
                      <Listbox.Option key={option.key} value={option.key} className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${option.key === birthMonth ? 'bg-gray-100' : ''}`}>
                        {option.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </>
            )}
          </Listbox>
          <input
            type="text"
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
            onFocus={() => setFocusedField('birthDay')}
            onBlur={() => setFocusedField('')}
            className={`mt-1 p-2 border rounded-xl w-full ${errors.birth_date ? 'border-red-500' : ''} ${focusedField === 'birthDay' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
            placeholder="روز"
          />
        </div>
        {renderErrorMessages(errors.birth_date)}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700">جنسیت</label>
        <Listbox value={gender} onChange={setGender}>
          {({ open }) => (
            <>
              <div className="relative mt-1">
                <span className="block p-2 border rounded-xl w-full cursor-pointer">
                  {genderOptions.find(option => option.key === gender)?.label || 'انتخاب جنسیت'}
                </span>
                <Listbox.Button className="absolute inset-y-0 left-4 flex items-center pr-2">
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
            </>
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

      <button type="submit" className="max-w-44 max-h-12  mt-6  py-2 md:py-0 px-2 bg-green-600 text-white rounded-lg" disabled={loading}>
        {loading ? 'در حال بارگذاری...' : 'ذخیره اطلاعات'}
      </button>
    </form>
  );
};

export default EditUser;
