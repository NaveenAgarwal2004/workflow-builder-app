import { useEffect } from 'react';
import { KEYBOARD_SHORTCUTS } from '../utils/constants';

export const useKeyboard = ({ undo, redo, save, deleteSelected, cancelEdit }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? event.metaKey : event.ctrlKey;

      // Undo: Cmd/Ctrl + Z
      if (modKey && event.key === KEYBOARD_SHORTCUTS.UNDO.key && !event.shiftKey) {
        event.preventDefault();
        undo();
        return;
      }

      // Redo: Cmd/Ctrl + Shift + Z
      if (modKey && event.key === KEYBOARD_SHORTCUTS.REDO.key && event.shiftKey) {
        event.preventDefault();
        redo();
        return;
      }

      // Save: Cmd/Ctrl + S
      if (modKey && event.key === KEYBOARD_SHORTCUTS.SAVE.key) {
        event.preventDefault();
        save();
        return;
      }

      // Delete: Delete or Backspace
      if (KEYBOARD_SHORTCUTS.DELETE.includes(event.key)) {
        // Only if not typing in an input
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          deleteSelected();
        }
        return;
      }

      // Escape
      if (event.key === KEYBOARD_SHORTCUTS.ESCAPE) {
        cancelEdit();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, save, deleteSelected, cancelEdit]);
};