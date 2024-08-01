import React from "react";
import './index.css'
import { Routes, Route } from "react-router-dom";
import Container from "./components/Container";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/dashboard/Dashboard"; // Import the Dashboard component
import { Toaster } from "react-hot-toast"; // Import the Toaster component

function App() {
  return (
    <div className="font-sans w-full bg-gray-100 min-h-[100vh]">
      <Toaster />
      <Routes>
        <Route path="/" element={<Container />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
