import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';
import Spinner from '../../../../ui/Loading';
import { createHousePicture, deleteHousePicture, changeHouseMainPicture } from '../../../../services/houseService';

const EditHouseImages = ({ houseUuid, token, initialImages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(initialImages || []);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState('');
  const [isMain, setIsMain] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    if (initialImages) {
      setImages(initialImages);
    }
  }, [initialImages]);

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

  const handleAddImage = async () => {
    if (!imageFile) {
      toast.error('لطفا یک تصویر انتخاب کنید');
      return;
    }
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', title);
    if (isMain) formData.append('main', 1);

    setLoading(true);
    try {
      const response = await createHousePicture(houseUuid, formData);
      setImages(response.medias);
      toast.success('تصویر با موفقیت اضافه شد');
      setIsOpen(false);
    } catch (error) {
      toast.error('خطایی در ارسال تصویر رخ داد');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (imageId) => {
    setImageToDelete(imageId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteModalOpen(false);
    try {
      await deleteHousePicture(houseUuid, imageToDelete);
      setImages(images.filter((img) => img.id !== imageToDelete));
      toast.success('تصویر با موفقیت حذف شد');
    } catch (error) {
      toast.error('خطایی در حذف تصویر رخ داد');
    }
  };

  const handleMakeMain = async (imageId) => {
    try {
      await changeHouseMainPicture(houseUuid, imageId);
      setImages(images.map((img) => ({ ...img, main: img.id === imageId })));
      toast.success('تصویر به عنوان تصویر اصلی تنظیم شد');
    } catch (error) {
      toast.error('خطایی در تنظیم تصویر اصلی رخ داد');
    }
  };

  return (
    <div className="edit-house-images p-4">
      <Toaster />
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl">مدیریت تصاویر</h2>
        <button
          className="bg-green-600 px-4 py-2 rounded-lg text-white"
          onClick={() => setIsOpen(true)}
        >
          اضافه کردن تصویر
        </button>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative border rounded-lg flex items-center">
              <img src={image.media} alt="House" className="w-full h-40 object-cover rounded-tl-lg" />
              <div className="p-3 w-full flex flex-col">
                <p className="font-semibold mb-1">عنوان: {image.title || 'بدون عنوان'}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleDeleteClick(image.id)}
                    className="text-white bg-red-500 rounded-lg px-3 py-1"
                  >
                    حذف
                  </button>
                  {!image.main && (
                    <button
                      onClick={() => handleMakeMain(image.id)}
                      className="text-white bg-blue-500 rounded-lg px-3 py-1"
                    >
                      تبدیل به تصویر اصلی
                    </button>
                  )}
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

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg p-6">
            <Dialog.Title>اضافه کردن تصویر</Dialog.Title>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full my-2" />
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover my-2" />}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان تصویر"
              className="w-full border rounded-lg p-2 my-2"
            />
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={isMain} onChange={() => setIsMain(!isMain)} />
              <span>تبدیل به تصویر اصلی</span>
            </label>
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
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? <Spinner size={20} /> : 'اضافه کردن'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
            <Dialog.Title>حذف تصویر</Dialog.Title>
            <p className="my-4">آیا مطمئن هستید که می‌خواهید این تصویر را حذف کنید؟</p>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                لغو
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                بله، حذفش کن
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default EditHouseImages;
