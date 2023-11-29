import { Point } from '../common/DOMTypes';
import { isNotEmptyString } from '../common/StringUtil';
import { openWidgetLinks } from './MyLinks';
import { MyLinksLookup } from './MyLinksLookup';

export function openWidgetLinksFromPoint(point: Point, myLinksLookup: MyLinksLookup): void {
  const widgetAttributeName = 'data-list-id';
  const widgetId = document.elementFromPoint(point.x, point.y)
    ?.closest(`[${widgetAttributeName}]`)
    ?.getAttribute(widgetAttributeName);

  if (isNotEmptyString(widgetId)) {
    const widget = myLinksLookup.findWidgetById(widgetId);
    if (widget) {
      openWidgetLinks(widget);
    }
  }
}
