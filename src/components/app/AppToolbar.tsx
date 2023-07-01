import React, { ChangeEvent, ReactNode } from 'react';
import { MyLinksHolder } from '../../common/MyLinksHolder';
import { MyLinkActionCallback } from '../../model/Events';

const actions = [
  'loadConfig', 'saveConfig', 'shortcut',
] as const;
export type AppToolbarActionType = typeof actions[number];

function isAction(action: string | undefined): action is AppToolbarActionType {
  return !!action && actions.includes(action as AppToolbarActionType);
}

interface AppToolbarProps {
  myLinksHolder: MyLinksHolder | undefined;
  action: MyLinkActionCallback<AppToolbarActionType>;
}

interface AppToolbarState {
  showButtons: boolean;
}

export class AppToolbar extends React.Component<AppToolbarProps, AppToolbarState> {
  constructor(props: AppToolbarProps) {
    super(props);
    this.state = { showButtons: false };
  }

  private handleFileSelect(evt: ChangeEvent<HTMLInputElement>): void {
    if (!evt.target) {
      return;
    }
    const file = evt.target.files && evt.target.files[0];
    // onChange is not called when the path is the same so, we force the change
    evt.target.value = '';
    if (file) {
      this.props.action({ target: 'loadConfig', data: file });
    }
  }

  private onButtonClick(e: React.MouseEvent<HTMLElement>): void {
    if (isAction(e.currentTarget.dataset.action)) {
      this.props.action({ target: e.currentTarget.dataset.action });
    }
  }

  private onShowButtons(_e: React.MouseEvent<HTMLElement>): void {
    this.setState(prevState => ({
      showButtons: !prevState.showButtons
    }));
  }

  render(): ReactNode {
    const myLinksHolder = this.props.myLinksHolder;
    const shortcutStyle = {
      visibility: myLinksHolder?.hasShortcuts() ? 'visible' : 'collapse'
    } as React.CSSProperties;
    const saveConfigStyle = {
      visibility: myLinksHolder?.myLinks ? 'visible' : 'collapse'
    } as React.CSSProperties;
    const showButtonStyle = {
      display: this.state.showButtons ? 'inline' : 'none'
    } as React.CSSProperties;
    const showButtonIcon = this.state.showButtons ? 'fa-chevron-down' : 'fa-bars';

    return (
      <div className="toolbar-container">
        <label className="toolbar-icon"
               title="Show Actions"
               onClick={(e): void => this.onShowButtons(e)}>
          <i className={`fas ${showButtonIcon}`}></i>
        </label>

        <div className="toolbar-buttons"
             style={showButtonStyle}>
          <label className="toolbar-icon" title="Load configuration from local file">
            <i className="fa fa-file-import"/>
            <input type="file" id="files" name="files[]"
                   accept="application/json"
                   onChange={(e): void => this.handleFileSelect(e)}/>
          </label>

          <label className="toolbar-icon"
                 data-action="saveConfig"
                 title="Save Configuration"
                 style={saveConfigStyle}
                 onClick={(e): void => this.onButtonClick(e)}>
            <i className="fas fa-file-download"></i>
          </label>

          <label className="toolbar-icon"
                 data-action="shortcut"
                 title="Toggle shortcuts visibility"
                 style={shortcutStyle}
                 onClick={(e): void => this.onButtonClick(e)}>
            <i className="fa fa-keyboard"/>
          </label>
        </div>
      </div>);
  }
}
