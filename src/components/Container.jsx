import React from "react";
import Navbar from "./Navbar";
import Body from "./Body";
import Header from "./Header";
import { Helmet } from "react-helmet-async";

function Container() {
  return (
    <>
    <Helmet><title>جا تا جار</title></Helmet>
    <div className="w-full overflow-x-hidden h-screen">
      <Header />
      <Body />
    </div>
    </>
  );
}

export default Container;
