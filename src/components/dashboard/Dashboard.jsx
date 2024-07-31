// Dashboard.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import DashboardContent from "./DashboardContent";
import axios from "axios";
import Spinner from "../Spinner"; // Import Spinner component
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {
  const API_BASE_URL = "http://portal1.jatajar.com/api";
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
      toast.success("Data fetched successfully!");
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

  

  return (
    <div className="min-h-[100vh]">
      <Navbar userName={data.data.name} />
      <DashboardContent
        data={data}
        token={token}
        onUpdate={fetchData}
        onEditStart={handleEditStart}
        onEditEnd={handleEditEnd}
      />
    </div>
  );
}

export default Dashboard;
