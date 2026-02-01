import { useState, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { INITIAL_STATE, MAX_HISTORY } from '../utils/constants';
import * as nodeOps from '../utils/nodeOperations';

export const useWorkflowState = () => {
  const [state, setState] = useState(INITIAL_STATE);
  const [history, setHistory] = useState([INITIAL_STATE]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Use refs to always get latest values without causing re-renders
  const stateRef = useRef(state);
  const historyRef = useRef(history);
  const historyIndexRef = useRef(historyIndex);
  
  // Keep refs in sync
  stateRef.current = state;
  historyRef.current = history;
  historyIndexRef.current = historyIndex;

  // Load state from saved data (for localStorage restore)
  const loadState = useCallback((savedState) => {
    if (savedState && savedState.nodes && savedState.rootId) {
      const stateWithVersion = {
        ...savedState,
        version: savedState.version || 0,
        selectedNodeId: savedState.selectedNodeId || null,
      };
      
      flushSync(() => {
        setState(stateWithVersion);
        setHistory([stateWithVersion]);
        setHistoryIndex(0);
      });
    }
  }, []);

  // Push new state to history
  const pushHistory = useCallback((newState) => {
    console.log('📝 pushHistory - version:', newState.version, 'nodes:', Object.keys(newState.nodes).length);
    
    const currentHistory = historyRef.current;
    const currentIndex = historyIndexRef.current;
    
    const newHistory = currentHistory.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }
    
    flushSync(() => {
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setState(newState);
    });
    
    console.log('✅ Updated!');
  }, []); // No dependencies!

  // Add node - use ref to get latest state
  const addNode = useCallback((parentId, nodeType, branchLabel = null) => {
    const currentState = stateRef.current;
    const newState = nodeOps.addNode(currentState, parentId, nodeType, branchLabel);
    if (newState !== currentState) {
      pushHistory(newState);
    }
  }, [pushHistory]);

  // Delete node - use ref to get latest state
  const deleteNode = useCallback((nodeId) => {
    const currentState = stateRef.current;
    const newState = nodeOps.deleteNode(currentState, nodeId);
    if (newState !== currentState) {
      pushHistory(newState);
    }
  }, [pushHistory]);

  // Update node - use ref to get latest state
  const updateNode = useCallback((nodeId, updates) => {
    const currentState = stateRef.current;
    const newState = nodeOps.updateNode(currentState, nodeId, updates);
    if (newState !== currentState) {
      pushHistory(newState);
    }
  }, [pushHistory]);

  // Select node - use ref to get latest state
  const selectNode = useCallback((nodeId) => {
    const currentState = stateRef.current;
    setState(nodeOps.selectNode(currentState, nodeId));
  }, []);

  // Add branch label - use ref to get latest state
  const addBranchLabel = useCallback((nodeId, label) => {
    const currentState = stateRef.current;
    const newState = nodeOps.addBranchLabel(currentState, nodeId, label);
    if (newState !== currentState) {
      pushHistory(newState);
    }
  }, [pushHistory]);

  // Update branch label - use ref to get latest state
  const updateBranchLabel = useCallback((nodeId, index, label) => {
    const currentState = stateRef.current;
    const newState = nodeOps.updateBranchLabel(currentState, nodeId, index, label);
    if (newState !== currentState) {
      pushHistory(newState);
    }
  }, [pushHistory]);

  // Undo - use refs
  const undo = useCallback(() => {
    const currentIndex = historyIndexRef.current;
    const currentHistory = historyRef.current;
    
    if (currentIndex > 0) {
      flushSync(() => {
        setHistoryIndex(currentIndex - 1);
        setState(currentHistory[currentIndex - 1]);
      });
    }
  }, []);

  // Redo - use refs
  const redo = useCallback(() => {
    const currentIndex = historyIndexRef.current;
    const currentHistory = historyRef.current;
    
    if (currentIndex < currentHistory.length - 1) {
      flushSync(() => {
        setHistoryIndex(currentIndex + 1);
        setState(currentHistory[currentIndex + 1]);
      });
    }
  }, []);

  // Can undo/redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    state,
    addNode,
    deleteNode,
    updateNode,
    selectNode,
    addBranchLabel,
    updateBranchLabel,
    undo,
    redo,
    canUndo,
    canRedo,
    loadState,
  };
};