import { ActionCommand, ActionContext } from './ActionCommandType';
import { exportConfigAction, toggleShortcutsAction } from './actions/ConfigAction';
import { findLinksAction, openSettingsAction } from './actions/DialogAction';
import { openAllLinksAction, widgetAction } from './actions/WidgetAction';
import { Action } from './ActionType';

const actionCommandMap = new Map<Action, ActionCommand>();

export function registerActions(
  context: ActionContext
): void {
  actionCommandMap.set('openAllLinks', openAllLinksAction(context));
  actionCommandMap.set('findLinks', findLinksAction(context));
  actionCommandMap.set('openSettings', openSettingsAction(context));
  actionCommandMap.set('toggleShortcuts', toggleShortcutsAction(context));
  actionCommandMap.set('exportConfig', exportConfigAction(context));
  actionCommandMap.set('addWidget', widgetAction('addWidget', context));
  actionCommandMap.set('expandAllWidgets', widgetAction('expandAllWidgets', context));
  actionCommandMap.set('collapseAllWidgets', widgetAction('collapseAllWidgets', context));
}

export function executeAction(
  action: Action,
  ...args: unknown[]
): void {
  const command = actionCommandMap.get(action);

  if (!command) {
    throw new Error(`Action command ${action} not found`);
  }
  command.execute(args);
}
