import React from 'react';

function TextField({ label, name, value, onChange, placeholder, readOnly }) {
  return (
    <div className='my-4'>
      <label htmlFor={name} className="text-xs md:text-sm  mb-1.5 font-medium">
        {label}
      </label>
      <input
        className="textField__input"
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        readOnly={readOnly}  // Set the field as read-only if needed
      />
    </div>
  );
}

export default TextField;
