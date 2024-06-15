import { saveConfig } from '../../common/Config';
import { cursorPosition } from '../../common/CursorPositionTracker';
import { createWidget } from '../../common/MyLinksUtil';
import { openWidgetLinksFromPoint } from '../../model/MyLinksDOM';
import { ActionCommand, ActionContext } from '../ActionCommandType';

export function addWidgetAction(
  {
    config: { myLinksLookup },
    updateUIState,
  }: ActionContext
): ActionCommand {
  return {
    execute: (): void => {
      myLinksLookup.widgetManager.createWidget(createWidget());
      saveConfig({
        data: myLinksLookup.myLinks,
        callback: _ => {
          updateUIState({ type: 'settingsChanged', value: true });
          updateUIState({ type: 'configurationLoaded' });
        }
      });
    }
  };
}

export function openAllLinksAction(
  {
    config: { myLinksLookup },
  }:
  ActionContext
): ActionCommand {
  return {
    execute: () => openWidgetLinksFromPoint(cursorPosition(), myLinksLookup)
  };
}
