import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Listbox } from "@headlessui/react";

const GeneralDetails = ({ data, token, houseUuid }) => {
  const [houseFloorOptions, setHouseFloorOptions] = useState([]);
  const [privacyOptions, setPrivacyOptions] = useState([]);

  const [formData, setFormData] = useState({
    name: data?.name || "",
    land_size: data?.structure?.land_size || "",
    structure_size: data?.structure?.size || "",
    house_floor: data?.house_floor || "",
    number_stairs: data?.structure?.number_stairs || "",
    description: data?.description || "",
    tip: "", // Initially empty, will be set in useEffect
    privacy: "" // Initially empty, will be set in useEffect
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [houseFloorRes, privacyRes] = await Promise.all([
          axios.get('https://portal1.jatajar.com/api/assets/types/tip/detail', {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }),
          axios.get('https://portal1.jatajar.com/api/assets/types/privacy/detail', {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          })
        ]);

        if (houseFloorRes.status === 200) {
          setHouseFloorOptions(houseFloorRes.data.data);
        }

        if (privacyRes.status === 200) {
          setPrivacyOptions(privacyRes.data.data);
        }

        // Set initial values based on fetched options and existing data
        setFormData((prev) => ({
          ...prev,
          tip: data?.tip?.key || "",
          privacy: data?.privacy?.key || ""
        }));
      } catch (error) {
        toast.error("Error fetching options");
      }
    };

    fetchOptions();
  }, [token, data]);

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    setErrors({});

    try {
      const response = await axios.post(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}`,
        {
          ...formData,
          _method: "PUT",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("اطلاعات با موفقیت ثبت شد");
      } else {
        toast.error("خطایی در ثبت اطلاعات پیش آمد");
      }
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
    <div className="relative">
      <Toaster />
      <div className="overflow-auto scrollbar-thin max-h-[70vh] pr-2 w-full min-h-[70vh]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">نام اقامتگاه</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField('')}
              className={`block p-2 border rounded-xl w-full ${errors.name ? 'border-red-500' : ''} ${focusedField === 'name' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
              placeholder="نام اقامتگاه"
            />
            {renderErrorMessages(errors.name)}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">متراژ کل</label>
            <input
              type="text"
              value={formData.land_size}
              onChange={(e) => handleInputChange("land_size", e.target.value)}
              onFocus={() => setFocusedField('land_size')}
              onBlur={() => setFocusedField('')}
              className={`block p-2 border rounded-xl w-full ${errors.land_size ? 'border-red-500' : ''} ${focusedField === 'land_size' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
              placeholder="متراژ کل"
            />
            {renderErrorMessages(errors.land_size)}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">متراژ زیر بنا</label>
            <input
              type="text"
              value={formData.structure_size}
              onChange={(e) => handleInputChange("structure_size", e.target.value)}
              onFocus={() => setFocusedField('structure_size')}
              onBlur={() => setFocusedField('')}
              className={`block p-2 border rounded-xl w-full ${errors.structure_size ? 'border-red-500' : ''} ${focusedField === 'structure_size' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
              placeholder="متراژ زیر بنا"
            />
            {renderErrorMessages(errors.structure_size)}
          </div>

          {/* Tip (House Floor Type) Dropdown */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">تعداد طبقات</label>
            <Listbox value={formData.tip} onChange={(value) => handleInputChange('tip', value)}>
              {({ open }) => (
                <div className="relative">
                  <div className="relative w-full cursor-pointer">
                    <Listbox.Button
                      className={`block p-2 border rounded-xl w-full text-left flex justify-between items-center ${errors.tip ? 'border-red-500' : ''} ${focusedField === 'tip' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
                    >
                      {houseFloorOptions.find(option => option.key === formData.tip)?.label || 'انتخاب نوع'}
                      <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </Listbox.Button>
                    <Listbox.Options className={`absolute mt-2 w-full border rounded-xl bg-white shadow-lg ${open ? 'block z-10' : 'hidden'} max-h-60 overflow-y-auto`}>
                      {houseFloorOptions.map(option => (
                        <Listbox.Option key={option.key} value={option.key} className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${option.key === formData.tip ? 'bg-gray-100' : ''}`}>
                          <span>{option.label}</span>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </div>
              )}
            </Listbox>
            {renderErrorMessages(errors.tip)}
          </div>

          {/* Privacy Dropdown */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت حریم</label>
            <Listbox value={formData.privacy} onChange={(value) => handleInputChange('privacy', value)}>
              {({ open }) => (
                <div className="relative">
                  <div className="relative w-full cursor-pointer">
                    <Listbox.Button
                      className={`block p-2 border rounded-xl w-full text-left flex justify-between items-center ${errors.privacy ? 'border-red-500' : ''} ${focusedField === 'privacy' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
                    >
                      {privacyOptions.find(option => option.key === formData.privacy)?.label || 'انتخاب حریم'}
                      <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </Listbox.Button>
                    <Listbox.Options className={`absolute mt-2 w-full border rounded-xl bg-white shadow-lg ${open ? 'block z-10' : 'hidden'} max-h-60 overflow-y-auto`}>
                      {privacyOptions.map(option => (
                        <Listbox.Option key={option.key} value={option.key} className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${option.key === formData.privacy ? 'bg-gray-100' : ''}`}>
                          <span>{option.label}</span>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </div>
              )}
            </Listbox>
            {renderErrorMessages(errors.privacy)}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">تعداد پله</label>
            <input
              type="text"
              value={formData.number_stairs}
              onChange={(e) => handleInputChange("number_stairs", e.target.value)}
              onFocus={() => setFocusedField('number_stairs')}
              onBlur={() => setFocusedField('')}
              className={`block p-2 border rounded-xl w-full ${errors.number_stairs ? 'border-red-500' : ''} ${focusedField === 'number_stairs' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
              placeholder="تعداد پله"
            />
            {renderErrorMessages(errors.number_stairs)}
          </div>

          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField('')}
              className={`block p-2 border rounded-xl w-full ${errors.description ? 'border-red-500' : ''} ${focusedField === 'description' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
              placeholder="توضیحات"
            />
            {renderErrorMessages(errors.description)}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? 'در حال بارگذاری...' : 'ثبت اطلاعات'}
        </button>
      </div>
    </div>
  );
};

export default GeneralDetails;
