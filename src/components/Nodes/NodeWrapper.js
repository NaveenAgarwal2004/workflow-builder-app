import React from 'react';
import { NODE_TYPES } from '../../utils/constants';
import './Nodes.css';

export const NodeWrapper = ({ 
  node, 
  position, 
  isSelected,
  onSelect, 
  onEdit, 
  onDelete,
  onAddChild,
  children 
}) => {
  const canDelete = node.type !== NODE_TYPES.START;
  const canAddChild = node.type !== NODE_TYPES.END;

  const handleNodeClick = (e) => {
    e.stopPropagation();
    onSelect(node.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(node);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(node);
  };

  const handleAddClick = (e, branchLabel = null) => {
    e.stopPropagation();
    onAddChild(node.id, e.clientX, e.clientY, branchLabel);
  };

  return (
    <div
      className={`node-wrapper ${isSelected ? 'node-wrapper--selected' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onClick={handleNodeClick}
      data-testid={`node-${node.type}`}
    >
      {children}

      {/* Action buttons */}
      <div className="node-actions">
        {node.type !== NODE_TYPES.START && (
          <button
            className="node-action node-action--edit"
            onClick={handleEditClick}
            title="Edit node"
            aria-label="Edit node"
            data-testid="edit-node-button"
          >
            ✎
          </button>
        )}
        
        {canDelete && (
          <button
            className="node-action node-action--delete"
            onClick={handleDeleteClick}
            title="Delete node"
            aria-label="Delete node"
            data-testid="delete-node-button"
          >
            🗑
          </button>
        )}
      </div>

      {/* Add child button(s) */}
      {canAddChild && (
        <div className="node-add-children">
          {node.type === NODE_TYPES.BRANCH ? (
            // Branch node: show add button for each branch
            <div className="node-add-branches">
              {(node.branchLabels || ['True', 'False']).map((branchLabel, index) => (
                <button
                  key={index}
                  className="node-add-button node-add-button--branch"
                  onClick={(e) => handleAddClick(e, branchLabel)}
                  title={`Add node to ${branchLabel} branch`}
                  data-testid={`add-child-branch-${index}`}
                >
                  <span className="node-add-button__icon">+</span>
                  <span className="node-add-button__label">{branchLabel}</span>
                </button>
              ))}
            </div>
          ) : (
            // Regular node: single add button
            <button
              className="node-add-button"
              onClick={handleAddClick}
              title="Add child node"
              data-testid="add-child-button"
            >
              <span className="node-add-button__icon">+</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};