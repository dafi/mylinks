// eslint-disable-next-line max-lines-per-function
export function formatUrl(stringOrUrl: string | URL, format: string): string {
  const url = typeof stringOrUrl === 'string' ? new URL(stringOrUrl) : stringOrUrl;
  let result = '';
  const len = format.length;

  for (let i = 0; i < len; i++) {
    const ch = format.charAt(i);

    switch (ch) {
      case '$':
        if (i + 1 < len) {
          ++i;
          const ch1 = format.charAt(i);
          switch (ch1) {
            case '$':
              result += '$';
              break;
            case 'a':
              result += url.hash;
              break;
            case 'h':
              result += url.host;
              break;
            case 'H':
              result += url.hostname;
              break;
            case 'u':
              result += url.href;
              break;
            case 'o':
              result += url.origin;
              break;
            case 'w':
              result += url.password;
              break;
            case 'p':
              result += url.pathname;
              break;
            case 'r':
              result += url.port;
              break;
            case 't':
              result += url.protocol;
              break;
            case 's':
              result += url.search;
              break;
            case 'n':
              result += url.username;
              break;
            default:
              throw new Error(`Invalid format specifier '${ch1}'`);
          }
        } else {
          throw new Error('Format specifier at end of string');
        }
        break;
      default:
        result += ch;
    }
  }
  return result;
}
