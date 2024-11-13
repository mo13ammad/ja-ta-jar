// src/components/edithouse-components/EditHouseEnvironmentDetails.jsx

import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Switch } from "@headlessui/react";
import Spinner from "../../../../ui/Loading";
import TextArea from "../../../../ui/TextArea";
import toast, { Toaster } from "react-hot-toast";
import {
  useFetchTextures,
  useFetchHouseViews,
  useFetchNeighbours,
  useFetchRoutes,
} from "../../../../services/fetchDataService";
import NeighbourSelect from "./NeighbourSelect";

const EditHouseEnvironmentDetails = forwardRef((props, ref) => {
  const { houseData, loadingHouse, handleEditHouse, houseId } = props;

  const {
    data: textureOptions = [],
    isLoading: loadingTextures,
  } = useFetchTextures();
  const {
    data: viewOptions = [],
    isLoading: loadingViews,
  } = useFetchHouseViews();
  const {
    data: neighbourOptions = [],
    isLoading: loadingNeighbours,
  } = useFetchNeighbours();
  const {
    data: routeOptions = [],
    isLoading: loadingRoutes,
  } = useFetchRoutes();

  const [formData, setFormData] = useState({
    selectedTextures: [],
    selectedViews: [],
    selectedNeighbour: "",
    selectedRoutes: [],
    accessMethod: "",
    viewDescription: "",
  });
  const [errors, setErrors] = useState({});
  const [errorList, setErrorList] = useState([]);
  const [isModified, setIsModified] = useState(false);

  // Initialize form data with houseData values
  useEffect(() => {
    if (houseData) {
      console.log("Received houseData:", houseData);
      setFormData({
        selectedTextures: houseData?.areas?.map((area) => area.key) || [],
        selectedViews: houseData?.views?.types?.map((view) => view.key) || [],
        selectedNeighbour: houseData?.neighbour?.key || "",
        selectedRoutes: houseData?.arrivals?.types?.map((route) => route.key) || [],
        accessMethod: houseData?.arrivals?.description || "",
        viewDescription: houseData?.views?.description || "",
      });
    }
  }, [houseData]);

  // Toggle function for checkboxes
  const toggleOption = (key, field) => {
    setFormData((prevFormData) => {
      const isSelected = prevFormData[field].includes(key);
      const updatedField = isSelected
        ? prevFormData[field].filter((item) => item !== key)
        : [...prevFormData[field], key];
      setIsModified(true);
      return {
        ...prevFormData,
        [field]: updatedField,
      };
    });
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
    setIsModified(true);
  };

  // Validate and Submit
  const validateAndSubmit = async () => {
    if (!isModified) {
      console.log('No changes detected, submission skipped.');
      return true;
    }

    setErrors({});
    setErrorList([]);
    console.log('Validating and submitting data:', formData);

    if (!houseId) {
      toast.error('شناسه اقامتگاه موجود نیست. امکان ارسال داده وجود ندارد.');
      console.error('Validation error: houseId is missing.');
      return false;
    }

    const requestData = {
      areas: formData.selectedTextures,
      views: formData.selectedViews,
      neighbour: formData.selectedNeighbour,
      arrivals: formData.selectedRoutes,
      arrival_description: formData.accessMethod,
      view_description: formData.viewDescription,
    };

    console.log('Data to send:', requestData);

    try {
      await handleEditHouse(requestData);
      toast.success("اطلاعات با موفقیت ثبت شد");
      console.log('Data successfully sent and received.');
      setIsModified(false);
      return true;
    } catch (errorData) {
      console.error('Submission Error:', errorData);
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
        toast.error('متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید');
      }
      return false;
    }
  };

  useImperativeHandle(ref, () => ({
    validateAndSubmit,
  }));

  if (
    loadingHouse ||
    loadingTextures ||
    loadingViews ||
    loadingNeighbours ||
    loadingRoutes
  ) {
    console.log('Loading data...');
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative">
      <Toaster />
      <div className="overflow-auto scrollbar-thin px-3 lg:px-4 w-full">
        <div className="text-right font-bold lg:text-lg">اطلاعات محیطی :</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
          {/* Environment Texture */}
          <div className="mt-4 lg:col-span-2">
            <label className="block mb-2">بافت محیط :</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {textureOptions.map((option) => (
                <Switch.Group
                  key={option.key}
                  as="div"
                  className="flex items-center space-x-2"
                >
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Switch
                      checked={formData.selectedTextures.includes(option.key)}
                      onChange={() => toggleOption(option.key, "selectedTextures")}
                      className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                        formData.selectedTextures.includes(option.key)
                          ? "bg-primary-600"
                          : "bg-gray-200"
                      }`}
                    >
                      {formData.selectedTextures.includes(option.key) && (
                        <svg
                          className="w-4 h-4 text-white absolute inset-0 m-auto"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </Switch>
                    <span className="ml-3 text-sm">{option.label}</span>
                  </label>
                </Switch.Group>
              ))}
            </div>
            {errors.areas && (
              <p className="mt-2 text-sm text-red-600">{errors.areas[0]}</p>
            )}
          </div>

          {/* View Options */}
          <div className="mt-4 lg:col-span-2">
            <label className="block mb-2">منظره اقامتگاه :</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {viewOptions.map((option) => (
                <Switch.Group
                  key={option.key}
                  as="div"
                  className="flex items-center space-x-2"
                >
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Switch
                      checked={formData.selectedViews.includes(option.key)}
                      onChange={() => toggleOption(option.key, "selectedViews")}
                      className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                        formData.selectedViews.includes(option.key)
                          ? "bg-primary-600"
                          : "bg-gray-200"
                      }`}
                    >
                      {formData.selectedViews.includes(option.key) && (
                        <svg
                          className="w-4 h-4 text-white absolute inset-0 m-auto"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </Switch>
                    <span className="ml-3 text-sm font-medium">{option.label}</span>
                  </label>
                </Switch.Group>
              ))}
            </div>
            {errors.views && (
              <p className="mt-2 text-sm text-red-600">{errors.views[0]}</p>
            )}
          </div>

          {/* View Description */}
          <div className="mt-4 lg:col-span-2">
            <TextArea
              label="توضیحات منظره اقامتگاه"
              name="viewDescription"
              value={formData.viewDescription}
              onChange={(e) => handleInputChange("viewDescription", e.target.value)}
              placeholder="توضیحات منظره اقامتگاه"
              errorMessages={errors.view_description}
            />
          </div>

          {/* Neighbourhood Type */}
          <div className="mt-4  w-full">
            <NeighbourSelect
              label="نوع همسایگی"
              name="selectedNeighbour"
              value={formData.selectedNeighbour}
              onChange={handleInputChange}
              options={neighbourOptions}
              errorMessages={errors.neighbour}
            />
          </div>

          {/* Access Routes */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-lg font-medium mb-2">مسیر دسترسی</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {routeOptions.map((option) => (
                <Switch.Group
                  key={option.key}
                  as="div"
                  className="flex items-center space-x-2"
                >
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Switch
                      checked={formData.selectedRoutes.includes(option.key)}
                      onChange={() => toggleOption(option.key, "selectedRoutes")}
                      className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                        formData.selectedRoutes.includes(option.key)
                          ? "bg-primary-600"
                          : "bg-gray-200"
                      }`}
                    >
                      {formData.selectedRoutes.includes(option.key) && (
                        <svg
                          className="w-4 h-4 text-white absolute inset-0 m-auto"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </Switch>
                    <span className="ml-3 text-sm font-medium">{option.label}</span>
                  </label>
                </Switch.Group>
              ))}
            </div>
            {errors.arrivals && (
              <p className="mt-2 text-sm text-red-600">{errors.arrivals[0]}</p>
            )}
          </div>

          {/* Access Method Description */}
          <div className="mt-4 lg:col-span-2">
            <TextArea
              label="توضیحات شیوه دسترسی به اقامتگاه"
              name="accessMethod"
              value={formData.accessMethod}
              onChange={(e) => handleInputChange("accessMethod", e.target.value)}
              placeholder="توضیحات شیوه دسترسی به اقامتگاه"
              errorMessages={errors.arrival_description}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default EditHouseEnvironmentDetails;
