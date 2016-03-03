import dora from 'dora';
import { join } from 'path';
import request from 'request';
import expect from 'expect';

const port = 12345;
const proxyPort = 12354;

function getUrl(url, port) {
  return `http://localhost:${port || proxyPort}${url}`;
}

describe('getRes', function() {
  this.timeout(50000);

  before(done => {
    dora({
      port,
      plugins: [`../../../src/index?port=${proxyPort}&config=proxy.config.res.js`],
      cwd: join(__dirname, './fixtures/proxy'),
      verbose: true,
    });
    setTimeout(done, 1000);
  });

  it('json', done => {
    request(getUrl('/test/res/json?a=1'), (err, res, body) => {
      expect(body).toEqual(JSON.stringify({
        query: {
          a: '1'
        }
      }));
      done();
    });
  });

  it('jsonp with query', done => {
    request(getUrl('/test/res/jsonp?a=1&callback=jsonp'), (err, res, body) => {
      expect(body).toEqual('jsonp(' + JSON.stringify({
        query: {
          a: '1',
          callback: 'jsonp'
        }
      }) + ')');
      done();
    });
  });

  it('jsonp without query', done => {
    request(getUrl('/test/res/jsonp'), (err, res, body) => {
      expect(res.statusCode).toBe(400);
      expect(body).toEqual(JSON.stringify({
        errors: [{
          status: 400,
          detail: 'Should provide a callback for JSONP'
        }]
      }));
      done();
    });
  });

  it('jsonp without callback', done => {
    request(getUrl('/test/res/jsonp?a=1'), (err, res, body) => {
      expect(res.statusCode).toBe(400);
      expect(body).toEqual(JSON.stringify({
        errors: [{
          status: 400,
          detail: 'Should provide a callback for JSONP'
        }]
      }));
      done();
    });
  });
});
