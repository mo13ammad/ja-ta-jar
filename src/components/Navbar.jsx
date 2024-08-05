import React from 'react';

const Navbar = ({ userName, avatar }) => {
  return (
    <div className="navbar">
      {avatar && <img src={avatar} alt={`${userName}'s avatar`} className="avatar" />}
      <span>{userName}</span>
    </div>
  );
};

export default Navbar;
