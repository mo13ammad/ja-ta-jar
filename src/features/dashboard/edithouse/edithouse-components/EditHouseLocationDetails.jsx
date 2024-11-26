// src/components/edithouse-components/EditHouseLocationDetails.jsx

import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  Fragment,
  useRef,
} from "react";
import { toast, Toaster } from "react-hot-toast";
import { Listbox, Transition } from "@headlessui/react";
import Loading from "../../../../ui/Loading";
import TextField from "../../../../ui/TextField";
import useFetchProvinces from "../../useFetchProvinces";
import useFetchCities from "../../useFetchCities";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import customMarkerImage from "../../../../../public/assets/location.png";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

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

const EditHouseLocationDetails = forwardRef((props, ref) => {
  const {
    houseData,
    loadingHouse,
    handleEditHouse,
    editLoading,
    refetchHouseData,
  } = props;

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [latitude, setLatitude] = useState(DEFAULT_LAT);
  const [longitude, setLongitude] = useState(DEFAULT_LNG);
  const [errors, setErrors] = useState({});
  const [cityOptions, setCityOptions] = useState([]);
  const [isModified, setIsModified] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const {
    data: provinces = [],
    isLoading: loadingProvinces,
    error: provincesError,
  } = useFetchProvinces();
  const {
    data: citiesData,
    isLoading: loadingCities,
    error: citiesError,
  } = useFetchCities(selectedProvince?.value);

  useEffect(() => {
    if (houseData && provinces.length) {
      const initialLat = houseData.address?.geography?.latitude || DEFAULT_LAT;
      const initialLng = houseData.address?.geography?.longitude || DEFAULT_LNG;
      setLatitude(initialLat);
      setLongitude(initialLng);

      const provinceName =
        houseData.address?.province?.name ||
        houseData.address?.city?.province?.name;
      const cityName = houseData.address?.city?.name;

      const initialProvince = provinces.find((p) => p.name === provinceName);
      if (initialProvince) {
        setSelectedProvince({
          value: initialProvince.id,
          label: initialProvince.name,
        });
      }

      if (houseData.address?.city) {
        setCityOptions([{ value: houseData.address.city.id, label: cityName }]);
        setSelectedCity({
          value: houseData.address.city.id,
          label: cityName,
        });
      }
    }
  }, [houseData, provinces]);

  useEffect(() => {
    if (selectedProvince && citiesData?.cities) {
      const newCityOptions = citiesData.cities.map((city) => ({
        value: city.id,
        label: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
      }));
      setCityOptions(newCityOptions);

      if (houseData?.address?.city && selectedCity == null) {
        const city = newCityOptions.find(
          (city) => city.value === houseData.address.city.id,
        );
        if (city) setSelectedCity(city);
      }
    }
  }, [selectedProvince, citiesData, houseData]);

  const initializeMap = (latitude, longitude) => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [latitude, longitude],
        11,
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      markerRef.current = L.marker([latitude, longitude], {
        draggable: true,
        icon: customMarkerIcon,
      }).addTo(mapRef.current);

      markerRef.current.on("dragend", (e) => {
        const coords = e.target.getLatLng();
        setLatitude(coords.lat);
        setLongitude(coords.lng);
        setIsModified(true);
        toast.success("موقعیت جدید انتخاب شد");
        console.log("Marker dragged to:", coords);
      });

      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setLatitude(lat);
        setLongitude(lng);
        setIsModified(true);
        markerRef.current.setLatLng([lat, lng]);
        toast.success("موقعیت جدید انتخاب شد");
        console.log("Map clicked at:", { lat, lng });
      });
    }
  };

  useEffect(() => {
    if (!mapRef.current) initializeMap(latitude, longitude);
  }, [latitude, longitude]);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([latitude, longitude], 11);
      markerRef.current.setLatLng([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const handleProvinceChange = (option) => {
    setSelectedProvince(option);
    setSelectedCity(null);
    setCityOptions([]);
    setIsModified(true);
    console.log("Province changed to:", option);
  };

  const handleCityChange = (option) => {
    setSelectedCity(option);
    setLatitude(option.latitude);
    setLongitude(option.longitude);
    setIsModified(true);
    console.log("City changed to:", option);
  };

  const validateAndSubmit = async () => {
    console.log("validateAndSubmit called in EditHouseLocationDetails");

    if (!isModified) {
      console.log("No changes detected, submission skipped.");
      return true;
    }

    setErrors({});
    console.log("Validating and submitting data.");

    if (!selectedCity) {
      setErrors((prev) => ({
        ...prev,
        city_id: ["لطفاً یک شهر را انتخاب کنید."],
      }));
      toast.error("لطفاً یک شهر را انتخاب کنید.");
      console.error("Validation error: City not selected.");
      return false;
    }

    const dataToSend = {
      city_id: selectedCity.value,
      latitude,
      longitude,
    };

    console.log("Data to send:", dataToSend);

    try {
      await handleEditHouse(dataToSend); // Update houseData
      toast.success("موقعیت مکانی با موفقیت به‌روزرسانی شد");
      console.log("Data successfully sent and updated.");
      setIsModified(false);
      return true;
    } catch (error) {
      console.error("Submission Error:", error);
      if (error.errors || error.message) {
        if (error.errors?.fields) {
          setErrors(error.errors.fields);
        }
        if (error.message) {
          toast.error(error.message);
        }
      } else {
        toast.error("خطایی رخ داده است.");
      }
      return false;
    }
  };

  useImperativeHandle(ref, () => ({
    validateAndSubmit,
  }));

  if (loadingHouse) {
    console.log("Loading house data...");
    return <Loading message="در حال بارگذاری اطلاعات..." />;
  }

  const provinceOptions = provinces.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  return (
    <div className="relative p-4">
      <Toaster />
      {errors.general && (
        <div className="error-list mb-4">
          {errors.general.map((error, index) => (
            <div key={index} className="text-red-500 text-sm">
              {error}
            </div>
          ))}
        </div>
      )}
      <form className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-2">استان</label>
          <Listbox
            value={selectedProvince}
            onChange={handleProvinceChange}
            disabled={loadingProvinces}
          >
            {({ open }) => (
              <div className="relative bg-white rounded-xl">
                <Listbox.Button className="listbox__button">
                  <span>
                    {loadingProvinces
                      ? "در حال بارگزاری..."
                      : selectedProvince?.label || "انتخاب استان"}
                  </span>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      open ? "rotate-180" : "rotate-0"
                    }`}
                    aria-hidden="true"
                  />
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {provinceOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                            active
                              ? "bg-secondary-100 text-secondary-700"
                              : "text-gray-900"
                          }`
                        }
                      >
                        <span className="block truncate font-normal">
                          {option.label}
                        </span>
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
          <Listbox
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedProvince || loadingCities}
          >
            {({ open }) => (
              <div className="relative bg-white rounded-xl">
                <Listbox.Button className="listbox__button">
                  <span>
                    {!selectedProvince
                      ? "ابتدا استان را انتخاب کنید"
                      : loadingCities
                        ? "در حال بارگزاری..."
                        : selectedCity?.label || "انتخاب شهر"}
                  </span>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      open ? "rotate-180" : "rotate-0"
                    }`}
                    aria-hidden="true"
                  />
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {cityOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                            active
                              ? "bg-secondary-100 text-secondary-700"
                              : "text-gray-900"
                          }`
                        }
                      >
                        <span className="block truncate font-normal">
                          {option.label}
                        </span>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
          {errors.city_id && (
            <p className="mt-2 text-sm text-red-600">{errors.city_id[0]}</p>
          )}
        </div>

        <div>
          <TextField
            label="عرض جغرافیایی"
            name="latitude"
            value={latitude}
            readOnly
          />
        </div>
        <div>
          <TextField
            label="طول جغرافیایی"
            name="longitude"
            value={longitude}
            readOnly
          />
        </div>

        <div
          className="mt-6 w-full lg:col-span-2 shadow-centered rounded-lg overflow-hidden border h-[400px] z-0"
          ref={mapContainerRef}
        />
      </form>
    </div>
  );
});

export default EditHouseLocationDetails;
