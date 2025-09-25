import React from 'react';

const Logo: React.FC = () => {
  return (
    <a href="/" className="flex items-center space-x-2 group">
      <img
        src="/images/logo/logo.png"
        alt="Logo"
        className="h-10 w-10 transition-transform duration-700 group-hover:animate-spin-vertical"
      />
      <span className="text-xl font-bold text-white">PHILTECH</span>
    </a>
  );
};

export default Logo;
