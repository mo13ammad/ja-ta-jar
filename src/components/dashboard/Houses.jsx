import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogPanel, DialogTitle, Description, RadioGroup, Label } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';
import Spinner from "../Spinner"; 
import ReactPaginate from 'react-paginate';

const Houses = ({ token }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [houses, setHouses] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [structureOptions, setStructureOptions] = useState([]);

  useEffect(() => {
    fetchHouses(currentPage);
    fetchStructureOptions(); // Fetch structure options on mount
  }, [token, currentPage]);

  const fetchHouses = async (page) => {
    setIsDataLoaded(false);
    try {
      const response = await axios.get(`https://portal1.jatajar.com/api/client/house?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        setHouses(Array.isArray(response.data.data) ? response.data.data : []);
        setTotalPages(response.data.pagination.last_page);
        setIsDataLoaded(true);
      } else {
        throw new Error('Failed to fetch data: ' + response.statusText);
      }
    } catch (error) {
      setError('Failed to fetch data: ' + error.message);
      setIsDataLoaded(true);
    }
  };

  const fetchStructureOptions = async () => {
    try {
      const response = await axios.get('https://portal1.jatajar.com/api/assets/types/structure/detail', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setStructureOptions(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedOption(response.data.data[0].key); // Set default selected option
        }
      } else {
        throw new Error('Failed to fetch structure options: ' + response.statusText);
      }
    } catch (error) {
      setError('Failed to fetch structure options: ' + error.message);
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
        await fetchHouses(currentPage);
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

      if (response.status === 201) {
        const { uuid } = response.data.data;
        setSuccess('Successfully added.');
        setIsOpen(false);
        toast.success('اقامتگاه اضافه شد');
        navigate(`/edit-house/${uuid}`, { state: { token } });
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

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <div className='w-full h-full p-4'>
      <Toaster />
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

      {!loading && isDataLoaded && (
        <div className="flex justify-center mt-4">
          <ReactPaginate
            previousLabel={<span className="ml-3">صفحه قبلی</span>}
            nextLabel={"صفحه بعدی"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
            className="flex items-center space-x-2"
            pageClassName="px-3 py-1.5 rounded-2xl bg-gray-200 hover:bg-gray-300 cursor-pointer"
            activeLinkClassName="text-green-500"
          />
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
                {structureOptions.map((option) => (
                  <RadioGroup.Option key={option.key} value={option.key} className="flex items-center">
                    {({ checked }) => (
                      <div className={`flex items-center p-4 border rounded-lg cursor-pointer w-full ${checked ? 'bg-gray-100' : ''}`}>
                        <div className="flex-shrink-0">
                          <img src={option.icon} alt={option.label} className="w-6 h-6" />
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
