import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';

const ImageDetails = ({ token, houseUuid, houseData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medias, setMedias] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState('');
  const [isMain, setIsMain] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [makeMainLoading, setMakeMainLoading] = useState({});
  const [buttonText, setButtonText] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null); // Image to delete

  useEffect(() => {
    if (houseData?.medias) {
      setMedias(houseData.medias);
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
      const response = await axios.post(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}/media`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMedias(response.data.data.medias);
        toast.success('تصویر با موفقیت اضافه شد');
        setIsOpen(false);
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'خطایی در ارسال تصویر رخ داد.';
      setErrorMessage(errMsg);
      toast.error(errMsg);
      console.error('Error adding image:', errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (imageId) => {
    setImageToDelete(imageId);
    setDeleteModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    setDeleteLoading((prev) => ({ ...prev, [imageToDelete]: true }));
    setDeleteModalOpen(false); // Close the modal after confirmation
    try {
      const response = await axios.delete(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}/media/${imageToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setMedias((prev) => prev.filter((image) => image.id !== imageToDelete));
        toast.success('تصویر با موفقیت حذف شد');
      } else {
        throw new Error('Failed to delete image.');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'خطایی در حذف تصویر رخ داد.';
      setErrorMessage(errMsg);
      toast.error(errMsg);
      console.error('Error deleting image:', errMsg);
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [imageToDelete]: false }));
      setImageToDelete(null); // Reset image to delete
    }
  };

  const handleMakeMain = async (imageId) => {
    if (!imageId) return;

    const imageToMakeMain = medias.find((img) => img.id === imageId);
    if (!imageToMakeMain) {
      toast.error('تصویر یافت نشد');
      return;
    }

    setMakeMainLoading((prev) => ({ ...prev, [imageId]: true }));
    setButtonText((prev) => ({ ...prev, [imageId]: 'در حال تبدیل ...' }));

    try {
      const response = await axios.put(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}/media/${imageId}`,
        {
          title: imageToMakeMain.title,
          main: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setMedias((prevMedias) =>
          prevMedias.map((img) => {
            if (img.id === imageId) {
              return { ...img, main: true };
            } else if (img.main) {
              return { ...img, main: false };
            }
            return img;
          })
        );
        toast.success('تصویر به عنوان تصویر اصلی تنظیم شد');
      } else {
        throw new Error('Failed to make image main.');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'خطایی در تبدیل به تصویر اصلی رخ داد.';
      setErrorMessage(errMsg);
      toast.error(errMsg);
      console.error('Error making image main:', errMsg);
    } finally {
      setMakeMainLoading((prev) => ({ ...prev, [imageId]: false }));
      setButtonText((prev) => ({ ...prev, [imageId]: 'تبدیل به تصویر اصلی' }));
    }
  };

  return (
    <div className="w-full h-full p-4">
      <Toaster />
      <div className="w-full flex justify-between items-center mb-2">
        <h2 className="text-xl">مدیریت تصاویر</h2>
        <button
          className="bg-green-600 px-4 py-2 rounded-xl text-white"
          onClick={() => setIsOpen(true)}
        >
          اضافه کردن تصویر
        </button>
      </div>

      {medias.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {medias.map((image) => (
            <div key={image.id || image.media} className="border rounded-2xl flex flex-col md:flex-row justify-between items-center gap-2 relative">
              <div className="px-3 py-2 w-full md:w-3/5 flex flex-col">
                <p className="font-semibold mb-2">عنوان: {image.title || 'بدون عنوان'}</p>
                {image.main && (
                  <span className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 text-sm rounded truncate">اصلی</span>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-red-500 text-white px-1 py-0.5 truncate rounded-lg"
                    onClick={() => handleDeleteClick(image.id)}
                    disabled={deleteLoading[image.id]}
                  >
                    {deleteLoading[image.id] ? 'در حال حذف...' : 'حذف'}
                  </button>
                  {!image.main && (
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs"
                      onClick={() => handleMakeMain(image.id)}
                      disabled={makeMainLoading[image.id]}
                    >
                      {makeMainLoading[image.id] ? buttonText[image.id] || 'در حال تبدیل ...' : 'تبدیل به تصویر اصلی'}
                    </button>
                  )}
                </div>
              </div>
              <img
                src={image.media}
                className="w-full md:w-2/5 h-40 md:h-full object-cover rounded-tl-xl rounded-bl-xl"
                alt={image.title || 'Image'}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="p-1">تصویری وجود ندارد.</p>
      )}

      {/* Add Image Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-xl w-full">
            <DialogTitle className="font-bold text-xl">اضافه کردن تصویر</DialogTitle>
            <Description>لطفاً عنوان و تصویر را وارد کنید.</Description>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded-lg p-2"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover mt-4 border rounded-lg" />
            )}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان تصویر"
              className="w-full border rounded-lg p-2 outline-none"
            />
            <div className="flex items-center gap-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMain}
                  onChange={() => setIsMain(!isMain)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border ${isMain ? 'bg-green-500' : 'bg-gray-200'} flex items-center justify-center`}>
                  {isMain && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4.293 9.293a1 1 0 011.414 0L10 11.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm">{isMain ? 'تبدیل به تصویر اصلی' : 'تبدیل به تصویر اصلی'}</span>
              </label>
            </div>
            <div className="flex justify-end mt-4 gap-2">
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
                {loading ? 'در حال بارگذاری ...' : 'اضافه کردن'}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-md p-8 space-y-4 bg-white border rounded-xl">
            <DialogTitle className="text-lg font-bold">آیا مطمئن هستید؟</DialogTitle>
            <p>آیا مطمئن هستید که می‌خواهید این تصویر را حذف کنید؟</p>
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
                disabled={deleteLoading[imageToDelete]}
              >
                بله، حذفش کن
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default ImageDetails;
