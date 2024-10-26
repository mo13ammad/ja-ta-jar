import React, { useState } from "react";
import { Switch, Listbox } from "@headlessui/react";
import Spinner from "../../../../ui/Loading";

const EditHouseEnvironmentDetails = () => {
  // Static data for demo purposes
  const environmentTexturesOptions = [
    { key: 'forest', label: 'جنگل' },
    { key: 'desert', label: 'بیابان' },
    { key: 'mountain', label: 'کوهستان' }
  ];

  const viewOptions = [
    { key: 'sea', label: 'دریا' },
    { key: 'lake', label: 'دریاچه' },
    { key: 'city', label: 'شهر' }
  ];

  const neighbourOptions = [
    { key: 'quiet', label: 'محله آرام' },
    { key: 'busy', label: 'محله پر تردد' }
  ];

  const accessRouteOptions = [
    { key: 'road', label: 'جاده' },
    { key: 'trail', label: 'مسیر پیاده' }
  ];

  // UI state management
  const [selectedTextures, setSelectedTextures] = useState([]);
  const [selectedViews, setSelectedViews] = useState([]);
  const [selectedNeighbour, setSelectedNeighbour] = useState('');
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [accessMethod, setAccessMethod] = useState('');
  const [view, setView] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // UI Toggles for textures, views, routes
  const toggleTexture = (key) => {
    setSelectedTextures((prevSelected) =>
      prevSelected.includes(key)
        ? prevSelected.filter((texture) => texture !== key)
        : [...prevSelected, key]
    );
  };

  const toggleView = (key) => {
    setSelectedViews((prevSelected) =>
      prevSelected.includes(key)
        ? prevSelected.filter((view) => view !== key)
        : [...prevSelected, key]
    );
  };

  const toggleRoute = (key) => {
    setSelectedRoutes((prevSelected) =>
      prevSelected.includes(key)
        ? prevSelected.filter((route) => route !== key)
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

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-thin max-h-full pl-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Environment Texture */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">بافت محیط</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {environmentTexturesOptions.map((option) => (
                <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Switch
                      checked={selectedTextures.includes(option.key)}
                      onChange={() => toggleTexture(option.key)}
                      className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1
                        ${selectedTextures.includes(option.key) ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                      {selectedTextures.includes(option.key) && (
                        <svg
                          className="w-4 h-4 text-white absolute inset-0 m-auto"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
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
                      onChange={() => toggleView(option.key)}
                      className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1
                        ${selectedViews.includes(option.key) ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                      {selectedViews.includes(option.key) && (
                        <svg
                          className="w-4 h-4 text-white absolute inset-0 m-auto"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
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

          {/* View Text Area */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">توضیحات منظره اقامتگاه</label>
            <textarea
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="توضیحات منظره اقامتگاه"
            />
          </div>

          {/* Neighbour Dropdown */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">نوع همسایگی</label>
            <Listbox value={selectedNeighbour} onChange={setSelectedNeighbour}>
              {({ open }) => (
                <div className="relative">
                  <Listbox.Button className="p-2 border rounded-xl w-1/2 text-left flex justify-between items-center relative z-10">
                    <span>
                      {neighbourOptions.find(option => option.key === selectedNeighbour)?.label || 'انتخاب نوع همسایگی'}
                    </span>
                    <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Listbox.Button>

                  <Listbox.Options className="absolute mt-2 w-1/2 border rounded-xl bg-white shadow-lg max-h-60 overflow-y-auto z-20">
                    {neighbourOptions.map(option => (
                      <Listbox.Option key={option.key} value={option.key} className="cursor-pointer px-4 py-2 hover:bg-gray-200">
                        {option.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              )}
            </Listbox>
          </div>

          {/* Access Route (Check Boxes) */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">مسیر دسترسی</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {accessRouteOptions.map((option) => (
                <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Switch
                      checked={selectedRoutes.includes(option.key)}
                      onChange={() => toggleRoute(option.key)}
                      className={`relative inline-flex items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1
                        ${selectedRoutes.includes(option.key) ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                      {selectedRoutes.includes(option.key) && (
                        <svg
                          className="w-4 h-4 text-white absolute inset-0 m-auto"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
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

          {/* Access Method Text Area */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">توضیحات شیوه دسترسی به اقامتگاه</label>
            <textarea
              value={accessMethod}
              onChange={(e) => setAccessMethod(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="توضیحات شیوه دسترسی به اقامتگاه"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? 'در حال بارگذاری...' : 'ثبت اطلاعات'}
        </button>
      </div>
    </div>
  );
};

export default EditHouseEnvironmentDetails;
