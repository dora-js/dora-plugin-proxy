import expect from 'expect';
import { isMatch } from '../src/utils';
import { join } from 'path';

describe('utils', () => {

  it('isMatch', () => {
    expect(isMatch({url:'http://a.com/index.js'}, '/index.js')).toBe(true);
    expect(isMatch({url:'http://a.com/index.js'}, '/index2.js')).toBe(false);

    // Host
    expect(isMatch({url:'http://a.com/index.js'}, 'http://a.com/index.js')).toBe(true);
    expect(isMatch({url:'http://a.com/index.js'}, 'http://b.com/index.js')).toBe(false);

    // Port
    expect(isMatch({url:'http://a.com/index.js'}, 'http://a.com:80/index.js')).toBe(true);
    expect(isMatch({url:'http://a.com/index.js'}, 'http://a.com:8080/index.js')).toBe(false);
    expect(isMatch({url:'http://a.com:8080/index.js'}, 'http://a.com/index.js')).toBe(false);

    // Regexp
    expect(isMatch({url:'http://a.com/index.js'}, '/*')).toBe(true);
    expect(isMatch({url:'http://a.com/a/index.js'}, '/a/:id?/*')).toBe(true);
    expect(isMatch({url:'http://a.com/a/0.1.0/index.js'}, '/a/:id?/*')).toBe(true);

    // Method
    expect(isMatch({method:'get',url:'http://a.com/index.js'}, '/index.js')).toBe(true);
    expect(isMatch({method:'put',url:'http://a.com/index.js'}, '/index.js')).toBe(true);
    expect(isMatch({method:'get',url:'http://a.com/index.js'}, 'GET /index.js')).toBe(true);
    expect(isMatch({method:'put',url:'http://a.com/index.js'}, 'GET /index.js')).toBe(false);

    // Together
    expect(isMatch({method:'get',url:'http://a.com/index.js'}, 'GET http://a.com:80/index.js')).toBe(true);
  });
});
