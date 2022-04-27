export interface Theme {
  backgroundImage?: string;
  missingFavIconColor: string;
  linkKeyBackground?: string;
  linkKeyColor?: string;
}

export interface Link {
  id: string;
  label: string;
  url: string;
  favicon?: string;
  shortcut?: string;
  widget?: Widget;
}

export interface Widget {
  id: string;
  title: string;
  list: [Link];
}

export interface Config {
  faviconService?: string;
}

export interface MyLinks {
  theme: Theme;
  columns: [Widget[]];
  config?: Config;
}

