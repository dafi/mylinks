import { WidgetLink } from "./WidgetLink";

export interface ShortcutData {
  key: string;
  id: string;
}

export default interface WidgetData {
  id: string;
  title: string;
  list: [WidgetLink];
}

export function openAllLinks(wd: WidgetData) {
    wd.list.reverse().forEach(item => window.open(item.url));
}
