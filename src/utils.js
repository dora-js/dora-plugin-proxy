import { parse as parseUrl } from 'url';
import pathToRegexp from 'path-to-regexp';

function decodeParam(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }

  return decodeURIComponent(val);
}

export function isRemote(str) {
  return str.indexOf('http://') === 0 || str.indexOf('https://') === 0;
}

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
    return hostname === urlObj.hostname
      && (port || '80') === (urlObj.port || '80')
      && !!urlObj.path.match(pathToRegexp(path));
  }

  return !!urlObj.pathname.match(pathToRegexp(expectPattern));
}

export function getParams(url, pattern) {
  const keys = [];
  const path = pattern.trim().indexOf(' ') > -1 ? pattern.split(' ')[1] : pattern;
  if (path === '/') {
    return {};
  }

  const regexp = pathToRegexp(path, keys);
  const m = regexp.exec(url);
  if (!keys.length || !m) {
    return {};
  }

  const params = {};
  m.forEach((ms, index) => {
    if (index === 0) return;
    const key = keys[index - 1];
    const prop = key.name;
    const val = decodeParam(ms);
    if (val !== undefined || !(Object.prototype.hasOwnProperty.call(params, prop))) {
      params[prop] = val;
    }
  });
  return params;
}
