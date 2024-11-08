// src/components/edithouse-components/EditHouseRooms.jsx

import React, { useState, useEffect } from 'react';
import { Disclosure, Dialog } from '@headlessui/react';
import Spinner from '../../../../ui/Loading';
import TextField from '../../../../ui/TextField';
import TextArea from '../../../../ui/TextArea';
import ToggleSwitch from '../../../../ui/ToggleSwitch';
import ToggleSwitchGroup from '../../../../ui/ToggleSwitchGroup';
import { useFetchRoomFacilities, useFetchCoolingAndHeatingOptions } from '../../../../services/fetchDataService';
import { toast, Toaster } from 'react-hot-toast';
import { createRoom, editRoom, deleteRoom } from '../../../../services/houseService';

const EditHouseRooms = ({ houseData, houseId, refetchHouseData }) => {
  const [rooms, setRooms] = useState([]);
  const [hasLivingRoom, setHasLivingRoom] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { data: facilitiesData = [], isLoading: loadingFacilities } = useFetchRoomFacilities();
  const { data: airConditionData = [], isLoading: loadingAirConditions } = useFetchCoolingAndHeatingOptions();

  useEffect(() => {
    if (houseData?.room) {
      console.log('Received house data:', houseData);
      const initialRooms = houseData.room.map((room) => ({
        roomName: room.name || '',
        isMasterRoom: room.is_master || false,
        numberSingleBeds: room.number_single_beds || 0,
        numberDoubleBeds: room.number_double_beds || 0,
        numberSofaBeds: room.number_sofa_beds || 0,
        numberFloorService: room.number_floor_service || 0,
        description: room.description || '',
        selectedFacilities: room.facilities?.map((f) => f.key) || [],
        selectedAirConditions: room.airConditions?.map((a) => a.key) || [],
        isLivingRoom: room.is_living_room || false,
        uuid: room.uuid || null,
      }));
      setRooms(initialRooms.reverse());
      setHasLivingRoom(initialRooms.some((room) => room.isLivingRoom));
    }
  }, [houseData]);

  const addRoom = (isLivingRoom = false) => {
    console.log(`Adding a new ${isLivingRoom ? 'living room' : 'room'}`);
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
    if (isLivingRoom) setHasLivingRoom(true);
  };

  const handleInputChange = (index, key, value) => {
    console.log(`Updating room index ${index}, setting ${key} to:`, value);
    setRooms((prevRooms) =>
      prevRooms.map((room, i) => (i === index ? { ...room, [key]: value } : room))
    );
  };

  const toggleSelection = (index, type, key) => {
    const keyName = type === 'facility' ? 'selectedFacilities' : 'selectedAirConditions';
    console.log(`Toggling ${type} with key ${key} for room index ${index}`);
    setRooms((prevRooms) =>
      prevRooms.map((room, i) =>
        i === index
          ? {
              ...room,
              [keyName]: room[keyName].includes(key)
                ? room[keyName].filter((item) => item !== key)
                : [...room[keyName], key],
            }
          : room
      )
    );
  };

  const handleRoomSubmit = async (index) => {
    const roomData = rooms[index];
    const payload = {
      name: roomData.roomName,
      is_master: roomData.isMasterRoom,
      is_living_room: roomData.isLivingRoom ? 1 : 0,
      number_single_beds: roomData.numberSingleBeds,
      number_double_beds: roomData.numberDoubleBeds,
      number_sofa_beds: roomData.numberSofaBeds,
      number_floor_service: roomData.numberFloorService,
      description: roomData.description,
      facilities: roomData.selectedFacilities,
      airConditions: roomData.selectedAirConditions,
    };

    console.log('Submitting room data with payload:', payload);
    setLoadingSubmit(true);

    try {
      if (roomData.uuid) {
        console.log('Updating existing room with UUID:', roomData.uuid);
        await editRoom(houseId, roomData.uuid, payload);
      } else {
        console.log('Creating a new room');
        await createRoom(houseId, payload);
      }
      refetchHouseData();
      toast.success('اتاق با موفقیت ثبت شد');
    } catch (error) {
      console.error('Error submitting room:', error);
      toast.error('خطا در ثبت اتاق');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setIsModalOpen(true);
    console.log('Preparing to delete room at index:', index);
  };

  const handleDelete = async () => {
    const roomData = rooms[deleteIndex];
    console.log('Deleting room data:', roomData);
    setLoadingDelete(true);

    if (!roomData.uuid) {
      setRooms((prevRooms) => prevRooms.filter((_, i) => i !== deleteIndex));
      setIsModalOpen(false);
      setLoadingDelete(false);
      return;
    }

    try {
      console.log('Deleting room with UUID:', roomData.uuid);
      await deleteRoom(houseId, roomData.uuid);
      refetchHouseData();
      setRooms((prevRooms) => prevRooms.filter((_, i) => i !== deleteIndex));
      toast.success('اتاق با موفقیت حذف شد');
      if (roomData.isLivingRoom) setHasLivingRoom(false);
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('خطا در حذف اتاق');
    } finally {
      setLoadingDelete(false);
      setIsModalOpen(false);
    }
  };

  if (loadingFacilities || loadingAirConditions) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative">
      <Toaster />
      <div className="text-right font-bold lg:text-lg mb-2 px-4">اطلاعات اتاق‌ها :</div>
      <div className="w-full px-4 flex justify-end">
        <button
          onClick={() => addRoom(false)}
          className="bg-primary-600 text-xs md:text-sm cursor-pointer text-white px-4 py-2 rounded-2xl shadow-centered mr-2"
        >
          اضافه کردن اتاق
        </button>
        <button
          onClick={() => addRoom(true)}
          className={`bg-primary-600 text-xs md:text-sm cursor-pointer text-white px-4 py-2 rounded-2xl shadow-centered ${
            hasLivingRoom ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={hasLivingRoom}
        >
          اضافه کردن اتاق پذیرایی
        </button>
      </div>
      <div className="overflow-auto scrollbar-thin max-h-[70vh] pt-2 px-2 lg:px-4 w-full min-h-[70vh]">
        {rooms.map((room, index) => (
          <Disclosure key={index}>
            {({ open }) => (
              <>
                <Disclosure.Button className="py-2 flex justify-between items-center w-full bg-white mt-2 shadow-centered rounded-xl px-4 mb-2">
                  <span>{room.roomName || `اتاق ${rooms.length - index}`}</span>
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

                <Disclosure.Panel className="p-4 rounded-xl mb-4 bg-white shadow-centered shadow-sm">
                  <TextField
                    label="نام اتاق"
                    name="roomName"
                    value={room.roomName}
                    onChange={(e) => handleInputChange(index, 'roomName', e.target.value)}
                    placeholder="نام اتاق"
                  />

                  <div className="my-3">
                    <ToggleSwitch
                      checked={room.isMasterRoom}
                      onChange={() => handleInputChange(index, 'isMasterRoom', !room.isMasterRoom)}
                      label="اتاق مستر می باشد"
                    />
                  </div>

                  <TextField
                    label="تعداد تخت‌های یک نفره"
                    name="numberSingleBeds"
                    type="number"
                    value={room.numberSingleBeds}
                    onChange={(e) => handleInputChange(index, 'numberSingleBeds', e.target.value)}
                  />

                  <ToggleSwitchGroup
                    label="امکانات"
                    options={facilitiesData}
                    selectedOptions={room.selectedFacilities}
                    onChange={(key) => toggleSelection(index, 'facility', key)}
                  />

                  <ToggleSwitchGroup
                    label="امکانات سرمایشی و گرمایشی"
                    options={airConditionData}
                    selectedOptions={room.selectedAirConditions}
                    onChange={(key) => toggleSelection(index, 'airCondition', key)}
                  />

                  <TextArea
                    label="توضیحات"
                    name="description"
                    value={room.description}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    placeholder="توضیحات اتاق"
                    className="mt-4"
                  />

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleRoomSubmit(index)}
                      className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl"
                      disabled={loadingSubmit}
                    >
                      {loadingSubmit ? 'در حال ارسال...' : room.uuid ? 'ثبت تغییرات' : 'ثبت اتاق'}
                    </button>
                    {room.uuid && (
                      <button
                        onClick={() => confirmDelete(index)}
                        className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl"
                        disabled={loadingDelete}
                      >
                        {loadingDelete ? 'در حال حذف...' : 'حذف اتاق'}
                      </button>
                    )}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <Dialog.Title className="text-lg font-medium">آیا مطمئن هستید که می‌خواهید اتاق را حذف کنید؟</Dialog.Title>
            <div className="mt-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl mr-4"
                disabled={loadingDelete}
              >
                {loadingDelete ? 'در حال حذف...' : 'بله حذف کن'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl"
              >
                لغو
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default EditHouseRooms;
