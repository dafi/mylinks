import { ReactNode } from 'react';
import { MyLinkActionCallback } from '../../../model/Events';
import './widgetToolbar.css';
import { useWidgetContext } from '../contexts/WidgetContext';

export type WidgetToolbarActionType = 'collapse' | 'edit' | 'openLinks';

type WidgetToolbarProps = Readonly<{
  collapsed: boolean;
  classNames?: string;
  action: MyLinkActionCallback<WidgetToolbarActionType>;
}>;

export function WidgetToolbar(
  {
    collapsed,
    classNames = '',
    action,
  }: WidgetToolbarProps
): ReactNode {
  const { editable } = useWidgetContext();
  const collapseClassNames = collapsed ? 'fa fa-angle-down icon' : 'fa fa-angle-up icon';
  const collapseTitle = collapsed ? 'Expand content' : 'Collapse content';
  const editClassNames = editable ? 'fas fa-toggle-on icon editable-on' : 'fas fa-toggle-off icon';

  return (
    <span className={`ml-toolbar ${classNames}`}>
      <i
        className={editClassNames}
        onClick={(): void => action({ target: 'edit' })}
        title="Toggle Edit Mode"
      />
      <i
        className="fa fa-external-link-alt icon"
        onClick={(): void => action({ target: 'openLinks' })}
        title="Open all links"
      />
      <i
        className={collapseClassNames}
        onClick={(): void => action({ target: 'collapse' })}
        title={collapseTitle}
      />
    </span>
  );
}
