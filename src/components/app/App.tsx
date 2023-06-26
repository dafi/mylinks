import React, { ReactNode } from 'react';

import { AppConfig, appConfigClone, AppConfigContext } from '../../contexts/AppConfigContext';
import { AppUIState, AppUIStateContext } from '../../contexts/AppUIStateContext';
import Config from '../../common/Config';
import { isEditLinkData, prepareForSave } from '../../common/EditHelper';
import { applyColorToFavicon } from '../../common/Favicon';
import { isKeyboardEventConsumer } from '../../common/HtmlUtil';
import { MyLinksHolder } from '../../common/MyLinksHolder';
import { UIInput } from '../../common/UIInput';
import { EditDataType, EditLinkData, EditWidgetData } from '../../model/EditData-interface';
import { MyLinksEvent } from '../../model/Events';
import { openLink } from '../../model/MyLinks';
import { Link, MyLinks as MMLinks, Widget } from '../../model/MyLinks-interface';
import { EditLinkDialog } from '../editLinkDialog/EditLinkDialog';
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

interface PageState {
  columns: [Widget[]];
  config: AppConfig;
  hasShortcuts: boolean;
  uiState: AppUIState;
  isFinderOpen: boolean;
  isEditLinkOpen?: boolean;
  editLinkData?: EditLinkData;
}

class Page extends React.Component<unknown, PageState> {
  private myLinksHolder?: MyLinksHolder;

  constructor(props: unknown) {
    super(props);
    const config = appConfigClone();
    const uiState: AppUIState = {
      hideShortcuts: this.hideShortcuts,
      onEdit: (editLinkData): void => this.onEditData(editLinkData),
    };
    this.state = { columns: [[]], config: config, hasShortcuts: false, isFinderOpen: false, uiState };
  }

  keyDown(e: KeyboardEvent): boolean {
    const isThisTarget = e.currentTarget === e.target || !isKeyboardEventConsumer(e.target as HTMLElement);

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

  showEditLinkDialog(isOpen: boolean, editLinkData?: EditLinkData): void {
    if (editLinkData?.editType === 'delete') {
      this.onSave(editLinkData);
      return;
    }
    this.setState({ isEditLinkOpen: isOpen, editLinkData });
  }

  private onClickToolbar(e: MyLinksEvent<AppToolbarActionType>): void {
    if (e.target === 'loadConfig') {
      this.onLoadConfig(e.data as File);
    } else if (e.target === 'shortcut') {
      this.onShortcut();
    } else if (e.target === 'saveConfig') {
      this.onSaveConfig();
    }
  }

  private onSaveConfig(): void {
    if (this.myLinksHolder) {
      const indentSpaces = 2;
      const w = window.open();
      w.document.write(`<pre>${JSON.stringify(this.myLinksHolder.myLinks, null, indentSpaces)}</prev>`);
    }
  }

  private onShortcut(): void {
    this.hideShortcuts = !this.hideShortcuts;
    this.setState({
      uiState: {
        hideShortcuts: this.hideShortcuts,
      }
    });
  }

  private onEditData(editData: EditDataType): void {
    if (isEditLinkData(editData)) {
      this.showEditLinkDialog(true, editData);
    } else {
      this.onSave(editData);
    }
  }

  private onLoadConfig(file: File): void {
    Config.fromFile(file, (myLinks?: MMLinks | null) => {
      this.reloadAll(myLinks);
    });
  }

  private onSave(editLinkData: EditLinkData | EditWidgetData): void {
    if (!this.myLinksHolder) {
      return;
    }
    try {
      if (prepareForSave(editLinkData)) {
        Config.saveData(this.myLinksHolder.myLinks, (myLinks) => this.reloadAll(myLinks));
      }
    } catch (e) {
      alert((e as Error).message);
    }
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

  renderEditLinkDialog(): ReactNode {
    if (this.state.isEditLinkOpen && this.state.editLinkData) {
      return <EditLinkDialog isOpen={this.state.isEditLinkOpen}
                             onSave={(o): void => this.onSave(o)}
                             onClose={(): void => this.showEditLinkDialog(false)}
                             data={this.state.editLinkData}/>;
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
            myLinksHolder={this.myLinksHolder}
            action={(e): void => this.onClickToolbar(e)}/>

          {this.renderLinkFinder()}
          {this.renderEditLinkDialog()}

        </div>
      </AppUIStateContext.Provider>
    </AppConfigContext.Provider>;
  }

  reloadAll(myLinks?: MMLinks | null): void {
    if (!myLinks) {
      return;
    }
    const config = this.buildConfig(myLinks);
    this.myLinksHolder = new MyLinksHolder(myLinks);
    this.myLinksHolder.applyBackground();
    this.myLinksHolder.applyTheme();
    applyColorToFavicon(config.theme.faviconColor);

    UIInput.instance().setup(this.myLinksHolder);
    this.setState({
      config,
      columns: myLinks.columns,
      hasShortcuts: this.myLinksHolder.hasShortcuts()
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
        faviconColor: myLinks.theme?.faviconColor || this.state.config.theme.faviconColor,
      },
      faviconService: myLinks.config?.faviconService,
      myLinksLookup: this.myLinksHolder,
    };
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function App(): JSX.Element {
  return <Page/>;
}

export default App;
