import React, { useState, useEffect, useRef, Fragment } from 'react';
import { toast } from 'react-hot-toast';
import Loading from '../../../../ui/Loading';
import TextField from '../../../../ui/TextField';
import useFetchProvinces from '../../useFetchProvinces';
import useFetchCities from '../../useFetchCities';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import customMarkerImage from '../../../../../public/assets/location.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: customMarkerImage,
  iconUrl: customMarkerImage,
  shadowUrl: null,
});

const customMarkerIcon = new L.Icon({
  iconUrl: customMarkerImage,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const DEFAULT_LAT = 35.6892;
const DEFAULT_LNG = 51.389;

const EditHouseLocationDetails = ({
  houseData,
  loadingHouse,
  isFetching,
  handleEditHouse,
  editLoading,
  editError,
}) => {
  const { data: provinces = [], isLoading: loadingProvinces } = useFetchProvinces();
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [latitude, setLatitude] = useState(DEFAULT_LAT);
  const [longitude, setLongitude] = useState(DEFAULT_LNG);
  const [errors, setErrors] = useState({});
  const [initialized, setInitialized] = useState(false);

  const { data: citiesData = [], isLoading: loadingCities } = useFetchCities(selectedProvince?.value);
  const [cityOptions, setCityOptions] = useState([]);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInitialized = useRef(false);

  useEffect(() => {
    if (!initialized && houseData && !loadingProvinces) {
      const lat = houseData.address?.geography?.latitude || DEFAULT_LAT;
      const lng = houseData.address?.geography?.longitude || DEFAULT_LNG;
      
      const cityId = houseData.address?.city?.id || null;
      const provinceName = houseData.address?.province?.name || houseData.address?.city?.province?.name || null;

      console.log("Initial houseData city ID:", cityId);
      console.log("Initial houseData province name:", provinceName);

      if (provinceName) {
        const province = provinces.find((p) => p.name === provinceName);
        if (province) {
          setSelectedProvince({ value: province.id, label: province.name });
        }
      }

      setLatitude(lat);
      setLongitude(lng);
      setInitialized(true);
    }
  }, [houseData, initialized, provinces, loadingProvinces]);

  useEffect(() => {
    if (!loadingCities && citiesData.cities) {
      const options = citiesData.cities.map((city) => ({
        value: city.id,
        label: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
      }));
      console.log("Setting city options from citiesData:", options);
      setCityOptions(options);
    }
  }, [citiesData, loadingCities]);

  useEffect(() => {
    if (cityOptions.length && houseData?.address?.city?.id && !selectedCity) {
      const cityId = houseData.address.city.id;
      const matchingCity = cityOptions.find((c) => c.value === cityId);
      console.log("Matching city found for initial selection:", matchingCity);
      if (matchingCity) {
        setSelectedCity(matchingCity);
        setLatitude(matchingCity.latitude);
        setLongitude(matchingCity.longitude);
      }
    }
  }, [cityOptions, houseData, selectedCity]);

  useEffect(() => {
    if (!loadingHouse && !loadingProvinces && mapContainerRef.current && !mapInitialized.current) {
      mapInitialized.current = true;

      mapRef.current = L.map(mapContainerRef.current).setView([latitude, longitude], 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);

      markerRef.current = L.marker([latitude, longitude], {
        draggable: true,
        icon: customMarkerIcon,
      }).addTo(mapRef.current);

      markerRef.current.on('dragend', (e) => {
        const coords = e.target.getLatLng();
        setLatitude(coords.lat);
        setLongitude(coords.lng);
        toast.success('موقعیت جدید انتخاب شد');
      });

      mapRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setLatitude(lat);
        setLongitude(lng);
        markerRef.current.setLatLng([lat, lng]);
        toast.success('موقعیت جدید انتخاب شد');
      });
    }
  }, [loadingHouse, loadingProvinces]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    }
    if (mapRef.current) {
      mapRef.current.setView([latitude, longitude], 11);
    }
  }, [latitude, longitude]);

  const handleProvinceChange = (option) => {
    setSelectedProvince(option);
    setSelectedCity(null);
    setCityOptions([]);

    if (option) {
      const province = provinces.find((p) => p.id === option.value);
      if (province) {
        setLatitude(province.latitude);
        setLongitude(province.longitude);

        if (markerRef.current && mapRef.current) {
          markerRef.current.setLatLng([province.latitude, province.longitude]);
          mapRef.current.setView([province.latitude, province.longitude], 11);
        }
      }
    }
  };

  const handleCityChange = (option) => {
    setSelectedCity(option);

    if (option) {
      const city = cityOptions.find((c) => c.value === option.value);
      if (city) {
        setLatitude(city.latitude);
        setLongitude(city.longitude);

        if (markerRef.current && mapRef.current) {
          markerRef.current.setLatLng([city.latitude, city.longitude]);
          mapRef.current.setView([city.latitude, city.longitude], 11);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!selectedCity) {
      setErrors((prev) => ({ ...prev, city_id: ['لطفاً یک شهر را انتخاب کنید.'] }));
      toast.error('لطفاً یک شهر را انتخاب کنید.');
      return;
    }

    const dataToSend = { city_id: selectedCity.value, latitude, longitude };
    try {
      await handleEditHouse(dataToSend);
      toast.success('موقعیت مکانی با موفقیت به‌روزرسانی شد');
    } catch (error) {
      console.error('Error submitting data:', error);
      if (error.response?.data?.errors?.fields) {
        setErrors(error.response.data.errors.fields);
      }
      toast.error('خطایی رخ داده است.');
    }
  };

  const isLoading = loadingHouse || isFetching || loadingProvinces;

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loading />
      </div>
    );

  const provinceOptions = provinces.map((p) => ({ value: p.id, label: p.name }));

  return (
    <div className="relative p-4">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-2">استان</label>
          <Listbox value={selectedProvince} onChange={handleProvinceChange} disabled={loadingProvinces}>
            {({ open }) => (
              <div className="relative bg-white rounded-xl">
                <Listbox.Button className="listbox__button">
                  <span>
                    {selectedProvince?.label || (loadingProvinces ? 'در حال بارگزاری...' : 'انتخاب استان')}
                  </span>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      open ? 'rotate-180' : 'rotate-0'
                    }`}
                    aria-hidden="true"
                  />
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {provinceOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                            active ? 'bg-secondary-100 text-secondary-700' : 'text-gray-900'
                          }`
                        }
                      >
                        <span className="block truncate font-normal">{option.label}</span>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
        </div>
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-2">شهر</label>
          <Listbox value={selectedCity} onChange={handleCityChange} disabled={!selectedProvince || loadingCities}>
            {({ open }) => (
              <div className="relative bg-white rounded-xl">
                <Listbox.Button className="listbox__button">
                  <span>{loadingCities ? 'در حال بارگزاری...' : selectedCity?.label || 'انتخاب شهر'}</span>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      open ? 'rotate-180' : 'rotate-0'
                    }`}
                    aria-hidden="true"
                  />
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {cityOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                            active ? 'bg-secondary-100 text-secondary-700' : 'text-gray-900'
                          }`
                        }
                      >
                        <span className="block truncate font-normal">{option.label}</span>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
          {errors.city_id && <p className="mt-2 text-sm text-red-600">{errors.city_id[0]}</p>}
        </div>
        <div>
          <TextField label="عرض جغرافیایی" name="latitude" value={latitude} readOnly />
        </div>
        <div>
          <TextField label="طول جغرافیایی" name="longitude" value={longitude} readOnly />
        </div>
        <div className="mt-6 w-full shadow-centered lg:col-span-2 rounded-lg overflow-hidden border h-64">
          <div id="map-container" ref={mapContainerRef} style={{ height: '400px' }} />
        </div>
        {Object.keys(errors).length > 0 && (
          <div className="text-red-500 col-span-2">خطایی در ثبت اطلاعات وجود دارد. لطفا موارد زیر را بررسی کنید.</div>
        )}
        <div className="mt-4 w-full lg:col-span-2 flex justify-end">
          <button
            type="submit"
            className="btn bg-primary-600 text-white px-4 py-2 shadow-lg hover:bg-primary-800 transition-colors duration-200"
            disabled={editLoading}
          >
            {editLoading ? 'در حال ذخیره...' : 'ثبت موقعیت'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHouseLocationDetails;
