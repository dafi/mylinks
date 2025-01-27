import { linkFinderDialogId } from '../../components/linkFinderDialog/LinkFinderDialogTypes';
import { getModal } from '../../components/modal/ModalHandler';
import { settingsDialogId } from '../../components/settingsDialog/SettingsDialogTypes';
import { ActionCommand, ActionContext } from '../ActionCommandType';

export function findLinksAction(
  _context: ActionContext
): ActionCommand {
  return {
    execute: () => getModal(linkFinderDialogId).open()
  };
}

export function openSettingsAction(
  _context: ActionContext
): ActionCommand {
  return {
    execute: () => getModal(settingsDialogId).open()
  };
}
