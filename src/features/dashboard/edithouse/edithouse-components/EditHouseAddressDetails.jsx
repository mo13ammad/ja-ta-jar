// src/components/edithouse-components/EditHouseAddressDetails.jsx

import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { toast, Toaster } from "react-hot-toast";
import TextField from "../../../../ui/TextField";
import Loading from "../../../../ui/Loading";

const EditHouseAddressDetails = forwardRef((props, ref) => {
  const {
    houseData,
    setHouseData,
    loadingHouse,
    handleEditHouse,
    editLoading,
  } = props;

  const [formData, setFormData] = useState({
    address: "",
    neighborhood: "",
    floor: "",
    plaqueNumber: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState({});
  const [errorList, setErrorList] = useState([]);
  const [isModified, setIsModified] = useState(false); // Track if any field has been modified

  useEffect(() => {
    if (houseData?.address) {
      setFormData({
        address: houseData.address.address || "",
        neighborhood: houseData.address.village || "",
        floor: houseData.address.floor || "",
        plaqueNumber: houseData.address.house_number || "",
        postalCode: houseData.address.postal_code || "",
      });
    }
  }, [houseData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Set isModified to true when any input changes
    setIsModified(true);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(`Field ${name} changed to: ${value}`);
  };

  const validateAndSubmit = async () => {
    if (!isModified) {
      console.log("No changes detected, submission skipped.");
      return true; // Proceed to next tab since there's nothing to submit
    }

    setErrors({});
    setErrorList([]);

    console.log("Validating and submitting data:", formData);

    // Client-side validation for postal code
    if (formData.postalCode && !/^\d{10}$/.test(formData.postalCode)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        postal_code: ["کد پستی باید یک عدد ۱۰ رقمی باشد."],
      }));
      toast.error("کد پستی معتبر نمی باشد.");
      return false;
    }

    const dataToSend = {
      address: formData.address,
      village_name: formData.neighborhood,
      floor: formData.floor,
      house_number: formData.plaqueNumber,
      postal_code: formData.postalCode,
    };

    try {
      console.log("Sending data to server:", dataToSend);
      await handleEditHouse(dataToSend);
      console.log("Data successfully sent and received.");
      toast.success("آدرس با موفقیت به‌روزرسانی شد");

      // Update the houseData state with the new address
      setHouseData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          address: formData.address,
          village: formData.neighborhood,
          floor: formData.floor,
          house_number: formData.plaqueNumber,
          postal_code: formData.postalCode,
        },
      }));
      setIsModified(false); // Reset isModified after successful submission
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

  if (loadingHouse) {
    console.log("Loading house data...");
    return <Loading message="در حال بارگذاری اطلاعات آدرس..." />;
  }

  return (
    <div className="relative">
      <Toaster />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          validateAndSubmit();
        }}
        className="flex flex-col md:grid grid-cols-2 overflow-auto gap-x-2 gap-y-4 p-2 scrollbar-thin w-full"
      >
        <TextField
          label="آدرس اقامتگاه"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="آدرس اقامتگاه"
          errorMessages={errors.address}
        />

        <TextField
          label="روستا / محله"
          name="neighborhood"
          value={formData.neighborhood}
          onChange={handleInputChange}
          placeholder="روستا / محله"
          errorMessages={errors.village_name}
        />

        <TextField
          label="اقامتگاه در طبقه"
          name="floor"
          value={formData.floor}
          onChange={handleInputChange}
          placeholder="اقامتگاه در طبقه"
          errorMessages={errors.floor}
        />

        <TextField
          label="شماره پلاک"
          name="plaqueNumber"
          value={formData.plaqueNumber}
          onChange={handleInputChange}
          placeholder="شماره پلاک"
          errorMessages={errors.house_number}
        />

        <TextField
          label="کد پستی"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleInputChange}
          placeholder="کد پستی"
          errorMessages={errors.postal_code}
        />
      </form>
    </div>
  );
});

export default EditHouseAddressDetails;
