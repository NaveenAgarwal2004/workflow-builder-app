import React, { useState, useEffect } from 'react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { MAX_LABEL_LENGTH, NODE_TYPES } from '../../utils/constants';
import './Controls.css';

export const NodeEditor = ({ node, onSave, onClose }) => {
  const [label, setLabel] = useState(node.label);
  const [branchLabels, setBranchLabels] = useState(
    node.branchLabels || ['True', 'False']
  );

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSave = () => {
    if (!label.trim()) {
      return; // Don't allow empty labels
    }

    const updates = { label: label.trim() };
    
    if (node.type === NODE_TYPES.BRANCH) {
      updates.branchLabels = branchLabels.map(l => l.trim() || 'Branch');
    }

    onSave(node.id, updates);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSave();
    }
  };

  const updateBranchLabel = (index, value) => {
    const newLabels = [...branchLabels];
    newLabels[index] = value;
    setBranchLabels(newLabels);
  };

  const isBranch = node.type === NODE_TYPES.BRANCH;

  return (
    <div className="node-editor-overlay" data-testid="node-editor-overlay" onClick={onClose}>
      <div className="node-editor" data-testid="node-editor" onClick={(e) => e.stopPropagation()}>
        <div className="node-editor__header">
          <h3 className="node-editor__title">
            Edit {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node
          </h3>
          <button
            className="node-editor__close"
            onClick={onClose}
            aria-label="Close"
            data-testid="node-editor-close"
          >
            ✕
          </button>
        </div>

        <div className="node-editor__content">
          <div className="node-editor__field">
            <label className="node-editor__label">Node Label</label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter node label"
              maxLength={MAX_LABEL_LENGTH}
              autoFocus
              onKeyDown={handleKeyDown}
              data-testid="node-label-input"
            />
            <span className="node-editor__counter">
              {label.length}/{MAX_LABEL_LENGTH}
            </span>
          </div>

          {isBranch && (
            <div className="node-editor__field">
              <label className="node-editor__label">Branch Labels</label>
              {branchLabels.map((branchLabel, index) => (
                <div key={index} className="node-editor__branch-input">
                  <span className="node-editor__branch-number">{index + 1}.</span>
                  <Input
                    value={branchLabel}
                    onChange={(e) => updateBranchLabel(index, e.target.value)}
                    placeholder={`Branch ${index + 1}`}
                    maxLength={30}
                    onKeyDown={handleKeyDown}
                    data-testid={`branch-label-input-${index}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="node-editor__footer">
          <Button variant="ghost" onClick={onClose} data-testid="cancel-edit-button">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} data-testid="save-edit-button">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};