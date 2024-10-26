import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import Loading from "../../../../ui/Loading";
import TextField from "../../../../ui/TextField";
import FormSelect from "../../../../ui/FormSelect";
import useFetchProvinces from "../../useFetchProvinces";
import useFetchCities from "../../useFetchCities";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const EditHouseLocationDetails = ({ data, token }) => {
  const { data: provinces = [], isLoading: loadingProvinces } = useFetchProvinces();
  const [selectedProvince, setSelectedProvince] = useState(data?.address?.city?.province?.id || '');
  const { data: cities = [], isLoading: loadingCities } = useFetchCities(selectedProvince);
  const [selectedCity, setSelectedCity] = useState(data?.address?.city?.id || '');

  const [latitude, setLatitude] = useState(data?.address?.geography?.latitude || 35.6892); // Default to Tehran
  const [longitude, setLongitude] = useState(data?.address?.geography?.longitude || 51.389); // Default to Tehran

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current && document.getElementById("map-container")) {
      // Initialize the map
      mapRef.current = L.map("map-container").setView([latitude, longitude], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Add a draggable marker
      markerRef.current = L.marker([latitude, longitude], { draggable: true }).addTo(mapRef.current);
      markerRef.current.on("dragend", function (e) {
        const coords = e.target.getLatLng();
        setLatitude(coords.lat);
        setLongitude(coords.lng);
        toast.success("موقعیت جدید انتخاب شد");
      });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (selectedCity && cities.length > 0) {
      const city = cities.find((city) => city.id === selectedCity);
      if (city) {
        setLatitude(city.latitude);
        setLongitude(city.longitude);
        if (mapRef.current) {
          mapRef.current.setView([city.latitude, city.longitude], 11);
          markerRef.current.setLatLng([city.latitude, city.longitude]);
        }
      }
    }
  }, [selectedCity, cities]);

  const handleSaveChanges = () => {
    toast.success("تغییرات ذخیره شدند (بدون ارسال)");
  };

  return (
    <div className="relative p-4">
      {loadingProvinces ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Province Selection */}
          <FormSelect
            label="استان"
            name="province"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            options={[
              { value: '', label: 'انتخاب استان' },
              ...provinces.map((province) => ({ value: province.id, label: province.name })),
            ]}
          />

          {/* City Selection */}
          <FormSelect
            label="شهر"
            name="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            options={
              loadingCities
                ? [{ value: '', label: 'در حال بارگذاری...' }]
                : [{ value: '', label: 'انتخاب شهر' }, ...cities.map((city) => ({ value: city.id, label: city.name }))]
            }
            disabled={!selectedProvince}
          />

          {/* Latitude and Longitude */}
          <div>
            <TextField label="عرض جغرافیایی" name="latitude" value={latitude} disabled />
          </div>
          <div>
            <TextField label="طول جغرافیایی" name="longitude" value={longitude} disabled />
          </div>

          {/* Map Container */}
          <div className="mt-6 w-full lg:col-span-2 rounded-lg overflow-hidden border h-64">
            <div id="map-container" style={{ height: "100%" }} />
          </div>

          {/* Save Button */}
          <div className="mt-4 w-full lg:col-span-2 flex justify-end">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-500 transition-colors duration-200"
              onClick={handleSaveChanges}
            >
              ذخیره موقعیت
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditHouseLocationDetails;
