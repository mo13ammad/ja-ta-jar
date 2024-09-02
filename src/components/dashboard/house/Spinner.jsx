import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center mt-12">
      <ClipLoader color="#28a745" size={45} />
    </div>
  );
};

export default Spinner;
