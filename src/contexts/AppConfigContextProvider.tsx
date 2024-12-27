import { ReactNode } from 'react';
import { ActionShortcut } from '../action/ActionType';
import { ExportConfigType, ExportSettingsForm } from '../components/settingsDialog/ExportSettingsDialog';
import { SettingsDialog } from '../components/settingsDialog/SettingsDialog';
import { settingsDialogId, SettingsPanel } from '../components/settingsDialog/SettingsDialogTypes';
import { ThemeSettingsForm } from '../components/settingsDialog/ThemeSettingsDialog';
import { SystemShortcutForm } from '../components/systemShortcutsDialog/SystemShortcutsDialog';
import { EditComplete } from '../hooks/useEditLink/useEditLink';
import { MyLinks } from '../model/MyLinks-interface';
import { AppConfigContext } from './AppConfigContext';
import { AppConfig } from './AppConfigType';

type AppConfigContextProps = Readonly<{
  config: AppConfig;
  onEditComplete: (result: EditComplete) => void;
  onLoadConfig: (file: File) => void;
  onExportConfig: (type: ExportConfigType) => void;
  children: ReactNode;
}>;

export function AppConfigContextProvider(
  {
    config,
    onEditComplete,
    children,
    onLoadConfig,
    onExportConfig,
  }: AppConfigContextProps
): ReactNode {
  function onSaveSettings(settings: Pick<MyLinks, 'theme' | 'config'>): void {
    const data: MyLinks = {
      ...myLinks,
      theme: { ...myLinks.theme, ...settings.theme },
      config: { ...myLinks.config, ...settings.config },
    };

    onEditComplete({ type: 'success', data });
  }

  function onSaveSystemShortcuts(systemShortcuts: ActionShortcut[]): void {
    const data: MyLinks = {
      ...myLinks,
      config: { ...myLinks.config, systemShortcuts },
    };

    onEditComplete({ type: 'success', data });
  }

  const myLinks = config.myLinksLookup.myLinks;

  const panels: SettingsPanel[] = [
    {
      title: 'Configuration', content:
        <ExportSettingsForm
          onLoadConfig={onLoadConfig}
          onExportConfig={onExportConfig}
          modalId={settingsDialogId}
        />
    },
    { title: 'Theme/FavIcon', content: <ThemeSettingsForm onSave={onSaveSettings} modalId={settingsDialogId} /> },
    { title: 'System Shortcuts', content: <SystemShortcutForm onSave={onSaveSystemShortcuts} modalId={settingsDialogId} /> },
  ];
  return (
    <AppConfigContext value={config}>
      {children}

      <SettingsDialog
        panels={panels}
      />
    </AppConfigContext>
  );
}
