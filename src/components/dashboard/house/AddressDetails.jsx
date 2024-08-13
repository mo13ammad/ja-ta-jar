import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const AddressDetails = ({ data, onChange, errors, renderErrorMessages }) => {
 
  // Initialize the state with direct string values
  const [address, setAddress] = useState(data?.address?.address || '');
  const [neighborhood, setNeighborhood] = useState(data?.address?.village_name || '');
  const [floor, setFloor] = useState(data?.address?.floor || '');
  const [plaqueNumber, setPlaqueNumber] = useState(data?.address?.house_number || '');
  const [postalCode, setPostalCode] = useState(data?.address?.postal_code || '');

  const handleAddressChange = (e) => {
    const newValue = e.target.value;
    setAddress(newValue);
    onChange("address", newValue);
  };

  const handleNeighborhoodChange = (e) => {
    const newValue = e.target.value;
    setNeighborhood(newValue);
    onChange("village_name", newValue);
  };

  const handleFloorChange = (e) => {
    const newValue = e.target.value;
    setFloor(newValue);
    onChange("floor", newValue);
  };

  const handlePlaqueNumberChange = (e) => {
    const newValue = e.target.value;
    setPlaqueNumber(newValue);
    onChange("house_number", newValue);
  };

  const handlePostalCodeChange = (e) => {
    const newValue = e.target.value;
    setPostalCode(newValue);
    onChange("postal_code", newValue);
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
              onChange={handleAddressChange}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
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
              onChange={handleNeighborhoodChange}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
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
              onChange={handleFloorChange}
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
              onChange={handlePlaqueNumberChange}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
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
              onChange={handlePostalCodeChange}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="کد پستی"
            />
            {renderErrorMessages(errors.postal_code)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
