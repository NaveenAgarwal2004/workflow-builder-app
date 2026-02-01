import React from 'react';
import './Nodes.css';

export const StartNode = ({ node }) => {
  return (
    <div className="node node--start" data-testid="start-node">
      <div className="node__content">
        <span className="node__icon">▶</span>
        <span className="node__label">{node.label}</span>
      </div>
    </div>
  );
};