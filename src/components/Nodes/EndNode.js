import React from 'react';
import './Nodes.css';

export const EndNode = ({ node }) => {
  return (
    <div className="node node--end" data-testid="end-node">
      <div className="node__content">
        <span className="node__icon">🏁</span>
      </div>
    </div>
  );
};