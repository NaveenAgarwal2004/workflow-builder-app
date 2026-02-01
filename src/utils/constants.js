// Layout constants
export const LAYOUT = {
  NODE_WIDTH: 200,
  NODE_HEIGHT: 80,
  HORIZONTAL_GAP: 100,
  VERTICAL_GAP: 120,
  BRANCH_NODE_SIZE: 120,
  END_NODE_SIZE: 80,
};

// Node types
export const NODE_TYPES = {
  START: 'start',
  ACTION: 'action',
  BRANCH: 'branch',
  END: 'end',
};

// Maximum history entries for undo/redo
export const MAX_HISTORY = 50;

// Maximum label length
export const MAX_LABEL_LENGTH = 50;

// Initial workflow state
export const INITIAL_STATE = {
  nodes: {
    'start-node': {
      id: 'start-node',
      type: NODE_TYPES.START,
      label: 'Start',
      children: [],
      parentId: null,
      metadata: {
        createdAt: Date.now(),
        position: { x: 0, y: 0 }
      }
    }
  },
  rootId: 'start-node',
  selectedNodeId: null,
  version: 0, // Add version counter for forcing re-renders
};

// Default branch labels
export const DEFAULT_BRANCH_LABELS = ['True', 'False'];

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  UNDO: { key: 'z', ctrl: true, shift: false },
  REDO: { key: 'z', ctrl: true, shift: true },
  SAVE: { key: 's', ctrl: true },
  DELETE: ['Delete', 'Backspace'],
  ESCAPE: 'Escape',
  ENTER: 'Enter',
};