import { ReactNode } from 'react';
import { LinkSearchResult } from '../../common/LinkSearch';
import { isNotEmptyString } from '../../common/StringUtil';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { Link } from '../../model/MyLinks-interface';
import { MyLinksLookup } from '../../model/MyLinksLookup';
import { ShortcutDetails } from '../shortcut/shortcutDetails/ShortcutDetails';
import { LinkIcon } from '../widgets/linkIcon/LinkIcon';
import { Highlight } from './Highlight';
import './LinkSelector.css';

function widgetTitle(link: Link, myLinksLookup: MyLinksLookup | undefined): string {
  const title = myLinksLookup?.linkManager.findWidgetByLinkId(link.id)?.title;
  return isNotEmptyString(title) ? ` - ${title}` : '';
}

export function LinkSearchResultViewItem(
  {
    item,
  }: { readonly item: LinkSearchResult }
): ReactNode {
  const { myLinksLookup } = useAppConfigContext();

  return (
    <div className="link-search-result">
      <ShortcutDetails combination={item.link.hotKey}>
        <i className="list-image">
          <LinkIcon link={item.link} />
        </i>
        <div>
          <Highlight matches={item.matches} />
          {widgetTitle(item.link, myLinksLookup)}
        </div>
      </ShortcutDetails>
    </div>
  );
}
