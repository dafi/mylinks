import { Dispatch, ReactNode, SetStateAction } from 'react';

import './ShortcutDialog.css';
import { Shortcut } from '../../../common/shortcut/Shortcut';
import { compareCombinationsArray, findKeyCombinations, getShortcuts } from '../../../common/shortcut/ShortcutManager';
import { KeyCombination } from '../../../model/KeyCombination';
import { Footer, FooterButton } from '../../footer/Footer';
import Modal from '../../modal/Modal';
import { getModal } from '../../modal/ModalHandler';
import { ShortcutDetails } from '../shortcutDetails/ShortcutDetails';
import { ShortcutInput } from '../shortcutInput/ShortcutInput';
import { formatShortcuts } from '../ShortcutUtil';
import { shortcutDialogId } from './ShortcutDialogTypes';

type ShortcutDialogProps = Readonly<{
  label: string;
  defaultCombination: KeyCombination[];
  keyCombination: KeyCombination[];
  setKeyCombination: Dispatch<SetStateAction<KeyCombination[]>>;
  extraCombinations?: Shortcut[];
}>;

type Message = {
  type: 'error' | 'warn' | 'info';
  text: string;
};

function findAlreadyAssigned(
  list: readonly Shortcut[] | undefined,
  combination: KeyCombination[],
  ignore: KeyCombination[] | undefined
): Shortcut[] | undefined {
  if (list == null || combination.length === 0) {
    return undefined;
  }
  const shortcuts = findKeyCombinations(list, combination, { exactMatch: false, compareModifiers: false });
  if (shortcuts.length === 1 && ignore && compareCombinationsArray(ignore, shortcuts[0].hotKey)) {
    return undefined;
  }
  return shortcuts.length > 0 ? shortcuts : undefined;
}

function getMessage(
  extraCombinations: Shortcut[] | undefined,
  keyCombination: KeyCombination[],
  defaultCombination: KeyCombination[] | undefined,
): Message {
  const assignedList = findAlreadyAssigned(extraCombinations, keyCombination, defaultCombination)
    ?? findAlreadyAssigned(getShortcuts(), keyCombination, defaultCombination);
  if (assignedList) {
    return { type: 'error', text: `Already assigned: ${formatShortcuts(assignedList)}` };
  }
  return { type: 'info', text: '' };
}

export function ShortcutDialog(
  {
    label,
    defaultCombination,
    keyCombination,
    setKeyCombination,
    extraCombinations,
  }: ShortcutDialogProps
): ReactNode {
  function onClickSave(): void {
    getModal(shortcutDialogId).close('Ok', keyCombination);
  }

  function onClickCancel(): void {
    getModal(shortcutDialogId).close('Cancel');
  }

  const message = getMessage(extraCombinations, keyCombination, defaultCombination);
  const rightButtons: FooterButton[] = [
    { id: 'save', label: 'Save', onClick: onClickSave, disabled: message.type === 'error' },
    { id: 'close', label: 'Close', onClick: onClickCancel },
  ];

  return (
    <Modal id={shortcutDialogId}>
      <div className="panel">
        <header>
          <h2 className="title">Shortcut Combination</h2>
          <span className="details"><ShortcutDetails label={label} combination={defaultCombination} /></span>
        </header>

        <section>
          <form>
            <ul className="form-list">
              <li>
                <ShortcutInput
                  autoFocus
                  keyCombination={keyCombination}
                  setKeyCombination={setKeyCombination}
                />
              </li>
            </ul>
          </form>
          <p className={`details ${message.type}`}>
            {message.type === 'error' && <i className="fas fa-exclamation-circle icon" />}
            {message.text}
          </p>
        </section>

        <Footer rightButtons={rightButtons} />
      </div>
    </Modal>
  );
}
