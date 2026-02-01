import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import { useWorkflowState } from './hooks/useWorkflowState';
import { useKeyboard } from './hooks/useKeyboard';
import { WorkflowCanvas } from './components/Canvas/WorkflowCanvas';
import { Toolbar } from './components/Controls/Toolbar';
import { NodeEditor } from './components/Controls/NodeEditor';
import { DeleteConfirmation } from './components/Controls/DeleteConfirmation';
import { NewWorkflowConfirmation } from './components/Controls/Newworkflowconfirmation';
import { Toast } from './components/UI/Toast';

const STORAGE_KEY = 'workflow-builder-state';

function App() {
  const {
    state,
    addNode,
    deleteNode,
    updateNode,
    selectNode,
    undo,
    redo,
    canUndo,
    canRedo,
    loadState,
  } = useWorkflowState();

  const [editingNode, setEditingNode] = useState(null);
  const [deletingNode, setDeletingNode] = useState(null);
  const [showNewWorkflowConfirm, setShowNewWorkflowConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  // Load workflow from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        loadState(parsed);
      }
    } catch (error) {
      console.error('Failed to load workflow:', error);
    }
  }, [loadState]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const handleSave = useCallback(() => {
    const exportData = {
      nodes: state.nodes,
      rootId: state.rootId,
      version: '1.0',
      createdAt: new Date().toISOString(),
      savedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, jsonString);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }

    // Create and download file
    try {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.href = url;
      link.download = `workflow-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast('✓ Workflow saved & downloaded!', 'success');
    } catch (error) {
      console.error('Failed to download file:', error);
      
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(jsonString).then(() => {
        showToast('✓ Workflow saved & copied to clipboard!', 'success');
      }).catch(() => {
        showToast('✓ Workflow saved to localStorage', 'info');
      });
    }
  }, [state, showToast]);

  const handleNewWorkflow = useCallback(() => {
    setShowNewWorkflowConfirm(true);
  }, []);

  const confirmNewWorkflow = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (state.selectedNodeId && state.nodes[state.selectedNodeId]) {
      const node = state.nodes[state.selectedNodeId];
      setDeletingNode(node);
    }
  }, [state.selectedNodeId, state.nodes]);

  useKeyboard({
    undo,
    redo,
    save: handleSave,
    deleteSelected: handleDeleteSelected,
    cancelEdit: () => {
      setEditingNode(null);
      setDeletingNode(null);
      setShowNewWorkflowConfirm(false);
      selectNode(null);
    },
  });

  const handleAddNode = useCallback((parentId, nodeType, branchLabel) => {
    addNode(parentId, nodeType, branchLabel);
    showToast(`✓ ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} node added`);
  }, [addNode, showToast]);

  const handleDeleteNode = useCallback((node) => {
    setDeletingNode(node);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deletingNode) {
      deleteNode(deletingNode.id);
      setDeletingNode(null);
      showToast('✓ Node deleted successfully');
    }
  }, [deletingNode, deleteNode, showToast]);

  const handleEditNode = useCallback((node) => {
    setEditingNode(node);
  }, []);

  const handleSaveNodeEdit = useCallback((nodeId, updates) => {
    updateNode(nodeId, updates);
    setEditingNode(null);
    showToast('✓ Node updated successfully');
  }, [updateNode, showToast]);

  return (
    <div className="App">
      <Toolbar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onSave={handleSave}
        onNewWorkflow={handleNewWorkflow}
      />

      <WorkflowCanvas
        state={state}
        onAddNode={handleAddNode}
        onDeleteNode={handleDeleteNode}
        onSelectNode={selectNode}
        onEditNode={handleEditNode}
      />

      {editingNode && (
        <NodeEditor
          node={editingNode}
          onSave={handleSaveNodeEdit}
          onClose={() => setEditingNode(null)}
        />
      )}

      {deletingNode && (
        <DeleteConfirmation
          nodeName={deletingNode.label}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingNode(null)}
        />
      )}

      {showNewWorkflowConfirm && (
        <NewWorkflowConfirmation
          onConfirm={confirmNewWorkflow}
          onCancel={() => setShowNewWorkflowConfirm(false)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;