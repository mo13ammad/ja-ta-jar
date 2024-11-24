import React from 'react';
import PropTypes from 'prop-types';

const CustomInfoIcon = ({ tooltipText, className, ...props }) => (
  <div className="relative group">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="#801D14"
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
      />
    </svg>
    {tooltipText && (
      <div className="absolute bottom-full left-1/2 transform  -translate-x-1/2 mb-2 hidden group-hover:block bg-primary-500 text-white text-xs rounded-2xl px-2 py-1">
        {tooltipText}
      </div>
    )}
  </div>
);

CustomInfoIcon.propTypes = {
  tooltipText: PropTypes.string,
  className: PropTypes.string,
};

export default CustomInfoIcon;
