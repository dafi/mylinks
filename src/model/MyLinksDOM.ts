import { Point } from '../common/DOMTypes';
import { openWidgetLinks } from './MyLinks';
import { MyLinksLookup } from './MyLinksLookup';

export function openWidgetLinksFromPoint({ x, y }: Point, { widgetManager }: MyLinksLookup): void {
  const el = document.elementFromPoint(x, y);
  const widget = el ? widgetManager.closestWidget(el) : undefined;
  if (widget) {
    openWidgetLinks(widget);
  }
}
