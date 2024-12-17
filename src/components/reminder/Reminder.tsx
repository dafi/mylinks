import { ReactElement } from 'react';
import { Button } from '../button/Button';

type ReminderProps = {
  readonly message: string;
  readonly isVisible: boolean;
  readonly onExportConfig: () => void;
};

export function ReminderComponent(
  {
    message,
    isVisible,
    onExportConfig,
  }: ReminderProps
): ReactElement | null {
  if (!isVisible) {
    return null;
  }
  return (
    <div className="reminder bg-action-warn">
      <span className="message">{message}</span>
      <Button label="View JSON" onClick={onExportConfig} />
    </div>
  );
}
