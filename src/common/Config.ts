import { MyLinks } from '../model/MyLinks-interface';
import { isNotEmptyString } from './StringUtil';

const STORAGE_PREF_DATA = 'myLinksData';

export type OnLoadCallback = (myLinks: MyLinks | undefined) => void;
export type OnSaveCallback = (myLinks: MyLinks) => void;

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
  if (isNotEmptyString(url)) {
    loadFromUrl(url, callback);
  } else if (file) {
    loadFromFile(file, callback);
  } else {
    loadData(callback);
  }
}

function loadData(onLoadCallback: OnLoadCallback): void {
  let data: MyLinks | undefined;

  const jsonText = localStorage.getItem(STORAGE_PREF_DATA);
  if (isNotEmptyString(jsonText)) {
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

function loadFromFile(file: File, onLoadCallback: OnLoadCallback): void {
  file
    .text()
    .then(jsonText => {
      onLoadCallback(loadFromObject(JSON.parse(jsonText)));
      localStorage.setItem(STORAGE_PREF_DATA, jsonText);
    })
    .catch(e => window.alert(e));
}

function loadFromUrl(url: string, onLoadCallback: OnLoadCallback): void {
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

