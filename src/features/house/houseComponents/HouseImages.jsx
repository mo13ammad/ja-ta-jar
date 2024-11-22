import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import { Dialog } from "@headlessui/react";

function HouseImages({ houseData }) {
  // Extract the main image and media array
  const mainImage = houseData?.main_image;
  const mediaImages = houseData?.medias?.map((mediaItem) => mediaItem.media) || [];

  // Combine main image and other media images
  const images = mainImage ? [mainImage, ...mediaImages] : mediaImages;

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide index

  // Open modal
  const openModal = (index) => {
    setCurrentSlide(index);
    setIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full lg:w-2/3 mx-auto">
      {/* Swiper Component */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={50}
        slidesPerView={1}
        className="rounded-xl shadow-centered"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full max-h-48 sm:max-h-72 lg:max-h-96 h-auto object-cover rounded-lg cursor-pointer"
              onClick={() => openModal(index)} // Open modal on click
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal with Swiper */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-75" aria-hidden="true"></div>
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full max-w-4xl max-h-screen mx-4 lg:mx-0">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full p-2"
            >
              &times;
            </button>
            {/* Swiper in Modal */}
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={50}
              slidesPerView={1}
              initialSlide={currentSlide} // Set the initial slide
              className="rounded-xl"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full max-h-screen object-contain rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default HouseImages;
