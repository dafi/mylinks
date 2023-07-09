import React, { ReactNode, RefObject } from 'react';
import { AppUIStateContext } from '../../../contexts/AppUIStateContext';
import { MyLinksEvent } from '../../../model/Events';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import { InputText } from '../../inputText/InputText';
import { Link } from '../link/Link';
import { WidgetToolbar, WidgetToolbarActionType } from '../widgetToolbar/WidgetToolbar';
import './Widget.css';
import { DraggableListItem } from './DraggableListItem';

const debounceTimeout = 1500;

export interface WidgetProps {
  value: MLWidget;
}

interface WidgetState {
  collapsed: boolean;
  editable: boolean;
}

interface WidgetExtraCssClass {
  widget: string;
}

export class Widget extends React.Component<WidgetProps, WidgetState> {
  static contextType = AppUIStateContext;
  context!: React.ContextType<typeof AppUIStateContext>;
  private startCollapsed = false;
  private inputRef: RefObject<InputText> = React.createRef();

  constructor(props: WidgetProps) {
    super(props);
    this.startCollapsed = localStorage.getItem(`${this.props.value.id}-collapsed`) === 't';
    this.state = { collapsed: this.startCollapsed, editable: false };
  }

  toggleCollapse(collapsed: boolean): void {
    if (this.startCollapsed) {
      this.setState({ collapsed });
    }
  }

  toggleWidgetSize(): void {
    this.startCollapsed = !this.startCollapsed;
    localStorage.setItem(`${this.props.value.id}-collapsed`, this.startCollapsed ? 't' : 'f');
    this.setState({ collapsed: this.startCollapsed });
  }

  cssExtraClasses(): WidgetExtraCssClass {
    const collapsed = this.state.collapsed;
    const collapsedVisible = this.startCollapsed && !collapsed;
    const cls: WidgetExtraCssClass = {
      widget: '',
    };

    if (this.startCollapsed) {
      cls.widget += 'collapsed ';
    }
    if (collapsedVisible) {
      cls.widget += 'collapsed-visible ';
    }

    return cls;
  }

  onClickToolbar(e: MyLinksEvent<WidgetToolbarActionType>): void {
    if (e.target === 'collapse') {
      this.toggleWidgetSize();
    } else if (e.target === 'edit') {
      this.onToggleEdit();
    }
  }

  onToggleEdit(): void {
    this.setState(prevState => ({
      editable: !prevState.editable
    }));
  }

  onAddLink(): void {
    if (this.context.onEdit) {
      const widget = this.props.value;
      this.context.onEdit({
        link: { id: `${widget.id}-${new Date().getTime()}`, url: '', shortcut: '', label: '' },
        widget,
        editType: 'create'
      });
    }
  }

  private saveTitle(title: string): void {
    const widget = this.props.value;
    if (this.context.onEdit && widget.title !== title) {
      this.context.onEdit({
        widget,
        editType: 'update',
        editedProperties: { title }
      });
    }
  }

  private onKeydownTitle(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Escape') {
      this.onToggleEdit();
    } else if (e.key === 'Enter') {
      this.onToggleEdit();
      if (this.inputRef.current?.value) {
        this.saveTitle(this.inputRef.current?.value);
      }
    }
  }

  renderButtons(): ReactNode | null {
    if (this.state.editable) {
      return (
        <div className="ml-widget-button-container">
          <button className="button" onClick={(): void => this.onAddLink()}>Add New Link</button>
        </div>
      );
    }
    return null;
  }

  renderTitle(): ReactNode {
    const widget = this.props.value;

    if (this.state.editable) {
      return <InputText
        ref={this.inputRef}
        autofocus={true}
        className="edit-title"
        debounce={debounceTimeout}
        defaultValue={widget.title}
        onKeyDown={(e): void => this.onKeydownTitle(e)}
        onText={(v): void => this.saveTitle(v)}
      />;
    }
    return widget.title;
  }

  onDrop(sourceId: string, destId: string): void {
    const links = this.props.value.list;
    const fromIndex = links.findIndex(l => l.url === sourceId);
    const toIndex = links.findIndex(l => l.url === destId);
    if (this.context.onEdit && fromIndex >= 0 && toIndex >= 0) {
      this.context.onEdit({
        link: links[fromIndex],
        editType: 'move',
        widget: this.props.value,
        position: { fromIndex, toIndex }
      });
    }
  }

  render(): ReactNode {
    const widget = this.props.value;
    const editable = this.state.editable;
    const items = widget.list.map(v =>
      <DraggableListItem
        key={v.url}
        id={v.url}
        draggable={editable}
        onDrop={(s, d): void => this.onDrop(s, d)}>
        <Link
          link={v}
          draggable={!editable}
          widget={widget}
          editable={editable}/>
      </DraggableListItem>);

    const cls = this.cssExtraClasses();

    return (
      <div className={`ml-widget ${cls.widget}`}
           data-list-id={widget.id}
           onMouseEnter={(): void => this.toggleCollapse(false)}
           onMouseLeave={(): void => this.toggleCollapse(true)}>
        <div>
          <h2 className="ml-widget-title">{this.renderTitle()}</h2>
          <WidgetToolbar
            collapsed={this.startCollapsed}
            widget={widget}
            editable={editable}
            action={(e): void => this.onClickToolbar(e)}
            classNames={'hover-toolbar'}/>
        </div>
        <div className="ml-widget-container">
          <div className="ml-widget-control-box">
            <ul className="ml-widget-list">{items}</ul>
            {this.renderButtons()}
          </div>
        </div>
      </div>);
  }
}
