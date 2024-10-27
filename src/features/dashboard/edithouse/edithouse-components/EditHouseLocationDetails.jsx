import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import Loading from "../../../../ui/Loading";
import TextField from "../../../../ui/TextField";
import FormSelect from "../../../../ui/FormSelect";
import useFetchProvinces from "../../useFetchProvinces";
import useFetchCities from "../../useFetchCities";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const DEFAULT_LAT = 35.6892; // Tehran latitude
const DEFAULT_LNG = 51.389; // Tehran longitude

const EditHouseLocationDetails = ({ userData, loadingUser }) => {
  const { data: provinces = [], isLoading: loadingProvinces } = useFetchProvinces();
  
  // State to manage selected province, city, latitude, and longitude
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [latitude, setLatitude] = useState(DEFAULT_LAT);
  const [longitude, setLongitude] = useState(DEFAULT_LNG);

  const { data: cityData, isLoading: loadingCities } = useFetchCities(selectedProvince);
  const cities = cityData?.cities || [];

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInitialized = useRef(false);

  // Set initial location data after userData is loaded
  useEffect(() => {
    if (userData && userData.city) {
      setSelectedProvince(userData.city.province.id);
      setSelectedCity(userData.city.id);
      setLatitude(userData.city.latitude);
      setLongitude(userData.city.longitude);
    } else if (userData && userData.city?.province) {
      setSelectedProvince(userData.city.province.id);
      setLatitude(userData.city.province.latitude);
      setLongitude(userData.city.province.longitude);
    }
  }, [userData]);

  // Initialize the map only when userData is loaded
  useEffect(() => {
    if (!loadingUser && !loadingProvinces && !mapInitialized.current && document.getElementById("map-container")) {
      mapInitialized.current = true;

      mapRef.current = L.map("map-container").setView([latitude, longitude], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      markerRef.current = L.marker([latitude, longitude], { draggable: true }).addTo(mapRef.current);

      markerRef.current.on("dragend", (e) => {
        const coords = e.target.getLatLng();
        setLatitude(coords.lat);
        setLongitude(coords.lng);
        toast.success("موقعیت جدید انتخاب شد");
      });

      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setLatitude(lat);
        setLongitude(lng);
        markerRef.current.setLatLng([lat, lng]);
        toast.success("موقعیت جدید انتخاب شد");
      });
    }
  }, [loadingUser, loadingProvinces, latitude, longitude]);

  // Update marker position on map when latitude or longitude changes
  useEffect(() => {
    if (mapInitialized.current && markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapRef.current.setView([latitude, longitude], 11);
    }
  }, [latitude, longitude]);

  // Update location when a new city is selected
  useEffect(() => {
    if (selectedCity && cities.length > 0) {
      const city = cities.find((city) => city.id === selectedCity);
      if (city) {
        setLatitude(city.latitude);
        setLongitude(city.longitude);
      }
    }
  }, [selectedCity, cities]);

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedCity("");
    
    const selectedProvinceData = provinces.find((province) => province.id === provinceId);
    if (selectedProvinceData) {
      setLatitude(selectedProvinceData.latitude);
      setLongitude(selectedProvinceData.longitude);
    }
  };

  const handleSaveChanges = () => {
    toast.success("تغییرات ذخیره شدند (بدون ارسال)");
  };

  if (loadingUser || loadingProvinces) return <Loading />;

  return (
    <div className="relative p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Province Selection */}
        <FormSelect
          label="استان"
          name="province"
          value={selectedProvince}
          onChange={handleProvinceChange}
          options={[
            { value: "", label: "انتخاب استان" },
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
            !selectedProvince
              ? [{ value: "", label: "لطفا ابتدا استان را انتخاب کنید" }]
              : loadingCities
              ? [{ value: "", label: "در حال بارگذاری..." }]
              : [{ value: "", label: "انتخاب شهر" }, ...cities.map((city) => ({ value: city.id, label: city.name }))]
          }
          disabled={!selectedProvince}
        />

        {/* Latitude and Longitude */}
        <div>
          <TextField label="عرض جغرافیایی" name="latitude" value={latitude} readOnly />
        </div>
        <div>
          <TextField label="طول جغرافیایی" name="longitude" value={longitude} readOnly />
        </div>

        {/* Map Container */}
        <div className="mt-6 w-full shadow-centered lg:col-span-2 rounded-lg overflow-hidden border h-64">
          <div id="map-container" style={{ height: "100%" }} />
        </div>

        {/* Save Button */}
        <div className="mt-4 w-full lg:col-span-2 flex justify-end">
          <button
            className="btn bg-primary-600 text-white px-4 py-2 shadow-lg hover:bg-primary-800 transition-colors duration-200"
            onClick={handleSaveChanges}
          >
            ذخیره موقعیت
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHouseLocationDetails;
