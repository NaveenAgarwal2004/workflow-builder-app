import { useState, useEffect } from 'react';
import { calculateLayout } from '../utils/layoutEngine';

export const useLayout = (nodes, rootId, version = 0) => {
  const [positions, setPositions] = useState(() => calculateLayout(nodes, rootId));

  // Recalculate layout whenever nodes, rootId, or version changes
  useEffect(() => {
    console.log('🔄 Layout recalculating - version:', version, 'node count:', Object.keys(nodes).length);
    const newPositions = calculateLayout(nodes, rootId);
    setPositions(newPositions);
  }, [nodes, rootId, version]);

  return positions;
};