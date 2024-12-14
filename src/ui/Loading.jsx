import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/BeatLoader";

const Loading = ({ size, type = "clip", color }) => {
  let defaultColor = type === "beat" ? "#E1F1FF" : "#56160C";

  // Override defaults if color prop is provided
  if (color === "primary") {
    defaultColor = "#56160C";
  } else if (color === "secondary") {
    defaultColor = "#E1F1FF";
  }

  const LoaderComponent =
    type === "beat" ? (
      <BeatLoader color={defaultColor} size={size || 8} margin={1} />
    ) : (
      <ClipLoader color={defaultColor} size={size} />
    );

  return (
    <div className="flex justify-center items-center">
      {LoaderComponent}
    </div>
  );
};

export default Loading;
