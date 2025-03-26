import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`h-full bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition ${className}`}>
      {children}
    </div>
  );
};

export default Card;