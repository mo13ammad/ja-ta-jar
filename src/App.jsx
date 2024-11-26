// src/App.jsx

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import Auth from "./pages/Auth";
import EditHouseContainer from "./features/dashboard/edithouse/EditHouseContainer";
import Home from "./pages/Home";
import AppLayout from "./ui/AppLayout";
import DashboardContainer from "./features/dashboard/DashboardContainer";
import HouseContainer from "./features/house/HouseContainer";
import CheckOTPForm from "./features/authentication/CheckOTPForm";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Routes>
        {/* If you want LoginWithToken to use AppLayout, include it here */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashboardContainer />} />
          <Route
            path="/dashboard/edit-house/:uuid"
            element={<EditHouseContainer />}
          />
          <Route path="/house/:uuid" element={<HouseContainer />} />
          <Route path="/panel/login-with-token" element={<CheckOTPForm />} />
        </Route>

        <Route path="/auth" element={<Auth />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
