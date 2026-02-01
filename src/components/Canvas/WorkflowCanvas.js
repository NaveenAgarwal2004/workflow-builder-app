import React, { useState, useCallback } from 'react';
import { NODE_TYPES } from '../../utils/constants';
import { useLayout } from '../../hooks/useLayout';
import { NodeWrapper } from '../Nodes/NodeWrapper';
import { StartNode } from '../Nodes/StartNode';
import { ActionNode } from '../Nodes/ActionNode';
import { BranchNode } from '../Nodes/BranchNode';
import { EndNode } from '../Nodes/EndNode';
import { ConnectionLines } from './ConnectionLines';
import { AddNodeMenu } from '../Controls/AddNodeMenu';
import './WorkflowCanvas.css';

const CANVAS_PADDING = 300;

export const WorkflowCanvas = ({
  state,
  onAddNode,
  onDeleteNode,
  onSelectNode,
  onEditNode,
}) => {
  const [addMenuState, setAddMenuState] = useState(null);
  
  // Pass version to force layout recalculation when nodes change
  const positions = useLayout(state.nodes, state.rootId, state.version || 0);

  // Calculate canvas bounds
  const getCanvasBounds = useCallback(() => {
    let minX = 0, minY = 0, maxX = 0, maxY = 0;

    Object.entries(positions).forEach(([nodeId, pos]) => {
      const node = state.nodes[nodeId];
      let width = 200, height = 80;

      if (node.type === NODE_TYPES.BRANCH) {
        width = height = 120;
      } else if (node.type === NODE_TYPES.END) {
        width = height = 80;
      }

      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + width);
      maxY = Math.max(maxY, pos.y + height);
    });

    return {
      width: maxX - minX + CANVAS_PADDING * 2,
      height: maxY - minY + CANVAS_PADDING * 2,
      offsetX: -minX + CANVAS_PADDING,
      offsetY: -minY + CANVAS_PADDING,
    };
  }, [positions, state.nodes]);

  const bounds = getCanvasBounds();

  const handleAddChild = useCallback((parentId, x, y, branchLabel) => {
    setAddMenuState({ parentId, x, y, branchLabel });
  }, []);

  const handleMenuSelect = useCallback((nodeType) => {
    if (addMenuState) {
      onAddNode(addMenuState.parentId, nodeType, addMenuState.branchLabel);
      setAddMenuState(null);
    }
  }, [addMenuState, onAddNode]);

  const handleCanvasClick = useCallback(() => {
    onSelectNode(null);
  }, [onSelectNode]);

  const renderNode = (node, position) => {
    const adjustedPosition = {
      x: position.x + bounds.offsetX,
      y: position.y + bounds.offsetY,
    };

    let NodeComponent;
    switch (node.type) {
      case NODE_TYPES.START:
        NodeComponent = StartNode;
        break;
      case NODE_TYPES.ACTION:
        NodeComponent = ActionNode;
        break;
      case NODE_TYPES.BRANCH:
        NodeComponent = BranchNode;
        break;
      case NODE_TYPES.END:
        NodeComponent = EndNode;
        break;
      default:
        return null;
    }

    return (
      <NodeWrapper
        key={node.id}
        node={node}
        position={adjustedPosition}
        isSelected={state.selectedNodeId === node.id}
        onSelect={onSelectNode}
        onEdit={onEditNode}
        onDelete={onDeleteNode}
        onAddChild={handleAddChild}
      >
        <NodeComponent node={node} />
      </NodeWrapper>
    );
  };

  // Adjust positions for rendering
  const adjustedPositions = {};
  Object.entries(positions).forEach(([nodeId, pos]) => {
    adjustedPositions[nodeId] = {
      x: pos.x + bounds.offsetX,
      y: pos.y + bounds.offsetY,
    };
  });

  return (
    <div className="workflow-canvas-container" onClick={handleCanvasClick}>
      <div
        className="workflow-canvas"
        style={{
          width: bounds.width,
          height: bounds.height,
        }}
        data-testid="workflow-canvas"
      >
        <ConnectionLines nodes={state.nodes} positions={adjustedPositions} />

        {Object.entries(state.nodes).map(([nodeId, node]) => {
          const position = positions[nodeId];
          if (!position) return null;
          return renderNode(node, position);
        })}

        {addMenuState && (
          <AddNodeMenu
            x={addMenuState.x}
            y={addMenuState.y}
            onSelect={handleMenuSelect}
            onClose={() => setAddMenuState(null)}
          />
        )}
      </div>
    </div>
  );
};