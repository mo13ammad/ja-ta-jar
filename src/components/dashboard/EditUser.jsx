import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jalaali from "jalaali-js";
import { Listbox } from "@headlessui/react";
import Spinner from "../Spinner"; // Import Spinner component

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

const persianToGregorian = (persianDate) => {
  if (!persianDate) return "";
  const [year, month, day] = persianDate.split('/');
  const gregorianDate = jalaali.toGregorian(parseInt(year), parseInt(month), parseInt(day));
  return `${gregorianDate.gy}-${String(gregorianDate.gm).padStart(2, '0')}-${String(gregorianDate.gd).padStart(2, '0')}`;
};

const gregorianToPersian = (gregorianDate) => {
  if (!gregorianDate) return "";
  const [year, month, day] = gregorianDate.split('-');
  const persianDate = jalaali.toJalaali(parseInt(year), parseInt(month), parseInt(day));
  return `${persianDate.jy}/${String(persianDate.jm).padStart(2, '0')}/${String(persianDate.jd).padStart(2, '0')}`;
};

const EditUser = ({ user, token, onUpdate, onEditStart, onEditEnd }) => {
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [nationalCode, setNationalCode] = useState(user.national_code || "");
  const [email, setEmail] = useState(user.email || "");
  const [birthDate, setBirthDate] = useState(gregorianToPersian(user.birth_date) || "");
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

  useEffect(() => {
    setFirstName(user.first_name || "");
    setLastName(user.last_name || "");
    setNationalCode(user.national_code || "");
    setEmail(user.email || "");
    setBirthDate(gregorianToPersian(user.birth_date) || "");
    setGender(genderMap[user.sex] || "");
    setSecondPhone(user.second_phone || "");
    setSelectedProvince(user.province_id || "");
    setSelectedCity(user.city_id || "");
    setInitialGender(genderMap[user.sex] || "");
  }, [user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onEditStart();
    setErrors({});

    try {
      const updateData = {
        first_name: firstName,
        last_name: lastName,
        national_code: nationalCode,
        email,
        birth_date: persianToGregorian(birthDate),
        second_phone: secondPhone,
        ...(gender && gender !== initialGender && gender !== '' && { sex: gender }), // Include gender only if changed and valid
        ...(selectedCity && { city_id: selectedCity })
      };

      const response = await axios.put("https://portal1.jatajar.com/api/client/profile", updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log("API response:", response.data);
      onUpdate();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error during profile update:", error);
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
    <form onSubmit={handleEditSubmit} className="flex flex-col items-end p-1.5">
      <div className="opacity-90 text-lg font-bold mb-5 self-start">ویرایش پروفایل</div>
      <div className="flex flex-col sm:grid grid-cols-2 gap-5 w-full">

        {/* name: */}
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

         {/* family name */}
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
          
          {/* national code */}
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
            required
          />
          {renderErrorMessages(errors.email)}
        </div>

             {/* province */}
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
                  <Listbox.Options className={`absolute mt-2 w-3/5 border rounded-xl bg-white shadow-lg ${open ? 'block z-10' : 'hidden'} max-h-60 overflow-y-auto`}>
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
         
            {/* city */}
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
                  <Listbox.Options className={`absolute mt-2 w-3/5 border rounded-xl bg-white shadow-lg ${open ? 'block z-10' : 'hidden'} max-h-60 overflow-y-auto`}>
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

          {/* birth Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">تاریخ تولد</label>
          <input
            type="text"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            onFocus={() => setFocusedField('birthDate')}
            onBlur={() => setFocusedField('')}
            className={`mt-1 p-2 border rounded-xl w-full ${errors.birth_date ? 'border-red-500' : ''} ${focusedField === 'birthDate' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
            placeholder="YYYY/MM/DD"
            required
          />
          {renderErrorMessages(errors.birth_date)}
        </div>

         {/* gender */}
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
                  <Listbox.Options className={`absolute mt-2 w-3/5 border rounded-xl bg-white shadow-lg ${open ? 'block z-10' : 'hidden'} max-h-60 overflow-y-auto`}>
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

           {/* second phone */}
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

       

        <button type="submit" className={`w-1/2 mt-4 py-2 md:py-0  px-2 bg-green-600 text-white rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
          ذخیره اطلاعات
        </button>
      </div>
    </form>
  );
};

export default EditUser;
