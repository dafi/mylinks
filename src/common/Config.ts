import { MyLinks } from '../model/MyLinks-interface';

const STORAGE_PREF_DATA = 'myLinksData';

export type OnLoadCallback = (myLinks: MyLinks | undefined) => void;
export type OnSaveCallback = (myLinks: MyLinks) => void;

type MyLinksCallback = (myLinks: MyLinks | undefined) => void;

export default class Config {
  static fromData(onLoadCallback: OnLoadCallback): void {
    const configUrl = new URL(location.href).searchParams.get('c');
    if (configUrl) {
      ConfigReader.loadFromUrl(configUrl, (myLinks?: MyLinks) => {
        onLoadCallback(myLinks);
      });
    } else {
      ConfigReader.loadData((myLinks?: MyLinks) => {
        onLoadCallback(myLinks);
      });
    }
  }

  static fromFile(file: File, onLoadCallback: OnLoadCallback): void {
    ConfigReader.loadFromFile(file, (myLinks?: MyLinks) => {
      onLoadCallback(myLinks);
    });
  }

  static saveData(data: MyLinks, onSaveCallback: OnSaveCallback): void {
    ConfigReader.saveData(data, onSaveCallback);
  }
}

class ConfigReader {
  static loadData(onLoadCallback: MyLinksCallback): void {
    let data: MyLinks | undefined;

    const jsonText = localStorage.getItem(STORAGE_PREF_DATA);
    if (jsonText) {
      try {
        data = ConfigReader.loadFromObject(JSON.parse(jsonText));
      } catch (e) {
        window.alert(e);
      }
    }
    onLoadCallback(data);
  }

  static loadFromObject(json: unknown): MyLinks {
    return json as MyLinks;
  }

  static loadFromFile(file: File, onLoadCallback: MyLinksCallback): void {
    const reader = new FileReader();

    reader.onload = (() =>
      (event: ProgressEvent<FileReader>): void => {
        const result = event.target?.result;
        const jsonText = typeof result === 'string' ? result : '';
        try {
          onLoadCallback(ConfigReader.loadFromObject(JSON.parse(jsonText)));
          localStorage.setItem(STORAGE_PREF_DATA, jsonText);
        } catch (e) {
          window.alert(e);
        }
      })();

    reader.readAsText(file);
  }

  static loadFromUrl(url: string, onLoadCallback: MyLinksCallback): void {
    fetch(url)
      .then(async response => response.json())
      .then(data => onLoadCallback(data as MyLinks))
      .catch(e => window.alert(e));
  }

  static saveData(data: MyLinks, onSaveCallback: OnSaveCallback): void {
    localStorage.setItem(STORAGE_PREF_DATA, JSON.stringify(data));
    onSaveCallback(data);
  }
}
