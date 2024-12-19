import { CSSProperties, ReactNode, useState } from 'react';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { useAppUIStateContext } from '../../contexts/AppUIStateContext';
import { MyLinkActionCallback } from '../../model/Events';
import { AppToolbarButton } from './AppToolbarButton';
import { AppToolbarActionType, isAction } from './AppToolbarButtonTypes';
import './AppToolbar.css';

type AppToolbarProps = Readonly<{
  action: MyLinkActionCallback<AppToolbarActionType>;
}>;

export function AppToolbar(
  {
    action
  }: AppToolbarProps
): ReactNode {
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
  const { onEdit } = useAppUIStateContext();

  const showButtonStyle: CSSProperties = {
    display: showButtons ? 'inline' : 'none'
  };
  const showButtonIcon = showButtons ? 'fa-chevron-down' : 'fa-bars';
  const hasWidgets = myLinksLookup.myLinks.columns.length > 0;

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
        <AppToolbarButton
          title="Edit Application Settings"
          className="toolbar-icon"
          action="openSettings"
          icon="fa fa-cogs"
          onAction={onAction}
        />

        <AppToolbarButton
          title="Load configuration from local file"
          className="toolbar-icon"
          action="loadConfig"
          icon="fa fa-file-import"
          onAction={onAction}
          type="file"
        />

        {myLinksLookup.linkManager.hasLinks() &&
          <AppToolbarButton
            title="Find links"
            className="toolbar-icon"
            action="findLinks"
            icon="fa fa-search"
            onAction={onAction}
          />
        }

        {myLinksLookup.linkManager.hasShortcuts() &&
          <AppToolbarButton
            title="Toggle shortcuts visibility"
            className="toolbar-icon"
            action="toggleShortcuts"
            icon="fa fa-keyboard"
            onAction={onAction}
          />
        }

        <AppToolbarButton
          title="Add Widget"
          className="toolbar-icon"
          action="addWidget"
          icon="far fa-window-restore"
          onAction={onAction}
          data={{ onEdit, myLinksLookup }}
        />

        {hasWidgets &&
          <AppToolbarButton
            title="Expand All Widgets"
            className="toolbar-icon"
            action="expandAllWidgets"
            icon="fas fa-expand-alt"
            onAction={onAction}
            data={{ onEdit, myLinksLookup }}
          />
        }

        {hasWidgets &&
          <AppToolbarButton
            title="Collapse All Widgets"
            className="toolbar-icon"
            action="collapseAllWidgets"
            icon="fas fa-compress-alt"
            onAction={onAction}
            data={{ onEdit, myLinksLookup }}
          />
        }

      </div>
    </div>
  );
}
