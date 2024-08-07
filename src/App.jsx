import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Container from './components/Container';
import Login from './components/Login';
import Register from './components/Register';
import Rules from './components/Rules';
import Faq from './components/Faq';
import Dashboard from './components/dashboard/Dashboard';
import EditHousePage from './components/dashboard/house/EditHousePage'; // Import the new component
import './index.css';
import { Toaster } from 'react-hot-toast';

const App = () => (
  <div className="font-sans w-full bg-gray-100 min-h-[100vh]">
    <Toaster />
    <Routes>
      <Route path="/" element={<Container />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/edit-house/:uuid" element={<EditHousePage />} /> {/* Add the new route */}
      <Route path="/panel/login-with-token" element={<Register />} />
    </Routes>
  </div>
);

export default App;
