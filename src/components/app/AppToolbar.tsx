import React, { ChangeEvent, useState } from 'react';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { MyLinkActionCallback } from '../../model/Events';

const actions = [
  'loadConfig', 'saveConfig', 'shortcut',
] as const;
export type AppToolbarActionType = typeof actions[number];

function isAction(action: string | undefined): action is AppToolbarActionType {
  return !!action && actions.includes(action as AppToolbarActionType);
}

interface AppToolbarProps {
  readonly action: MyLinkActionCallback<AppToolbarActionType>;
}

export function AppToolbar(
  {
    action
  }: AppToolbarProps
): JSX.Element {
  function handleFileSelect(evt: ChangeEvent<HTMLInputElement>): void {
    if (!evt.target) {
      return;
    }
    const file = evt.target.files && evt.target.files[0];
    // onChange is not called when the path is the same so, we force the change
    evt.target.value = '';
    if (file) {
      action({ target: 'loadConfig', data: file });
    }
  }

  function onButtonClick(e: React.MouseEvent<HTMLElement>): void {
    if (isAction(e.currentTarget.dataset.action)) {
      action({ target: e.currentTarget.dataset.action });
    }
  }

  function onShowButtons(_e: React.MouseEvent<HTMLElement>): void {
    setShowButtons(prevShowButtons => !prevShowButtons);
  }

  const [showButtons, setShowButtons] = useState(false);
  const { myLinksLookup } = useAppConfigContext();

  const shortcutStyle = {
    visibility: myLinksLookup?.hasShortcuts() ? 'visible' : 'collapse'
  } as React.CSSProperties;
  const saveConfigStyle = {
    visibility: myLinksLookup ? 'visible' : 'collapse'
  } as React.CSSProperties;
  const showButtonStyle = {
    display: showButtons ? 'inline' : 'none'
  } as React.CSSProperties;
  const showButtonIcon = showButtons ? 'fa-chevron-down' : 'fa-bars';

  return (
    <div className="toolbar-container">
      <label
        className="toolbar-icon"
        title="Show Actions"
        onClick={onShowButtons}
      >
        <i className={`fas ${showButtonIcon}`} />
      </label>

      <div
        className="toolbar-buttons"
        style={showButtonStyle}
      >
        <label
          className="toolbar-icon"
          title="Load configuration from local file"
        >
          <i className="fa fa-file-import" />
          <input
            type="file"
            id="files"
            name="files[]"
            accept="application/json"
            onChange={handleFileSelect}
          />
        </label>

        <label
          className="toolbar-icon"
          data-action="saveConfig"
          title="Save Configuration"
          style={saveConfigStyle}
          onClick={onButtonClick}
        >
          <i className="fas fa-file-download" />
        </label>

        <label
          className="toolbar-icon"
          data-action="shortcut"
          title="Toggle shortcuts visibility"
          style={shortcutStyle}
          onClick={onButtonClick}
        >
          <i className="fa fa-keyboard" />
        </label>
      </div>
    </div>);
}
