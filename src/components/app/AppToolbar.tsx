import React, { ChangeEvent, ReactNode } from 'react';
import { MyLinkActionCallback } from '../../model/Events';

export type AppToolbarActionType = 'file' | 'shortcut' | 'editLinks';

interface AppToolbarProps {
  hasShortcuts: boolean;
  action: MyLinkActionCallback<AppToolbarActionType>;
}

export class AppToolbar extends React.Component<AppToolbarProps, unknown> {
  private handleFileSelect(evt: ChangeEvent<HTMLInputElement>): void {
    if (!evt.target) {
      return;
    }
    const file = evt.target.files && evt.target.files[0];
    // onChange is not called when the path is the same so, we force the change
    evt.target.value = '';
    if (file) {
      this.props.action({ target: 'file', data: file });
    }
  }

  private onClickKeyboard(): void {
    this.props.action({ target: 'shortcut' });
  }

  private onClickEdit(): void {
    this.props.action({ target: 'editLinks' });
  }

  render(): ReactNode {
    const style = {
      visibility: this.props.hasShortcuts ? 'visible' : 'collapse'
    } as React.CSSProperties;

    return (
      <div className="toolbar-container">
        <label className="toolbar-icon" title="Load configuration from local file">
          <i className="fa fa-file-import"/>
          <input type="file" id="files" name="files[]"
                 accept="application/json"
                 onChange={(e): void => this.handleFileSelect(e)}/>
        </label>

        <label className="toolbar-icon"
               title="Toggle shortcuts visibility"
               style={style} onClick={(): void => this.onClickKeyboard()}>
          <i className="fa fa-keyboard"/>
        </label>

        <label className="toolbar-icon"
               title="Edit Links"
               onClick={(): void => this.onClickEdit()}>
          <i className="fa fa-edit"/>
        </label>
      </div>
    );
  }

}
