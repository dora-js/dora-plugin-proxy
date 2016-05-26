import dora from 'dora';
import { join } from 'path';
import { stringify } from 'qs';
import request from 'request';
import expect from 'expect';

const port = 12347;
const proxyPort = 12355;

function getUrl(url, port) {
  return `http://localhost:${port || proxyPort}${url}`;
}

describe('index', function() {

  this.timeout(50000);

  describe('proxy.config.js', () => {

    before(done => {
      dora({
        port,
        plugins: [`../../../src/index?port=${proxyPort}`],
        cwd: join(__dirname, './fixtures/proxy'),
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

     it('Forward with subPath', done => {
      request(getUrl('/someDir/0.0.50/index.css'), (err, res, body) => {
        expect(body.indexOf('iconfont') > -1).toExist();
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

    it('should Handle Function: DELETE', done => {
      request({
        url: getUrl('/test-func/update/1?a=b'),
        method: 'DELETE',
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

  describe('proxy.config.test.js', () => {

    before(done => {
      dora({
        port: port+1,
        plugins: [`../../../src/index?port=${proxyPort+1}&config=proxy.config.test.js`],
        cwd: join(__dirname, './fixtures/proxy'),
        verbose: true,
      });
      setTimeout(done, 1000);
    });

    it('should Get Rules From proxy.config.test.js', done => {
      request(getUrl('/test-test', proxyPort+1), (err, res, body) => {
        expect(body).toEqual(JSON.stringify({
          a: 1
        }));
        done();
      });
    });
  });

});

