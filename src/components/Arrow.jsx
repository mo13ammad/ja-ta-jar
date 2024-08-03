import React from 'react';

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'green', borderRadius: '50%' }}
      onClick={onClick}
    />
  );
};

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'green', borderRadius: '50%' }}
      onClick={onClick}
    />
  );
};

export { SamplePrevArrow, SampleNextArrow };
