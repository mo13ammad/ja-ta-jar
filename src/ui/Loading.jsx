import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import BeatLoader from 'react-spinners/BeatLoader';

const Loading = ({ size, type = "clip" }) => {
  const LoaderComponent = type === "beat" ? (
    <BeatLoader color="#56160C" size={size || 8} margin={1} />
  ) : (
    <ClipLoader color="#56160C" size={size} />
  );

  return (
    <div className="flex justify-center  items-center">
      {LoaderComponent}
    </div>
  );
};

export default Loading;
