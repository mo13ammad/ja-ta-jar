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

const EditHouseLocationDetails = ({ houseData, loadingHouse }) => {
  const { data: provinces = [], isLoading: loadingProvinces } = useFetchProvinces();
  
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [latitude, setLatitude] = useState(DEFAULT_LAT);
  const [longitude, setLongitude] = useState(DEFAULT_LNG);
  const [shouldSetView, setShouldSetView] = useState(false);

  const { data: cityData, isLoading: loadingCities } = useFetchCities(selectedProvince);
  const cities = cityData?.cities || [];

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInitialized = useRef(false);

  // Initialize location data based on houseData when it loads
  useEffect(() => {
    if (houseData && houseData.address) {
      const lat = houseData.address.geography?.latitude || DEFAULT_LAT;
      const lng = houseData.address.geography?.longitude || DEFAULT_LNG;
      setLatitude(lat);
      setLongitude(lng);

      if (houseData.address.city) {
        setSelectedCity(houseData.address.city.id);
        setSelectedProvince(houseData.address.city.province.id);
      } else if (houseData.address.city?.province) {
        setSelectedProvince(houseData.address.city.province.id);
      }
    }
  }, [houseData]);

  // Initialize the map once when data is loaded
  useEffect(() => {
    if (!loadingHouse && !loadingProvinces && !mapInitialized.current && document.getElementById("map-container")) {
      mapInitialized.current = true;

      mapRef.current = L.map("map-container").setView([latitude, longitude], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      markerRef.current = L.marker([latitude, longitude], { draggable: true }).addTo(mapRef.current);

      // Handle marker drag to set new lat/lng without changing map view
      markerRef.current.on("dragend", (e) => {
        const coords = e.target.getLatLng();
        setLatitude(coords.lat);
        setLongitude(coords.lng);
        setShouldSetView(false); // No view update for user-dragged marker
        toast.success("موقعیت جدید انتخاب شد");
      });

      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setLatitude(lat);
        setLongitude(lng);
        markerRef.current.setLatLng([lat, lng]);
        setShouldSetView(false); // No view update for user-clicked map
        toast.success("موقعیت جدید انتخاب شد");
      });
    }
  }, [loadingHouse, loadingProvinces, latitude, longitude]);

  // Conditionally update map view based on shouldSetView
  useEffect(() => {
    if (mapInitialized.current && shouldSetView) {
      mapRef.current.setView([latitude, longitude], 11);
      setShouldSetView(false); // Reset after setting the view
    }
    if (mapInitialized.current && markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    }
  }, [latitude, longitude, shouldSetView]);

  // Update latitude and longitude when the selected province changes
  useEffect(() => {
    if (selectedProvince) {
      const selectedProvinceData = provinces.find((province) => province.id === selectedProvince);
      if (selectedProvinceData) {
        setLatitude(selectedProvinceData.latitude);
        setLongitude(selectedProvinceData.longitude);
        setShouldSetView(true); // Set view when province changes
      }
      setSelectedCity(""); // Reset city when province changes
    }
  }, [selectedProvince, provinces]);

  // Update latitude and longitude when the selected city changes
  useEffect(() => {
    if (selectedCity && cities.length > 0) {
      const city = cities.find((city) => city.id === selectedCity);
      if (city) {
        setLatitude(city.latitude);
        setLongitude(city.longitude);
        setShouldSetView(true); // Set view when city changes
      }
    }
  }, [selectedCity, cities]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
  };

  const handleSaveChanges = () => {
    toast.success("تغییرات ذخیره شدند (بدون ارسال)");
  };

  if (loadingHouse || loadingProvinces) return <Loading />;

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
