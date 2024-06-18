import { saveConfig } from '../../common/Config';
import { cursorPosition } from '../../common/CursorPositionTracker';
import { createWidget } from '../../common/MyLinksUtil';
import { openWidgetLinksFromPoint } from '../../model/MyLinksDOM';
import { WidgetManager } from '../../model/WidgetManager';
import { ActionCommand, ActionContext } from '../ActionCommandType';
import { Action } from '../ActionType';

type AllowedWidgetAction = Extract<Action, 'addWidget' | 'collapseAllWidgets' | 'expandAllWidgets'>;

export function widgetAction(
  action: AllowedWidgetAction,
  {
    config: { myLinksLookup: { myLinks, widgetManager } },
    updateUIState,
  }: ActionContext
): ActionCommand {
  return {
    execute: (): void => {
      if (!execute(action, widgetManager)) {
        return;
      }
      saveConfig({
        data: myLinks,
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
  }: ActionContext
): ActionCommand {
  return {
    execute: () => openWidgetLinksFromPoint(cursorPosition(), myLinksLookup)
  };
}

function execute(
  action: AllowedWidgetAction,
  widgetManager: WidgetManager
): boolean {
  switch (action) {
    case 'addWidget':
      return widgetManager.createWidget(createWidget());
    case 'collapseAllWidgets':
      return widgetManager.collapseAllWidgets();
    case 'expandAllWidgets':
      return widgetManager.expandAllWidgets();
  }
}

