import { MyLinks } from '../model/MyLinks-interface';

const STORAGE_PREF_DATA = 'myLinksData';

export type OnLoadCallback = (myLinks: MyLinks | undefined) => void;
export type OnSaveCallback = (myLinks: MyLinks) => void;

type MyLinksCallback = (myLinks: MyLinks | undefined) => void;

export interface LoadConfig {
  url?: string | null;
  file?: File | null;
  callback: OnLoadCallback;
}

export interface SaveConfig {
  data: MyLinks;
  callback: OnSaveCallback;
}

export function loadConfig(
  {
    url,
    file,
    callback
  }: LoadConfig
): void {
  if (url) {
    loadFromUrl(url, (myLinks?: MyLinks) => {
      callback(myLinks);
    });
  } else if (file) {
    loadFromFile(file, (myLinks?: MyLinks) => {
      callback(myLinks);
    });
  } else {
    loadData((myLinks?: MyLinks) => {
      callback(myLinks);
    });
  }
}

function loadData(onLoadCallback: MyLinksCallback): void {
  let data: MyLinks | undefined;

  const jsonText = localStorage.getItem(STORAGE_PREF_DATA);
  if (jsonText) {
    try {
      data = loadFromObject(JSON.parse(jsonText));
    } catch (e) {
      window.alert(e);
    }
  }
  onLoadCallback(data);
}

function loadFromObject(json: unknown): MyLinks {
  return json as MyLinks;
}

function loadFromFile(file: File, onLoadCallback: MyLinksCallback): void {
  const reader = new FileReader();

  reader.onload = (() =>
    (event: ProgressEvent<FileReader>): void => {
      const result = event.target?.result;
      const jsonText = typeof result === 'string' ? result : '';
      try {
        onLoadCallback(loadFromObject(JSON.parse(jsonText)));
        localStorage.setItem(STORAGE_PREF_DATA, jsonText);
      } catch (e) {
        window.alert(e);
      }
    })();

  reader.readAsText(file);
}

function loadFromUrl(url: string, onLoadCallback: MyLinksCallback): void {
  fetch(url)
    .then(async response => response.json())
    .then(data => onLoadCallback(data as MyLinks))
    .catch(e => window.alert(e));
}

export function saveConfig(
  {
    data,
    callback
  }: SaveConfig
): void {
  localStorage.setItem(STORAGE_PREF_DATA, JSON.stringify(data));
  callback(data);
}

