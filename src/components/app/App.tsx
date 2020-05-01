import React from 'react';
import './App.css';
import './toolbar-icon.css';

import {ThemeContext, Theme, defaultTheme} from '../../common/ThemeContext';
import * as MyLinks from '../widgets/Widgets';
import Config from '../../common/Config';
import { UIInput } from '../../common/UIInput';
import { Widget, MyLinksHolder, MyLinks as MMLinks } from '../../model/MyLinks';

const STORAGE_PREF_HIDE_SHORTCUTS = 'hideShortcuts';

export interface PageState { columns: [Widget[]], theme: Theme }

class Page extends React.Component<{}, PageState> {
  private myLinksHolder?: MyLinksHolder;

  constructor(props: {}) {
    super(props);
    const theme = Object.assign({}, defaultTheme);
    theme.hideShortcuts = this.hideShortcuts;
    this.state = { columns: [[]], theme: theme};
  }

  componentDidMount() {
    Config.fromData((myLinks?: MMLinks | null) => {
      this.reloadAll(myLinks);
    });
  }

  render() {
    return <ThemeContext.Provider value={this.state.theme}>
      <div className="ml-wrapper">
        <div className="ml-grid">
          <MyLinks.Grid columns={this.state.columns} />
        </div>

        <label className="toolbar-icon">
          <i className="fa fa-file-import"></i>
          <input type="file" id="files" name="files[]" onChange={(e) => this.handleFileSelect(e)} />
        </label>

        <label className="toolbar-icon" onClick={(e) => this.onClickKeyboard(e)}>
          <i className="fa fa-keyboard"></i>
        </label>

      </div>
    </ThemeContext.Provider>
    ;
  }

  reloadAll(myLinks?: MMLinks | null) {
    if (!myLinks) {
      return;
    }
    this.myLinksHolder = new MyLinksHolder(myLinks);
    this.myLinksHolder.applyBackground();
    this.myLinksHolder.applyTheme();
    UIInput.instance().setup(this.myLinksHolder);
    this.setState({
      theme: {missingFavIconColor: myLinks.theme?.missingFavIconColor, hideShortcuts: this.hideShortcuts},
      columns: myLinks.columns
    });
  }

  onClickKeyboard(evt: any) {
    if (this.myLinksHolder) {
      this.hideShortcuts = !this.hideShortcuts;
      this.setState({
        theme: {missingFavIconColor: this.myLinksHolder.myLinks.theme?.missingFavIconColor, hideShortcuts: this.hideShortcuts},
      });
    }
  }
  
  handleFileSelect(evt: any) {
    const file = evt.target.files[0];
    if (file.type === 'application/json') {
      Config.fromFile(file, (myLinks?: MMLinks | null) => {
        this.reloadAll(myLinks);
      });
    }
  }

  get hideShortcuts(): boolean {
    return (localStorage.getItem(STORAGE_PREF_HIDE_SHORTCUTS) === '1') || false;
  }

  set hideShortcuts(v: boolean) {
    localStorage.setItem(STORAGE_PREF_HIDE_SHORTCUTS, v ? '1' : '0');
  }
}

function App() {
  return <Page/>;
}

export default App;
