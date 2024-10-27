import React from 'react';

function TextField({ label, name, value, onChange, placeholder, readOnly }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs md:text-sm xl:text-lg mb-3 font-medium">
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
