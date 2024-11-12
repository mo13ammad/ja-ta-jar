// src/components/edithouse-components/EditHouseImages.jsx

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';
import Spinner from '../../../../ui/Loading';
import {
  createHousePicture,
  deleteHousePicture,
} from '../../../../services/houseService';
import { useMutation } from '@tanstack/react-query';
import ToggleSwitch from '../../../../ui/ToggleSwitch'; // Adjust the import path as necessary

const EditHouseImages = ({ houseId, houseData, refetchHouseData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState(houseData?.medias || []);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState('');
  const [isMain, setIsMain] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    if (houseData?.medias) {
      setImages(houseData.medias);
    }
  }, [houseData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to display errors based on error.response.data.message
  const displayError = (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || 'خطایی رخ داده است';
    toast.error(errorMessage);
  };

  // Mutation to add a new image
  const addImageMutation = useMutation(
    async (formData) => {
      return await createHousePicture(houseId, formData);
    },
    {
      onSuccess: (data) => {
        setImages(data.medias);
        toast.success('تصویر با موفقیت اضافه شد');
        setIsOpen(false);
        setImageFile(null);
        setImagePreview(null);
        setTitle('');
        setIsMain(false);
        refetchHouseData();
      },
      onError: (error) => {
        console.error('Error adding image:', error);
        displayError(error);
      },
    }
  );

  const handleAddImage = () => {
    if (!imageFile) {
      toast.error('لطفا یک تصویر انتخاب کنید');
      return;
    }
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', title);
    if (isMain) formData.append('main', 1);

    addImageMutation.mutate(formData);
  };

  // Mutation to delete an image
  const deleteImageMutation = useMutation(
    async () => {
      return await deleteHousePicture(houseId, imageToDelete);
    },
    {
      onSuccess: () => {
        setImages((prev) => prev.filter((img) => img.id !== imageToDelete));
        toast.success('تصویر با موفقیت حذف شد');
        setDeleteModalOpen(false);
        refetchHouseData();
      },
      onError: (error) => {
        console.error('Error deleting image:', error);
        displayError(error);
      },
    }
  );

  const handleDeleteClick = (imageId) => {
    setImageToDelete(imageId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteImageMutation.mutate();
  };

  return (
    <div className="edit-house-images p-4">
      <Toaster />
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl">مدیریت تصاویر</h2>
        <button
          className="btn bg-primary-600 px-2 py-1 lg:py-1.5 lg:px-3 text-sm text-white"
          onClick={() => setIsOpen(true)}
        >
          اضافه کردن تصویر
        </button>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {[...images].reverse().map((image) => (
            <div key={image.id} className="relative border rounded-lg flex items-center">
              <img
                src={image.media}
                alt="House"
                className="w-32 h-32 object-cover rounded-tl-lg"
              />
              <div className="p-3 w-full flex flex-col">
                <p className="font-semibold mb-1">عنوان: {image.title || 'بدون عنوان'}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleDeleteClick(image.id)}
                    className="text-white bg-red-500 rounded-lg px-3 py-1"
                    disabled={deleteImageMutation.isLoading}
                  >
                    {deleteImageMutation.isLoading ? 'در حال حذف...' : 'حذف'}
                  </button>
                </div>
                {image.main && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    تصویر اصلی
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="p-4 text-center">هیچ تصویری وجود ندارد.</p>
      )}

      {/* Add Image Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg p-6">
            <Dialog.Title>اضافه کردن تصویر</Dialog.Title>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full my-2" />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover my-2" />
            )}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان تصویر"
              className="w-full border rounded-lg p-2 my-2 focus:outline-none focus:ring-0"
            />
            {/* Use ToggleSwitch for isMain */}
            <div className="flex items-center mt-2">
              <ToggleSwitch
                checked={isMain}
                onChange={setIsMain}
                label="تبدیل به تصویر اصلی"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg"
                disabled={addImageMutation.isLoading}
              >
                {addImageMutation.isLoading ? <Spinner size={20} /> : 'اضافه کردن'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
            <Dialog.Title>حذف تصویر</Dialog.Title>
            <p className="my-4">آیا مطمئن هستید که می‌خواهید این تصویر را حذف کنید؟</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                لغو
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                disabled={deleteImageMutation.isLoading}
              >
                {deleteImageMutation.isLoading ? 'در حال حذف...' : 'بله، حذفش کن'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default EditHouseImages;
