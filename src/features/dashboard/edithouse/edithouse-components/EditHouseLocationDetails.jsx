import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import Loading from '../../../../ui/Loading';
import TextField from '../../../../ui/TextField';
import FormSelect from '../../../../ui/FormSelect';
import useFetchProvinces from '../../useFetchProvinces';
import useFetchCities from '../../useFetchCities';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

  const { data: cityData, isLoading: loadingCities } = useFetchCities(selectedProvince || undefined);
  const cities = cityData?.cities || [];

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInitialized = useRef(false);

  useEffect(() => {
    if (!initialized && houseData && houseData.address) {
      const lat = houseData.address.geography?.latitude || DEFAULT_LAT;
      const lng = houseData.address.geography?.longitude || DEFAULT_LNG;
      setLatitude(lat);
      setLongitude(lng);
      
      if (houseData.address.city) {
        setSelectedCity(houseData.address.city.id);
        setSelectedProvince(houseData.address.city.province_id || houseData.address.city.province?.id);
      }
      setInitialized(true);
    }
  }, [houseData, initialized]);

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
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapRef.current.setView([latitude, longitude], 11);
    }
  }, [latitude, longitude]);

  const handleProvinceChange = (option) => {
    setSelectedProvince(option.value);
    setSelectedCity(null);

    const province = provinces.find((p) => p.id === option.value);
    if (province) {
      setLatitude(province.latitude);
      setLongitude(province.longitude);

      if (markerRef.current && mapRef.current) {
        markerRef.current.setLatLng([province.latitude, province.longitude]);
        mapRef.current.setView([province.latitude, province.longitude], 11);
      }
    }
  };

  const handleCityChange = (option) => {
    setSelectedCity(option.value);

    const city = cities.find((c) => c.id === option.value);
    if (city) {
      setLatitude(city.latitude);
      setLongitude(city.longitude);

      if (markerRef.current && mapRef.current) {
        markerRef.current.setLatLng([city.latitude, city.longitude]);
        mapRef.current.setView([city.latitude, city.longitude], 11);
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

    const dataToSend = { city_id: selectedCity, latitude, longitude };
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

  if (isLoading) return <div className="min-h-[60vh] flex justify-center items-center"><Loading /></div>;

  const provinceOptions = provinces.map((p) => ({ value: p.id, label: p.name }));
  const cityOptions = cities.map((c) => ({ value: c.id, label: c.name }));

  const selectedProvinceOption = provinceOptions.find((opt) => opt.value === selectedProvince);
  const selectedCityOption = cityOptions.find((opt) => opt.value === selectedCity);

  return (
    <div className="relative p-4">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FormSelect
          label="استان"
          name="province"
          value={selectedProvinceOption || null}
          onChange={handleProvinceChange}
          options={provinceOptions}
          placeholder="انتخاب استان"
        />
        <FormSelect
          label="شهر"
          name="city"
          value={selectedCityOption || null}
          onChange={handleCityChange}
          options={cityOptions}
          disabled={!selectedProvince || loadingCities}
          placeholder={loadingCities ? 'در حال بارگزاری...' : 'انتخاب شهر'}
          errorMessages={errors.city_id}
        />
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
