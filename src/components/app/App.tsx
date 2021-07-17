import React, {ChangeEvent, ReactNode} from 'react';
import './App.css';
import './toolbar-icon.css';
import Spotlight from '../spotlight/Spotlight';

import {AppConfigContext, appConfigClone, AppConfig} from '../../common/AppConfigContext';
import * as MyLinks from '../widgets/Widgets';
import Config from '../../common/Config';
import {UIInput} from '../../common/UIInput';
import {Link, MyLinks as MMLinks, MyLinksHolder, openLink, Widget} from '../../model/MyLinks';
import {LinkSelector} from '../linkSelector/LinkSelector';

const STORAGE_PREF_HIDE_SHORTCUTS = 'hideShortcuts';

// https://github.com/microsoft/TypeScript/issues/21309
// TS doesn't include experimental APIs in lib.d.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

export interface PageState {
  columns: [Widget[]];
  config: AppConfig;
  hasShortcuts: boolean;
  isOpen: boolean;
}

class Page extends React.Component<unknown, PageState> {
  private myLinksHolder?: MyLinksHolder;

  constructor(props: unknown) {
    super(props);
    const config = appConfigClone();
    config.hideShortcuts = this.hideShortcuts;
    this.state = {columns: [[]], config: config, hasShortcuts: false, isOpen: false};
  }

  keyDown(e: KeyboardEvent) {
    if (this.state.isOpen) {
      if (e.key === 'Escape') {
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
    this.toggleModal();
    // Ensure the DOM is updated and the dialog is hidden when the link is open
    // This is necessary because when returning to myLinks window/tab, the dialog can be yet visible
    window.requestIdleCallback(() => openLink(link));
  };

  toggleModal = () => {
    this.setState( prevState => (
      {isOpen: !prevState.isOpen}
    ));
  };

  render(): ReactNode {
    const style = {
      visibility: this.state.hasShortcuts ? 'visible' : 'collapse'
    } as React.CSSProperties;

    return <AppConfigContext.Provider value={this.state.config}>
      <div className="ml-wrapper">
        <div className="ml-grid">
          <MyLinks.Grid columns={this.state.columns}/>
        </div>

        <label className="toolbar-icon" title="Load configuration from local file">
          <i className="fa fa-file-import"/>
          <input type="file" id="files" name="files[]"
                 accept="application/json"
                 onChange={(e) => this.handleFileSelect(e)}/>
        </label>

        <label className="toolbar-icon"
               title="Toggle shortcuts visibility"
               style={style} onClick={() => this.onClickKeyboard()}>
          <i className="fa fa-keyboard"/>
        </label>

        <Spotlight show={this.state.isOpen}
                   onClose={this.toggleModal}>
          <LinkSelector
            onSelected={this.onLinkSelected}
            widgets={this.myLinksHolder?.myLinks.columns}/>
        </Spotlight>

      </div>
    </AppConfigContext.Provider>;
  }

  reloadAll(myLinks?: MMLinks | null) {
    if (!myLinks) {
      return;
    }
    this.myLinksHolder = new MyLinksHolder(myLinks);
    this.myLinksHolder.applyBackground();
    this.myLinksHolder.applyTheme();
    this.myLinksHolder.applyColorToFavIcon(myLinks.theme?.missingFavIconColor);

    UIInput.instance().setup(this.myLinksHolder);
    this.setState({
      config: this.buildConfig(myLinks),
      columns: myLinks.columns,
      hasShortcuts: this.myLinksHolder.hasShortcuts()
    });
  }

  onClickKeyboard() {
    if (this.myLinksHolder) {
      this.hideShortcuts = !this.hideShortcuts;
      this.setState({
        config: this.buildConfig(this.myLinksHolder.myLinks)
      });
    }
  }

  handleFileSelect(evt: ChangeEvent<HTMLInputElement>) {
    if (!evt.target) {
      return;
    }
    const file = evt.target.files && evt.target.files[0];
    // onChange is not called when the path is the same
    // so we force the change
    evt.target.value = '';
    if (file) {
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

  buildConfig(myLinks: MMLinks): AppConfig {
    return {
      theme: {
        missingFavIconColor: myLinks.theme?.missingFavIconColor,
      },
      faviconService: myLinks.config?.faviconService,
      hideShortcuts: this.hideShortcuts
    };
  }

}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function App() {
  return <Page/>;
}

export default App;
