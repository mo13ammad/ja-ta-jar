import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Container from "./components/Container";
import Login from "./components/Login";
import Dashboard from "./components/dashboard/Dashboard"; // Import the Dashboard component

function App() {
  return (
    <div className="font-sans w-full bg-gray-100 min-h-[100vh]">
      <Router>
        <Routes>
          <Route path="/" element={<Container />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
