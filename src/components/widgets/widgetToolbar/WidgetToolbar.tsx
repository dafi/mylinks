import { CSSProperties, ReactElement } from 'react';
import { MyLinkActionCallback } from '../../../model/Events';
import { openAllLinks } from '../../../model/MyLinks';
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
  const collapseIcon = collapsed ? 'fa fa-angle-down' : 'fa fa-angle-up';
  const collapseTitle = collapsed ? 'Expand content' : 'Collapse content';
  const editStyle: CSSProperties = {
    color: editable ? 'var(--action-color-primary)' : ''
  };
  const editClassNames = editable ? 'fas fa-toggle-on' : 'fas fa-toggle-off';

  return (
    <span className={`ml-toolbar ${classNames}`}>
        <i
          className={`${editClassNames} icon`}
          style={editStyle}
          onClick={(): void => action({ target: 'edit' })}
          title="Toggle Edit Mode"
        />
        <i
          className="fa fa-external-link-alt icon"
          onClick={(): void => openAllLinks(widget)}
          title="Open all links"
        />
        <i
          className={`${collapseIcon} icon`}
          onClick={(): void => action({ target: 'collapse' })}
          title={collapseTitle}
        />
    </span>
  );
}

WidgetToolbar.defaultProps = defaultProps;
