import * as React from "react";
import './LinkSelector.css'
import {Link, Widget} from "../../model/MyLinks";

interface Result {
  id: string,
  widget: Widget,
  link: Link
}

export interface LinkSelectorProps {
  widgets: [Widget[]] | undefined,
  onSelected: (link: Link) => void
}

interface LinkSelectorState {
  result: Result[]
  selectedIndex: number
}

function linkContains(link: Link, pattern: string) {
  return link.label.toLowerCase().indexOf(pattern.toLowerCase()) >= 0;
}

export class LinkSelector extends React.Component<LinkSelectorProps, LinkSelectorState> {
  private listRefs = new Map<string, any>();
  private inputRef: any = React.createRef();

  constructor(props: any) {
    super(props);
    this.state = {
      result: [],
      selectedIndex: -1
    };
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  onClick(e: any, index: number) {
    e.preventDefault();
    e.stopPropagation();

    this.inputRef.current.focus();

    this.setState({
      selectedIndex: index
    });

    return true;
  }

  onDoubleClick(e: any, index: number) {
    e.preventDefault();
    e.stopPropagation();

    this.inputRef.current.focus();
    this.props.onSelected(this.state.result[index].link);
    return true;
  }

  onKeyDown(e: any) {
    const currIndex = this.state.selectedIndex;
    let newIndex = -1;

    if (e.keyCode === 38) { // up
      if (currIndex > 0) {
        newIndex = currIndex - 1;
      }
    } else if (e.keyCode === 40) { // down
      if (currIndex < (this.state.result.length - 1)) {
        newIndex = currIndex + 1
      }
    } else if (e.keyCode === 13) {
      if (currIndex >= 0) {
        this.props.onSelected(this.state.result[currIndex].link);
      }
    } else {
      return false;
    }
    if (newIndex !== -1) {
      const item = this.state.result[newIndex];
      this.listRefs.get(item.id).current
        .scrollIntoView({block: "nearest", inline: "nearest"})
      this.setState({
        selectedIndex: newIndex
      });
    }
    e.preventDefault();
    return true
  }

  render() {
    return (
      <div className="link-selector">
        <input type="text"
               ref={this.inputRef}
               onKeyDown={this.onKeyDown}
               onChange={this.onChange}
               placeholder="Search"
               className="input-box"/>
        <div className="list">
          <ul>
            {this.state.result.map((r, i) => {
              return <li
                onClick={(e) => this.onClick(e, i)}
                onDoubleClick={(e) => this.onDoubleClick(e, i)}
                className={i === this.state.selectedIndex ? 'selected' : 'none'}
                ref={this.listRefs.get(r.id)}
                key={r.id}>{this.image(r.link)}
                <div>{r.widget.title} - {r.link.label}</div>
              </li>
            })}
          </ul>
        </div>
      </div>
    );
  }

  onChange(e: any) {
    const pattern = e.target.value;
    const result = this.filter(pattern);

    this.listRefs = result.reduce((acc, r) => {
      acc.set(r.id, React.createRef());
      return acc;
    }, new Map<string, any>());

    this.setState({
      result: result,
      selectedIndex: result.length ? 0 : -1
    });
  }

  filter(pattern: string) {
    if (pattern.length === 0) {
      return [];
    }
    const widgets = this.props.widgets?.flat() || [];
    const result: Result[] = [];

    widgets.forEach(w => {
      const links = w.list.filter(link => linkContains(link, pattern))
      if (links) {
        result.push(...links.map(l => {
          return {id: l.id, widget: w, link: l}
        }));
      }
    });
    return result;
  }

  image(item: Link) {
    if (item.favicon) {
      return <img src={item.favicon} className="ml-favicon" alt=''/>;
    }
    return <div className="ml-missing-favicon"/>;
  }

}
