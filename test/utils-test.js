import expect from 'expect';
import { isMatch } from '../src/utils';
import { join } from 'path';

describe.only('utils', () => {

  it('isMatch', () => {
    expect(isMatch('http://a.com/index.js', '/index.js')).toBe(true);
    expect(isMatch('http://a.com/index.js', '/index2.js')).toBe(false);

    // Host
    expect(isMatch('http://a.com/index.js', 'http://a.com/index.js')).toBe(true);
    expect(isMatch('http://a.com/index.js', 'http://b.com/index.js')).toBe(false);

    // Port
    expect(isMatch('http://a.com/index.js', 'http://a.com:80/index.js')).toBe(true);
    expect(isMatch('http://a.com/index.js', 'http://a.com:8080/index.js')).toBe(false);
    expect(isMatch('http://a.com:8080/index.js', 'http://a.com/index.js')).toBe(false);

    // Regexp
    expect(isMatch('http://a.com/index.js', '/(.+?).js')).toBe(true);
    expect(isMatch('http://a.com/a/b/index.js', '^/a/(.+?).js')).toBe(true);
    expect(isMatch('http://a.com/a/b/index.js', '^/b/(.+?).js')).toBe(false);
  });
});
