import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Listbox, Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast, Toaster } from "react-hot-toast";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Spinner from "../../Spinner";

// Fix the default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationDetails = ({ data, onSave }) => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(data?.address?.city?.province?.id || null);
  const [selectedCity, setSelectedCity] = useState(data?.address?.city?.id || null);
  const [latitude, setLatitude] = useState(data?.address?.geography?.latitude || null);
  const [longitude, setLongitude] = useState(data?.address?.geography?.longitude || null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Format latitude and longitude to 5 decimal places
  const formatCoord = (coord) => (coord !== null ? parseFloat(coord).toFixed(5) : "");

  // Fetch provinces and cities when component mounts or selectedProvince changes
  useEffect(() => {
    const fetchProvincesAndCities = async () => {
      try {
        setIsLoading(true);
        const provinceResponse = await axios.get("https://portal1.jatajar.com/api/assets/province");
        setProvinces(provinceResponse.data.data);

        if (selectedProvince) {
          const cityResponse = await axios.get(`https://portal1.jatajar.com/api/assets/province/${selectedProvince}/cities`);
          setCities(cityResponse.data.data.cities || []);
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error("Error fetching provinces or cities:", error);
        toast.error("خطا در بارگذاری استان‌ها یا شهرها");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvincesAndCities();
  }, [selectedProvince]);

  const MapEventHandler = () => {
    useMapEvents({
      moveend: (event) => {
        const mapCenter = event.target.getCenter();
        setLatitude(formatCoord(mapCenter.lat));
        setLongitude(formatCoord(mapCenter.lng));
      },
    });
    return null;
  };

  const handleMapModalClose = () => setIsMapModalOpen(false);
  const handleMapModalOpen = () => setIsMapModalOpen(true);

  const handleSaveLocation = () => {
    if (latitude && longitude && selectedCity) {
      onSave({
        city_id: selectedCity,
        latitude,
        longitude,
      });
      toast.success("موقعیت با موفقیت ثبت شد");
    } else {
      toast.error("مقادیر موقعیت مکانی معتبر نیستند");
    }
    setIsMapModalOpen(false);
  };

  return (
    <div className="relative lg:w-5/6 lg:h-5/6">
      <Toaster />
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-auto scrollbar-thin max-h-[70vh] pr-2 w-full min-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5 p-2">
            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-1">استان</label>
              <Listbox value={selectedProvince} onChange={setSelectedProvince}>
                {({ open }) => (
                  <>
                    <div className="relative mt-1">
                      <span className="block p-2 border rounded-xl w-full cursor-pointer">
                        {provinces.find((province) => province.id === selectedProvince)?.name || "انتخاب استان"}
                      </span>
                      <Listbox.Button className="absolute inset-y-0 left-4 flex items-center pr-2">
                        <svg className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Listbox.Button>
                      <Listbox.Options className={`absolute mt-2 w-full border z-50 rounded-xl bg-white shadow-lg scrollbar-thin ${open ? "block z-10" : "hidden"} max-h-60 overflow-y-auto`}>
                        {provinces.map((province) => (
                          <Listbox.Option key={province.id} value={province.id} className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${province.id === selectedProvince ? "bg-gray-100" : ""}`}>
                            {province.name}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700">شهر</label>
              <Listbox value={selectedCity} onChange={setSelectedCity} disabled={!selectedProvince}>
                {({ open }) => (
                  <>
                    <div className="relative mt-1">
                      <span className="block p-2 border rounded-xl w-full cursor-pointer">
                        {cities.find((city) => city.id === selectedCity)?.name || "انتخاب شهر"}
                      </span>
                      <Listbox.Button className="absolute inset-y-0 left-4 flex items-center pr-2">
                        <svg className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Listbox.Button>
                      <Listbox.Options className={`absolute scrollbar-thin mt-2 w-full border rounded-xl bg-white shadow-lg ${open ? "block z-10" : "hidden"} max-h-60 overflow-y-auto`}>
                        {cities.map((city) => (
                          <Listbox.Option key={city.id} value={city.id} className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${city.id === selectedCity ? "bg-gray-100" : ""}`}>
                            {city.name}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5 p-2">
            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-1">عرض جغرافیایی</label>
              <input type="number" step="0.00001" value={latitude || ""} onChange={(e) => setLatitude(formatCoord(e.target.value))} className="block w-full p-2 border rounded-xl" />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-1">طول جغرافیایی</label>
              <input type="number" step="0.00001" value={longitude || ""} onChange={(e) => setLongitude(formatCoord(e.target.value))} className="block w-full p-2 border rounded-xl" />
            </div>
          </div>
          <div className="mt-10">
            <label className="block text-sm font-medium text-gray-700 mb-2">انتخاب موقعیت</label>
            <button className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-xl" onClick={handleMapModalOpen}>
              باز کردن نقشه
            </button>
          </div>
        </div>
      )}

      <Transition show={isMapModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleMapModalClose}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-right align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    انتخاب موقعیت
                  </Dialog.Title>
                  <div className="relative mt-4">
                    <MapContainer center={{ lat: parseFloat(latitude) || 35.6892, lng: parseFloat(longitude) || 51.389 }} zoom={13} scrollWheelZoom={false} className="h-[60vh] w-full rounded-xl">
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                      <MapEventHandler />
                      <div className="leaflet-marker-icon leaflet-zoom-animated leaflet-interactive" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -100%)", zIndex: "1000" }}>
                        <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" alt="center marker" />
                      </div>
                    </MapContainer>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button type="button" className="inline-flex justify-center w-1/2 mr-2 rounded-xl border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm" onClick={handleSaveLocation}>
                      ثبت موقعیت
                    </button>
                    <button type="button" className="inline-flex justify-center w-1/2 ml-2 rounded-xl border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm" onClick={handleMapModalClose}>
                      بستن نقشه
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default LocationDetails;
