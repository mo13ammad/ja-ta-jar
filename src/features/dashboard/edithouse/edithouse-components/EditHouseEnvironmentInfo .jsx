import React, { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import Spinner from "../../../../ui/Loading";
import TextArea from "../../../../ui/TextArea";
import FormSelect from "../../../../ui/FormSelect";
import {
  useFetchTextures,
  useFetchHouseViews,
  useFetchNeighbours,
  useFetchRoutes,
} from "../../../../services/fetchDataService";

const EditHouseEnvironmentDetails = ({ houseData, loadingHouse }) => {
  const { data: textureOptions = [], isLoading: loadingTextures } = useFetchTextures();
  const { data: viewOptions = [], isLoading: loadingViews } = useFetchHouseViews();
  const { data: neighbourOptions = [], isLoading: loadingNeighbours } = useFetchNeighbours();
  const { data: routeOptions = [], isLoading: loadingRoutes } = useFetchRoutes();

  const [selectedTextures, setSelectedTextures] = useState([]);
  const [selectedViews, setSelectedViews] = useState([]);
  const [selectedNeighbour, setSelectedNeighbour] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [accessMethod, setAccessMethod] = useState("");
  const [viewDescription, setViewDescription] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (houseData) {
      setSelectedTextures(Array.isArray(houseData.textures) ? houseData.textures : []);
      setSelectedViews(Array.isArray(houseData.views) ? houseData.views : []);
      setSelectedNeighbour(houseData.neighbour || "");
      setSelectedRoutes(Array.isArray(houseData.routes) ? houseData.routes : []);
      setAccessMethod(houseData.accessMethod || "");
      setViewDescription(houseData.viewDescription || "");
    }
  }, [houseData]);

  const toggleOption = (setter, currentValue, key) => {
    setter((prevSelected) =>
      prevSelected.includes(key)
        ? prevSelected.filter((item) => item !== key)
        : [...prevSelected, key]
    );
  };

  const handleSubmit = () => {
    setLoadingSubmit(true);
    setTimeout(() => {
      setLoadingSubmit(false);
      alert("Submitted successfully");
    }, 1500);
  };

  if (loadingHouse || loadingTextures || loadingViews || loadingNeighbours || loadingRoutes) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative ">
      <div className="overflow-auto scrollbar-thin px-3 lg:px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Environment Texture */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">بافت محیط</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {textureOptions.map((option) => (
                <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Switch
                      checked={selectedTextures.includes(option.key)}
                      onChange={() => toggleOption(setSelectedTextures, selectedTextures, option.key)}
                      className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                        selectedTextures.includes(option.key) ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      {selectedTextures.includes(option.key) && (
                        <svg className="w-4 h-4 text-white absolute inset-0 m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* View Options */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">منظره اقامتگاه</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {viewOptions.map((option) => (
                <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Switch
                      checked={selectedViews.includes(option.key)}
                      onChange={() => toggleOption(setSelectedViews, selectedViews, option.key)}
                      className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                        selectedViews.includes(option.key) ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      {selectedViews.includes(option.key) && (
                        <svg className="w-4 h-4 text-white absolute inset-0 m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* View Description */}
          <div className="mt-4 lg:col-span-2">
            <TextArea
              label="توضیحات منظره اقامتگاه"
              name="viewDescription"
              value={viewDescription}
              onChange={(e) => setViewDescription(e.target.value)}
              placeholder="توضیحات منظره اقامتگاه"
            />
          </div>

          {/* Neighbourhood Type */}
          <div className="mt-4 lg:col-span-2 w-1/2">
            <FormSelect
              label="نوع همسایگی"
              name="neighbour"
              value={selectedNeighbour}
              onChange={(e) => setSelectedNeighbour(e.target.value)}
              options={[
                { value: "", label: "انتخاب نوع همسایگی" },
                ...neighbourOptions.map((option) => ({ value: option.key, label: option.label })),
              ]}
            />
          </div>

          {/* Access Routes */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">مسیر دسترسی</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {routeOptions.map((option) => (
                <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Switch
                      checked={selectedRoutes.includes(option.key)}
                      onChange={() => toggleOption(setSelectedRoutes, selectedRoutes, option.key)}
                      className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 ${
                        selectedRoutes.includes(option.key) ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      {selectedRoutes.includes(option.key) && (
                        <svg className="w-4 h-4 text-white absolute inset-0 m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* Access Method Description */}
          <div className="mt-4 lg:col-span-2">
            <TextArea
              label="توضیحات شیوه دسترسی به اقامتگاه"
              name="accessMethod"
              value={accessMethod}
              onChange={(e) => setAccessMethod(e.target.value)}
              placeholder="توضیحات شیوه دسترسی به اقامتگاه"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
    
    </div>
  );
};

export default EditHouseEnvironmentDetails;
