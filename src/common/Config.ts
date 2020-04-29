import { MyLinks } from '../model/MyLinks';

const STORAGE_PREF_DATA = 'myLinksData';

export type OnLoadCallback = (config?: Config | null | undefined) => void;

export default class Config {
  myLinks: MyLinks;

  constructor(myLinks: MyLinks) {
    this.myLinks = myLinks;
    this.updateDescriptions();
  }

  private updateDescriptions() {
    this.myLinks.columns.forEach(row => {
      row.forEach(widgets => {
        widgets.list
        .filter(item => !!item.id)
        .forEach(item => {
          item.description = this.myLinks.shortcuts.find(s => s.id === item.id)?.key
        });
      })
    })
  }

  static fromData(onLoadCallback: OnLoadCallback) {
    ConfigReader.loadData((myLinks?: MyLinks) => {
      onLoadCallback(myLinks ? new Config(myLinks) : null);
    });
  }

  static fromFile(file: any, onLoadCallback: OnLoadCallback) {
    ConfigReader.loadFromFile(file, (myLinks?: MyLinks) => {
      onLoadCallback(myLinks ? new Config(myLinks) : null);
    });
  }

  findWidgetById(id: string) {
    return this.myLinks.columns.flat().find(w => w.id === id);
  }
  
  applyBackground() {
    const bkg = this.myLinks?.theme?.backgroundImage;
    const body = document.body;
    if (bkg) {
      body.style.backgroundImage = `url(${bkg})`;
    } else {
      body.style.backgroundImage = '';
    }
  }

  applyTheme() {
    const theme = this.myLinks.theme;

    if (!theme) {
      return;
    }

    if (theme.missingFavIconColor) {
      document.documentElement.style.setProperty('--missing-favicon-color', theme.missingFavIconColor);
    }
    if (theme.linkDescriptionBackground) {
      document.documentElement.style.setProperty('--link-description-background', theme.linkDescriptionBackground);
    }
    if (theme.linkDescriptionColor) {
      document.documentElement.style.setProperty('--link-description-color', theme.linkDescriptionColor);
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

  static loadFromObject(json: any) : MyLinks {
    return json as MyLinks;
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
