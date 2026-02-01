import { NODE_TYPES } from './constants';

// Validate workflow and return warnings
export const validateWorkflow = (nodes, rootId) => {
  const warnings = [];

  // Check if there's a path to END from each node
  const hasPathToEnd = (nodeId, currentPath = new Set()) => {
    if (currentPath.has(nodeId)) {
      // Circular dependency detected
      return { hasEnd: false, isCircular: true };
    }

    const node = nodes[nodeId];
    if (!node) return { hasEnd: false, isCircular: false };

    if (node.type === NODE_TYPES.END) {
      return { hasEnd: true, isCircular: false };
    }

    if (node.children.length === 0) {
      return { hasEnd: false, isCircular: false };
    }

    currentPath.add(nodeId);
    
    let foundEnd = false;
    let foundCircular = false;

    for (const childId of node.children) {
      const result = hasPathToEnd(childId, new Set(currentPath));
      if (result.hasEnd) foundEnd = true;
      if (result.isCircular) foundCircular = true;
    }

    return { hasEnd: foundEnd, isCircular: foundCircular };
  };

  // Validate each node
  Object.values(nodes).forEach(node => {
    // Skip START node
    if (node.type === NODE_TYPES.START) return;

    // Check for orphaned nodes (no path to END)
    if (node.type !== NODE_TYPES.END && node.children.length === 0) {
      warnings.push({
        nodeId: node.id,
        type: 'orphaned',
        message: `"${node.label}" has no path to completion`,
        severity: 'warning'
      });
    }

    // Check for branch nodes with insufficient children
    if (node.type === NODE_TYPES.BRANCH && node.children.length < 2) {
      warnings.push({
        nodeId: node.id,
        type: 'incomplete-branch',
        message: `Branch "${node.label}" needs at least 2 paths`,
        severity: 'warning'
      });
    }
  });

  // Check for circular dependencies
  const circularCheck = hasPathToEnd(rootId);
  if (circularCheck.isCircular) {
    warnings.push({
      nodeId: null,
      type: 'circular',
      message: 'Circular dependency detected in workflow',
      severity: 'error'
    });
  }

  return warnings;
};

// Check if workflow is complete (has at least one END node)
export const isWorkflowComplete = (nodes) => {
  return Object.values(nodes).some(node => node.type === NODE_TYPES.END);
};

// Get all reachable nodes from root
export const getReachableNodes = (nodes, rootId) => {
  const reachable = new Set();
  
  const traverse = (nodeId) => {
    if (reachable.has(nodeId)) return;
    
    reachable.add(nodeId);
    const node = nodes[nodeId];
    
    if (node && node.children) {
      node.children.forEach(childId => traverse(childId));
    }
  };

  traverse(rootId);
  return reachable;
};