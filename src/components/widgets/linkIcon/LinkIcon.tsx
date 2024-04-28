import { ReactElement, useState } from 'react';
import { faviconUrlByLink } from '../../../common/Favicon';
import { isNotEmptyString } from '../../../common/StringUtil';
import { useAppConfigContext } from '../../../contexts/AppConfigContext';
import { Link as MLLink } from '../../../model/MyLinks-interface';
import { getStyleForMissingFavicon } from './LinkIconUtil';
import './LinkIcon.css';

interface LinkIconProps {
  readonly link: MLLink;
  readonly faviconService?: string | null;
}

export function LinkIcon(
  {
    link,
    faviconService = null,
  }: LinkIconProps
): ReactElement {
  const { faviconService: appFaviconService } = useAppConfigContext();
  const faviconUrl = faviconUrlByLink(link, faviconService ?? appFaviconService);
  const [missingStyle, setMissingStyle] = useState<ReturnType<typeof getStyleForMissingFavicon> | undefined>();

  function onError(): void {
    setMissingStyle(getStyleForMissingFavicon(link));
  }

  if (missingStyle === undefined && isNotEmptyString(faviconUrl)) {
    return (
      <img
        src={faviconUrl}
        className="link-icon-favicon"
        alt=""
        onError={onError}
      />);
  }

  const { label, style } = missingStyle ?? getStyleForMissingFavicon(link);
  return <div style={style} className="link-icon-favicon-missing">{label}</div>;
}
