import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import DashboardContent from "./DashboardContent";
import axios from "axios";
import Spinner from "../Spinner"; // Import Spinner component
import { Helmet } from "react-helmet-async";
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {
  const API_BASE_URL = "https://portal1.jatajar.com/api";
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token || ""; // Get the token from location.state

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false); // New state to track if we're refetching
  const [editLoading, setEditLoading] = useState(false); // New state for edit button loading

  const fetchData = async () => {
    setFetching(true); // Set fetching to true when starting to refetch data
    try {
      const response = await axios.get(`${API_BASE_URL}/client/profile`, {
        headers: {
          Authorization: `Bearer ${token}` // Pass the token in the headers
        }
      });
      console.log("API response from get:", response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      navigate("/login");
    } finally {
      setLoading(false);
      setFetching(false); // Reset fetching state
    }
  };

  const handleEditStart = () => {
    setEditLoading(true); // Set editLoading to true to show spinner
  };

  const handleEditEnd = () => {
    setEditLoading(false); // Reset editLoading to false when done
  };

  useEffect(() => {
    fetchData();
  }, [token, navigate]); // Dependency on token to refetch if it changes

  if (loading || fetching || editLoading) {
    // Show spinner while loading or fetching or editing
    return (
      <div className="min-h-[100vh] flex items-center justify-center">
        <Toaster />
        <Spinner /> {/* Show spinner */}
      </div>
    );
  }

  if (!data || !data.data) {
    // Handle the case where data or data.data is null
    return (
      <div className="min-h-[100vh] flex items-center justify-center">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <>
     <Helmet>
        <title>{"پروفایل"}</title>
      </Helmet>
    <div className="min-h-[100vh] overflow-auto">
      <Navbar userName={data.data.name} />
      <DashboardContent
        data={data}
        token={token}
        onUpdate={fetchData}
        onEditStart={handleEditStart}
        onEditEnd={handleEditEnd}
      />
    </div>
    </>
  );
}

export default Dashboard;
