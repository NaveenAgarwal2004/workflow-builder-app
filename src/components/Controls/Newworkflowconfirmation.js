import React, { useEffect } from 'react';
import { Button } from '../UI/Button';
import './Controls.css';

export const NewWorkflowConfirmation = ({ onConfirm, onCancel }) => {
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
      data-testid="new-workflow-overlay"
      onClick={onCancel}
    >
      <div 
        className="delete-confirmation" 
        data-testid="new-workflow-confirmation"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-confirmation__icon">🆕</div>
        <h3 className="delete-confirmation__title">Start New Workflow?</h3>
        <p className="delete-confirmation__message">
          Are you sure you want to start a new workflow?
          <br />
          <span className="delete-confirmation__note">
            Your current workflow will be cleared. Make sure you've saved it first!
          </span>
        </p>
        <div className="delete-confirmation__actions">
          <Button variant="ghost" onClick={onCancel} data-testid="cancel-new-button">
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} data-testid="confirm-new-button">
            Start New
          </Button>
        </div>
      </div>
    </div>
  );
};