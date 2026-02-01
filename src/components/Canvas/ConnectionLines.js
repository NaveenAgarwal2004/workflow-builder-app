import React from 'react';
import { getConnectionPoints, calculateBezierPath } from '../../utils/layoutEngine';
import './WorkflowCanvas.css';

export const ConnectionLines = ({ nodes, positions }) => {
  const connections = [];

  // Generate connections
  Object.values(nodes).forEach(node => {
    if (node.children && node.children.length > 0) {
      node.children.forEach(childId => {
        const child = nodes[childId];
        if (child && positions[node.id] && positions[childId]) {
          const { startX, startY, endX, endY } = getConnectionPoints(
            positions[node.id],
            positions[childId],
            node.type,
            child.type
          );

          connections.push({
            id: `${node.id}-${childId}`,
            path: calculateBezierPath(startX, startY, endX, endY),
            branchLabel: child.branchLabel,
            labelX: (startX + endX) / 2,
            labelY: (startY + endY) / 2,
          });
        }
      });
    }
  });

  if (connections.length === 0) return null;

  return (
    <svg className="connection-lines">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(99,102,241,0.6)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0.6)" />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {connections.map(conn => (
        <g key={conn.id}>
          <path
            d={conn.path}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="connection-line"
            filter="url(#glow)"
          />
          
          {conn.branchLabel && (
            <g>
              <rect
                x={conn.labelX - 30}
                y={conn.labelY - 10}
                width="60"
                height="20"
                fill="#1e293b"
                stroke="rgba(99,102,241,0.5)"
                strokeWidth="1"
                rx="10"
              />
              <text
                x={conn.labelX}
                y={conn.labelY + 4}
                textAnchor="middle"
                fill="#f1f5f9"
                fontSize="11"
                fontWeight="500"
              >
                {conn.branchLabel}
              </text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
};