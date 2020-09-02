import { MyLinks } from '../model/MyLinks';

const STORAGE_PREF_DATA = 'myLinksData';

export type OnLoadCallback = (myLinks?: MyLinks | null | undefined) => void;

export default class Config {
  static fromData(onLoadCallback: OnLoadCallback) {
    ConfigReader.loadData((myLinks?: MyLinks) => {
      onLoadCallback(myLinks);
    });
  }

  static fromFile(file: any, onLoadCallback: OnLoadCallback) {
    ConfigReader.loadFromFile(file, (myLinks?: MyLinks) => {
      onLoadCallback(myLinks);
    });
  }
}

class ConfigReader {
  static loadData(onLoadCallback: any) {
    let data = null;

    let jsonText = localStorage.getItem(STORAGE_PREF_DATA);
    if (jsonText) {
      try {
        data = ConfigReader.loadFromObject(JSON.parse(jsonText));
      } catch (e) {
        window.alert(e);
      }
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
        try {
          onLoadCallback(ConfigReader.loadFromObject(JSON.parse(jsonText)));
          localStorage.setItem(STORAGE_PREF_DATA, jsonText);
        } catch (e) {
          window.alert(e);
        }
      };
    })();

    reader.readAsText(file);
  }
}
