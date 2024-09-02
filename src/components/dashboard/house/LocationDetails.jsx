import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Listbox, Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast, Toaster } from "react-hot-toast";
import Spinner from "../../Spinner";
import '@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css';
import nmp_mapboxgl from '@neshan-maps-platform/mapbox-gl';

const LocationDetails = ({ data, onSave, token, houseUuid }) => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(data?.address?.city?.province?.id || null);
  const [selectedCity, setSelectedCity] = useState(data?.address?.city?.id || null);
  
  const [latitude, setLatitude] = useState(() => {
    if (data?.address?.geography?.latitude) {
      return data.address.geography.latitude;
    } else if (data?.address?.city?.province?.latitude) {
      return data.address.city.province.latitude;
    } else {
      return 35.6892; // Default to Tehran's latitude
    }
  });

  const [longitude, setLongitude] = useState(() => {
    if (data?.address?.geography?.longitude) {
      return data.address.geography.longitude;
    } else if (data?.address?.city?.province?.longitude) {
      return data.address.city.province.longitude;
    } else {
      return 51.389; // Default to Tehran's longitude
    }
  });

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const mapContainerRef = useRef(null);
  const mapContainerLgRef = useRef(null);
  const modalMapRef = useRef(null);
  const modalMarkerRef = useRef(null);
  const lgMapRef = useRef(null);
  const lgMarkerRef = useRef(null);

  const [tempLatitude, setTempLatitude] = useState(latitude);
  const [tempLongitude, setTempLongitude] = useState(longitude);

  const formatCoord = (coord) => (coord !== null ? parseFloat(coord).toFixed(5) : "");

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsLoading(true);
        const provinceResponse = await axios.get("https://portal1.jatajar.com/api/assets/province");
        setProvinces(provinceResponse.data.data);
      } catch (error) {
        toast.error("خطا در بارگذاری استان‌ها");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedProvince) {
        try {
          const cityResponse = await axios.get(
            `https://portal1.jatajar.com/api/assets/province/${selectedProvince}/cities`
          );
          setCities(cityResponse.data.data.cities || []);
        } catch (error) {
          toast.error("خطا در بارگذاری شهرها");
        }
      } else {
        setCities([]);
      }
    };

    fetchCities();
  }, [selectedProvince]);

  // Effect to update the latitude and longitude when the province changes
  useEffect(() => {
    if (selectedProvince) {
      const selectedProvinceData = provinces.find(prov => prov.id === selectedProvince);
      if (selectedProvinceData) {
        setLatitude(selectedProvinceData.latitude);
        setLongitude(selectedProvinceData.longitude);

        // Update map position if map is already initialized
        if (lgMapRef.current) {
          lgMapRef.current.setCenter([selectedProvinceData.longitude, selectedProvinceData.latitude]);
          lgMarkerRef.current.setLngLat([selectedProvinceData.longitude, selectedProvinceData.latitude]);
        }
        if (modalMapRef.current) {
          modalMapRef.current.setCenter([selectedProvinceData.longitude, selectedProvinceData.latitude]);
          modalMarkerRef.current.setLngLat([selectedProvinceData.longitude, selectedProvinceData.latitude]);
        }
      }
    }
  }, [selectedProvince]);

  const handleMapModalClose = () => {
    setIsMapModalOpen(false);
  };

  const initializeMap = (containerRef, mapRef, markerRef) => {
    if (containerRef.current) {
      const mapInstance = new nmp_mapboxgl.Map({
        mapType: nmp_mapboxgl.Map.mapTypes.neshanVector,
        container: containerRef.current,
        zoom: 11,
        pitch: 0,
        center: [longitude, latitude],
        minZoom: 2,
        maxZoom: 21,
        trackResize: true,
        mapKey: "web.a3f7a30528d54b41b3432213e9b8f51f",
        poi: true,
        traffic: true,
        mapTypeControllerOptions: {
          show: true,
          position: 'bottom-left'
        }
      });

      const markerInstance = new nmp_mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(mapInstance);

      mapInstance.on('click', (e) => {
        const coords = e.lngLat;
        setTempLatitude(coords.lat);
        setTempLongitude(coords.lng);

        markerInstance.setLngLat([coords.lng, coords.lat]);

        toast.success(`موقعیت انتخاب شد`);

        setLatitude(coords.lat);
        setLongitude(coords.lng);
      });

      mapRef.current = mapInstance;
      markerRef.current = markerInstance;
    } else {
      console.error("Map container not found");
    }
  };

  useEffect(() => {
    if (isMapModalOpen) {
      setTimeout(() => {
        initializeMap(mapContainerRef, modalMapRef, modalMarkerRef);
      }, 0);
    }
  }, [isMapModalOpen]);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setTimeout(() => {
        initializeMap(mapContainerLgRef, lgMapRef, lgMarkerRef);
      }, 0);
    }
  }, []);

  const handleMapModalOpen = () => {
    setIsMapModalOpen(true);
  };

  const handleSaveLocation = () => {
    setLatitude(tempLatitude);
    setLongitude(tempLongitude);
    toast.success("موقعیت با موفقیت ثبت شد");
    setIsMapModalOpen(false);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const requestData = {
      city_id: selectedCity,
      latitude,
      longitude,
      _method: "PUT",
    };

    try {
      const response = await axios.post(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("تغییرات با موفقیت ثبت شد");
      } else {
        toast.error("خطایی رخ داده است");
      }
    } catch (error) {
      toast.error("خطا در ثبت تغییرات");
    } finally {
      setIsSaving(false);
    }
  };

  const renderErrorMessages = (fieldErrors) => {
    if (!fieldErrors) return null;
    return (
      <div className="mt-0.5 text-red-500 text-sm">
        {Array.isArray(fieldErrors) ? (
          fieldErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))
        ) : (
          <p>{fieldErrors}</p>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <Toaster />
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2">
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">استان</label>
              <Listbox value={selectedProvince} onChange={setSelectedProvince}>
                {({ open }) => (
                  <div className="relative">
                    <div className="relative w-full cursor-pointer">
                      <Listbox.Button
                        className={`block p-2 border rounded-xl w-full text-left flex justify-between items-center ${errors.province ? 'border-red-500' : ''}`}
                      >
                        {provinces.find((province) => province.id === selectedProvince)?.name || "انتخاب استان"}
                        <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Listbox.Button>
                      <Listbox.Options className={`absolute mt-2 w-full border rounded-xl bg-white shadow-lg ${open ? 'block z-10' : 'hidden'} max-h-40 overflow-y-auto`}>
                        {provinces.map(province => (
                          <Listbox.Option key={province.id} value={province.id} className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${province.id === selectedProvince ? 'bg-gray-100' : ''}`}>
                            {province.name}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </div>
                )}
              </Listbox>
              {renderErrorMessages(errors.province)}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">شهر</label>
              <Listbox value={selectedCity} onChange={setSelectedCity} disabled={!selectedProvince}>
                {({ open }) => (
                  <div className="relative">
                    <div className="relative w-full cursor-pointer">
                      <Listbox.Button
                        className={`block p-2 border rounded-xl w-full text-left flex justify-between items-center ${errors.city ? 'border-red-500' : ''}`}
                        disabled={!selectedProvince}
                      >
                        {cities.find((city) => city.id === selectedCity)?.name || "انتخاب شهر"}
                        <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Listbox.Button>
                      <Listbox.Options className={`absolute mt-2 w-full border rounded-xl bg-white shadow-lg ${open ? 'block z-10' : 'hidden'} max-h-40 overflow-y-auto`}>
                        {cities.map(city => (
                          <Listbox.Option key={city.id} value={city.id} className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${city.id === selectedCity ? 'bg-gray-100' : ''}`}>
                            {city.name}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </div>
                )}
              </Listbox>
              {renderErrorMessages(errors.city)}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2">
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">عرض جغرافیایی</label>
              <input 
                type="number" 
                step="0.00001" 
                value={latitude || ""} 
                disabled 
                className="block w-full p-2 border rounded-xl bg-gray-200 cursor-not-allowed" 
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">طول جغرافیایی</label>
              <input 
                type="number" 
                step="0.00001" 
                value={longitude || ""} 
                disabled 
                className="block w-full p-2 border rounded-xl bg-gray-200 cursor-not-allowed" 
              />
            </div>
          </div>

          <div className="mt-10">
            <label className="block text-sm font-medium text-gray-700 mb-2">انتخاب موقعیت</label>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-xl shadow-xl lg:hidden" onClick={handleMapModalOpen}>
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-xl bg-white p-6 text-right align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    انتخاب موقعیت
                  </Dialog.Title>
                  <div className="relative" id="map-container" ref={mapContainerRef} style={{ height: '500px' }}>
                    {/* Map will render in this div */}
                  </div>
                  <div className="mt-6 flex justify-end">       
                    <button type="button" className="inline-flex justify-center w- ml-2 rounded-xl border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm" onClick={handleSaveLocation}>
                      ثبت موقعیت
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="hidden lg:block justify-start mt-5">
        <div className="w-full lg:w-2/3 rounded-xl overflow-hidden border">
          <div className="relative" id="map-container-lg" ref={mapContainerLgRef} style={{ height: '400px' }}>
            {/* Map will render in this div */}
          </div>
        </div>
      </div>

      {!isLoading && (
        <div className="absolute flex justify-end w-full">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-xl w-36"
            onClick={handleSaveChanges}
          >
            ثبت تغییرات
          </button>
        </div>
      )}

      {isSaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default LocationDetails;
