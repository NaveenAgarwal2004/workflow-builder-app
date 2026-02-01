import React from 'react';
import './UI.css';

export const Input = ({ 
  value, 
  onChange, 
  placeholder,
  maxLength,
  autoFocus = false,
  onKeyDown,
  className = '',
  ...props 
}) => {
  return (
    <input
      type="text"
      className={`input ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
      {...props}
    />
  );
};