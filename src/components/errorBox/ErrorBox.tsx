import { ReactNode, useState } from 'react';
import { Button } from '../button/Button';

export type ErrorBoxProps = Readonly<{
  error: unknown;
}>;

function errorToString(error: unknown): string {
  return '' + (error as string);
}

export function ErrorBox(
  {
    error
  }: ErrorBoxProps
): ReactNode {
  function onClose(): void {
    setHidden(true);
  }
  const [hidden, setHidden] = useState(false);

  if (hidden) {
    return null;
  }
  return (
    <div className="error-box bg-action-danger-60">
      <span className="message">{errorToString(error)}</span>
      <Button label="Close" scope="danger" onClick={onClose} />
    </div>
  );
}
