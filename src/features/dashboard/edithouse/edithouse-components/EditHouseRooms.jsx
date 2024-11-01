import React, { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import Spinner from '../../../../ui/Loading';
import TextField from '../../../../ui/TextField';
import TextArea from '../../../../ui/TextArea';
import ToggleSwitch from '../../../../ui/ToggleSwitch';
import ToggleSwitchGroup from '../../../../ui/ToggleSwitchGroup';
import { useFetchRoomFacilities, useFetchCoolingAndHeatingOptions } from '../../../../services/fetchDataService';

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
    },
  ]);

  const { data: facilitiesOptions = [], isLoading: loadingFacilities } = useFetchRoomFacilities();
  const { data: airConditionOptions = [], isLoading: loadingAirConditions } = useFetchCoolingAndHeatingOptions();

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

  const toggleSelection = (index, type, key) => {
    const keyName = type === 'facility' ? 'selectedFacilities' : 'selectedAirConditions';
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

  const toggleMasterRoom = (index) => {
    setRooms((prevRooms) =>
      prevRooms.map((room, i) =>
        i === index
          ? { ...room, isMasterRoom: !room.isMasterRoom }
          : { ...room, isMasterRoom: false } // Ensure only one master room at a time
      )
    );
  };

  if (loadingFacilities || loadingAirConditions) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative ">
      <div className="text-center font-bold text-xl my-4">اطلاعات اتاق</div>

<div className='w-full  px-4 flex justify-end'>
      <button
        onClick={() => addRoom(false)}
        className="bg-primary-600 cursor-pointer text-white px-4 py-2  rounded-xl shadow-xl max-w-36"
      >
        اضافه کردن اتاق
      </button>

      <button
        onClick={() => addRoom(true)}
        className="bg-primary-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl max-w-52 mr-2"
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

                <Disclosure.Panel className="p-4  rounded-xl mb-4 bg-white shadow-centered shadow-sm">
                  <TextField
                    label="نام اتاق"
                    name="roomName"
                    value={room.roomName}
                    onChange={(e) => handleInputChange(index, 'roomName', e.target.value)}
                    placeholder="نام اتاق"
                  />

                  <div className='mx-1 my-2 mt-3'>
                  <ToggleSwitch
                    checked={room.isMasterRoom}
                    onChange={() => toggleMasterRoom(index)}
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

                  {/* Facilities ToggleSwitchGroup */}
                  <ToggleSwitchGroup
                    label="امکانات"
                    options={facilitiesOptions}
                    selectedOptions={room.selectedFacilities}
                    onChange={(key) => toggleSelection(index, 'facility', key)}
                  />

                  <ToggleSwitchGroup
                    label="امکانات سرمایشی و گرمایشی"
                    options={airConditionOptions}
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
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
};

export default EditHouseRooms;
