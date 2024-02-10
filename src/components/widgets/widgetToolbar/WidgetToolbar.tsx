import { ReactElement } from 'react';
import { MyLinkActionCallback } from '../../../model/Events';
import './widgetToolbar.css';

export type WidgetToolbarActionType = 'collapse' | 'edit' | 'openLinks';

interface WidgetToolbarProps {
  readonly collapsed: boolean;
  readonly classNames?: string;
  readonly action: MyLinkActionCallback<WidgetToolbarActionType>;
  readonly editable: boolean;
}

const defaultProps = {
  classNames: ''
};

export function WidgetToolbar(
  {
    collapsed,
    classNames,
    action,
    editable,
  }: WidgetToolbarProps
): ReactElement {
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

WidgetToolbar.defaultProps = defaultProps;
