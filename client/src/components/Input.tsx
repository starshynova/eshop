import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input: React.FC<InputProps> = ({
  error = false,
  className = '',
  ...props
}) => {
  return (
    <input
      className={
        `w-full h-10 text-base border-2 bg-white rounded-md px-2 mb-5 ` +
        (error ? 'border-red-500' : 'border-[#b7e8ff]') +
        ` ${className}`
      }
      {...props}
    />
  );
};

export default Input;
