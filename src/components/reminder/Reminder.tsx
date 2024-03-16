import { ReactElement } from 'react';
import './Reminder.css';

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
    <div className="reminder">
      <span className="message">{message}</span>
      <button className="button" onClick={onExportConfig}>Save JSON</button>
    </div>
  );
}
