// src/components/edithouse-components/EditHouseRooms.jsx

import React, { useState, useEffect } from "react";
import { Disclosure, Dialog } from "@headlessui/react";
import Spinner from "../../../../ui/Loading";
import TextField from "../../../../ui/TextField";
import TextArea from "../../../../ui/TextArea";
import ToggleSwitch from "../../../../ui/ToggleSwitch";
import ToggleSwitchGroup from "../../../../ui/ToggleSwitchGroup";
import NumberField from "../../../../ui/NumberField"; // Import NumberField
import {
  useFetchRoomFacilities,
  useFetchCoolingAndHeatingOptions,
} from "../../../../services/fetchDataService";
import { toast } from "react-hot-toast";
import {
  createRoom,
  editRoom,
  deleteRoom,
} from "../../../../services/houseService";

const EditHouseRooms = ({ houseData, houseId, refetchHouseData }) => {
  const [rooms, setRooms] = useState([]);
  const [hasLivingRoom, setHasLivingRoom] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [expandedRoomIndex, setExpandedRoomIndex] = useState(null);

  const { data: facilitiesData = [], isLoading: loadingFacilities } =
    useFetchRoomFacilities();
  const { data: airConditionData = [], isLoading: loadingAirConditions } =
    useFetchCoolingAndHeatingOptions();

  useEffect(() => {
    if (houseData?.room) {
      const initialRooms = houseData.room.map((room) => ({
        roomName: room.name || "",
        isMasterRoom: room.is_master || false,
        numberSingleBeds: room.number_single_beds ?? 0, // Default to 0
        numberDoubleBeds: room.number_double_beds ?? 0, // Default to 0
        numberSofaBeds: room.number_sofa_beds ?? 0, // Default to 0
        numberFloorService: room.number_floor_service ?? 0, // Default to 0
        description: room.description || "",
        selectedFacilities: room.facilities?.map((f) => f.key) || [],
        selectedAirConditions: room.airConditions?.map((a) => a.key) || [],
        isLivingRoom: room.is_living_room || false,
        quantity: room.quantity ?? "", // Default to empty string
        uuid: room.uuid || null,
        hasUnsavedChanges: false,
      }));
      setRooms(initialRooms.reverse());
      setHasLivingRoom(initialRooms.some((room) => room.isLivingRoom));
    }
  }, [houseData]);

  const addRoom = (isLivingRoom = false) => {
    setRooms((prevRooms) => [
      {
        roomName: "",
        isMasterRoom: false,
        numberSingleBeds: 0, // Default to 0
        numberDoubleBeds: 0, // Default to 0
        numberSofaBeds: 0, // Default to 0
        numberFloorService: 0, // Default to 0
        description: "",
        selectedFacilities: [],
        selectedAirConditions: [],
        isLivingRoom,
        quantity: houseData.is_rent_room ? "" : null, // Default to empty string
        uuid: null,
        hasUnsavedChanges: true,
      },
      ...prevRooms,
    ]);
    if (isLivingRoom) setHasLivingRoom(true);
    setExpandedRoomIndex(0); // Expand the newly added room
  };

  const handleInputChange = (index, key, value) => {
    setRooms((prevRooms) =>
      prevRooms.map((room, i) =>
        i === index ? { ...room, [key]: value, hasUnsavedChanges: true } : room,
      ),
    );
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [key]: null,
    }));
  };

  const toggleSelection = (index, type, key) => {
    const keyName =
      type === "facility" ? "selectedFacilities" : "selectedAirConditions";
    setRooms((prevRooms) =>
      prevRooms.map((room, i) =>
        i === index
          ? {
              ...room,
              [keyName]: room[keyName].includes(key)
                ? room[keyName].filter((item) => item !== key)
                : [...room[keyName], key],
              hasUnsavedChanges: true,
            }
          : room,
      ),
    );
  };

  const handleRoomSubmit = async (index) => {
    const roomData = rooms[index];
    const payload = {
      name: roomData.roomName,
      is_master: roomData.isMasterRoom,
      is_living_room: roomData.isLivingRoom ? 1 : 0,
      number_single_beds: parseInt(roomData.numberSingleBeds, 10) || 0,
      number_double_beds: parseInt(roomData.numberDoubleBeds, 10) || 0,
      number_sofa_beds: parseInt(roomData.numberSofaBeds, 10) || 0,
      number_floor_service: parseInt(roomData.numberFloorService, 10) || 0,
      description: roomData.description,
      facilities: roomData.selectedFacilities,
      airConditions: roomData.selectedAirConditions,
      quantity: houseData.is_rent_room
        ? roomData.quantity === ""
          ? null
          : parseInt(roomData.quantity, 10)
        : undefined,
    };

    setLoadingSubmit(true);
    setFieldErrors({});

    try {
      if (roomData.uuid) {
        await editRoom(houseId, roomData.uuid, payload);
      } else {
        await createRoom(houseId, payload);
      }
      await refetchHouseData();
      toast.success("اتاق با موفقیت ثبت شد");
      setRooms((prevRooms) =>
        prevRooms.map((room, i) =>
          i === index ? { ...room, hasUnsavedChanges: false } : room,
        ),
      );
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors.fields;
        setFieldErrors(errors);
        toast.error("لطفاً خطاهای فرم را بررسی کنید");
      } else {
        toast.error("خطا در ثبت اتاق");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    const roomData = rooms[deleteIndex];
    setLoadingDelete(true);

    if (!roomData.uuid) {
      setRooms((prevRooms) => prevRooms.filter((_, i) => i !== deleteIndex));
      setIsModalOpen(false);
      setLoadingDelete(false);
      return;
    }

    try {
      await deleteRoom(houseId, roomData.uuid);
      await refetchHouseData();
      setRooms((prevRooms) => prevRooms.filter((_, i) => i !== deleteIndex));
      toast.success("اتاق با موفقیت حذف شد");
      if (roomData.isLivingRoom) setHasLivingRoom(false);
    } catch (error) {
      toast.error("خطا در حذف اتاق");
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
    <div className="relative p-1.5 lg:p-3">
      <div className="text-right font-bold lg:text-lg">اطلاعات اتاق‌ها :</div>

      <div className="w-full px-4 flex justify-between items-center">
        <div>
          {Object.keys(fieldErrors).length > 0 && (
            <div className="mt-2 text-red-600 text-sm pr-2">
              {Object.values(fieldErrors).map((error, idx) => (
                <div key={idx}>{error}</div>
              ))}
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => addRoom(false)}
            className="bg-primary-600 text-xs md:text-sm cursor-pointer text-white px-4 py-2 rounded-2xl shadow-centered ml-2"
          >
            اضافه کردن اتاق
          </button>
          <button
            onClick={() => addRoom(true)}
            className={`bg-primary-600 text-xs md:text-sm cursor-pointer text-white px-4 py-2 rounded-2xl shadow-centered ${
              hasLivingRoom ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={hasLivingRoom}
          >
            اضافه کردن اتاق پذیرایی
          </button>
        </div>
      </div>

      <div className="overflow-auto scrollbar-thin max-h-[70vh] mt-2 px-2 lg:px-4 w-full min-h-[70vh]">
        {rooms.map((room, index) => (
          <Disclosure
            key={index}
            defaultOpen={index === expandedRoomIndex}
            as="div"
            className="mb-2"
          >
            {({ open }) => (
              <>
                <Disclosure.Button className="py-2 flex justify-between items-center w-full z-40 bg-white mt-2 shadow-centered rounded-xl px-4">
                  <span className="flex items-center">
                    {room.roomName || `اتاق ${rooms.length - index}`}
                    {room.isLivingRoom && (
                      <span className="mr-4 bg-secondary-500 text-white text-xs px-2 py-1 rounded-full">
                        اتاق پذیرایی
                      </span>
                    )}
                    {room.hasUnsavedChanges && (
                      <span className="mr-2 text-red-500 text-xs">
                        * تغییرات ذخیره نشده
                      </span>
                    )}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      open ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel className="p-4 rounded-xl bg-white shadow-centered mt-1.5">
                  <TextField
                    label="نام اتاق"
                    name="roomName"
                    value={room.roomName}
                    onChange={(e) =>
                      handleInputChange(index, "roomName", e.target.value)
                    }
                    placeholder="نام اتاق"
                    error={fieldErrors.roomName}
                  />

                  {houseData.is_rent_room && (
                    <TextField
                      label="تعداد موجود از این اتاق"
                      name="quantity"
                      value={room.quantity}
                      onChange={(e) =>
                        handleInputChange(index, "quantity", e.target.value)
                      }
                      error={fieldErrors.quantity}
                      placeholder="تعداد موجود از این اتاق"
                    />
                  )}

                  <div className="my-3">
                    <ToggleSwitch
                      checked={room.isMasterRoom}
                      onChange={() =>
                        handleInputChange(
                          index,
                          "isMasterRoom",
                          !room.isMasterRoom,
                        )
                      }
                      label="اتاق مستر می باشد"
                    />
                  </div>

                  <NumberField
                    label="تعداد تخت‌های یک نفره"
                    name="numberSingleBeds"
                    value={room.numberSingleBeds}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "numberSingleBeds",
                        e.target.value,
                      )
                    }
                    errorMessages={fieldErrors.number_single_beds}
                    min="0"
                  />

                  <NumberField
                    label="تعداد تخت‌های دو نفره"
                    name="numberDoubleBeds"
                    value={room.numberDoubleBeds}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "numberDoubleBeds",
                        e.target.value,
                      )
                    }
                    errorMessages={fieldErrors.number_double_beds}
                    min="0"
                  />

                  <NumberField
                    label="تعداد مبل‌های تخت خواب شو"
                    name="numberSofaBeds"
                    value={room.numberSofaBeds}
                    onChange={(e) =>
                      handleInputChange(index, "numberSofaBeds", e.target.value)
                    }
                    min="0"
                  />

                  <NumberField
                    label="تعداد تشک‌های خواب"
                    name="numberFloorService"
                    value={room.numberFloorService}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "numberFloorService",
                        e.target.value,
                      )
                    }
                    min="0"
                  />

                  <ToggleSwitchGroup
                    label="امکانات"
                    options={facilitiesData}
                    selectedOptions={room.selectedFacilities}
                    onChange={(key) => toggleSelection(index, "facility", key)}
                  />

                  <ToggleSwitchGroup
                    label="امکانات سرمایشی و گرمایشی"
                    options={airConditionData}
                    selectedOptions={room.selectedAirConditions}
                    onChange={(key) =>
                      toggleSelection(index, "airCondition", key)
                    }
                  />

                  <TextArea
                    label="توضیحات"
                    name="description"
                    value={room.description}
                    onChange={(e) =>
                      handleInputChange(index, "description", e.target.value)
                    }
                    placeholder="توضیحات اتاق"
                    className="mt-4"
                  />

                  <div className="mt-4 flex gap-2 justify-end">
                    <button
                      onClick={() => handleRoomSubmit(index)}
                      className=" btn  bg-green-500 cursor-pointer text-white px-4 py-2 rounded-2xl shadow-centered hover:bg-green-600"
                      disabled={loadingSubmit}
                    >
                      {loadingSubmit
                        ? "در حال ارسال..."
                        : room.uuid
                          ? "ثبت تغییرات"
                          : "ثبت اتاق"}
                    </button>

                    <button
                      onClick={() => confirmDelete(index)}
                      className="bg-red-500 hover:bg-red-600 btn cursor-pointer text-white px-4 py-2 rounded-2xl shadow-centered"
                      disabled={loadingDelete}
                    >
                      {loadingDelete ? "در حال حذف..." : "حذف اتاق"}
                    </button>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-25"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <Dialog.Title className="text-lg font-medium">
              آیا مطمئن هستید که می‌خواهید اتاق را حذف کنید؟
            </Dialog.Title>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl"
              >
                لغو
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl mr-4"
                disabled={loadingDelete}
              >
                {loadingDelete ? "در حال حذف..." : "بله حذف کن"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default EditHouseRooms;
