import React, { useEffect } from 'react';
import './UI.css';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast--${type}`} data-testid="toast">
      <span className="toast__icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ⓘ'}
      </span>
      <span className="toast__message">{message}</span>
    </div>
  );
};