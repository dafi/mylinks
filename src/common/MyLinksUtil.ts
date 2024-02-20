import { Widget } from '../model/MyLinks-interface';

let widgetCounter = 0;

export function createWidget(): Widget {
  return {
    id: `wid-${Date.now().toString(36)}`, /* eslint-disable-line @typescript-eslint/no-magic-numbers */
    title: `No Name ${++widgetCounter}`,
    list: []
  };
}
