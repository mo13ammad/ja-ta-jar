import React from "react";
import logo from "../assets/logo.webp";

function Header() {
  return (
    <div className="h-12 bg-gray-100 flex items-center shadow-md">
      <img src={logo} alt="Logo"  className="max-w-36"/>
    </div>
  );
}

export default Header;
