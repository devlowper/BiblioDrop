import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white border border-brand/10 overflow-hidden flex flex-col rounded-2xl shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
