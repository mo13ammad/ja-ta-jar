import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  Fragment,
  useMemo,
} from "react";
import { toast, Toaster } from "react-hot-toast";
import Spinner from "../../../../ui/Loading";
import TextField from "../../../../ui/TextField";
import TextArea from "../../../../ui/TextArea";
import FormSelect from "../../../../ui/FormSelect";
import ToggleSwitch from "../../../../ui/ToggleSwitch";
import {
  useFetchHouseFloors,
  useFetchPrivacyOptions,
} from "../../../../services/fetchDataService";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

// Ownership Options
const ownershipOptions = [
  { key: "Owner", label: "مالک", value: "Owner" },
  { key: "LongTermTenant", label: "مستأجر بلند مدت", value: "LongTermTenant" },
  { key: "Intermediary", label: "ناظر رزرو", value: "Intermediary" },
  {
    key: "FamiliarWithTheOwner",
    label: "مشاور املاک",
    value: "FamiliarWithTheOwner",
  },
  { key: "Gatekeeper", label: "سرایدار", value: "Gatekeeper" },
];

// OwnershipSelect Component
function OwnershipSelect({ label, value, onChange }) {
  const selectedOption =
    ownershipOptions.find((option) => option.value === value) || {};
  return (
    <div className="w-full">
      <label className="block font-medium text-gray-700 mb-2">{label}</label>
      <Listbox
        value={selectedOption}
        onChange={(val) => onChange("ownership", val.value)}
      >
        {({ open }) => (
          <div className="relative bg-white rounded-xl">
            <Listbox.Button className="listbox__button">
              <span>{selectedOption.label || "انتخاب کنید"}</span>
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
              />
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                {ownershipOptions.map((option) => (
                  <Listbox.Option
                    key={option.key}
                    value={option}
                    className={({ active }) =>
                      `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                        active
                          ? "bg-secondary-100 text-secondary-700"
                          : "text-gray-900"
                      }`
                    }
                  >
                    <span className="block truncate font-normal">
                      {option.label}
                    </span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
}

// Main EditHouseGeneralInfo Component
const EditHouseGeneralInfo = forwardRef((props, ref) => {
  const { houseData, loadingHouse, handleEditHouse, houseId } = props;

  const [formData, setFormData] = useState({
    name: "",
    land_size: "",
    structure_size: "",
    number_stairs: "",
    description: "",
    tip: "",
    privacy: "",
    rentType: "",
    price_handle_by: "",
    ownership: "",
  });
  const [errors, setErrors] = useState({});
  const [errorList, setErrorList] = useState([]);
  const [isModified, setIsModified] = useState(false);

  const { data: houseFloorOptions = [], isLoading: loadingHouseFloors } =
    useFetchHouseFloors();
  const { data: privacyOptions = [], isLoading: loadingPrivacyOptions } =
    useFetchPrivacyOptions();

  // Memoize options to prevent unnecessary re-renders
  const houseFloorOptionsData = useMemo(() => {
    if (loadingHouseFloors) {
      return [{ key: "loading", value: "", label: "در حال بارگذاری..." }];
    } else {
      return [
        { key: "default", value: "", label: "انتخاب نوع" },
        ...houseFloorOptions.map((option) => ({
          key: option.key,
          value: option.key,
          label: option.label,
        })),
      ];
    }
  }, [loadingHouseFloors, houseFloorOptions]);

  const privacyOptionsData = useMemo(() => {
    if (loadingPrivacyOptions) {
      return [{ key: "loading", value: "", label: "در حال بارگذاری..." }];
    } else {
      return [
        { key: "default", value: "", label: "انتخاب حریم" },
        ...privacyOptions.map((option) => ({
          key: option.key,
          value: option.key,
          label: option.label,
        })),
      ];
    }
  }, [loadingPrivacyOptions, privacyOptions]);

  useEffect(() => {
    if (houseData) {
      console.log("Received houseData:", houseData);
      setFormData({
        name: houseData?.name || "",
        land_size: houseData?.structure?.land_size || "",
        structure_size: houseData?.structure?.size || "",
        number_stairs: houseData?.structure?.number_stairs || "",
        description: houseData?.description || "",
        tip: houseData?.tip?.key || "",
        privacy: houseData?.privacy?.key || "",
        rentType: houseData?.structure?.can_rent_room
          ? houseData?.is_rent_room
            ? "Rooms"
            : "House"
          : "House",
        price_handle_by: houseData?.price_handle_by?.key || "PerNight",
        ownership: houseData?.ownership || "",
      });
    }
  }, [houseData]);

  // Rent type and price options
  const rentTypeOptions = [
    { key: "House", label: "اقامتگاه" },
    { key: "Rooms", label: "اتاق" },
  ];

  const priceHandleOptions = [
    { key: "PerNight", label: "براساس هر شب" },
    { key: "PerPerson", label: "براساس هر نفر - شب" },
  ];

  const handleInputChange = (name, value) => {
    console.log(`Input Change - Field: ${name}, Value: ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsModified(true);
  };

  const validateAndSubmit = async () => {
    if (!isModified) {
      console.log("No changes detected, submission skipped.");
      return true;
    }

    setErrors({});
    setErrorList([]);
    console.log("Validating and submitting data:", formData);

    if (!houseId) {
      toast.error("شناسه اقامتگاه موجود نیست. امکان ارسال داده وجود ندارد.");
      console.error("Validation error: houseId is missing.");
      return false;
    }

    try {
      await handleEditHouse(formData);
      toast.success("جزئیات اقامتگاه با موفقیت به‌روزرسانی شد!");
      console.log("Data successfully sent and received.");
      setIsModified(false);
      return true;
    } catch (errorData) {
      console.error("Edit House Error:", errorData);

      if (errorData.errors || errorData.message) {
        if (errorData.errors?.fields) {
          const fieldErrors = errorData.errors.fields;
          const updatedErrors = {};
          const errorsArray = Object.values(fieldErrors).flat();

          for (let field in fieldErrors) {
            updatedErrors[field] = fieldErrors[field];
          }
          setErrors(updatedErrors);
          setErrorList(errorsArray);
        }

        if (errorData.message) {
          toast.error(errorData.message);
        }
      } else {
        toast.error("متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید");
      }
      return false;
    }
  };

  useImperativeHandle(ref, () => ({
    validateAndSubmit,
  }));

  if (loadingHouse || loadingHouseFloors || loadingPrivacyOptions) {
    console.log("Loading data...");
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative">
      <Toaster />
      <div className="overflow-auto scrollbar-thin pt-2 px-2 lg:px-4 w-full h-full">
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TextField
            label="نام اقامتگاه"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="نام اقامتگاه"
            errorMessages={errors.name}
          />
          <TextField
            label="متراژ کل"
            name="land_size"
            value={formData.land_size}
            onChange={(e) => handleInputChange("land_size", e.target.value)}
            placeholder="متراژ کل به متر مربع"
            errorMessages={errors.land_size}
          />
          <TextField
            label="متراژ زیر بنا"
            name="structure_size"
            value={formData.structure_size}
            onChange={(e) =>
              handleInputChange("structure_size", e.target.value)
            }
            placeholder="متراژ زیر بنا به متر مربع"
            errorMessages={errors.structure_size}
          />
          <TextField
            label="تعداد پله"
            name="number_stairs"
            value={formData.number_stairs}
            onChange={(e) => handleInputChange("number_stairs", e.target.value)}
            placeholder="تعداد پله"
            errorMessages={errors.number_stairs}
          />

          <FormSelect
            label="تیپ سازه"
            name="tip"
            value={formData.tip || ""}
            onChange={handleInputChange}
            options={houseFloorOptionsData}
            errorMessages={errors.tip}
          />
          <FormSelect
            label="وضعیت حریم"
            name="privacy"
            value={formData.privacy || ""}
            onChange={handleInputChange}
            options={privacyOptionsData}
            errorMessages={errors.privacy}
          />

          <OwnershipSelect
            label="نوع ارتباط مالک با اقامتگاه"
            value={formData.ownership || ""}
            onChange={handleInputChange}
          />
          {errors.ownership && (
            <p className="mt-2 text-sm text-red-600">{errors.ownership[0]}</p>
          )}

          <TextArea
            label="درباره اقامتگاه"
            name="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="امکاناتی که میخواهید به مهمانان نمایش داده شود را بنویسید"
            className="lg:col-span-2"
            errorMessages={errors.description}
          />

          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              قیمت اقامتگاه بر چه اساسی باشد
            </label>
            <div className="flex space-x-4">
              {priceHandleOptions.map((option) => (
                <ToggleSwitch
                  key={option.key}
                  checked={formData.price_handle_by === option.key}
                  onChange={() =>
                    handleInputChange("price_handle_by", option.key)
                  }
                  label={option.label}
                />
              ))}
            </div>
            {errors.price_handle_by && (
              <p className="mt-2 text-sm text-red-600">
                {errors.price_handle_by[0]}
              </p>
            )}
          </div>

          {houseData?.structure?.can_rent_room && (
            <div className="mt-4 lg:col-span-2 border-t pt-2">
              <label className="block font-bold text-gray-700 mb-2">
                نوع اجاره دهی اقامتگاه بر چه اساسی باشد{" "}
              </label>
              <div className="flex space-x-4">
                {rentTypeOptions.map((option) => (
                  <ToggleSwitch
                    key={option.key}
                    checked={formData.rentType === option.key}
                    onChange={() => handleInputChange("rentType", option.key)}
                    label={option.label}
                  />
                ))}
              </div>
              {errors.rentType && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.rentType[0]}
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
});

export default EditHouseGeneralInfo;
