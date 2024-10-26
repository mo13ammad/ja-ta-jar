import React from 'react'

function TextField({label,name,value,onChange,placeholder}) {
  return (
    <div className=''>
    <label htmlFor={name} className="mb-3 font-medium">{label} </label>
      <input
        className="textField__input"
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete='off'
      />
    </div>
  )
}

export default TextField