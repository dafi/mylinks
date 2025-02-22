import { PropsWithChildren, ReactNode } from 'react';
import { WidgetContext, WidgetContextValue } from './WidgetContext';

export type WidgetContextProps = PropsWithChildren<Readonly<WidgetContextValue>>;

export function WidgetContextProvider(
  {
    widget,
    editable,
    isMouseOver,
    children
  }: WidgetContextProps
): ReactNode {
  const context: WidgetContextValue = { widget, editable, isMouseOver };

  return (
    <WidgetContext value={context}>
      {children}
    </WidgetContext>
  );
}
