import { parse as parseUrl } from 'url';

export function isMatch(url, pattern) {
  const urlObj = parseUrl(url);

  if (isRemote(pattern)) {
    const { hostname, port, path } = parseUrl(pattern);
    //console.log(hostname, urlObj.hostname, port, urlObj.port, path, urlObj.path);
    return hostname === urlObj.hostname
      && (port || '80') === (urlObj.port || '80')
      && !!urlObj.path.match(new RegExp(path));
  } else {
    //console.log(urlObj.path, pattern);
    return !!urlObj.path.match(new RegExp(pattern));
  }
}

export function isRemote(str) {
  return str.indexOf('http://') === 0 || str.indexOf('https://') === 0;
}
