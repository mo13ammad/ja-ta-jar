import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

const AddressDetails = () => {
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [floor, setFloor] = useState('');
  const [plaqueNumber, setPlaqueNumber] = useState('');
  const [errors, setErrors] = useState({ address: null, neighborhood: null, floor: null, plaqueNumber: null });

  const renderErrorMessages = (error) => {
    return error ? <div className="text-red-500 text-sm">{error}</div> : null;
  };

  return (
    <div className="relative w-5/6 h-5/6">
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
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full "
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
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="روستا / محله"
            />
            {renderErrorMessages(errors.neighborhood)}
          </div>

          {/* Floor */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">اقامتگاه در طبقه</label>
            <input
              type="text"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
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
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="شماره پلاک"
            />
            {renderErrorMessages(errors.plaqueNumber)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
