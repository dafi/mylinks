import React, { ReactNode } from 'react';

import { AppConfig, appConfigClone, AppConfigContext } from '../../common/AppConfigContext';
import { AppUIStateContext, AppUIState } from '../../common/AppUIStateContext';
import Config from '../../common/Config';
import { UIInput } from '../../common/UIInput';
import { MyLinksEvent } from '../../model/Events';
import { MyLinksHolder, openLink } from '../../model/MyLinks';
import { Link, MyLinks as MMLinks, Widget } from '../../model/MyLinks-interface';
import { LinkFinderDialog } from '../linkFinderDialog/LinkFinderDialog';
import { Grid } from '../widgets/Grid';
import './App.css';
import { AppToolbar, AppToolbarActionType } from './AppToolbar';
import './toolbar-icon.css';

const STORAGE_PREF_HIDE_SHORTCUTS = 'hideShortcuts';

// https://github.com/microsoft/TypeScript/issues/21309
// TS doesn't include experimental APIs in lib.d.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

export interface PageState {
  columns: [Widget[]];
  config: AppConfig;
  hasShortcuts: boolean;
  uiState: AppUIState;
  isFinderOpen: boolean;
}

class Page extends React.Component<unknown, PageState> {
  private myLinksHolder?: MyLinksHolder;

  constructor(props: unknown) {
    super(props);
    const config = appConfigClone();
    const uiState: AppUIState = { hideShortcuts: this.hideShortcuts };
    this.state = { columns: [[]], config: config, hasShortcuts: false, isFinderOpen: false, uiState };
  }

  keyDown(e: KeyboardEvent): boolean {
    const isThisTarget = e.currentTarget === e.target;

    // ignore events bubbling from other listeners
    if (!isThisTarget) {
      return true;
    }

    if (e.key === ' ') {
      e.stopPropagation();
      e.preventDefault();

      this.showLinkFinder(true);
      return true;
    }
    return UIInput.instance().keyDown(e);
  }

  componentDidMount(): void {
    document.body.addEventListener('keydown', (e) => this.keyDown(e), false);
    Config.fromData((myLinks?: MMLinks | null) => {
      this.reloadAll(myLinks);
    });
  }

  onLinkSelected = (link: Link): void => {
    // Ensure the DOM is updated and the dialog is hidden when the link is open
    // This is necessary because when returning to myLinks window/tab, the dialog can be yet visible
    window.requestIdleCallback(() => openLink(link));
  };

  showLinkFinder(isOpen: boolean): void {
    this.setState({ isFinderOpen: isOpen });
  }

  private onClickToolbar(e: MyLinksEvent<AppToolbarActionType>): void {
    if (e.target === 'file') {
      this.onFileSelect(e.data as File);
    } else if (e.target === 'shortcut') {
      this.onShortcut();
    }
  }

  onFileSelect(file: File): void {
    Config.fromFile(file, (myLinks?: MMLinks | null) => {
      this.reloadAll(myLinks);
    });
  }

  renderLinkFinder(): ReactNode {
    if (this.state.isFinderOpen) {
      return <LinkFinderDialog isOpen={this.state.isFinderOpen}
                               onClose={(): void => this.showLinkFinder(false)}
                               onLinkSelected={this.onLinkSelected}
                               widgets={this.myLinksHolder?.myLinks.columns}/>;
    }
    return null;
  }

  render(): ReactNode {
    return <AppConfigContext.Provider value={this.state.config}>
      <AppUIStateContext.Provider value={this.state.uiState}>
        <div className="ml-wrapper">
          <div className="ml-grid">
            <Grid columns={this.state.columns}/>
          </div>

          <AppToolbar
            hasShortcuts={this.state.hasShortcuts}
            action={(e): void => this.onClickToolbar(e)}/>

          {this.renderLinkFinder()}

        </div>
      </AppUIStateContext.Provider>
    </AppConfigContext.Provider>;
  }

  reloadAll(myLinks?: MMLinks | null): void {
    if (!myLinks) {
      return;
    }
    this.myLinksHolder = new MyLinksHolder(myLinks);
    this.myLinksHolder.applyBackground();
    this.myLinksHolder.applyTheme();
    this.myLinksHolder.applyColorToFavicon(myLinks.theme?.faviconColor);

    UIInput.instance().setup(this.myLinksHolder);
    this.setState({
      config: this.buildConfig(myLinks),
      columns: myLinks.columns,
      hasShortcuts: this.myLinksHolder.hasShortcuts()
    });
  }

  onShortcut(): void {
    this.hideShortcuts = !this.hideShortcuts;
    this.setState({
      uiState: {
        hideShortcuts: this.hideShortcuts
      }
    });
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
        faviconColor: myLinks.theme?.faviconColor,
      },
      faviconService: myLinks.config?.faviconService,
    };
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function App(): JSX.Element {
  return <Page/>;
}

export default App;
