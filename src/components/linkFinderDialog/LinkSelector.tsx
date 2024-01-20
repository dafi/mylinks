import { ChangeEvent, KeyboardEvent, ReactElement, useRef, useState } from 'react';
import { LinkSearch, LinkSearchResult } from '../../common/LinkSearch';
import { isNotEmptyString } from '../../common/StringUtil';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { Link, Widget } from '../../model/MyLinks-interface';
import { ListView } from '../listView/ListView';
import { ListViewHandle, ListViewItem } from '../listView/ListViewTypes';
import { LinkIcon } from '../widgets/linkIcon/LinkIcon';
import './LinkSelector.css';

interface LinkSelectorProps {
  readonly widgets: Widget[][];
  readonly onSelected: (link: Link) => void;
}

export function LinkSelector(
  {
    widgets,
    onSelected,
  }: LinkSelectorProps
): ReactElement {
  function onSelectionChange(_index: number): void {
    inputRef.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    listViewRef.current?.onKeyDown(e);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const pattern = e.target.value;
    // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1193
    // eslint-disable-next-line unicorn/no-array-callback-reference
    setResult(linkSearch.filter(pattern));
  }

  function widgetTitle(link: Link): string {
    const title = myLinksLookup?.findWidgetByLinkId(link.id)?.title;
    return isNotEmptyString(title) ? ` - ${title}` : '';
  }

  const { myLinksLookup } = useAppConfigContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const listViewRef = useRef<ListViewHandle>(null);
  const linkSearch = new LinkSearch();
  const [result, setResult] = useState<LinkSearchResult[]>([]);

  const links = widgets.flat().flatMap(w => w.list);
  linkSearch.setLinks(links);

  const listComponents = result.map((item): ListViewItem => (
    {
      id: item.id,
      element:
        <>
          <i className="list-image">
            <LinkIcon link={item.link} />
          </i>
          <div>
            {/* eslint-disable-next-line react/no-danger */}
            <span dangerouslySetInnerHTML={{ __html: item.highlighted }} />
            {widgetTitle(item.link)}
          </div>
        </>
    })
  );

  return (
    <div className="link-selector">
      <div className="input-container">
        <i className="fas fa-search icon" />
        <input
          type="text"
          data-auto-focus="true"
          ref={inputRef}
          onKeyDown={onKeyDown}
          onChange={onChange}
          placeholder="Search"
          spellCheck="false"
          className="input-box"
        />
      </div>
      <div className="list">
        <ListView
          ref={listViewRef}
          items={listComponents}
          onSelectionChange={onSelectionChange}
          selectedIndex={0}
          onSelected={(i): void => onSelected(result[i].link)}
        />
      </div>
    </div>
  );
}
