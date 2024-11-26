// src/components/edithouse-components/EditHouseMainFacilities.jsx

import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import Spinner from "../../../../ui/Loading";
import TextField from "../../../../ui/TextField";
import TextArea from "../../../../ui/TextArea";
import ToggleSwitch from "../../../../ui/ToggleSwitch";
import { useFetchFacilities } from "../../../../services/fetchDataService";
import { toast, Toaster } from "react-hot-toast";
import { editHouseFacilities } from "../../../../services/houseService";

const EditHouseMainFacilities = forwardRef((props, ref) => {
  const { houseId, houseData, setHouseData, loadingHouse, refetchHouseData } =
    props;
  const { data: facilitiesData = [], isLoading: loadingFacilities } =
    useFetchFacilities();
  const [selectedFacilities, setSelectedFacilities] = useState({});
  const [errors, setErrors] = useState({});
  const [errorList, setErrorList] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    if (houseData && facilitiesData.length > 0) {
      const initialSelectedFacilities = facilitiesData.reduce(
        (acc, facility) => {
          const existingFacility = houseData.facilities?.find(
            (f) => f.key === facility.key,
          );

          acc[facility.key] = {
            checked: !!existingFacility,
            fields: facility.fields?.reduce((fieldAcc, field) => {
              const existingField = existingFacility?.fields?.find(
                (f) => f.title.trim() === field.title.trim(),
              );
              fieldAcc[field.title.trim()] = existingField
                ? existingField.value === "true" ||
                  existingField.value === true ||
                  existingField.value
                : field.type === "toggle"
                  ? false
                  : "";
              return fieldAcc;
            }, {}),
          };
          return acc;
        },
        {},
      );

      setSelectedFacilities(initialSelectedFacilities);
    }
  }, [houseData, facilitiesData]);

  const toggleFacility = (key) => {
    setSelectedFacilities((prevSelected) => {
      const isChecked = !prevSelected[key].checked;
      setIsModified(true);
      return {
        ...prevSelected,
        [key]: {
          ...prevSelected[key],
          checked: isChecked,
          fields: isChecked ? prevSelected[key].fields : {}, // Clear fields if unchecked
        },
      };
    });
  };
  console.log(houseData);
  const handleInputChange = (facilityKey, fieldTitle, value) => {
    setSelectedFacilities((prevState) => {
      setIsModified(true);
      return {
        ...prevState,
        [facilityKey]: {
          ...prevState[facilityKey],
          fields: {
            ...prevState[facilityKey].fields,
            [fieldTitle.trim()]: value,
          },
        },
      };
    });
  };

  const validateAndSubmit = async () => {
    if (!isModified) {
      console.log("No changes detected, submission skipped.");
      return true;
    }

    setErrors({});
    setErrorList([]);
    console.log("Validating and submitting data.");

    setIsRefetching(true);

    try {
      const facilitiesDataToSend = Object.keys(selectedFacilities)
        .filter((key) => selectedFacilities[key].checked)
        .map((key) => ({
          type: key,
          fields: Object.entries(selectedFacilities[key].fields || {}).map(
            ([fieldKey, fieldValue]) => ({
              key: fieldKey.trim(),
              value:
                typeof fieldValue === "string" && !isNaN(fieldValue.trim())
                  ? parseFloat(fieldValue.trim())
                  : fieldValue === "true" || fieldValue === true || fieldValue,
            }),
          ),
        }));

      console.log("Data to send:", facilitiesDataToSend);

      const updatedHouseData = await editHouseFacilities(
        houseId,
        facilitiesDataToSend,
      );

      if (updatedHouseData) {
        setHouseData(updatedHouseData);
        toast.success("اطلاعات با موفقیت ثبت شد");
        setIsRefetching(true);
        await refetchHouseData();
        setIsRefetching(false);
        setIsModified(false);
        return true;
      } else {
        throw new Error("Failed to update facilities.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("خطایی در ثبت اطلاعات پیش آمد");
      setIsRefetching(false);
      return false;
    }
  };

  useImperativeHandle(ref, () => ({
    validateAndSubmit,
  }));

  const halfIndex = Math.ceil(facilitiesData.length / 2);
  const leftFacilities = facilitiesData.slice(0, halfIndex);
  const rightFacilities = facilitiesData.slice(halfIndex);

  if (loadingHouse || loadingFacilities || isRefetching) {
    console.log("Loading data...");
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative px-2 py-1">
      <Toaster />
      {errorList.length > 0 && (
        <div className="error-list mb-4">
          {errorList.map((error, index) => (
            <div key={index} className="text-red-500 text-sm">
              {error}
            </div>
          ))}
        </div>
      )}
      <div className="text-right font-bold lg:text-lg mb-2">امکانات اصلی</div>
      <div className="flex flex-col gap-4 p-2 lg:flex-row">
        <div className="flex-1 space-y-4">
          {leftFacilities.map((facility) => (
            <FacilityItem
              key={facility.key}
              facility={facility}
              selectedFacilities={selectedFacilities}
              toggleFacility={toggleFacility}
              handleInputChange={handleInputChange}
            />
          ))}
        </div>
        <div className="flex-1 space-y-4 mt-4 lg:mt-0">
          {rightFacilities.map((facility) => (
            <FacilityItem
              key={facility.key}
              facility={facility}
              selectedFacilities={selectedFacilities}
              toggleFacility={toggleFacility}
              handleInputChange={handleInputChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// Component to render each facility item
const FacilityItem = ({
  facility,
  selectedFacilities,
  toggleFacility,
  handleInputChange,
}) => (
  <div className="p-2 md:p-4 rounded-xl flex flex-col shadow-centered bg-white">
    <ToggleSwitch
      checked={selectedFacilities[facility.key]?.checked || false}
      onChange={() => toggleFacility(facility.key)}
      label={facility.label}
      icon={facility.icon}
    />
    {selectedFacilities[facility.key]?.checked &&
      facility.fields &&
      facility.fields.length > 0 && (
        <div className="mt-4 bg-white p-2 rounded-xl">
          {facility.fields.map((field, index) => (
            <div key={index} className="mb-4">
              {field.type === "toggle" ? (
                <ToggleSwitch
                  checked={
                    selectedFacilities[facility.key]?.fields?.[
                      field.title.trim()
                    ] || false
                  }
                  onChange={() =>
                    handleInputChange(
                      facility.key,
                      field.title,
                      !selectedFacilities[facility.key]?.fields?.[
                        field.title.trim()
                      ],
                    )
                  }
                  label={field.title}
                />
              ) : field.type === "textarea" ? (
                <TextArea
                  label={field.title}
                  placeholder={field.placeholder}
                  value={
                    selectedFacilities[facility.key]?.fields?.[
                      field.title.trim()
                    ] || ""
                  }
                  onChange={(e) =>
                    handleInputChange(facility.key, field.title, e.target.value)
                  }
                />
              ) : (
                <TextField
                  label={field.title}
                  type={field.type === "number" ? "number" : "text"}
                  placeholder={field.placeholder}
                  value={
                    selectedFacilities[facility.key]?.fields?.[
                      field.title.trim()
                    ] || ""
                  }
                  onChange={(e) =>
                    handleInputChange(facility.key, field.title, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>
      )}
  </div>
);

export default EditHouseMainFacilities;
