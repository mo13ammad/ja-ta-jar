import React, { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import Spinner from "../../../../ui/Loading";
import TextArea from "../../../../ui/TextArea";
import FormSelect from "../../../../ui/FormSelect";
import toast from "react-hot-toast";
import useEditHouse from "../useEditHouse";
import {
  useFetchTextures,
  useFetchHouseViews,
  useFetchNeighbours,
  useFetchRoutes,
} from "../../../../services/fetchDataService";

const EditHouseEnvironmentDetails = ({ houseData, loadingHouse, houseId }) => {
  const { data: textureOptions = [], isLoading: loadingTextures } = useFetchTextures();
  const { data: viewOptions = [], isLoading: loadingViews } = useFetchHouseViews();
  const { data: neighbourOptions = [], isLoading: loadingNeighbours } = useFetchNeighbours();
  const { data: routeOptions = [], isLoading: loadingRoutes } = useFetchRoutes();
  const { mutateAsync: editHouseAsync, isLoading: editLoading } = useEditHouse();

  const [formData, setFormData] = useState({
    selectedTextures: [],
    selectedViews: [],
    selectedNeighbour: "",
    selectedRoutes: [],
    accessMethod: "",
    viewDescription: "",
  });

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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: prevFormData[field].includes(key)
        ? prevFormData[field].filter((item) => item !== key)
        : [...prevFormData[field], key],
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const requestData = {
      areas: formData.selectedTextures,
      views: formData.selectedViews,
      neighbour: formData.selectedNeighbour,
      arrivals: formData.selectedRoutes,
      arrival_description: formData.accessMethod,
      view_description: formData.viewDescription,
    };

    console.log("Sending request data:", requestData);

    try {
      await editHouseAsync({ houseId, houseData: requestData });
      toast.success("اطلاعات با موفقیت ثبت شد");
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید");
    }
  };

  if (loadingHouse || loadingTextures || loadingViews || loadingNeighbours || loadingRoutes) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-auto scrollbar-thin px-3 lg:px-4 w-full">
        <div className="text-right font-bold lg:text-lg">اطلاعات محیطی :</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
          {/* Environment Texture */}
          <div className="mt-4 lg:col-span-2">
            <label className="block mb-2">بافت محیط :</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {textureOptions.map((option) => (
                <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Switch
                      checked={formData.selectedTextures.includes(option.key)}
                      onChange={() => toggleOption(option.key, "selectedTextures")}
                      className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                        formData.selectedTextures.includes(option.key) ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      {formData.selectedTextures.includes(option.key) && (
                        <svg className="w-4 h-4 text-white absolute inset-0 m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </Switch>
                    <span className="ml-3 text-sm">{option.label}</span>
                  </label>
                </Switch.Group>
              ))}
            </div>
          </div>

          {/* View Options */}
          <div className="mt-4 lg:col-span-2">
            <label className="block mb-2">منظره اقامتگاه :</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {viewOptions.map((option) => (
                <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Switch
                      checked={formData.selectedViews.includes(option.key)}
                      onChange={() => toggleOption(option.key, "selectedViews")}
                      className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                        formData.selectedViews.includes(option.key) ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      {formData.selectedViews.includes(option.key) && (
                        <svg className="w-4 h-4 text-white absolute inset-0 m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </Switch>
                    <span className="ml-3 text-sm font-medium">{option.label}</span>
                  </label>
                </Switch.Group>
              ))}
            </div>
          </div>

          {/* View Description */}
          <div className="mt-4 lg:col-span-2">
            <TextArea
              label="توضیحات منظره اقامتگاه"
              name="viewDescription"
              value={formData.viewDescription}
              onChange={(e) => setFormData({ ...formData, viewDescription: e.target.value })}
              placeholder="توضیحات منظره اقامتگاه"
            />
          </div>

          {/* Neighbourhood Type */}
          <div className="mt-4 lg:col-span-2 w-1/2">
            <FormSelect
              label="نوع همسایگی"
              name="neighbour"
              value={formData.selectedNeighbour}
              onChange={(e) => setFormData({ ...formData, selectedNeighbour: e.target.value })}
              options={[
                { value: "", label: "انتخاب نوع همسایگی" },
                ...neighbourOptions.map((option) => ({ value: option.key, label: option.label })),
              ]}
            />
          </div>

          {/* Access Routes */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-lg font-medium mb-2">مسیر دسترسی</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {routeOptions.map((option) => (
                <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Switch
                      checked={formData.selectedRoutes.includes(option.key)}
                      onChange={() => toggleOption(option.key, "selectedRoutes")}
                      className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                        formData.selectedRoutes.includes(option.key) ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      {formData.selectedRoutes.includes(option.key) && (
                        <svg className="w-4 h-4 text-white absolute inset-0 m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </Switch>
                    <span className="ml-3 text-sm font-medium">{option.label}</span>
                  </label>
                </Switch.Group>
              ))}
            </div>
          </div>

          {/* Access Method Description */}
          <div className="mt-4 lg:col-span-2">
            <TextArea
              label="توضیحات شیوه دسترسی به اقامتگاه"
              name="accessMethod"
              value={formData.accessMethod}
              onChange={(e) => setFormData({ ...formData, accessMethod: e.target.value })}
              placeholder="توضیحات شیوه دسترسی به اقامتگاه"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-4 w-full lg:col-span-2 flex justify-end">
        <button
          onClick={handleSubmit}
          className="btn bg-primary-600 text-white px-4 py-2 shadow-lg hover:bg-primary-800 transition-colors duration-200"
          disabled={editLoading}
        >
          {editLoading ? 'در حال بارگذاری...' : 'ثبت اطلاعات'}
        </button>
      </div>
    </div>
  );
};

export default EditHouseEnvironmentDetails;
