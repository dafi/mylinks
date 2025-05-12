import { expect, test } from 'vitest';
import { formatUrl, validateUrls } from '../src/common/UrlUtil';

const url = 'https://uname:pwd@my-address.com:8081/mail/u/0?a=1&b=3#inbox';

test('check hash', () => {
  expect(formatUrl(url, '$aa')).toEqual('#inboxa');
});

test('check host with port', () => {
  expect(formatUrl(url, '$h')).toEqual('my-address.com:8081');
});

test('check host without port', () => {
  expect(formatUrl(url, '$H')).toEqual('my-address.com');
});

test('check full url', () => {
  expect(formatUrl(url, '$u')).toEqual(url);
});

test('check origin', () => {
  expect(formatUrl(url, '$o')).toEqual('https://my-address.com:8081');
});

test('check password', () => {
  expect(formatUrl(url, '$w')).toEqual('pwd');
});

test('check pathname', () => {
  expect(formatUrl(url, '$p')).toEqual('/mail/u/0');
});

test('check port', () => {
  expect(formatUrl(url, '$r')).toEqual('8081');
});

test('check protocol', () => {
  expect(formatUrl(url, '$twww.sample.com')).toEqual('https:www.sample.com');
});

test('check search', () => {
  expect(formatUrl(url, '$s')).toEqual('?a=1&b=3');
});

test('check username', () => {
  expect(formatUrl(url, '$n')).toEqual('uname');
});

test('invalid format specifier', () => {
  expect(() => formatUrl(url, 'Hello$')).toThrowError('Format specifier at end of string');
});

test('invalid url format', () => {
  expect(() => new URL('hha')).toThrowError('Invalid URL');
});

test('invalid format specifier', () => {
  expect(() => formatUrl(url, '$x')).toThrowError("Invalid format specifier 'x'");
});

test('protocol + hash', () => {
  expect(formatUrl(url, '$$$t-$a$$')).toEqual('$https:-#inbox$');
});

test('strings surrounding formats', () => {
  expect(formatUrl(url, 'hash = $a, protocol = $t')).toEqual('hash = #inbox, protocol = https:');
});

test('url with leading spaces', () => {
  const urls = ['https://localhost.com', '  https://second.url'];
  expect(validateUrls(urls)).toEqual(`'${urls[1]}' has leading spaces`);
});

test('url with trailing spaces', () => {
  const urls = ['https://localhost.com', 'https://second.url', 'https://third.url    '];
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  expect(validateUrls(urls)).toEqual(`'${urls[2]}' has trailing spaces`);
});

test('url with empty lines', () => {
  const urls = '\n\n\n'.split('\n');
  expect(validateUrls(urls)).toEqual('Url list has empty lines');
});
