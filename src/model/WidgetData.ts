import { WidgetLink } from "./WidgetLink";

export default interface WidgetData {
  id: string;
  title: string;
  list: [WidgetLink];
}

export function openAllLinks(wd: WidgetData) {
    wd.list.reverse().forEach(item => window.open(item.url));
}
