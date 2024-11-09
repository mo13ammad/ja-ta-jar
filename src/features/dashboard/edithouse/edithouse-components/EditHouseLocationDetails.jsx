import React, { useState, useEffect, useRef, Fragment } from 'react';
import { toast } from 'react-hot-toast';
import { Listbox, Transition } from '@headlessui/react';
import Loading from '../../../../ui/Loading';
import TextField from '../../../../ui/TextField';
import useFetchProvinces from '../../useFetchProvinces';
import useFetchCities from '../../useFetchCities';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import customMarkerImage from '../../../../../public/assets/location.png';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

// Configure custom marker icon
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
  refetchHouseData,
}) => {
  const { data: provinces = [], isLoading: loadingProvinces, error: provincesError } = useFetchProvinces();
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [latitude, setLatitude] = useState(DEFAULT_LAT);
  const [longitude, setLongitude] = useState(DEFAULT_LNG);
  const [errors, setErrors] = useState({});
  const [cityOptions, setCityOptions] = useState([]);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  console.log("Component Rendered");

  // Log loading state for each data source
  console.log("Loading house data:", loadingHouse, "Provinces loading:", loadingProvinces, "Cities loading:", isFetching);

  useEffect(() => {
    if (provincesError) {
      console.error("Error fetching provinces:", provincesError);
      toast.error("خطا در بارگیری استان‌ها");
    }
  }, [provincesError]);

  // Initialize data from houseData
  useEffect(() => {
    if (houseData && provinces.length) {
      console.log("Initializing house data", houseData);
      const initialLat = houseData.address?.geography?.latitude || DEFAULT_LAT;
      const initialLng = houseData.address?.geography?.longitude || DEFAULT_LNG;
      setLatitude(initialLat);
      setLongitude(initialLng);
      console.log("Set initial latitude and longitude:", initialLat, initialLng);

      const provinceName = houseData.address?.province?.name || houseData.address?.city?.province?.name;
      const cityName = houseData.address?.city?.name;
      const initialProvince = provinces.find((p) => p.name === provinceName);

      if (initialProvince) {
        setSelectedProvince({ value: initialProvince.id, label: initialProvince.name });
        setCityOptions(houseData.address.city ? [{ value: houseData.address.city.id, label: cityName }] : []);
        console.log("Set initial city options based on house data:", cityOptions);
      }
    }
  }, [houseData, provinces]);

  const { data: citiesData, isLoading: loadingCities, error: citiesError } = useFetchCities(selectedProvince?.value);

  useEffect(() => {
    if (citiesError) {
      console.error("Error fetching cities:", citiesError);
      toast.error("خطا در بارگیری شهرها");
    }

    if (selectedProvince && citiesData?.cities) {
      console.log("Fetching cities for selected province", selectedProvince);
      const newCityOptions = citiesData.cities.map((city) => ({
        value: city.id,
        label: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
      }));
      setCityOptions(newCityOptions);
      console.log("Set city options based on selected province:", newCityOptions);
    }
  }, [selectedProvince, citiesData, citiesError]);

  // Initialize the map
  const initializeMap = (latitude, longitude) => {
    console.log("Initializing map with coordinates:", latitude, longitude);
    if (!mapRef.current && mapContainerRef.current) {
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
        console.log("Marker dragged to:", coords.lat, coords.lng);
        toast.success('موقعیت جدید انتخاب شد');
      });

      mapRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setLatitude(lat);
        setLongitude(lng);
        markerRef.current.setLatLng([lat, lng]);
        console.log("Map clicked and marker moved to:", lat, lng);
        toast.success('موقعیت جدید انتخاب شد');
      });
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      console.log("Attempting to initialize map for the first time");
      initializeMap(latitude, longitude);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([latitude, longitude], 11);
      markerRef.current.setLatLng([latitude, longitude]);
      console.log("Map and marker view updated to:", latitude, longitude);
    }
  }, [latitude, longitude]);

  const handleProvinceChange = (option) => {
    console.log("Province changed to:", option);
    setSelectedProvince(option);
    setSelectedCity(null);
    setCityOptions([]);
  };

  const handleCityChange = (option) => {
    console.log("City changed to:", option);
    setSelectedCity(option);
    setLatitude(option.latitude);
    setLongitude(option.longitude);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with selected city:", selectedCity, "and coordinates:", latitude, longitude);
    setErrors({});

    if (!selectedCity) {
      setErrors((prev) => ({ ...prev, city_id: ['لطفاً یک شهر را انتخاب کنید.'] }));
      toast.error('لطفاً یک شهر را انتخاب کنید.');
      return;
    }

    const dataToSend = { city_id: selectedCity.value, latitude, longitude };

    try {
      console.log("Sending data to handleEditHouse:", dataToSend);
      await handleEditHouse(dataToSend);
      refetchHouseData(); // Trigger refetch after successful edit
      toast.success('موقعیت مکانی با موفقیت به‌روزرسانی شد');
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      if (error.response?.data?.errors?.fields) {
        setErrors(error.response.data.errors.fields);
      }
      toast.error('خطایی رخ داده است.');
    }
  };

  const isLoading = loadingHouse || isFetching || loadingProvinces || loadingCities;
  console.log("Loading state:", isLoading);

  if (isLoading) {
    console.log("Component is loading...");
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  const provinceOptions = provinces.map((p) => ({ value: p.id, label: p.name }));
  console.log("Province options:", provinceOptions);

  return (
    <div className="relative p-4">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-2">استان</label>
          <Listbox value={selectedProvince} onChange={handleProvinceChange} disabled={loadingProvinces}>
            {({ open }) => (
              <div className="relative bg-white rounded-xl">
                <Listbox.Button className="listbox__button">
                  <span>{loadingProvinces ? 'در حال بارگزاری...' : selectedProvince?.label || 'انتخاب استان'}</span>
                  <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} aria-hidden="true" />
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {provinceOptions.map((option) => (
                      <Listbox.Option key={option.value} value={option} className={({ active }) => `cursor-pointer select-none relative py-2 pl-10 pr-4 ${active ? 'bg-secondary-100 text-secondary-700' : 'text-gray-900'}`}>
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
                  <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} aria-hidden="true" />
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {cityOptions.map((option) => (
                      <Listbox.Option key={option.value} value={option} className={({ active }) => `cursor-pointer select-none relative py-2 pl-10 pr-4 ${active ? 'bg-secondary-100 text-secondary-700' : 'text-gray-900'}`}>
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

        <div className="mt-6 w-full shadow-centered rounded-lg overflow-hidden border h-20" ref={mapContainerRef} />

        <div className="mt-4 w-full lg:col-span-2 flex justify-end">
          <button type="submit" className="btn bg-primary-600 text-white px-4 py-2 shadow-lg hover:bg-primary-800 transition-colors duration-200" disabled={editLoading}>
            {editLoading ? 'در حال ذخیره...' : 'ثبت موقعیت'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHouseLocationDetails;
