import { expect, test } from 'vitest';
import { formatUrl } from '../src/common/UrlUtil';

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
  expect(() => formatUrl(url, 'Hello$')).toThrowError(new Error('Format specifier at end of string'));
});

test('invalid url format', () => {
  expect(() => formatUrl('hha', '$u')).toThrowError(new Error('Invalid URL'));
});

test('invalid format specifier', () => {
  expect(() => formatUrl(url, '$x')).toThrowError(new Error("Invalid format specifier 'x'"));
});

test('protocol + hash', () => {
  expect(formatUrl(url, '$$$t-$a$$')).toEqual('$https:-#inbox$');
});

test('strings surrounding formats', () => {
  expect(formatUrl(url, 'hash = $a, protocol = $t')).toEqual('hash = #inbox, protocol = https:');
});

