import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50';

  const variants = {
    primary:
      'bg-brand text-white hover:bg-brand-deep border border-brand shadow-md shadow-brand/20',
    secondary:
      'bg-brand-ink text-black hover:bg-[#ffe0e0] border border-transparent',
    outline:
      'bg-white text-brand border border-brand/40 hover:bg-brand/5 hover:border-brand',
    ghost: 'bg-transparent text-gray-600 hover:text-brand hover:bg-brand/5 border border-transparent',
    danger:
      'bg-transparent text-red-500 border border-red-400/50 hover:bg-red-50 hover:border-red-400',
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
