import React, { useRef, useEffect } from 'react';
import { NODE_TYPES } from '../../utils/constants';
import './Controls.css';

export const AddNodeMenu = ({ x, y, onSelect, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const menuItems = [
    { type: NODE_TYPES.ACTION, icon: '⚡', label: 'Action', description: 'Single step/task' },
    { type: NODE_TYPES.BRANCH, icon: '◆', label: 'Branch', description: 'Decision point' },
    { type: NODE_TYPES.END, icon: '🏁', label: 'End', description: 'Final step' },
  ];

  return (
    <div
      ref={menuRef}
      className="add-node-menu"
      style={{ left: x, top: y }}
      data-testid="add-node-menu"
    >
      {menuItems.map((item) => (
        <button
          key={item.type}
          className="add-node-menu__item"
          onClick={() => onSelect(item.type)}
          data-testid={`add-node-${item.type}`}
        >
          <span className="add-node-menu__icon">{item.icon}</span>
          <div className="add-node-menu__text">
            <span className="add-node-menu__label">{item.label}</span>
            <span className="add-node-menu__description">{item.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
};