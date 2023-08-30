import { ReactElement } from 'react';
import { MyLinkActionCallback } from '../../../model/Events';
import { openWidgetLinks } from '../../../model/MyLinks';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import './widgetToolbar.css';

export type WidgetToolbarActionType = 'collapse' | 'edit';

interface WidgetToolbarProps {
  readonly collapsed: boolean;
  readonly widget: MLWidget;
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
    widget,
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
          onClick={(): void => openWidgetLinks(widget)}
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
