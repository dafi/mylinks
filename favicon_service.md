# Favicon service

It is possible to specify which service to call to obtain the icon shown for links, the so-called favicon

The most used service to get the favicon associated to a site is

    https://www.google.com/s2/favicons?domain=<url>

You can specify it as MyLink's favicon service

The first link url is passed automatically to the service and can be parsed to extract the needed information.

For example the above service requires the full url, so you must pass `$u`

The complete list is available below, the values are the same present at [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) documentation

The result column refers to the url

    https://uname:pwd@my-address.com:8081/mail/u/0?a=1&b=3#inbox


| Description       | Formatter<br/>Specifier | Result                                                         |
|-------------------|-------------------------|----------------------------------------------------------------|
| Hash              | `$a`                    | `#inbox`                                                       |
| Host with port    | `$h`                    | `my-address.com:8081`                                          |
| Host without port | `$H`                    | `my-address.com`                                               |
| Full url          | `$u`                    | `https://uname:pwd@my-address.com:8081/mail/u/0?a=1&b=3#inbox` |
| Origin            | `$o`                    | `https://my-address.com:8081`                                  |
| Pathname          | `$p`                    | `/mail/u/0`                                                    |
| Port              | `$r`                    | `8081`                                                         |
| Protocol          | `$t`                    | `https:`                                                       |
| Search Parameters | `$s`                    | `?a=1&b=3`                                                     |
| Username          | `$n`                    | `uname`                                                        |
| Password          | `$w`                    | `pwd`                                                          |
