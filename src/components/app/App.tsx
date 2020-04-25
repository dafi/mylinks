/*import React from 'react';
import logo from '../../logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

import React from 'react';
import './App.css';
import './fileContainer.css';

import {ThemeContext, Theme, defaultTheme} from '../../common/ThemeContext';
import * as MyLinks from '../widgets/Widgets';
import Config from '../../common/Config';
import * as UIInput from '../../common/UIInput';
import WidgetData from '../../model/WidgetData';

export interface PageState { columns: [WidgetData[]], theme: Theme }

class Page extends React.Component<{}, PageState> {
  constructor(props: {}) {
    super(props);
    this.state = { columns: [[]], theme: defaultTheme};
  }

  componentDidMount() {
    Config.fromData((config: Config) => {
      this.reloadAll(config);
    });
  }

  render() {
    return <ThemeContext.Provider value={this.state.theme}>
      <div className="ml-wrapper">
        <div className="ml-grid">
          <MyLinks.Grid columns={this.state.columns} />
        </div>

        <label className="fileContainer">
          Load Widgets...
          <input type="file" id="files" name="files[]" onChange={(e) => this.handleFileSelect(e)} />
        </label>
      </div>
    </ThemeContext.Provider>
    ;
  }

  reloadAll(config: Config) {
    config.applyBackground();
    config.applyTheme();
    new UIInput.UIInput(config);
    this.setState({
      theme: {missingFavIconColor: config.config.missingFavIconColor},
      columns: config.config.rows
    });
  }
  
  handleFileSelect(evt: any) {
    const file = evt.target.files[0];
    if (file.type === 'application/json') {
      Config.fromFile(file, (config: Config) => {
        this.reloadAll(config);
      });
    }
  }
}

function App() {
  return <Page/>;
}

export default App;
