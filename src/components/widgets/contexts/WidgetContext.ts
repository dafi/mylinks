import { createContext, useContext } from 'react';
import { Widget } from '../../../model/MyLinks-interface';

export type WidgetContextValue = Readonly<{
  widget: Widget;
  editable: boolean;
  isMouseOver: boolean;
}>;

export const WidgetContext = createContext<WidgetContextValue | undefined>(undefined);

export const useWidgetContext = (): WidgetContextValue => {
  const context = useContext(WidgetContext);

  if (context === undefined) {
    throw new Error('WidgetContext must be used within a WidgetContextProvider');
  }

  return context;
};
