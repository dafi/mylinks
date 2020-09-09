import React from 'react';
import './App.css';
import './toolbar-icon.css';
import Spotlight from '../spotlight/Spotlight';

import {AppConfigContext, appConfigClone, AppConfig} from '../../common/AppConfigContext';
import * as MyLinks from '../widgets/Widgets';
import Config from '../../common/Config';
import {UIInput} from '../../common/UIInput';
import {Link, MyLinks as MMLinks, MyLinksHolder, openLink, Widget} from '../../model/MyLinks';
import {LinkSelector} from "../linkSelector/LinkSelector";

const STORAGE_PREF_HIDE_SHORTCUTS = 'hideShortcuts';

export interface PageState {
  columns: [Widget[]],
  config: AppConfig,
  hasShortcuts: boolean,
  isOpen: boolean
}

class Page extends React.Component<{}, PageState> {
  private myLinksHolder?: MyLinksHolder;

  constructor(props: {}) {
    super(props);
    const config = appConfigClone();
    config.hideShortcuts = this.hideShortcuts;
    this.state = {columns: [[]], config: config, hasShortcuts: false, isOpen: false};
  }

  keyDown(e: any) {
    if (this.state.isOpen) {
      if (e.keyCode === 27) {
        this.toggleModal();
        return true;
      }
      return false;
    }
    if (e.key === ' ') {
      e.stopPropagation();
      e.preventDefault();

      this.toggleModal();
      return true;
    }
    return UIInput.instance().keyDown(e);
  }

  componentDidMount() {
    document.addEventListener('keydown', (e) => this.keyDown(e), false);
    Config.fromData((myLinks?: MMLinks | null) => {
      this.reloadAll(myLinks);
    });
  }

  onLinkSelected = (link: Link) => {
    this.toggleModal()
    openLink(link);
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const style = {
      visibility: this.state.hasShortcuts ? 'visible' : 'collapse'
    } as React.CSSProperties;

    return <AppConfigContext.Provider value={this.state.config}>
      <div className="ml-wrapper">
        <div className="ml-grid">
          <MyLinks.Grid columns={this.state.columns}/>
        </div>

        <label className="toolbar-icon">
          <i className="fa fa-file-import"/>
          <input type="file" id="files" name="files[]"
                 accept="application/json"
                 onChange={(e) => this.handleFileSelect(e)}/>
        </label>

        <label className="toolbar-icon" style={style} onClick={(e) => this.onClickKeyboard(e)}>
          <i className="fa fa-keyboard"/>
        </label>

        <Spotlight show={this.state.isOpen}
                   onClose={this.toggleModal}>
          <LinkSelector
            onSelected={this.onLinkSelected}
            widgets={this.myLinksHolder?.myLinks.columns}/>
        </Spotlight>

      </div>
    </AppConfigContext.Provider>
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
      config: this.buildConfig(myLinks),
      columns: myLinks.columns,
      hasShortcuts: this.myLinksHolder.hasShortcuts()
    });
  }

  onClickKeyboard(evt: any) {
    if (this.myLinksHolder) {
      this.hideShortcuts = !this.hideShortcuts;
      this.setState({
        config: this.buildConfig(this.myLinksHolder.myLinks)
      });
    }
  }

  handleFileSelect(evt: any) {
    const file = evt.target.files[0];
    // onChange is not called when the path is the same
    // so we force the change
    evt.target.value = null;
    Config.fromFile(file, (myLinks?: MMLinks | null) => {
      this.reloadAll(myLinks);
    });
  }

  get hideShortcuts(): boolean {
    return (localStorage.getItem(STORAGE_PREF_HIDE_SHORTCUTS) === '1') || false;
  }

  set hideShortcuts(v: boolean) {
    localStorage.setItem(STORAGE_PREF_HIDE_SHORTCUTS, v ? '1' : '0');
  }

  buildConfig(myLinks: MMLinks) : AppConfig {
    return {
      theme: {
        missingFavIconColor: myLinks.theme?.missingFavIconColor,
      },
      faviconService: myLinks.config?.faviconService,
      hideShortcuts: this.hideShortcuts
    }
  }

}

function App() {
  return <Page/>;
}

export default App;
