import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Switch, Listbox } from '@headlessui/react';

const environmentTexturesOptions = [
  { key: 'Village', label: 'روستایی', color: '#ffa800', icon: 'https://portal1.jatajar.com/storage/svg/cache/fas-cow.svg' },
  { key: 'Forest', label: 'جنگلی', color: '#42ff00', icon: 'https://portal1.jatajar.com/storage/svg/cache/gmdi-forest-o.svg' },
  { key: 'Beach', label: 'ساحلی', color: '#00f7ff', icon: 'https://portal1.jatajar.com/storage/svg/cache/maki-beach.svg' },
  { key: 'City', label: 'شهری', color: '#f00000', icon: 'https://portal1.jatajar.com/storage/svg/cache/hugeicons-city-01.svg' },
  { key: 'Mountainou', label: 'کوهستانی', color: '#00ffb3', icon: 'https://portal1.jatajar.com/storage/svg/cache/maki-mountain.svg' },
  { key: 'Desert', label: 'کویری', color: '#f0e00a', icon: 'https://portal1.jatajar.com/storage/svg/cache/gameicon-desert.svg' },
];

const viewOptions = [
  { key: 'MountainView', label: 'رو به کوهستان', color: '#ffa800', icon: 'https://portal1.jatajar.com/storage/svg/cache/phosphor-mountains-light.svg' },
  { key: 'ForestView', label: 'رو به جنگل', color: '#42ff00', icon: 'https://portal1.jatajar.com/storage/svg/cache/gmdi-forest-o.svg' },
  { key: 'SeaView', label: 'رو به دریا', color: '#00f7ff', icon: 'https://portal1.jatajar.com/storage/svg/cache/iconoir-sea-and-sun.svg' },
  { key: 'Facingriver', label: 'رو به رودخانه', color: '#1532e0', icon: 'https://portal1.jatajar.com/storage/svg/cache/carbon-chart-river.svg' },
];

const neighbourOptions = [
  { key: 'Wall', label: 'دیوار به دیوار', color: '#ff0000', icon: 'https://portal1.jatajar.com/storage/svg/cache/iconoir-neighbourhood.svg' },
  { key: 'Scattered', label: 'پراکنده', color: '#faff00', icon: 'https://portal1.jatajar.com/storage/svg/cache/healthicons-f-village.svg' },
  { key: 'EmptyNeighbour', label: 'بدون همسایه', color: '#00ff19', icon: 'https://portal1.jatajar.com/storage/svg/cache/fontisto-holiday-village.svg' },
];

const accessRouteOptions = [
  { key: 'Asphalt', label: 'آسفالت', color: '#00ff19', icon: 'https://portal1.jatajar.com/storage/svg/cache/hugeicons-road.svg' },
  { key: 'Earthy', label: 'خاکی', color: '#faff00', icon: 'https://portal1.jatajar.com/storage/svg/cache/fas-road-circle-exclamation.svg' },
  { key: 'Donkey', label: 'مال رو', color: '#ff0000', icon: 'https://portal1.jatajar.com/storage/svg/cache/fas-road-barrier.svg' },
];

const EnvironmentDetails = ({ data, token, houseUuid }) => {
  const [selectedTextures, setSelectedTextures] = useState([]);
  const [selectedViews, setSelectedViews] = useState([]);
  const [accessMethod, setAccessMethod] = useState(data?.arrival_description || '');
  const [view, setView] = useState(data?.view_description || '');
  const [selectedNeighbour, setSelectedNeighbour] = useState(data?.neighbour?.key || neighbourOptions[0].key);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (data?.areas) {
      setSelectedTextures(data.areas.map(area => area.key));
    }
    if (data?.views) {
      setSelectedViews(data.views.map(view => view.key));
    }
    if (data?.arrivals) {
      setSelectedRoutes(data.arrivals.map(route => route.key));
    }
  }, [data]);

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

  const handleSubmit = async () => {
    setLoadingSubmit(true);

    const requestData = {
      arrival_description: accessMethod,
      view_description: view,
      areas: selectedTextures,
      views: selectedViews,
      neighbour: selectedNeighbour,
      arrivals: selectedRoutes,
    };

    try {
      const response = await axios.post(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}`,
        {
          ...requestData,
          _method: 'PUT',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.success('اطلاعات با موفقیت ثبت شد');
      } else {
        toast.error('خطایی در ثبت اطلاعات پیش آمد');
      }
    } catch (error) {
      toast.error('متاسفانه مشکلی پیش آمده لطفا دوباره امتحان کنید');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <Toaster />
      <div className="flex-1 overflow-y-auto scrollbar-thin max-h-full pl-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Access Method */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">شیوه دسترسی به اقامتگاه</label>
            <textarea
              value={accessMethod}
              onChange={(e) => setAccessMethod(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="شیوه دسترسی به اقامتگاه"
            />
          </div>

          {/* View */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">منظره اقامتگاه</label>
            <textarea
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="block p-2 border outline-none focus:border-2 rounded-xl w-full"
              placeholder="منظره اقامتگاه"
            />
          </div>

          {/* Environment Texture */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">بافت محیط</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {environmentTexturesOptions.map((option) => (
                <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
                  <Switch
                    checked={selectedTextures.includes(option.key)}
                    onChange={() => toggleTexture(option.key)}
                    className={`relative inline-flex ml-1.5 items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 
                      ${selectedTextures.includes(option.key) ? 'bg-green-500' : 'bg-gray-200'}
                    `}
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
                  <Switch.Label className="ml-3 text-sm font-medium text-gray-700">{option.label}</Switch.Label>
                </Switch.Group>
              ))}
            </div>
          </div>

          {/* View Options */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">منظره اقامتگاه</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {viewOptions.map((option) => (
                <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
                  <Switch
                    checked={selectedViews.includes(option.key)}
                    onChange={() => toggleView(option.key)}
                    className={`relative inline-flex ml-1.5 items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 
                      ${selectedViews.includes(option.key) ? 'bg-green-500' : 'bg-gray-200'}
                    `}
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
                  <Switch.Label className="ml-3 text-sm font-medium text-gray-700">{option.label}</Switch.Label>
                </Switch.Group>
              ))}
            </div>
          </div>

          {/* Neighbour Dropdown */}
          <div className="mt-4 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع همسایگی</label>
            <Listbox value={selectedNeighbour} onChange={setSelectedNeighbour}>
              {({ open }) => (
                <div className="relative">
                  <Listbox.Button className="p-2 border rounded-xl w-1/2 text-left flex justify-between items-center relative z-10">
                    <span>
                      {neighbourOptions.find(option => option.key === selectedNeighbour)?.label || 'انتخاب نوع همسایگی'}
                    </span>
                    <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">مسیر دسترسی</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {accessRouteOptions.map((option) => (
                <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
                  <Switch
                    checked={selectedRoutes.includes(option.key)}
                    onChange={() => toggleRoute(option.key)}
                    className={`relative inline-flex ml-1.5 items-center h-6 w-6 rounded-full transition-colors ease-in-out duration-200 
                      ${selectedRoutes.includes(option.key) ? 'bg-green-500' : 'bg-gray-200'}
                    `}
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
                  <Switch.Label className="ml-3 text-sm font-medium text-gray-700">{option.label}</Switch.Label>
                </Switch.Group>
              ))}
            </div>
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

export default EnvironmentDetails;
