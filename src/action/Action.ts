import { ActionCommand, ActionContext } from './ActionCommandType';
import { exportConfigAction, toggleShortcutsAction } from './actions/ConfigAction';
import { findLinksAction, openSettingsAction } from './actions/DialogAction';
import { addWidgetAction, openAllLinksAction } from './actions/WidgetAction';
import { Action } from './ActionType';

const actionCommandMap = new Map<Action, ActionCommand>();

export function registerActions(
  context: ActionContext
): void {
  actionCommandMap.set('openAllLinks', openAllLinksAction(context));
  actionCommandMap.set('findLinks', findLinksAction(context));
  actionCommandMap.set('openSettings', openSettingsAction(context));
  actionCommandMap.set('toggleShortcuts', toggleShortcutsAction(context));
  actionCommandMap.set('addWidget', addWidgetAction(context));
  actionCommandMap.set('exportConfig', exportConfigAction(context));
}

export function executeAction(
  action: Action,
  ...args: unknown[]
): void {
  const command = actionCommandMap.get(action);

  if (!command) {
    throw new Error(`Action command ${command} not found`);
  }
  command.execute(args);
}
