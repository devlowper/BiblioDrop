import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center relative">
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
      <h1 className="relative font-display text-8xl font-bold tracking-tighter text-brand mb-4">404</h1>
      <h2 className="relative text-2xl font-medium text-black mb-6">Page Not Found</h2>
      <p className="relative text-gray-400 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="relative">
        <Button variant="primary">Return Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
