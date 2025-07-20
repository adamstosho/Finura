import React from 'react';

const Logo: React.FC = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block align-middle"
  >
    <rect width="48" height="48" rx="12" fill="#1A6AFF"/>
    <path
      d="M16 32V16H32"
      stroke="#2FFFCF"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 24H28C30.2091 24 32 25.7909 32 28C32 30.2091 30.2091 32 28 32H16"
      stroke="#FFD600"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="24" cy="24" r="22" stroke="#fff" strokeWidth="2"/>
  </svg>
);

export default Logo; 