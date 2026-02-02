import { NODE_TYPES, DEFAULT_BRANCH_LABELS } from './constants';

// Generate unique ID
export const generateId = () => {
  return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Add a new node to the workflow
export const addNode = (state, parentId, nodeType, branchLabel = null) => {
  const parent = state.nodes[parentId];
  if (!parent) return state;

  // Don't allow adding children to END nodes
  if (parent.type === NODE_TYPES.END) return state;

  const newNode = {
    id: generateId(),
    type: nodeType,
    label: `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}`,
    children: [],
    parentId: parentId,
    branchLabel: branchLabel,
    metadata: {
      createdAt: Date.now(),
    }
  };

  // For branch nodes, add default branch labels
  if (nodeType === NODE_TYPES.BRANCH) {
    newNode.branchLabels = [...DEFAULT_BRANCH_LABELS];
  }

  const newState = {
    ...state,
    nodes: {
      ...state.nodes,
      [newNode.id]: newNode,
      [parentId]: {
        ...parent,
        children: [...parent.children, newNode.id]
      }
    },
    selectedNodeId: newNode.id, // Auto-select new node
    version: (state.version || 0) + 1, // INCREMENT VERSION
  };

  return newState;
};

// Delete a node and reconnect its children to parent
export const deleteNode = (state, nodeId) => {
  const node = state.nodes[nodeId];
  
  // Can't delete the start node
  if (!node || node.type === NODE_TYPES.START) return state;

  const newNodes = { ...state.nodes };
  const parent = newNodes[node.parentId];

  if (parent) {
    // Remove node from parent's children
    parent.children = parent.children.filter(id => id !== nodeId);

    // Reconnect deleted node's children to parent
    parent.children.push(...node.children);
    
    // Update parentId for each child
    node.children.forEach(childId => {
      if (newNodes[childId]) {
        newNodes[childId] = {
          ...newNodes[childId],
          parentId: parent.id,
          branchLabel: node.branchLabel, // Preserve branch label
        };
      }
    });
  }

  // Delete the node
  delete newNodes[nodeId];

  return {
    ...state,
    nodes: newNodes,
    selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    version: (state.version || 0) + 1,
  };
};

// Update a node's properties
export const updateNode = (state, nodeId, updates) => {
  const node = state.nodes[nodeId];
  if (!node) return state;

  return {
    ...state,
    nodes: {
      ...state.nodes,
      [nodeId]: {
        ...node,
        ...updates,
      }
    },
    version: (state.version || 0) + 1,
  };
};

// Select a node
export const selectNode = (state, nodeId) => {
  return {
    ...state,
    selectedNodeId: nodeId,
  };
};

// Add a branch to a branch node
export const addBranchLabel = (state, nodeId, newLabel) => {
  const node = state.nodes[nodeId];
  if (!node || node.type !== NODE_TYPES.BRANCH) return state;

  const branchLabels = node.branchLabels || DEFAULT_BRANCH_LABELS;
  
  return {
    ...state,
    nodes: {
      ...state.nodes,
      [nodeId]: {
        ...node,
        branchLabels: [...branchLabels, newLabel],
      }
    },
    version: (state.version || 0) + 1,
  };
};

// Update branch label
export const updateBranchLabel = (state, nodeId, index, newLabel) => {
  const node = state.nodes[nodeId];
  if (!node || node.type !== NODE_TYPES.BRANCH) return state;

  const branchLabels = [...(node.branchLabels || DEFAULT_BRANCH_LABELS)];
  branchLabels[index] = newLabel;

  return {
    ...state,
    nodes: {
      ...state.nodes,
      [nodeId]: {
        ...node,
        branchLabels,
      }
    },
    version: (state.version || 0) + 1,
  };
};