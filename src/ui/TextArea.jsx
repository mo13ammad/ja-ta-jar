import React from 'react';

function TextArea({ label, name, value, onChange, placeholder, rows = 4 }) {
  return (
    <div className=''>
      <label htmlFor={name} className="mb-3 font-medium">{label} </label>
      <textarea
        className="textArea__input"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}  // Default is 4 rows, can be customized
      />
    </div>
  );
}

export default TextArea;
