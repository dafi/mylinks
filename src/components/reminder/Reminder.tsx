import { ReactNode } from 'react';
import { Button } from '../button/Button';

type ReminderProps = Readonly<{
  message: string;
  isVisible: boolean;
  onExportConfig: () => void;
}>;

export function ReminderComponent(
  {
    message,
    isVisible,
    onExportConfig,
  }: ReminderProps
): ReactNode {
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
