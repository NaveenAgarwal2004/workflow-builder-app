import React, { useEffect } from 'react';
import { Button } from '../UI/Button';
import './Controls.css';

export const DeleteConfirmation = ({ nodeName, onConfirm, onCancel }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  return (
    <div 
      className="delete-confirmation-overlay" 
      data-testid="delete-confirmation-overlay"
      onClick={onCancel}
    >
      <div 
        className="delete-confirmation" 
        data-testid="delete-confirmation"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-confirmation__icon">⚠️</div>
        <h3 className="delete-confirmation__title">Delete Node?</h3>
        <p className="delete-confirmation__message">
          Are you sure you want to delete <strong>"{nodeName}"</strong>?
          <br />
          <span className="delete-confirmation__note">
            Child nodes will be reconnected to the parent.
          </span>
        </p>
        <div className="delete-confirmation__actions">
          <Button variant="ghost" onClick={onCancel} data-testid="cancel-delete-button">
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} data-testid="confirm-delete-button">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};