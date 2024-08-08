import React from "react";
import Navbar from "./Navbar";
import Body from "./Body";

function Container() {
  return (
    <div className="w-full overflow-x-hidden h-screen">
      <Navbar />
      <Body />
    </div>
  );
}

export default Container;
