import React from 'react';

const SkeletonLoader = ({ className = '', type = 'box' }) => {
  const baseClasses = 'animate-pulse bg-brand-elevated border border-white/5';
  
  const types = {
    box: 'h-32 w-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2',
    avatar: 'h-12 w-12 rounded-full',
  };

  return <div className={`${baseClasses} ${types[type]} ${className}`} />;
};

export default SkeletonLoader;
