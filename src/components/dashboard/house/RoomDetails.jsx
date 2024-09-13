import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Switch, Disclosure, Dialog } from '@headlessui/react';
import Spinner from './Spinner'; // Assuming you have a Spinner component

const RoomDetails = ({ token, houseUuid, houseData, onSubmit }) => {
  const [loading, setLoading] = useState(true); // Manage loading state
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Manage delete loading state
  const [rooms, setRooms] = useState([]); // Manage multiple room forms
  const [facilitiesOptions, setFacilitiesOptions] = useState([]);
  const [airConditionOptions, setAirConditionOptions] = useState([]);
  const [hasLivingRoom, setHasLivingRoom] = useState(false); // Track if a living room has been created
  const [deleteIndex, setDeleteIndex] = useState(null); // Store the index of the room to delete
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility

  useEffect(() => {
    // Initialize rooms based on houseData.room
    if (houseData && houseData.room) {
      const initialRooms = houseData.room.map((r) => ({
        roomName: r.name || '',
        isMasterRoom: r.is_master || false,
        numberSingleBeds: r.number_single_beds || 0,
        numberDoubleBeds: r.number_double_beds || 0,
        numberSofaBeds: r.number_sofa_beds || 0,
        numberFloorService: r.number_floor_service || 0,
        description: r.description || '',
        selectedFacilities: r.facilities?.map((facility) => facility.key) || [], // Map facility keys
        selectedAirConditions: r.airConditions?.map((airCondition) => airCondition.key) || [], // Map air condition keys
        isLivingRoom: r.is_living_room || false,
        uuid: r.uuid || null,
      }));
      setRooms(initialRooms);

      // If there's already a living room, disable the button
      setHasLivingRoom(initialRooms.some((room) => room.isLivingRoom));
    }

    // Check if token is available
    if (!token) {
      toast.error('توکن معتبر نیست');
      return;
    }

    // Fetch facilities and air conditioning options
    const fetchOptions = async () => {
      try {
        const [facilitiesRes, airConditionsRes] = await Promise.all([
          axios.get('https://portal1.jatajar.com/api/assets/types/roomFacilities/detail', {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          }),
          axios.get('https://portal1.jatajar.com/api/assets/types/coolingAndHeating/detail', {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          }),
        ]);

        if (facilitiesRes.status === 200) {
          setFacilitiesOptions(facilitiesRes.data.data);
        }

        if (airConditionsRes.status === 200) {
          setAirConditionOptions(airConditionsRes.data.data);
        }
      } catch (error) {
        toast.error('خطا در دریافت داده‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [token, houseData]);

  // Add new room dropdown
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
        uuid: null,
      },
    ]);

    if (isLivingRoom) {
      setHasLivingRoom(true); // Disable the button once a living room is created
    }
  };

  const handleInputChange = (index, key, value) => {
    setRooms((prevRooms) =>
      prevRooms.map((room, i) =>
        i === index ? { ...room, [key]: value } : room
      )
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
                ? room.selectedAirConditions.filter(
                    (airCondition) => airCondition !== key
                  )
                : [...room.selectedAirConditions, key],
            }
          : room
      )
    );
  };

  const handleSubmit = async (index) => {
    setLoadingSubmit(true);
    const roomData = rooms[index];

    const requestData = {
      name: roomData.roomName,
      is_master: roomData.isMasterRoom,
      is_living_room: roomData.isLivingRoom ? 1 : 0, // Set based on the room type
      number_single_beds: roomData.numberSingleBeds,
      number_double_beds: roomData.numberDoubleBeds,
      number_sofa_beds: roomData.numberSofaBeds,
      number_floor_service: roomData.numberFloorService,
      description: roomData.description,
      facilities: roomData.selectedFacilities, // Send the selected facility keys
      airConditions: roomData.selectedAirConditions, // Send the selected air condition keys
    };

    // Log the data being sent
    console.log('Sending room data:', requestData);

    try {
      let response;
      if (roomData.uuid) {
        // PUT request for updating existing room
        response = await axios.put(
          `https://portal1.jatajar.com/api/client/house/${houseUuid}/room/${roomData.uuid}`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        // POST request for creating new room
        response = await axios.post(
          `https://portal1.jatajar.com/api/client/house/${houseUuid}/room`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      // Log the response
      console.log('Received response data:', response.data);

      if (response.status === 200) {
        toast.success('اتاق با موفقیت ثبت شد');
        onSubmit(); // Call the onSubmit prop to update the houseData
      } else {
        toast.error('خطا در ثبت اطلاعات');
      }
    } catch (error) {
      toast.error('متاسفانه مشکلی پیش آمده است');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index); // Set the room index to delete
    setIsModalOpen(true); // Open the confirmation modal
  };

  const handleDelete = async () => {
    setIsDeleting(true); // Start the delete loading state
    const roomData = rooms[deleteIndex];

    if (!roomData.uuid) {
      // Remove from frontend if the room has not been created yet
      setRooms((prevRooms) => prevRooms.filter((_, i) => i !== deleteIndex));
      setIsModalOpen(false); // Close the modal
      setIsDeleting(false); // Stop the delete loading state
      return;
    }

    try {
      const response = await axios.delete(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}/room/${roomData.uuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Log the response
      console.log('Delete response data:', response.data);

      if (response.status === 200) {
        toast.success('اتاق با موفقیت حذف شد');
        setRooms((prevRooms) => prevRooms.filter((_, i) => i !== deleteIndex));
        onSubmit(); // Update houseData after deletion
      } else {
        toast.error('خطا در حذف اتاق');
      }
    } catch (error) {
      toast.error('متاسفانه مشکلی پیش آمده است');
    } finally {
      setIsModalOpen(false); // Close the modal
      setIsDeleting(false); // Stop the delete loading state
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <Toaster />
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner /> {/* Spinner for loading state */}
        </div>
      ) : (
        <>
          <div>
            <button
              onClick={() => addRoom(false)} // Regular room
              className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl mb-4 max-w-36"
            >
              اضافه کردن اتاق
            </button>

            <button
              onClick={() => addRoom(true)} // Living room
              className={`bg-blue-600 truncate cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl mb-4 max-w-52 mr-2 ${
                hasLivingRoom ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={hasLivingRoom}
            >
              اضافه کردن اتاق پذیرایی
            </button>
          </div>
          {rooms.map((room, index) => (
            <Disclosure key={index}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="py-2 flex justify-between items-center w-full bg-gray-200 rounded-lg px-4 mb-2">
                    <span>
                      {room.roomName || `اتاق ${index + 1}`}
                      {room.isLivingRoom && (
                        <span className="mr-2 text-blue-500">(پذیرایی)</span> // Living room tag
                      )}
                    </span>
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
                                room.isMasterRoom ? '-translate-x-6' : '-translate-x-1'
                              }`}
                            />
                          </Switch>
                          <span className="ml-3 text-sm font-medium text-gray-700">اتاق دارای مستر می باشد</span>
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

                    <div className="mt-4">
                      <label className="block text-lg font-medium text-gray-700 mb-2">تعداد تخت‌های دو نفره</label>
                      <input
                        type="number"
                        value={room.numberDoubleBeds}
                        onChange={(e) => handleInputChange(index, 'numberDoubleBeds', e.target.value)}
                        className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-lg font-medium text-gray-700 mb-2">تعداد مبل‌های تخت خواب شو</label>
                      <input
                        type="number"
                        value={room.numberSofaBeds}
                        onChange={(e) => handleInputChange(index, 'numberSofaBeds', e.target.value)}
                        className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-lg font-medium text-gray-700 mb-2">تعداد تشک‌های خواب</label>
                      <input
                        type="number"
                        value={room.numberFloorService}
                        onChange={(e) => handleInputChange(index, 'numberFloorService', e.target.value)}
                        className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
                      />
                    </div>

                    {/* Room Description */}
                    <div className="mt-4">
                      <label className="block text-lg font-medium text-gray-700 mb-2">توضیحات اتاق</label>
                      <textarea
                        value={room.description}
                        onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                        className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
                        placeholder="امکاناتی که می‌خواهید میهمانان آن‌ها را ببینند"
                      />
                    </div>

                    {/* Facilities (Checkbox) */}
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

                    {/* Air Conditions (Checkbox) */}
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

                    {/* Submit / Update & Delete Buttons */}
                    <div className="mt-4 flex gap-1">
                      <button
                        onClick={() => handleSubmit(index)}
                        className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl"
                        disabled={loadingSubmit}
                      >
                        {loadingSubmit ? 'در حال بارگذاری...' : room.uuid ? 'ثبت تغییرات اقامتگاه' : 'ثبت اتاق'}
                      </button>

                      {room.uuid && (
                        <button
                          onClick={() => confirmDelete(index)}
                          className="bg-red-600 cursor-pointer text-white px-4 py-2 mr-1.5 rounded-xl shadow-xl"
                          disabled={loadingSubmit}
                        >
                          حذف اتاق
                        </button>
                      )}
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}

          {/* Confirmation Modal */}
          <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <Dialog.Title className="text-lg font-medium">آیا مطمعن هستید که می‌خواهید اتاق را حذف کنید؟</Dialog.Title>
                <div className="mt-4">
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl mr-4"
                    disabled={isDeleting} // Disable button during delete
                  >
                    {isDeleting ? 'در حال حذف ...' : 'بله حذفش کن'}
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-xl mr-2 shadow-xl"
                  >
                    لغو
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default RoomDetails;
