import { LAYOUT, NODE_TYPES } from './constants';

// Calculate positions for all nodes using tree layout algorithm
export const calculateLayout = (nodes, rootId) => {
  const positions = {};
  const nodeSizes = {};

  // Calculate size for each node
  Object.values(nodes).forEach(node => {
    if (node.type === NODE_TYPES.BRANCH) {
      nodeSizes[node.id] = { width: LAYOUT.BRANCH_NODE_SIZE, height: LAYOUT.BRANCH_NODE_SIZE };
    } else if (node.type === NODE_TYPES.END) {
      nodeSizes[node.id] = { width: LAYOUT.END_NODE_SIZE, height: LAYOUT.END_NODE_SIZE };
    } else {
      nodeSizes[node.id] = { width: LAYOUT.NODE_WIDTH, height: LAYOUT.NODE_HEIGHT };
    }
  });

  // Calculate subtree width for proper centering
  const calculateSubtreeWidth = (nodeId) => {
    const node = nodes[nodeId];
    if (!node || node.children.length === 0) {
      return nodeSizes[nodeId].width;
    }

    let totalWidth = 0;
    node.children.forEach((childId, index) => {
      totalWidth += calculateSubtreeWidth(childId);
      if (index < node.children.length - 1) {
        totalWidth += LAYOUT.HORIZONTAL_GAP;
      }
    });

    return Math.max(totalWidth, nodeSizes[nodeId].width);
  };

  // Position nodes recursively
  const positionNode = (nodeId, depth, offsetX) => {
    const node = nodes[nodeId];
    if (!node) return;

    const size = nodeSizes[nodeId];
    const children = node.children || [];
    
    // Calculate position for current node
    if (children.length === 0) {
      // Leaf node
      positions[nodeId] = {
        x: offsetX,
        y: depth * (LAYOUT.NODE_HEIGHT + LAYOUT.VERTICAL_GAP)
      };
    } else {
      // Calculate total width of children
      let childrenWidth = 0;
      children.forEach((childId, index) => {
        childrenWidth += calculateSubtreeWidth(childId);
        if (index < children.length - 1) {
          childrenWidth += LAYOUT.HORIZONTAL_GAP;
        }
      });

      // Center parent over children
      const parentX = offsetX + (childrenWidth - size.width) / 2;
      positions[nodeId] = {
        x: parentX,
        y: depth * (LAYOUT.NODE_HEIGHT + LAYOUT.VERTICAL_GAP)
      };

      // Position children
      let childOffsetX = offsetX;
      children.forEach((childId) => {
        const childWidth = calculateSubtreeWidth(childId);
        positionNode(childId, depth + 1, childOffsetX);
        childOffsetX += childWidth + LAYOUT.HORIZONTAL_GAP;
      });
    }
  };

  // Start positioning from root
  positionNode(rootId, 0, 0);

  return positions;
};

// Calculate connection points for lines
export const getConnectionPoints = (parentPos, childPos, parentType, childType) => {
  const parentSize = parentType === NODE_TYPES.BRANCH ? LAYOUT.BRANCH_NODE_SIZE : 
                     parentType === NODE_TYPES.END ? LAYOUT.END_NODE_SIZE : LAYOUT.NODE_WIDTH;
  const parentHeight = parentType === NODE_TYPES.BRANCH ? LAYOUT.BRANCH_NODE_SIZE :
                       parentType === NODE_TYPES.END ? LAYOUT.END_NODE_SIZE : LAYOUT.NODE_HEIGHT;
  
  const childSize = childType === NODE_TYPES.BRANCH ? LAYOUT.BRANCH_NODE_SIZE :
                    childType === NODE_TYPES.END ? LAYOUT.END_NODE_SIZE : LAYOUT.NODE_WIDTH;

  // Start point (bottom center of parent)
  const startX = parentPos.x + parentSize / 2;
  const startY = parentPos.y + parentHeight;

  // End point (top center of child)
  const endX = childPos.x + childSize / 2;
  const endY = childPos.y;

  return { startX, startY, endX, endY };
};

// Calculate Bezier curve path
export const calculateBezierPath = (startX, startY, endX, endY) => {
  const midY = (startY + endY) / 2;
  return `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
};