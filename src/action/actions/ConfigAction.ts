import { Dispatch } from 'react';
import { ExportConfigType } from '../../components/settingsDialog/ExportSettingsDialog';
import { AppUIStateAction } from '../../contexts/useAppUIState';
import { MyLinks } from '../../model/MyLinks-interface';
import { ActionCommand, ActionContext } from '../ActionCommandType';

export function exportConfigAction(
  {
    config,
    updateUIState,
  }: ActionContext
): ActionCommand {
  const { myLinksLookup: { myLinks } } = config;
  return {
    execute: (...args: unknown[]): void => exportConfig(myLinks, updateUIState, (args.at(0) ?? 'view') as ExportConfigType)
  };
}

function exportConfig(
  myLinks: MyLinks,
  updateUIState: Dispatch<AppUIStateAction>,
  type: ExportConfigType = 'view',
): void {
  const indentSpaces = 2;
  if (type === 'clipboard') {
    navigator.clipboard
      .writeText(JSON.stringify(myLinks, undefined, indentSpaces))
      .then(() => {
        updateUIState({ type: 'settingsChanged', value: false });
      })
      .catch((e: unknown) => {
        window.alert(e);
      });
  } else {
    const w = window.open();
    w?.document.write(`<pre>${JSON.stringify(myLinks, undefined, indentSpaces)}</prev>`);
    updateUIState({ type: 'settingsChanged', value: false });
  }
}

export function toggleShortcutsAction(
  {
    updateUIState,
  }: ActionContext
): ActionCommand {
  return {
    execute: () => updateUIState({ type: 'hideShortcuts', value: 'toggle' })
  };
}

