import WidgetData, { ShortcutData } from '../model/WidgetData';

const STORAGE_PREF_DATA = 'myLinkData';

export type OnLoadCallback = (config?: Config | null | undefined) => void;

export interface Data {
  bkg: string;
  missingFavIconColor: string,
  rows: [WidgetData[]];
  shortcuts: ShortcutData[];
}

export default class Config {
  config: Data;

  constructor(config: Data) {
    this.config = config;
  }

  static fromData(onLoadCallback: OnLoadCallback) {
    ConfigReader.loadData((data?: Data) => {
      onLoadCallback(data ? new Config(data) : null);
    });
  }

  static fromFile(file: any, onLoadCallback: OnLoadCallback) {
    ConfigReader.loadFromFile(file, (data?: Data) => {
      onLoadCallback(data ? new Config(data) : null);
    });
  }

  findWidgetById(id: string) {
    return this.config.rows.flat().find(w => w.id === id);
  }
  
  applyBackground() {
    const bkg = this.config ? this.config['bkg'] : null;
    const body = document.body;
    if (bkg) {
      body.style.backgroundImage = `url(${bkg})`;
    } else {
      body.style.backgroundImage = '';
    }
  }

  applyTheme() {
    if (this.config.missingFavIconColor) {
      document.documentElement.style.setProperty('--missing-favicon-color', this.config.missingFavIconColor);
    }
  }
}

class ConfigReader {
  static loadData(onLoadCallback: any) {
    let data = null;

    let jsonText = localStorage.getItem(STORAGE_PREF_DATA);
    if (jsonText) {
      data = ConfigReader.loadFromObject(JSON.parse(jsonText));
    }
    onLoadCallback(data);
  }

  // loadWidgetsFromUrl(url) {
  // $.ajax({
  //   dataType: "json",
  //   url: url,
  //   beforeSend: function(xhr) {
  //     // if called from local file system ensure the mimetype is json
  //     if (xhr.overrideMimeType) {
  //       xhr.overrideMimeType("application/json");
  //     }
  //   },
  //   success: function(json) {
  //     $.mlLoadWidgetsFromObject(json, callback);
  //   }
  // });
  // }

  static loadFromObject(json: any) : Data {
    return json as Data;
  }

  static loadFromFile(file: any, onLoadCallback: any) {
    let reader = new FileReader();

    reader.onload = (() => {
      return (e: any) => {
        let jsonText = e.target.result;
        localStorage.setItem(STORAGE_PREF_DATA, jsonText);
        onLoadCallback(ConfigReader.loadFromObject(JSON.parse(jsonText)));
      };
    })();

    reader.readAsText(file);
  }
}
