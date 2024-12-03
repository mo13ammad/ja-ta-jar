import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import { Dialog } from "@headlessui/react";

function HouseImages({ houseData }) {
  // Extract the main image and media array
  const mainImage = houseData?.image;
  const mediaImages =
    houseData?.galleries?.map((mediaItem) => mediaItem.media) || [];

  // Combine main image and other media images
  const images = mainImage ? [mainImage, ...mediaImages] : mediaImages;

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Open modal
  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full  mx-auto  mb-1.5 lg:mb-0">
      {/* Swiper Component for small screens */}
      <div className="block lg:hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          className="shadow-centered"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto max-h-60 sm:max-h-72 object-cover rounded-xl cursor-pointer"
                onClick={() => openModal(index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom layout for large screens */}
      <div className="hidden  w-full  lg:block">
        <div className="flex flex-row items-center  h-full  w-full justify-center gap-4">
          {/* Left Column */}
          <div className="flex flex-col    w-1/4 space-y-8">
            {images.map((image, index) =>
              index % 2 === 1 ? (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto max-h-60 object-cover rounded-xl cursor-pointer"
                  onClick={() => openModal(index)}
                />
              ) : null
            )}
          </div>
          {/* Center Column (Big Image) */}
          <div className="w-2/4">
            <img
              src={images[0]}
              alt="Main Image"
              className="w-full h-full object-cover rounded-xl cursor-pointer"
              onClick={() => openModal(0)}
            />
          </div>
          {/* Right Column */}
          <div className="flex flex-col w-1/4 justify-between space-y-8 h-full">
            {images.map((image, index) =>
              index !== 0 && index % 2 === 0 ? (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto max-h-60  object-cover rounded-xl cursor-pointer"
                  onClick={() => openModal(index)}
                />
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* Modal with Main Image and Thumbnails */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div
          className="fixed inset-0 bg-black bg-opacity-75"
          aria-hidden="true"
        ></div>
        <div className="fixed inset-0 flex   items-center justify-center">
          <Dialog.Panel className="w-full max-w-3xl z-50 xl:max-w-5xl mx-2  sm:px-6 flex flex-col  relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className=" text-white w-6 mb-1  h-6 bg-black  bg-opacity-50 rounded-full"
            >
              &times;
            </button>
            {/* Main Image */}
            <div className="flex w-full justify-center  h-full  ">
              <img
                src={images[selectedImageIndex]}
                alt={`Image ${selectedImageIndex + 1}`}
                className="min-h-24 h-auto max-h-72 xs:max-h-96 xl:max-h-144 3xl:max-h-192 object-cover rounded-2xl"
              />
            </div>
            {/* Thumbnails Below */}
            <div className="flex overflow-x-auto mt-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer m-1 ${
                    selectedImageIndex === index
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default HouseImages;
