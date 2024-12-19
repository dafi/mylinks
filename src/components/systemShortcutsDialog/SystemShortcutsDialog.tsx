import { ReactNode, useMemo, useState } from 'react';
import { ActionList, ActionShortcut } from '../../action/ActionType';
import { Shortcut } from '../../common/shortcut/Shortcut';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { KeyCombination } from '../../model/KeyCombination';
import { Footer, FooterButton } from '../footer/Footer';
import { ListView } from '../listView/ListView';
import { ListViewItem } from '../listView/ListViewTypes';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';
import './SystemShortcutsDialog.css';
import { ShortcutDetails } from '../shortcut/shortcutDetails/ShortcutDetails';
import { ShortcutDialog } from '../shortcut/shortcutDialog/ShortcutDialog';
import { shortcutDialogId } from '../shortcut/shortcutDialog/ShortcutDialogTypes';

type SystemShortcutProps = Readonly<{
  modalId: string;
  onSave: (shortcuts: ActionShortcut[]) => void;
}>;

type FormShortcut = {
  edited: boolean;
  shortcut: Shortcut;
  shortcutAction: ActionShortcut;
};

function formSystemShortcut(systemShortcuts: ActionShortcut[] | undefined): FormShortcut[] {
  return ActionList
    .filter(v => v.canAssignShortcut)
    .map(({ action, label }): FormShortcut => ({
      edited: false,
      shortcut: { label, callback: (): void => {}, hotKey: [] },
      shortcutAction: {
        hotKey: systemShortcuts?.find(v => action === v.action)?.hotKey ?? [],
        action
      }
    }));
}

export function SystemShortcutForm({ modalId, onSave }: SystemShortcutProps): ReactNode {
  const onCloseDialog = (code: CloseResultCode): void => getModal(modalId)?.close(code);

  function onClickSave(): void {
    onSave(form.map(v => v.shortcutAction).filter(v => v.hotKey.length > 0));
    onCloseDialog('Ok');
  }

  function onClickClose(): void {
    onCloseDialog('Cancel');
  }

  function onSelectedItem(index: number): void {
    const { shortcut, shortcutAction } = form[index];
    const editedCombinations = form
      .filter(v => v.edited)
      .map(v => ({ ...v.shortcut, hotKey: v.shortcutAction.hotKey }));

    setExtraCombinations(editedCombinations);
    setSelectedIndex(index);
    setCombinationLabel(shortcut.label);
    setDefaultCombination(shortcutAction.hotKey);
    setSelectedCombination([...shortcutAction.hotKey]);
    getModal(shortcutDialogId)?.open({
      onClose: (code, data) => {
        if (code === 'Ok' && Array.isArray(data)) {
          setForm(form.map(v => v.shortcutAction.action === shortcutAction.action ?
            { ...v, edited: true, shortcutAction: { ...v.shortcutAction, hotKey: data } } : v));
        }
      }
    });
  }

  const { systemShortcuts } = useAppConfigContext();
  const [form, setForm] = useState(formSystemShortcut(systemShortcuts));
  const [extraCombinations, setExtraCombinations] = useState<Shortcut[]>([]);
  const [combinationLabel, setCombinationLabel] = useState('');
  const [defaultCombination, setDefaultCombination] = useState<KeyCombination[]>([]);
  const [selectedCombination, setSelectedCombination] = useState<KeyCombination[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(form.length > 0 ? 0 : -1);

  const shortcutComponents = useMemo(() =>
    form.map(({ shortcut, shortcutAction }): ListViewItem => (
      {
        id: shortcutAction.action,
        element: <div><ShortcutDetails label={shortcut.label} combination={shortcutAction.hotKey} /></div>
      }))
  , [form]);

  const rightButtons: FooterButton[] = [
    { id: 'save', label: 'Save', onClick: onClickSave },
    { id: 'close', label: 'Close', onClick: onClickClose },
  ];

  return (
    <div className="panel">
      <section>
        <form>
          <div className="system-shortcuts">
            <ListView
              items={shortcutComponents}
              onSelected={onSelectedItem}
              selectedIndex={selectedIndex}
            />
          </div>
        </form>
      </section>

      <Footer rightButtons={rightButtons} />
      <ShortcutDialog
        label={combinationLabel}
        defaultCombination={defaultCombination}
        keyCombination={selectedCombination}
        setKeyCombination={setSelectedCombination}
        extraCombinations={extraCombinations}
      />
    </div>
  );
}
