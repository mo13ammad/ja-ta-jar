import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <ClipLoader color="#56160C" size={40} />
    </div>
  );
};

export default Spinner;
