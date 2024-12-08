import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import { Dialog } from "@headlessui/react";

function HouseImages({ houseData }) {
  // Prepare main image as an object with title
  const mainImage = houseData?.image
    ? {
        media: houseData.image,
        title: houseData.title || "تصویر اصلی",
      }
    : null;

  // Map galleries to an array of objects with { media, title }
  const galleryImages =
    houseData?.galleries?.map((item, index) => ({
      media: item.media,
      title: item.title || `تصویر ${index + 1}`,
    })) || [];

  // Combine main image and gallery images into one array
  const images = mainImage ? [mainImage, ...galleryImages] : galleryImages;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full mx-auto  lg:mb-0">
      {/* Mobile View */}
      <div className="block bg-gray-100 lg:hidden">
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
                src={image.media}
                alt={image.title}
                title={image.title}
                className="w-full h-auto max-h-64 sm:max-h-80 object-cover rounded-t-xl md:rounded-xl cursor-pointer"
                onClick={() => openModal(index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop View */}
      <div className="hidden w-full lg:block">
        <div className="flex flex-row items-center h-full w-full justify-center gap-4">
          {/* Left Column */}
          <div className="flex flex-col w-1/4 space-y-8">
            {images.slice(0, 2).map((image, index) => (
              <div
                key={index}
                className="relative w-full h-auto max-h-60 object-cover rounded-xl cursor-pointer"
                onClick={() => openModal(index)}
              >
                <img
                  src={image.media}
                  alt={image.title}
                  title={image.title}
                  className="w-full h-auto max-h-44 xl:max-h-52 2xl:max-h-60 object-cover rounded-xl"
                />
              </div>
            ))}
          </div>

          {/* Center Column (Main Image) */}
          <div className="w-2/4">
            {images[0] && (
              <img
                src={images[0].media}
                alt={images[0].title}
                title={images[0].title}
                className="w-full h-full object-cover rounded-xl cursor-pointer"
                onClick={() => openModal(0)}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col w-1/4 justify-between space-y-8 h-full">
            {images.slice(2, 4).map((image, index) => {
              const globalIndex = index + 2;
              return (
                <div
                  key={globalIndex}
                  className="relative w-full h-auto max-h-60 object-cover rounded-xl cursor-pointer"
                  onClick={() => openModal(globalIndex)}
                >
                  <img
                    src={image.media}
                    alt={image.title}
                    title={image.title}
                    className="w-full h-auto max-h-44 xl:max-h-52 2xl:max-h-60 object-cover rounded-xl"
                  />
                  {index === 1 && images.length > 4 && (
                    <div
                      className="absolute inset-0 flex items-center max-h-60  justify-center bg-gray-500 bg-opacity-50 rounded-2xl cursor-pointer"
                      onClick={() => openModal(globalIndex)}
                    >
                      <span className="text-white text-sm">مشاهده بیشتر</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div
          className="fixed inset-0 bg-black bg-opacity-75"
          aria-hidden="true"
        ></div>
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full  max-w-3xl z-50 xl:max-w-5xl mx-2 sm:px-6 flex flex-col relative">
            <button
              onClick={closeModal}
              className="text-white w-6 mb-2 h-6 bg-black bg-opacity-50 rounded-full absolute top-2 right-2"
            >
              &times;
            </button>

            {/* Display the title of the selected image */}
            <div className="w-full flex flex-col justify-center">
            <h2 className="text-white text-base  w-auto mr-16 font-semibold mb-2">
              {images[selectedImageIndex]?.title}
            </h2>

            <div className="flex w-full justify-center h-full">
              <img
                src={images[selectedImageIndex]?.media}
                alt={images[selectedImageIndex]?.title}
                className="min-h-24 h-auto max-h-72 xs:max-h-96 xl:max-h-144 3xl:max-h-192 object-cover rounded-2xl"
              />
            </div>
            </div>
            <div className="flex overflow-x-auto mt-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.media}
                  alt={image.title}
                  title={image.title}
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
