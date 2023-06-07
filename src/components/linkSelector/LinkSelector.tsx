import React, { ChangeEvent, ReactNode, RefObject } from 'react';
import { LinkSearch, LinkSearchResult } from '../../common/LinkSearch';
import { Link, Widget } from '../../model/MyLinks-interface';
import './LinkSelector.css';
import { LinkIcon } from '../widgets/LinkIcon';

export interface LinkSelectorProps {
  widgets: [Widget[]] | undefined;
  onSelected: (link: Link) => void;
}

interface LinkSelectorState {
  result: LinkSearchResult[];
  selectedIndex: number;
}

export class LinkSelector extends React.Component<LinkSelectorProps, LinkSelectorState> {
  private listRefs = new Map<string, RefObject<HTMLLIElement>>();
  private inputRef: RefObject<HTMLInputElement> = React.createRef();
  private linkSearch = new LinkSearch();

  constructor(props: LinkSelectorProps) {
    super(props);
    this.state = {
      result: [],
      selectedIndex: -1
    };
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);

    const links = this.props.widgets?.flat().map(w => w.list).flat() || [];
    this.linkSearch.setLinks(links);
  }

  moveFocusToSearch(): void {
    const el = this.inputRef?.current;
    if (el) {
      el.focus();
    }
  }

  componentDidMount(): void {
    this.moveFocusToSearch();
  }

  onClick(e: React.MouseEvent<HTMLElement>, index: number): void {
    // skip if a dblclick is in progress
    // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
    if (e.detail !== 1) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    this.moveFocusToSearch();

    this.setState({
      selectedIndex: index
    });
  }

  onDoubleClick(e: React.MouseEvent<HTMLElement>, index: number): void {
    e.preventDefault();
    e.stopPropagation();

    this.moveFocusToSearch();
    this.props.onSelected(this.state.result[index].link);
  }

  onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    const currIndex = this.state.selectedIndex;
    let newIndex = -1;

    if (e.key === 'ArrowUp') {
      if (currIndex > 0) {
        newIndex = currIndex - 1;
      }
    } else if (e.key === 'ArrowDown') {
      if (currIndex < (this.state.result.length - 1)) {
        newIndex = currIndex + 1;
      }
    } else if (e.key === 'Enter') {
      if (currIndex >= 0) {
        this.props.onSelected(this.state.result[currIndex].link);
      }
    } else {
      return;
    }
    if (newIndex !== -1) {
      const item = this.state.result[newIndex];
      const liElement = this.listRefs.get(item.id)?.current;
      if (liElement) {
        liElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      this.setState({
        selectedIndex: newIndex
      });
    }
    e.preventDefault();
  }

  render(): ReactNode {
    return (
      <div className="link-selector">
        <div className="input-container">
          <i className="fas fa-search icon"/>
          <input type="text"
                 ref={this.inputRef}
                 onKeyDown={(e): void => this.onKeyDown(e)}
                 onChange={(e): void => this.onChange(e)}
                 placeholder="Search"
                 spellCheck="false"
                 className="input-box"/>
        </div>
        <div className="list">
          <ul>
            {this.state.result.map((r, i) =>
              <li
                onClick={(e): void => this.onClick(e, i)}
                onDoubleClick={(e): void => this.onDoubleClick(e, i)}
                className={i === this.state.selectedIndex ? 'selected' : 'none'}
                ref={this.listRefs.get(r.id) ?? null}
                key={r.id}><i className="list-image">
                <LinkIcon link={r.link}/>
              </i>
                <div>
                  <span dangerouslySetInnerHTML={{ __html: r.highlighted }}/>{r.link.widget?.title ? ` - ${r.link.widget.title}` : ''}</div>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }

  onChange(e: ChangeEvent<HTMLInputElement>): void {
    const pattern = e.target.value;
    const result = this.linkSearch.filter(pattern);

    this.listRefs.clear();

    this.setState({
      result: result,
      selectedIndex: result.length ? 0 : -1
    });
  }
}
