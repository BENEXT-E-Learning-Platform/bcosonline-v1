import React from 'react';

const Button = ({ children, className = '', ...props }) => {
  return (
    <button className={`px-6 py-3 rounded font-bold ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;