import React from "react";
import Navbar from "./Navbar";
import Body from "./Body";
import Header from "./Header";

function Container() {
  return (
    <div className="w-full overflow-x-hidden h-screen">
      <Header />
      <Body />
    </div>
  );
}

export default Container;
