import React, { useState, useEffect } from "react";
import axios from "axios";
import { Listbox } from "@headlessui/react";
import { toast, Toaster } from "react-hot-toast";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix the default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const LocationDetails = () => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [errors, setErrors] = useState({ province_id: null, city_id: null });
  const [location, setLocation] = useState({ lat: 35.6892, lng: 51.3890 }); // Default to Tehran
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://portal1.jatajar.com/api/assets/province");
        setProvinces(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        toast.error("خطا در بارگذاری استان‌ها");
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(`https://portal1.jatajar.com/api/assets/province/${selectedProvince}/cities`);
          setCities(response.data.data.cities || []);
        } catch (error) {
          console.error("Error fetching cities:", error);
          toast.error("خطا در بارگذاری شهرها");
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedProvince]);

  const renderErrorMessages = (error) => {
    return error ? <div className="text-red-500 text-sm">{error}</div> : null;
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setMarkerPosition(e.latlng);
        setLocation(e.latlng);
      },
    });

    return markerPosition ? <Marker position={markerPosition}></Marker> : null;
  };

  return (
    <div className="relative w-5/6 h-5/6">
      <Toaster />
      <div className="overflow-auto scrollbar-thin max-h-[80vh] pr-2 w-full min-h-[70vh]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Province */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">استان</label>
            <Listbox value={selectedProvince} onChange={setSelectedProvince} open={provinceOpen} onClick={() => setProvinceOpen(!provinceOpen)}>
              {({ open }) => (
                <>
                  <div className="relative mt-1">
                    <span className="block p-2 border rounded-xl w-full cursor-pointer">
                      {provinces.find(province => province.id === selectedProvince)?.name || 'انتخاب استان'}
                    </span>
                    <Listbox.Button className="absolute inset-y-0 left-4 flex items-center pr-2">
                      <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </Listbox.Button>
                    <Listbox.Options className={`absolute mt-2 w-full border rounded-xl bg-white shadow-lg scrollbar-thin ${open ? 'block z-10' : 'hidden'} max-h-60 overflow-y-auto`}>
                      {provinces.map((province) => (
                        <Listbox.Option key={province.id} value={province.id} className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${province.id === selectedProvince ? 'bg-gray-100' : ''}`}>
                          {province.name}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </>
              )}
            </Listbox>
            {renderErrorMessages(errors.province_id)}
          </div>
          {/* City */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">شهر</label>
            <Listbox value={selectedCity} onChange={setSelectedCity} open={cityOpen} onClick={() => setCityOpen(!cityOpen)} disabled={!selectedProvince}>
              {({ open }) => (
                <>
                  <div className="relative mt-1">
                    <span className="block p-2 border rounded-xl w-full cursor-pointer">
                      {cities.find(city => city.id === selectedCity)?.name || 'انتخاب شهر'}
                    </span>
                    <Listbox.Button className="absolute inset-y-0 left-4 flex items-center pr-2">
                      <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </Listbox.Button>
                    <Listbox.Options className={`absolute scrollbar-thin mt-2 w-full border rounded-xl bg-white shadow-lg ${open ? 'block z-10' : 'hidden'} max-h-60 overflow-y-auto`}>
                      {cities.map((city) => (
                        <Listbox.Option key={city.id} value={city.id} className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${city.id === selectedCity ? 'bg-gray-100' : ''}`}>
                          {city.name}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </>
              )}
            </Listbox>
            {renderErrorMessages(errors.city_id)}
          </div>
        </div>
        {/* Map */}
        <div className="mt-10">
          <label className="block text-sm font-medium text-gray-700 mb-2">انتخاب موقعیت</label>
          <MapContainer center={location} zoom={13} scrollWheelZoom={false} className="h-64 rounded-xl">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;
