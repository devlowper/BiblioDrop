import React from 'react';

const Spinner = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-brand border-brand/20 ${sizes[size]}`}
      ></div>
    </div>
  );
};

export default Spinner;
