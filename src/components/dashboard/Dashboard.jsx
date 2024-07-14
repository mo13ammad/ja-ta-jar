import React, { useState } from "react";
import Navbar from "../Navbar";
import DashboardContent from "./DashboardContent";

function Dashboard() {

  return (
    <div>
      <Navbar/>
      <DashboardContent/>
    </div>
  );
}

export default Dashboard;
