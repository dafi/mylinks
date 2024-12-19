import { ReactNode } from 'react';
import { LinkSearchResult } from '../../common/LinkSearch';
import { isNotEmptyString } from '../../common/StringUtil';

type HighlightProps = Readonly<{
  matches: LinkSearchResult['matches'];
}>;

export function Highlight({ matches: m }: HighlightProps): ReactNode {
  if (m?.[0] && isNotEmptyString(m[0].value)) {
    const { value, indices } = m[0];
    const result: ReactNode[] = [];

    let pos = 0;
    for (const [start, end] of indices) {
      // https://github.com/krisk/Fuse/issues/761
      if (start < pos) {
        continue;
      }
      result.push(value.substring(pos, start), <mark key={pos}>{value.substring(start, end + 1)}</mark>);
      pos = end + 1;
    }
    result.push(value.substring(pos));
    return <span>{result}</span>;
  }
  return null;
}
