import { MyLinks } from '../model/MyLinks-interface';
import { isNotEmptyString } from './StringUtil';

const STORAGE_PREF_DATA = 'myLinksData';

let isLocalConfig = false;

export type OnLoadCallback = {
  onLoad: (myLinks: MyLinks) => void;
  onError: (error: unknown) => void;
};

export type OnSaveCallback = (myLinks: MyLinks) => void;

export interface LoadConfig {
  source: URL | File | undefined;
  callback: OnLoadCallback;
}

export interface SaveConfig {
  data: MyLinks;
  callback: OnSaveCallback;
}

export function loadConfig(
  {
    source,
    callback
  }: LoadConfig
): void {
  isLocalConfig = true;
  if (!source) {
    loadData(callback);
  } else if (source instanceof URL) {
    loadFromUrl(source, callback);
    isLocalConfig = false;
  } else {
    loadFromFile(source, callback);
  }
}

function loadData({ onLoad, onError }: OnLoadCallback): void {
  const jsonText = localStorage.getItem(STORAGE_PREF_DATA);
  try {
    if (isNotEmptyString(jsonText)) {
      onLoad(loadFromObject(JSON.parse(jsonText)));
    }
  } catch (e) {
    onError(e);
  }
}

function loadFromObject(json: unknown): MyLinks {
  return json as MyLinks;
}

function loadFromFile(
  file: File,
  { onLoad, onError }: OnLoadCallback
): void {
  file
    .text()
    .then(jsonText => {
      onLoad(loadFromObject(JSON.parse(jsonText)));
      localStorage.setItem(STORAGE_PREF_DATA, jsonText);
    })
    .catch(onError);
}

function loadFromUrl(url: URL, { onLoad, onError }: OnLoadCallback): void {
  fetch(url)
    .then(async response => response.json() as Promise<MyLinks>)
    .then(onLoad)
    .catch(onError);
}

export function saveConfig(
  {
    data,
    callback
  }: SaveConfig
): void {
  if (isLocalConfig) {
    localStorage.setItem(STORAGE_PREF_DATA, JSON.stringify(data));
  }
  callback(data);
}

