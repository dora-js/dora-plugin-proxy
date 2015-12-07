import { parse as parseUrl } from 'url';
import pathToRegexp from 'path-to-regexp';

export function isMatch(req, pattern) {
  const { method, url } = req;
  const urlObj = parseUrl(url);

  let expectPattern;
  let expectMethod;

  if (pattern.indexOf(' ') > -1) {
    [expectMethod, expectPattern] = pattern.split(/\s+/);
  } else {
    expectPattern = pattern;
  }

  // Match method first.
  if (expectMethod && expectMethod.toUpperCase() !== method.toUpperCase()) {
    return false;
  }

  if (isRemote(expectPattern)) {
    const { hostname, port, path } = parseUrl(expectPattern);
    //console.log(hostname, urlObj.hostname, port, urlObj.port, path, urlObj.path);
    return hostname === urlObj.hostname
      && (port || '80') === (urlObj.port || '80')
      && !!urlObj.path.match(pathToRegexp(path));
  } else {
    //console.log(urlObj.path, expectPattern);
    return !!urlObj.path.match(pathToRegexp(expectPattern));
  }
}

export function isRemote(str) {
  return str.indexOf('http://') === 0 || str.indexOf('https://') === 0;
}
