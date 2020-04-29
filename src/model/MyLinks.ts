export interface Theme {
  backgroundImage?: string;
  missingFavIconColor: string,
  linkDescriptionBackground?: string;
  linkDescriptionColor?: string;
}

export interface Link {
  id?: string;
  label: string;
  url: string;
  favicon?: string;
  description?: string;
}
export interface Shortcut {
  key: string;
  id: string;
}

export interface Widget {
  id: string;
  title: string;
  list: [Link];
}

export interface MyLinks {
  theme: Theme;
  columns: [Widget[]];
  shortcuts: Shortcut[];
}

export function openAllLinks(wd: Widget) {
  wd.list.reverse().forEach(item => window.open(item.url));
}
