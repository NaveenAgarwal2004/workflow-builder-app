import React from 'react';
import { Button } from '../UI/Button';
import './Controls.css';

export const Toolbar = ({ canUndo, canRedo, onUndo, onRedo, onSave, onNewWorkflow }) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  return (
    <div className="toolbar" data-testid="workflow-toolbar">
      <div className="toolbar__left">
        <h1 className="toolbar__title">
          <span className="toolbar__title-icon">🔀</span>
          Workflow Builder
        </h1>
      </div>
      
      <div className="toolbar__right">
        <Button
          variant="ghost"
          size="small"
          onClick={onNewWorkflow}
          title="Start new workflow"
          aria-label="New Workflow"
          data-testid="new-workflow-button"
        >
          <span className="toolbar__icon">🆕</span>
          New
        </Button>

        <Button
          variant="secondary"
          size="small"
          onClick={onUndo}
          disabled={!canUndo}
          title={`Undo (${modKey}+Z)`}
          aria-label="Undo"
          data-testid="undo-button"
        >
          <span className="toolbar__icon">↶</span>
          Undo
        </Button>
        
        <Button
          variant="secondary"
          size="small"
          onClick={onRedo}
          disabled={!canRedo}
          title={`Redo (${modKey}+Shift+Z)`}
          aria-label="Redo"
          data-testid="redo-button"
        >
          <span className="toolbar__icon">↷</span>
          Redo
        </Button>
        
        <Button
          variant="primary"
          size="small"
          onClick={onSave}
          title={`Save Workflow (${modKey}+S)`}
          aria-label="Save Workflow"
          data-testid="save-button"
        >
          <span className="toolbar__icon">💾</span>
          Save
        </Button>
      </div>
    </div>
  );
};