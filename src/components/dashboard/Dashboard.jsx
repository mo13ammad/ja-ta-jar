import React from "react";
import Navbar from "../Navbar";
import DashboardContent from "./DashboardContent";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const userName = location.state?.userData?.data?.user?.name || "User";

  return (
    <div className="min-h-[100vh]">
      <Navbar userName={userName} />
      <DashboardContent />
    </div>
  );
}

export default Dashboard;
