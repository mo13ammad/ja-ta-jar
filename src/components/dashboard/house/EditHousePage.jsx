import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar';
import EditHouseContent from './EditHouseContent';
import Spinner from '../../Spinner';
import toast, { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const EditHousePage = () => {
  const { uuid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token || '';

  const [houseData, setHouseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHouseData = async () => {
    try {
      const response = await axios.get(`https://portal1.jatajar.com/api/client/house/${uuid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setHouseData(response.data.data); // Ensure response.data.data is used
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching house data:', error);
      toast.error("مشکلی پیش آمده لطفا به پشتیبانی اطلاع دهید");
      navigate('/dashboard'); // Redirect to dashboard on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uuid) {
      fetchHouseData();
    } else {
      navigate('/dashboard'); // Redirect to dashboard if uuid is not available
    }
  }, [uuid]);

  if (loading) {
    return (
      <div className="min-h-[100vh] flex items-center justify-center">
        <Toaster />
        <Spinner />
      </div>
    );
  }

  if (!houseData) {
    navigate('/login'); // Redirect to login page if no house data
    return null; // Return null to avoid rendering anything before redirect
  }

  return (
    <>
     <Helmet>
        <title>{"ویرایش اقامتگاه"}</title>
      </Helmet>
    <div className="min-h-[100vh] ">
      <Navbar userName={houseData.vendor.name} />
      <EditHouseContent houseData={houseData} token={token} onUpdate={fetchHouseData} />
      <div className="fixed md:hidden z-50 bottom-0 bg-white shadow-2xl rounded-t-xl w-full h-16 flex justify-end">
          <button className="bg-green-600 self-end cursor-pointer text-white px-4 py-2 rounded-xl shadow-xl my-auto ml-4">
            ثبت اطلاعات
          </button>
        </div>
    </div>
    </>
  );
};

export default EditHousePage;
