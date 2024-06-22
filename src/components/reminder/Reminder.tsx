import { ReactElement } from 'react';

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
      <button className="button bg-action-primary" onClick={onExportConfig}>View JSON</button>
    </div>
  );
}
