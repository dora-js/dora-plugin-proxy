import dora from 'dora';
import { join } from 'path';
import { stringify } from 'qs';
import request from 'request';
import expect from 'expect';

const port = '12345';
const proxyPort = '12346';

//function request(url, headers, fn) {
//  _request({
//    url: `http://localhost:${proxyPort}${url}`,
//    headers,
//  }, fn);
//}

function getUrl(url) {
  return `http://localhost:${proxyPort}${url}`;
}

describe.only('index', () => {

  before(done => {
    dora({
      port,
      plugins: [`../../../src/index?port=${proxyPort}`],
      cwd: join(__dirname, './fixtures/getRule-proxy'),
      verbose: true,
    });
    setTimeout(done, 1000);
  });

  it('should Forward', done => {
    request(getUrl('/react/0.13.3/react.js'), (err, res, body) => {
      expect(body.indexOf('React v0.13.3') > -1).toExist();
      done();
    });
  });

  it('should Forward With Path', done => {
    request(getUrl('/card_min_9f4a07ca.css'), (err, res, body) => {
      expect(body.indexOf('.s-cardsetting{position:relative;') > -1).toExist();
      done();
    });
  });

  it('should Handle Local File', done => {
    request(getUrl('/local'), (err, res, body) => {
      expect(body.trim()).toEqual('local');
      done();
    });
  });

  it('should Fallback To Dora Server If No Match Rules', done => {
    request(getUrl('/not-match.js'), (err, res, body) => {
      expect(body.trim()).toEqual('not-match');
      done();
    });
  });

  it('should 404', done => {
    request(getUrl('/not-match'), (err, res, body) => {
      expect(res.statusCode).toEqual(404);
      done();
    });
  });

  it('should Handle Object', done => {
    request(getUrl('/test-object'), (err, res, body) => {
      expect(body).toEqual(JSON.stringify({
        name: '@Name',
        'id+1': 1,
        a: 2
      }));
      done();
    });
  });

  it('should Handle Array', done => {
    request(getUrl('/test-array'), (err, res, body) => {
      expect(body).toEqual(JSON.stringify([1, 2]));
      done();
    });
  });

  it('should Handle Function: GET', done => {
    request(getUrl('/test-func/update/1?a=b'), (err, res, body) => {
      expect(body).toEqual(JSON.stringify({
        body: '',
        params: {
          action: 'update',
          id: "1",
        },
        query: {
          a: 'b',
        },
      }));
      done();
    });
  });

  it('should Handle Function: POST', done => {
    request({
      url: getUrl('/test-func/update/1?a=b'),
      method: 'POST',
      body: '12345',
    }, (err, res, body) => {
      expect(body).toEqual(JSON.stringify({
        body: '12345',
        params: {
          action: 'update',
          id: "1",
        },
        query: {
          a: 'b',
        },
      }));
      done();
    });
  });

  it('should Handle Function: POST with Form', done => {
    request({
      url: getUrl('/test-func/update/1?a=b'),
      method: 'POST',
      form: {
        a: 'b'
      }
    }, (err, res, body) => {
      expect(body).toEqual(JSON.stringify({
        body: 'a=b',
        params: {
          action: 'update',
          id: "1",
        },
        query: {
          a: 'b',
        },
      }));
      done();
    });
  });

  xit('should Handle Function: POST with FormData', done => {
    request({
      url: getUrl('/test-func/update/1?a=b'),
      method: 'POST',
      formData: {
        a: 'b'
      }
    }, (err, res, body) => {
      expect(body).toEqual(JSON.stringify({
        body: 'a=b',
        params: {
          action: 'update',
          id: "1",
        },
        query: {
          a: 'b',
        },
      }));
      done();
    });
  });

  it('should Handle Function: PUT', done => {
    request({
      url: getUrl('/test-func/update/1?a=b'),
      method: 'PUT',
      body: '12345',
    }, (err, res, body) => {
      expect(body).toEqual(JSON.stringify({
        body: '12345',
        params: {
          action: 'update',
          id: "1",
        },
        query: {
          a: 'b',
        },
      }));
      done();
    });
  });

});

