import React from 'react';
import './Nodes.css';

export const ActionNode = ({ node }) => {
  return (
    <div className="node node--action" data-testid="action-node">
      <div className="node__content">
        <span className="node__icon">⚡</span>
        <span className="node__label">{node.label}</span>
      </div>
    </div>
  );
};