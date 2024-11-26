import React from "react";
import AuthContainer from "../features/authentication/AuthContainer";

function auth() {
  return (
    <div className="flex justify-center items-center h-screen">
      <AuthContainer />
    </div>
  );
}

export default auth;
