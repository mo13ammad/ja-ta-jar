import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const AddressDetails = ({ data, token, houseUuid }) => {
  const [address, setAddress] = useState(data?.address?.address || '');
  const [neighborhood, setNeighborhood] = useState(data?.address?.village || '');
  const [floor, setFloor] = useState(data?.address?.floor || '');
  const [plaqueNumber, setPlaqueNumber] = useState(data?.address?.house_number || '');
  const [postalCode, setPostalCode] = useState(data?.address?.postal_code || '');
  const [errors, setErrors] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    setErrors({});

    const requestData = {
      address,
      village_name: neighborhood,
      floor,
      house_number: plaqueNumber,
      postal_code: postalCode,
      _method: 'PUT',
    };

    try {
      const response = await axios.post(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("آدرس با موفقیت به‌روزرسانی شد");
      } else {
        toast.error("خطایی رخ داده است");
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
          {/* Address */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">آدرس اقامتگاه</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onFocus={() => setFocusedField('address')}
              onBlur={() => setFocusedField('')}
              className={`block p-2 border outline-none focus:border-2 rounded-xl w-full ${errors.address ? 'border-red-500' : ''} ${focusedField === 'address' ? 'border-green-400  border-2' : ''}`}
              placeholder="آدرس اقامتگاه"
            />
            {renderErrorMessages(errors.address)}
          </div>

          {/* Neighborhood */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">روستا / محله</label>
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              onFocus={() => setFocusedField('neighborhood')}
              onBlur={() => setFocusedField('')}
              className={`block p-2 border outline-none focus:border-2 rounded-xl w-full ${errors.village_name ? 'border-red-500' : ''} ${focusedField === 'neighborhood' ? 'border-green-400  border-2' : ''}`}
              placeholder="روستا / محله"
            />
            {renderErrorMessages(errors.village_name)}
          </div>

          {/* Floor */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">اقامتگاه در طبقه</label>
            <input
              type="text"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              onFocus={() => setFocusedField('floor')}
              onBlur={() => setFocusedField('')}
              className={`block p-2 border outline-none focus:border-2 rounded-xl w-full ${errors.floor ? 'border-red-500' : ''} ${focusedField === 'floor' ? 'border-green-400  border-2' : ''}`}
              placeholder="اقامتگاه در طبقه"
            />
            {renderErrorMessages(errors.floor)}
          </div>

          {/* Plaque Number */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">شماره پلاک</label>
            <input
              type="text"
              value={plaqueNumber}
              onChange={(e) => setPlaqueNumber(e.target.value)}
              onFocus={() => setFocusedField('plaqueNumber')}
              onBlur={() => setFocusedField('')}
              className={`block p-2 border outline-none focus:border-2 rounded-xl w-full ${errors.house_number ? 'border-red-500' : ''} ${focusedField === 'plaqueNumber' ? 'border-green-400  border-2' : ''}`}
              placeholder="شماره پلاک"
            />
            {renderErrorMessages(errors.house_number)}
          </div>

          {/* Postal Code */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">کد پستی</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              onFocus={() => setFocusedField('postalCode')}
              onBlur={() => setFocusedField('')}
              className={`block p-2 border outline-none focus:border-2 rounded-xl w-full ${errors.postal_code ? 'border-red-500' : ''} ${focusedField === 'postalCode' ? 'border-green-400  border-2' : ''}`}
              placeholder="کد پستی"
            />
            {renderErrorMessages(errors.postal_code)}
          </div>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-xl mt-4"
          onClick={handleSubmit}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "در حال ارسال..." : "ثبت آدرس"}
        </button>
      </div>
    </div>
  );
};

export default AddressDetails;
