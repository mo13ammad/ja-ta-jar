import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../../Navbar';
import EditHouseContent from './EditHouseContent';
import Spinner from '../../Spinner';
import toast, { Toaster } from 'react-hot-toast';

const EditHousePage = () => {
  const { uuid } = useParams();
  const location = useLocation();
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
      toast.success('House data fetched successfully!');
    } catch (error) {
      console.error('Error fetching house data:', error);
      toast.error('Failed to fetch house data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseData();
  }, [token, uuid]);

  if (loading) {
    return (
      <div className="min-h-[100vh] flex items-center justify-center">
        <Toaster />
        <Spinner />
      </div>
    );
  }

  if (!houseData) {
    return (
      <div className="min-h-[100vh] flex items-center justify-center">
        <p>No house data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] overflow-auto">
      <Navbar userName={houseData.ownerName} />
      <EditHouseContent houseData={houseData} token={token} onUpdate={fetchHouseData} />
    </div>
  );
};

export default EditHousePage;
