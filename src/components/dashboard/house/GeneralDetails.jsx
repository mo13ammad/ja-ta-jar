import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const GeneralDetails = ({ data, token, houseUuid }) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    land_size: data?.land_size || "",
    structure_size: data?.structure_size || "",
    house_floor: data?.house_floor || "",
    number_stairs: data?.number_stairs || "",
    description: data?.description || ""
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState("");

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
    <div className="relative md:w-5/6 md:h-5/6">
      <Toaster />
      <div className="overflow-auto scrollbar-thin max-h-[80vh] pr-2 w-full min-h-[70vh]">
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

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">تعداد طبقات</label>
            <input
              type="text"
              value={formData.house_floor}
              onChange={(e) => handleInputChange("house_floor", e.target.value)}
              onFocus={() => setFocusedField('house_floor')}
              onBlur={() => setFocusedField('')}
              className={`block p-2 border rounded-xl w-full ${errors.house_floor ? 'border-red-500' : ''} ${focusedField === 'house_floor' ? 'border-green-400 focus:outline-green-400 border-2' : ''}`}
              placeholder="تعداد طبقات"
            />
            {renderErrorMessages(errors.house_floor)}
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
