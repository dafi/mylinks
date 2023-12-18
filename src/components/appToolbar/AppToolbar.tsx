import { CSSProperties, ReactElement, useState } from 'react';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { MyLinkActionCallback } from '../../model/Events';
import { AppToolbarButton } from './AppToolbarButton';
import { AppToolbarActionType, isAction } from './AppToolbarButtonTypes';
import './AppToolbar.css';

interface AppToolbarProps {
  readonly action: MyLinkActionCallback<AppToolbarActionType>;
}

export function AppToolbar(
  {
    action
  }: AppToolbarProps
): ReactElement {
  function onAction(actionName: string | undefined, data: unknown): void {
    if (isAction(actionName)) {
      action({ target: actionName, data });
    }
  }

  function onShowButtons(_actionName: string | undefined, _data: unknown): void {
    setShowButtons(prevShowButtons => !prevShowButtons);
  }

  const [showButtons, setShowButtons] = useState(false);
  const { myLinksLookup } = useAppConfigContext();

  const showButtonStyle: CSSProperties = {
    display: showButtons || !myLinksLookup ? 'inline' : 'none'
  };
  const showButtonIcon = showButtons ? 'fa-chevron-down' : 'fa-bars';

  return (
    <div className="toolbar-container">
      <AppToolbarButton
        className="toolbar-icon"
        action="showButtons"
        icon={`fas ${showButtonIcon}`}
        title="Show Actions"
        onAction={onShowButtons}
      />

      <div
        className="toolbar-buttons"
        style={showButtonStyle}
      >
        {!myLinksLookup &&
          <AppToolbarButton
            title="Load configuration from local file"
            className="toolbar-icon"
            action="loadConfig"
            icon="fa fa-file-import"
            onAction={onAction}
            type="file"
          />
        }

        {myLinksLookup &&
          <AppToolbarButton
            title="Search link"
            className="toolbar-icon"
            action="searchLink"
            icon="fa fa-search"
            onAction={onAction}
          />
        }

        {myLinksLookup?.hasShortcuts() === true &&
          <AppToolbarButton
            title="Toggle shortcuts visibility"
            className="toolbar-icon"
            action="shortcut"
            icon="fa fa-keyboard"
            onAction={onAction}
          />
        }

        {myLinksLookup &&
          <AppToolbarButton
            title="Edit Application Settings"
            className="toolbar-icon"
            action="settingsDialog"
            icon="fa fa-cogs"
            onAction={onAction}
          />
        }
      </div>
    </div>
  );
}
