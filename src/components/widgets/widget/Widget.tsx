import React, { useState } from 'react';
import { useAppUIStateContext } from '../../../contexts/AppUIStateContext';
import useCollapsed from '../../../hooks/useCollapsed/useCollapsed';
import { MyLinksEvent } from '../../../model/Events';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import { Link } from '../link/Link';
import { WidgetToolbar, WidgetToolbarActionType } from '../widgetToolbar/WidgetToolbar';
import { DraggableListItem } from './DraggableListItem';
import './Widget.css';
import { cssExtraClasses } from './Widget.utils';
import WidgetActionList from './WidgetActionList';
import WidgetTitle from './WidgetTitle';

export interface WidgetProps {
  readonly value: MLWidget;
}

export function Widget({ value: widget }: WidgetProps): JSX.Element {
  function onClickToolbar(e: MyLinksEvent<WidgetToolbarActionType>): void {
    if (e.target === 'collapse') {
      toggleStartCollapsed();
    } else if (e.target === 'edit') {
      onToggleEdit();
    }
  }

  function onToggleEdit(): void {
    setEditable(prevState => !prevState);
  }

  function onDrop(sourceId: string, destId: string): void {
    const links = widget.list;
    const fromIndex = links.findIndex(l => l.id === sourceId);
    const toIndex = links.findIndex(l => l.id === destId);
    if (appOnEdit && fromIndex >= 0 && toIndex >= 0) {
      appOnEdit({
        link: links[fromIndex],
        editType: 'move',
        widget,
        position: { fromIndex, toIndex }
      });
    }
  }

  const { onEdit: appOnEdit } = useAppUIStateContext();

  const [editable, setEditable] = useState(false);
  const { startCollapsed, collapsed, setCollapsed, toggleStartCollapsed } = useCollapsed(widget.id);

  const items = widget.list.map(v =>
    <DraggableListItem
      key={v.id}
      id={v.id}
      draggable={editable}
      onDrop={(s, d): void => onDrop(s, d)}
    >
      <Link
        link={v}
        draggable={!editable}
        widget={widget}
        editable={editable}
      />
    </DraggableListItem>);

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
          widget={widget}
          editable={editable}
          action={(e): void => onClickToolbar(e)}
          classNames="hover-toolbar"
        />
      </div>
      <div className="ml-widget-container">
        <div className="ml-widget-control-box">
          <ul className="ml-widget-list">{items}</ul>
          <WidgetActionList editable={editable} widget={widget} />
        </div>
      </div>
    </div>);
}
