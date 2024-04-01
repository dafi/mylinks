export function formatUrl(stringOrUrl: string | URL, format: string): string {
  const url = typeof stringOrUrl === 'string' ? new URL(stringOrUrl) : stringOrUrl;
  const len = format.length;
  let result = '';

  for (let i = 0; i < len; i++) {
    const ch = format.charAt(i);

    switch (ch) {
      case '$':
        if (i + 1 < len) {
          result += parseSpecifier(url, format.charAt(++i));
        } else {
          throw new Error('Format specifier at end of string');
        }
        break;
      default:
        result += ch;
        break;
    }
  }
  return result;
}

function parseSpecifier(url: URL, specifier: string): string {
  switch (specifier) {
    case '$':
      return '$';
    case 'a':
      return url.hash;
    case 'h':
      return url.host;
    case 'H':
      return url.hostname;
    case 'u':
      return url.href;
    case 'o':
      return url.origin;
    case 'w':
      return url.password;
    case 'p':
      return url.pathname;
    case 'r':
      return url.port;
    case 't':
      return url.protocol;
    case 's':
      return url.search;
    case 'n':
      return url.username;
    default:
      throw new Error(`Invalid format specifier '${specifier}'`);
  }
}
