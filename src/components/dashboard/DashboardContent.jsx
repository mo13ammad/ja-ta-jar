import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProfileSidebar from "./ProfileSidebar";
import PersonalInfo from "./PersonalInfo";
import ProfileOrders from "./ProfileOrders";

import Addresses from "./ProfileAddresses";
import { Tab } from "@headlessui/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const DashboardContent = () => {
  const API_BASE_URL = "http://jatajar.com/api";
  const location = useLocation();
  const initialData = location.state?.userData || null;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);



  useEffect(() => {
    if (!initialData) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/client/profile`);
          console.log("API response:", response.data);
          setData(response.data);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      toast.success("Welcome to your dashboard!");
    }
  }, [initialData]);

  if (loading) {
    return <div>Loading...</div>; // Replace with a better loading indicator if needed
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <Tab.Group>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <ProfileSidebar user={data.data.user}/>
          <div className="col-span-1 lg:col-span-3 border p-4 rounded-xl bg-white">
            <Tab.Panels>
              <Tab.Panel>
                <PersonalInfo  user={data.data.user}/>
              </Tab.Panel>
             
              
             <Tab.Panel>
                <Addresses />
              </Tab.Panel>
              
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
    </div>
  );
};

export default DashboardContent;
