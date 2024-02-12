import { ReactElement, useState } from 'react';
import useCollapsed from '../../../hooks/useCollapsed/useCollapsed';
import { MyLinksEvent } from '../../../model/Events';
import { openWidgetLinks } from '../../../model/MyLinks';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import { WidgetToolbar, WidgetToolbarActionType } from '../widgetToolbar/WidgetToolbar';
import './Widget.css';
import { LinkListView } from './LinkListView';
import { cssExtraClasses } from './Widget.utils';
import WidgetActionList from './WidgetActionList';
import WidgetTitle from './WidgetTitle';

export interface WidgetProps {
  readonly value: MLWidget;
}

export function Widget({ value: widget }: WidgetProps): ReactElement {
  function onClickToolbar(e: MyLinksEvent<WidgetToolbarActionType>): void {
    switch (e.target) {
      case 'collapse':
        toggleStartCollapsed();
        break;
      case 'edit':
        onToggleEdit();
        break;
      case 'openLinks':
        openWidgetLinks(widget);
        break;
    }
  }

  function onToggleEdit(): void {
    setEditable(prevState => !prevState);
  }

  const [editable, setEditable] = useState(false);
  const { startCollapsed, collapsed, setCollapsed, toggleStartCollapsed } = useCollapsed(widget.id);

  const cls = cssExtraClasses(startCollapsed, collapsed);

  return (
    <div
      className={`ml-widget ${cls.widget}`}
      data-list-id={widget.id}
      onMouseEnter={(): void => setCollapsed(false)}
      onMouseLeave={(): void => setCollapsed(true)}
    >
      <div>
        <h2 className="ml-widget-title">
          <WidgetTitle editable={editable} widget={widget} onToggleEdit={onToggleEdit} />
        </h2>
        <WidgetToolbar
          collapsed={startCollapsed}
          editable={editable}
          action={onClickToolbar}
          classNames="hover-toolbar"
        />
      </div>
      <div className="ml-widget-container">
        <div className="ml-widget-control-box">
          <LinkListView widget={widget} editable={editable} />
          <WidgetActionList editable={editable} widget={widget} />
        </div>
      </div>
    </div>);
}
