import React from 'react';

export default function Button({ children, className, ...props }) {
  return (
    <button
      className={
        'hover:bg-blue-400 bg-blue-600 px-1 py-2 rounded-lg w-60 text-white bold ' +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
