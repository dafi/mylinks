import { ReactElement } from 'react';
import { LinkSearchResult } from '../../common/LinkSearch';
import { isNotEmptyString } from '../../common/StringUtil';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { Link } from '../../model/MyLinks-interface';
import { MyLinksLookup } from '../../model/MyLinksLookup';
import { LinkIcon } from '../widgets/linkIcon/LinkIcon';
import { Highlight } from './Highlight';

function widgetTitle(link: Link, myLinksLookup: MyLinksLookup | undefined): string {
  const title = myLinksLookup?.findWidgetByLinkId(link.id)?.title;
  return isNotEmptyString(title) ? ` - ${title}` : '';
}

export function LinkSearchResultViewItem(
  {
    item,
  }: { readonly item: LinkSearchResult }
): ReactElement {
  const { myLinksLookup } = useAppConfigContext();

  return (
    <>
      <i className="list-image">
        <LinkIcon link={item.link} />
      </i>
      <div>
        <Highlight matches={item.matches} />
        {widgetTitle(item.link, myLinksLookup)}
      </div>
    </>
  );
}
