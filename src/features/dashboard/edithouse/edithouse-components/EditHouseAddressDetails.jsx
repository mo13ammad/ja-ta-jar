import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import TextField from '../../../../ui/TextField';
import TextArea from '../../../../ui/TextArea';

const EditHouseAddressDetails = ({ data, onSubmit }) => {
  const [formData, setFormData] = useState({
    address: data?.address?.address || '',
    neighborhood: data?.address?.village || '',
    floor: data?.address?.floor || '',
    plaqueNumber: data?.address?.house_number || '',
    postalCode: data?.address?.postal_code || '',
  });

  const [errors, setErrors] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    setErrors({});

    try {
      await onSubmit(formData);
      toast.success("آدرس با موفقیت به‌روزرسانی شد");
    } catch (error) {
      console.error("Error submitting data:", error);
      if (error.response) {
        const { data } = error.response;
        if (data.errors) {
          setErrors(data.errors.fields || {});
        }
        toast.error(data.message || "An unexpected error occurred.");
      } else {
        toast.error("متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="relative">
      <Toaster />
      <form className="flex flex-col md:grid grid-cols-2 overflow-auto gap-x-2 gap-y-4 p-2 scrollbar-thinw-full">
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

        {Object.keys(errors).length > 0 && (
          <div className="text-red-500 col-span-2">
            خطایی در ثبت اطلاعات وجود دارد. لطفا موارد زیر را بررسی کنید.
          </div>
        )}

        <button
          type="button"
          className="btn block bg-primary-800 text-white px-4 py-2 rounded-xl mt-4 col-span-2 max-w-36 h-10"
          onClick={handleSubmit}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "در حال ارسال..." : "ثبت آدرس"}
        </button>
      </form>
    </div>
  );
};

export default EditHouseAddressDetails;
