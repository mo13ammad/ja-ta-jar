import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';

const ImageDetails = ({ token, houseUuid, houseData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medias, setMedias] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState('');
  const [isMain, setIsMain] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [makeMainLoading, setMakeMainLoading] = useState({});
  const [buttonText, setButtonText] = useState({});

  useEffect(() => {
    if (houseData && houseData.medias) {
      setMedias(houseData.medias || []);
      console.log('Medias:', houseData.medias);
    } else {
      console.log('No medias found in houseData');
    }
  }, [houseData]);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAddImage = async () => {
    if (!imageFile) {
      toast.error('لطفا یک تصویر انتخاب کنید');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', title);

    if (isMain) {
      formData.append('main', 1);
    }

    console.log('Add Image - FormData:', { image: imageFile, title, main: isMain });

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

      console.log('Add Image Response:', response.data.data.medias);

      if (response.status === 200 || response.status === 201) {
        setMedias(response.data.data.medias || []); // Re-render images from medias
        toast.success('تصویر با موفقیت اضافه شد');
        setIsOpen(false);
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      console.error('Error adding image:', error);
      toast.error('خطایی در ارسال تصویر رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (imageId) => {
    setDeleteLoading((prevState) => ({ ...prevState, [imageId]: true }));

    console.log('Delete Image - House UUID:', houseUuid);
    console.log('Delete Image - Image UUID:', imageId);

    try {
      const response = await axios.delete(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}/media/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Delete Image Response:', response);

      if (response.status === 200) {
        // Remove the deleted image from the media list
        setMedias((prev) => prev.filter((image) => image.id !== imageId));
        toast.success('تصویر با موفقیت حذف شد');
      } else {
        throw new Error('Failed to delete image.');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('خطایی در حذف تصویر رخ داد.');
    } finally {
      setDeleteLoading((prevState) => ({ ...prevState, [imageId]: false }));
    }
  };

  const handleUpdateImage = async () => {
    if (!selectedImage) {
      toast.error('لطفا تصویری برای ویرایش انتخاب کنید.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);

    if (isMain) {
      formData.append('main', 1);
    }

    console.log('Update Image - FormData:', { title, main: isMain });

    setLoading(true);

    try {
      const response = await axios.put(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}/media/${selectedImage}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Update Image Response:', response);

      if (response.status === 200) {
        setMedias(response.data.data.medias || []); // Re-render images from medias
        toast.success('تصویر با موفقیت به‌روزرسانی شد');
        setIsOpen(false);
      } else {
        throw new Error('Failed to update image.');
      }
    } catch (error) {
      toast.error('خطایی در به‌روزرسانی تصویر رخ داد.');
      console.error('Error updating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeMain = async (imageId) => {
    if (!imageId) {
      console.error('Image ID is undefined or null.');
      return;
    }
  
    setMakeMainLoading((prevState) => ({ ...prevState, [imageId]: true }));
    setButtonText((prev) => ({ ...prev, [imageId]: 'در حال تبدیل ...' }));
  
    console.log('Make Main Image - Image ID:', imageId);
  
    try {
      const response = await axios.put(
        `https://portal1.jatajar.com/api/client/house/${houseUuid}/media/${imageId}`,
        { main: 1 }, // Only send the main field
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Make Main Image Response:', response);
  
      if (response.status === 200) {
        setMedias(response.data.data.medias || []); // Re-render images from medias
        toast.success('تصویر به عنوان تصویر اصلی تنظیم شد');
      } else {
        throw new Error('Failed to make image main.');
      }
    } catch (error) {
      console.error('Error making image main:', error);
      toast.error('خطایی در تبدیل به تصویر اصلی رخ داد.');
    } finally {
      setMakeMainLoading((prevState) => ({ ...prevState, [imageId]: false }));
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
            <div key={image.id || image.media} className="border rounded-2xl flex justify-between items-center gap-2 relative">
              <div className="px-3 py-2 w-full sm:w-3/5">
                <p className="font-semibold mb-2">عنوان: {image.title || 'بدون عنوان'}</p>
                {image.main && (
                  <span className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 text-sm rounded truncate">
                    اصلی
                  </span>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-green-600 max-w-36 text-white px-2 py-1 rounded-lg"
                    onClick={() => {
                      setSelectedImage(image.id);
                      setTitle(image.title || '');
                      setIsMain(image.main);
                      setIsOpen(true);
                    }}
                  >
                    ویرایش
                  </button>
                  <button
                    className="bg-red-500 max-w-36 text-white px-2 py-1 rounded-lg"
                    onClick={() => handleDeleteClick(image.id)}
                    disabled={deleteLoading[image.id]}
                  >
                    {deleteLoading[image.id] ? 'در حال حذف ...' : 'حذف'}
                  </button>
                  {!image.main && (
                    <button
                      className="truncate max-w-xs bg-blue-500 text-white px-2 py-1 rounded-lg text-xs"
                      onClick={() => handleMakeMain(image.id)}
                      disabled={makeMainLoading[image.id]}
                    >
                      {makeMainLoading[image.id] ? buttonText[image.id] || 'تبدیل به تصویر اصلی' : 'تبدیل به تصویر اصلی'}
                    </button>
                  )}
                </div>
              </div>
              <img
                src={image.media}
                className="hidden sm:block w-2/5 h-full object-cover rounded-tl-xl rounded-bl-xl"
                alt={image.title || 'Image'}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="p-1">تصویری وجود ندارد.</p>
      )}

      {/* Add/Edit Image Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-xl w-full">
            <DialogTitle className="font-bold text-xl">
              {selectedImage ? 'ویرایش تصویر' : 'اضافه کردن تصویر'}
            </DialogTitle>
            <Description>لطفاً عنوان و تصویر را وارد کنید :</Description>

            <div className="w-full">
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 mb-2 border rounded-lg"
              />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان تصویر"
                className="w-full p-2 border rounded-lg outline-none"
              />
              {selectedImage === null && (
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={isMain}
                    onChange={(e) => setIsMain(e.target.checked)}
                    className="sr-only"
                    id="main-checkbox"
                  />
                  <div
                    className={`h-6 w-6 rounded-full transition-colors ease-in-out duration-200 ml-1 
                      ${isMain ? 'bg-green-500' : 'bg-gray-200'}
                    `}
                  >
                    {isMain && (
                      <svg
                        className="w-4 h-4 text-white absolute inset-0 m-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <label
                    htmlFor="main-checkbox"
                    className="ml-2 cursor-pointer select-none"
                  >
                    تبدیل به عکس اصلی
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                لغو
              </button>
              <button
                onClick={selectedImage ? handleUpdateImage : handleAddImage}
                className="bg-green-600 px-4 py-2 rounded-lg text-white"
              >
                {loading ? 'در حال ذخیره ...' : selectedImage ? 'ویرایش' : 'اضافه کردن'}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default ImageDetails;
