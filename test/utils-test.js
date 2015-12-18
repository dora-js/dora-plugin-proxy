import expect from 'expect';
import { isMatch, getParams } from '../src/utils';
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

    // Query
    expect(isMatch({method:'get',url:'http://a.com:8000/x.do?cb=jQuery21407292539589107037_1450166204069&_=1450166204070'}, 'GET /x.do')).toBe(true);

    // Together
    expect(isMatch({method:'get',url:'http://a.com:8000/a/0.1.0/index.js?cb=jQuery21407292539589107037_1450166204069'}, '/a/:id?/*')).toBe(true);
    expect(isMatch({method:'get',url:'http://a.com/index.js'}, 'GET http://a.com:80/index.js')).toBe(true);
  });

  it('getParams', () => {
    expect(getParams('/pigcan/8/18', '/pigcan/:month/:day')).toEqual({month:'8',day:'18'})
  });

});
