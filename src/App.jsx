import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Container from "./components/Container";
import Login from "./components/Login";

function App() {
  return (
    <div className="font-sans w-full bg-gray-200 h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Container />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
