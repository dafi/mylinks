import { Draggable } from '@hello-pangea/dnd';
import { CSSProperties, ReactNode, useState } from 'react';
import { useAppUIStateContext } from '../../../contexts/AppUIStateContext';
import useCollapsed from '../../../hooks/useCollapsed/useCollapsed';
import { MyLinksEvent } from '../../../model/Events';
import { openWidgetLinks } from '../../../model/MyLinks';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import { WidgetToolbar, WidgetToolbarActionType } from '../widgetToolbar/WidgetToolbar';
import './Widget.css';
import { LinkListView } from './LinkListView';
import { cssExtraClasses, CssVar, WidgetCssVar } from './Widget.utils';
import WidgetActionList from './WidgetActionList';
import WidgetTitle from './WidgetTitle';

export type WidgetProps = Readonly<{
  value: MLWidget;
  index: number;
}>;

type VarCSSProperties = Record<CssVar, string | number | undefined> & CSSProperties;

export function Widget(
  {
    value: widget,
    index,
  }: WidgetProps
): ReactNode {
  function onClickToolbar(e: MyLinksEvent<WidgetToolbarActionType>): void {
    switch (e.target) {
      case 'collapse':
        saveCollapsed(toggleStartCollapsed());
        break;
      case 'edit':
        onToggleEdit();
        break;
      case 'openLinks':
        openWidgetLinks(widget);
        break;
    }
  }

  function saveCollapsed(state: boolean): void {
    if (onEdit) {
      onEdit({
        widget,
        action: 'update',
        entity: 'widget',
        edited: { collapsed: state },
      });
    }
  }

  function onToggleEdit(): void {
    // In edit mode, the compressed state is ignored to avoid annoying interference
    // due to the continuous expansion/compression of the widget
    if (isCollapsedOnStart) {
      setStartCollapsed(editable);
    }
    setEditable(prevState => !prevState);
  }

  const { onEdit } = useAppUIStateContext();
  const [editable, setEditable] = useState(false);
  const {
    isCollapsedOnStart, startCollapsed, setStartCollapsed, collapsed,
    toggleStartCollapsed, onCollapse
  } = useCollapsed(widget.collapsed === true);

  const cls = cssExtraClasses(startCollapsed, collapsed);

  const style: VarCSSProperties = {
    [WidgetCssVar.titleColor]: widget.textColor,
    [WidgetCssVar.toolbarIconColor]: widget.textColor,
    [WidgetCssVar.backgroundColor]: widget.backgroundColor,
    [WidgetCssVar.textColor]: widget.textColor,
  };

  const [isMouseOver, setIsMouseOver] = useState(false);

  return (
    <Draggable
      draggableId={widget.id}
      isDragDisabled={!editable}
      index={index}
    >
      {dragProvided =>
        <div
          className={`ml-widget ${cls.widget}`}
          data-list-id={widget.id}
          ref={dragProvided.innerRef}
          {...onCollapse}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          style={{ ...dragProvided.draggableProps.style, ...style }}
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
          <div
            className="ml-widget-container"
            onMouseEnter={(): void => setIsMouseOver(true)}
            onMouseLeave={(): void => setIsMouseOver(false)}
          >
            <div className="ml-widget-control-box">
              <LinkListView widget={widget} editable={editable} isMouseOver={isMouseOver} />
              <WidgetActionList editable={editable} widget={widget} />
            </div>
          </div>
        </div>
      }
    </Draggable>
  );
}
