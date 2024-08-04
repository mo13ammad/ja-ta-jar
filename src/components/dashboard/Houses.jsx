import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogPanel, DialogTitle, Description, RadioGroup, Label } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';
import Spinner from "../Spinner"; 

const VilaaiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
  </svg>
);

const BoomgardiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const SuiteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
  </svg>
);

const ApartmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);

const options = [
  { key: 'Boomgardi', label: 'بوم گردی', icon: <BoomgardiIcon />, color: '#4bceff' },
  { key: 'Vilaii', label: 'ویلایی', icon: <VilaaiIcon />, color: '#42ff00' },
  { key: 'Swit', label: 'سویت', icon: <SuiteIcon />, color: '#ceff0b' },
  { key: 'Apartment', label: 'آپارتمان', icon: <ApartmentIcon />, color: '#ff0000' },
];

const Houses = ({ token }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0].key);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [houses, setHouses] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});

  useEffect(() => {
    const fetchHouses = async () => {
      setIsDataLoaded(false);
      try {
        const response = await axios.get('https://portal1.jatajar.com/api/client/house', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        console.log('Fetch Houses Response:', response); // Log the response here

        if (response.status === 200) {
          setHouses(Array.isArray(response.data.data) ? response.data.data : []);
          setIsDataLoaded(true);
        } else {
          throw new Error('Failed to fetch data: ' + response.statusText);
        }
      } catch (error) {
        setError('Failed to fetch data: ' + error.message);
        setIsDataLoaded(true);
      }
    };

    fetchHouses();
  }, [token]);

  const fetchHouses = async () => {
    setIsDataLoaded(false);
    try {
      const response = await axios.get('https://portal1.jatajar.com/api/client/house', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Fetch Houses Response:', response); // Log the response here

      if (response.status === 200) {
        setHouses(Array.isArray(response.data.data) ? response.data.data : []);
        setIsDataLoaded(true);
      } else {
        throw new Error('Failed to fetch data: ' + response.statusText);
      }
    } catch (error) {
      setError('Failed to fetch data: ' + error.message);
      setIsDataLoaded(true);
    }
  };

  const handleEditClick = async (uuid) => {
    navigate(`/edit-house/${uuid}`, { state: { token } });
  };

  const handleViewClick = (uuid) => {
    navigate(`/house/${uuid}`, { state: { token } });
  };

  const handleDeleteClick = async (uuid) => {
    setDeleteLoading((prevState) => ({ ...prevState, [uuid]: true }));
    setError('');
    setSuccess('');

    try {
      const response = await axios.delete(
        `https://portal1.jatajar.com/api/client/house/${uuid}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200) {
        setSuccess('Successfully deleted.');
        await fetchHouses();
      } else {
        throw new Error('Failed to delete: ' + response.statusText);
      }
    } catch (error) {
      setError('Failed to delete: ' + error.message);
    } finally {
      setDeleteLoading((prevState) => ({ ...prevState, [uuid]: false }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      const response = await axios.post(
        'https://portal1.jatajar.com/api/client/house',
        { structure: selectedOption },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
  
      console.log('Add House Response:', response); // Log the response
  
      if (response.status === 201) {
        const { uuid } = response.data.data; // Assuming the response data contains the house's uuid
        setSuccess('Successfully added.');
        setIsOpen(false);
        toast.success('اقامتگاه اضافه شد'); // Show success toast
        navigate(`/edit-house/${uuid}`, { state: { token } }); // Navigate to the edit-house page with the new uuid
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to add the house.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className='w-full h-full p-4'>
      <Toaster /> {/* Add the Toaster component to show toast messages */}
      <div className='w-full flex justify-between items-center mb-2'>
        <h2 className='text-xl'>اقامتگاه ها :</h2>
        <button
          className='bg-green-600 px-4 py-2 rounded-xl text-white'
          onClick={() => setIsOpen(true)}
        >
          اضافه کردن اقامتگاه
        </button>
      </div>
      {isDataLoaded ? (
  houses.length === 0 ? (
    <p className='p-1'>اقامتگاهی وجود ندارد.</p>
  ) : (
    <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
      {houses.map((house) => (
        <div key={house.uuid} className='border rounded-2xl flex justify-between items-center  gap-2 '>
          <div className='px-3 py-2 w-full sm:w-3/5'>
          <div className='flex gap-2 mb-2'>
            <p className='font-semibold '>نام :</p>
            <p className=''>{house.name || 'وارد نشده است'}</p>
          </div>
          <div className='flex gap-2 mb-2'>
            <p className='font-semibold '>نوع اقامتگاه :</p>
            <p className=''>{house.structure ? house.structure.label : 'وارد نشده است'}</p>
          </div>
          <div className='flex gap-2 mb-2'>
            <p className='font-semibold '>وضعیت :</p>
            <p className=''>{house.status ? house.status.label : 'وارد نشده است'}</p>
          </div>
         
          <div className='flex gap-2'>
            <button
              className='bg-green-500 max-w-36 text-white px-2 py-1 rounded-lg mt-2'
              onClick={() => handleEditClick(house.uuid)}
            >
              ویرایش
            </button>
            <button
              className='bg-gray-400 max-w-36 text-white px-2 py-1 rounded-lg mt-2'
              onClick={() => handleViewClick(house.uuid)}
            >
              مشاهده
            </button>
            <button
              className='bg-red-500 max-w-36 text-white px-2 py-1 rounded-lg mt-2'
              onClick={() => handleDeleteClick(house.uuid)}
            >
              {deleteLoading[house.uuid] ? 'در حال حذف ...' : 'حذف'}
            </button>
          </div>
          </div>
          <img src={house.image} className='hidden sm:block w-2/5 h-full object-cover rounded-tl-xl rounded-bl-xl' alt="" />
        </div>
      ))}
    </div>
  )
) : (
  <div className='flex justify-center items-center w-full min-h-[50vh]'>
    <Spinner />
  </div>
)}


      {/* Add House Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        {/* Background Blur Effect */}
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-xl w-full">
            <DialogTitle className="font-bold text-xl">افزودن اقامتگاه</DialogTitle>
            <Description>لطفاً نوع اقامتگاه خود را وارد کنید :</Description>

            <div className="w-full">
              <RadioGroup value={selectedOption} onChange={setSelectedOption} className="grid grid-cols-2 gap-2">
                {options.map((option) => (
                  <RadioGroup.Option key={option.key} value={option.key} className="flex items-center">
                    {({ checked }) => (
                      <div className={`flex items-center p-4 border rounded-lg cursor-pointer w-full ${checked ? 'bg-gray-100' : ''}`}>
                        <div className="flex-shrink-0">
                          {option.icon}
                        </div>
                        <div className="ml-3">
                          <Label className="text-lg font-medium mr-2">{option.label}</Label>
                        </div>
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </RadioGroup>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                لغو
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 px-4 py-2 rounded-lg text-white"
              >
                {loading ? 'در حال اضافه کردن ....' : 'اضافه کردن'}
              </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default Houses;
