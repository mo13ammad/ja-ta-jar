import React from "react";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Outlet />
    </div>
  );
}

export default Dashboard;
