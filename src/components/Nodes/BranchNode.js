import React from 'react';
import './Nodes.css';

export const BranchNode = ({ node }) => {
  return (
    <div className="node node--branch" data-testid="branch-node">
      <div className="node__branch-inner">
        <div className="node__content">
          <span className="node__icon">◆</span>
          <span className="node__label">{node.label}</span>
        </div>
      </div>
    </div>
  );
};