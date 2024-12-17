// src/features/dashboard/DashboardContainer.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardContent from "./DashboardContent";
import useUser from "./useUser";
import Loading from "../../ui/Loading";

function DashboardContainer() {
  const { isLoading, data: initialUser } = useUser();
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUser);
  const [selectedTab, setSelectedTab] = useState("profile");

  // Update user state when initialUser changes
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  // Redirect to home if user does not exist after loading
useEffect(() => {
  // Only navigate if we are not loading and initialUser is definitively null
  if (!isLoading && initialUser === null) {
    navigate("/");
  }
}, [isLoading, initialUser, navigate]);


  if (isLoading || !user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loading size={30} />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 w-full min-h-[83vh] h-full">
      <div className="md:col-span-3 w-full bg-gray-50 border-t border-gray-200 shadow-centered rounded-xl p-2 md:p-4">
        <DashboardSidebar user={user} setSelectedTab={setSelectedTab} />
      </div>
      <div className="md:col-span-9 flex-grow w-full bg-gray-50 border-t border-gray-200 shadow-centered rounded-xl p-2 md:p-4">
        <DashboardContent
          selectedTab={selectedTab}
          initialUser={user}
          onUpdateUser={setUser}
        />
      </div>
    </div>
  );
}

export default DashboardContainer;
