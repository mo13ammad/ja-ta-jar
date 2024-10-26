import React, { useState } from 'react';
import { Switch, Disclosure } from '@headlessui/react';

const EditHouseRooms = () => {
  const [rooms, setRooms] = useState([
    {
      roomName: '',
      isMasterRoom: false,
      numberSingleBeds: 0,
      numberDoubleBeds: 0,
      numberSofaBeds: 0,
      numberFloorService: 0,
      description: '',
      selectedFacilities: [],
      selectedAirConditions: [],
      isLivingRoom: false,
    }
  ]);

  const facilitiesOptions = [
    { key: 'wifi', label: 'وای فای' },
    { key: 'tv', label: 'تلویزیون' },
    { key: 'aircon', label: 'تهویه هوا' },
  ];

  const airConditionOptions = [
    { key: 'heater', label: 'بخاری' },
    { key: 'cooler', label: 'کولر' },
  ];

  const addRoom = (isLivingRoom = false) => {
    setRooms((prevRooms) => [
      ...prevRooms,
      {
        roomName: '',
        isMasterRoom: false,
        numberSingleBeds: 0,
        numberDoubleBeds: 0,
        numberSofaBeds: 0,
        numberFloorService: 0,
        description: '',
        selectedFacilities: [],
        selectedAirConditions: [],
        isLivingRoom,
      },
    ]);
  };

  const handleInputChange = (index, key, value) => {
    setRooms((prevRooms) =>
      prevRooms.map((room, i) => (i === index ? { ...room, [key]: value } : room))
    );
  };

  const toggleFacility = (index, key) => {
    setRooms((prevRooms) =>
      prevRooms.map((room, i) =>
        i === index
          ? {
              ...room,
              selectedFacilities: room.selectedFacilities.includes(key)
                ? room.selectedFacilities.filter((facility) => facility !== key)
                : [...room.selectedFacilities, key],
            }
          : room
      )
    );
  };

  const toggleAirCondition = (index, key) => {
    setRooms((prevRooms) =>
      prevRooms.map((room, i) =>
        i === index
          ? {
              ...room,
              selectedAirConditions: room.selectedAirConditions.includes(key)
                ? room.selectedAirConditions.filter((airCondition) => airCondition !== key)
                : [...room.selectedAirConditions, key],
            }
          : room
      )
    );
  };

  return (
    <div className="relative">
      {/* Static Header */}
      <div className="text-center font-bold text-xl my-4">
        اطلاعات اتاق
      </div>

      <button
        onClick={() => addRoom(false)} // Regular room
        className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl mb-4 max-w-36"
      >
        اضافه کردن اتاق
      </button>

      <button
        onClick={() => addRoom(true)} // Living room
        className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl mb-4 max-w-52 mr-2"
      >
        اضافه کردن اتاق پذیرایی
      </button>

      {rooms.map((room, index) => (
        <Disclosure key={index}>
          {({ open }) => (
            <>
              <Disclosure.Button className="py-2 flex justify-between items-center w-full bg-gray-200 rounded-lg px-4 mb-2">
                <span>{room.roomName || `اتاق ${index + 1}`}</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Disclosure.Button>

              <Disclosure.Panel className="p-4 border rounded-lg mb-4">
                {/* Room Name */}
                <div className="mt-4">
                  <label className="block text-lg font-medium text-gray-700 mb-2">نام اتاق</label>
                  <input
                    type="text"
                    value={room.roomName}
                    onChange={(e) => handleInputChange(index, 'roomName', e.target.value)}
                    className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
                    placeholder="نام اتاق"
                  />
                </div>

                {/* Master Room Switch */}
                <div className="mt-4">
                  <Switch.Group as="div" className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Switch
                        checked={room.isMasterRoom}
                        onChange={() => handleInputChange(index, 'isMasterRoom', !room.isMasterRoom)}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ease-in-out duration-200 ml-1
                          ${room.isMasterRoom ? 'bg-green-500' : 'bg-gray-200'}`}
                      >
                        <span
                          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                            room.isMasterRoom ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </Switch>
                      <span className="ml-3 text-sm font-medium text-gray-700">اتاق مستر می باشد</span>
                    </label>
                  </Switch.Group>
                </div>

                {/* Number of Beds */}
                <div className="mt-4">
                  <label className="block text-lg font-medium text-gray-700 mb-2">تعداد تخت‌های یک نفره</label>
                  <input
                    type="number"
                    value={room.numberSingleBeds}
                    onChange={(e) => handleInputChange(index, 'numberSingleBeds', e.target.value)}
                    className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
                  />
                </div>

                {/* Facilities */}
                <div className="mt-4">
                  <label className="block text-lg font-medium text-gray-700 mb-2">امکانات</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {facilitiesOptions.map((option) => (
                      <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <Switch
                            checked={room.selectedFacilities.includes(option.key)}
                            onChange={() => toggleFacility(index, option.key)}
                            className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1
                              ${room.selectedFacilities.includes(option.key) ? 'bg-green-500' : 'bg-gray-200'}`}
                          >
                            {room.selectedFacilities.includes(option.key) && (
                              <svg
                                className="w-4 h-4 text-white absolute inset-0 m-auto"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </Switch>
                          <span className="ml-3 text-sm font-medium text-gray-700">{option.label}</span>
                        </label>
                      </Switch.Group>
                    ))}
                  </div>
                </div>

                {/* Air Conditions */}
                <div className="mt-4">
                  <label className="block text-lg font-medium text-gray-700 mb-2">امکانات سرمایشی و گرمایشی</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {airConditionOptions.map((option) => (
                      <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <Switch
                            checked={room.selectedAirConditions.includes(option.key)}
                            onChange={() => toggleAirCondition(index, option.key)}
                            className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1
                              ${room.selectedAirConditions.includes(option.key) ? 'bg-green-500' : 'bg-gray-200'}`}
                          >
                            {room.selectedAirConditions.includes(option.key) && (
                              <svg
                                className="w-4 h-4 text-white absolute inset-0 m-auto"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </Switch>
                          <span className="ml-3 text-sm font-medium text-gray-700">{option.label}</span>
                        </label>
                      </Switch.Group>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
};

export default EditHouseRooms;
