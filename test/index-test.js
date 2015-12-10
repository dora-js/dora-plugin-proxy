import dora from 'dora';
import { join } from 'path';
import request from 'supertest';

const port = '12345';
const proxyPort = '12346';

describe('index', () => {

  before(done => {
    dora({
      port,
      plugins: [`../../../src/index?port=${proxyPort}`],
      cwd: join(__dirname, './fixtures/getRule-proxy'),
    });
    setTimeout(done, 1000);
  });

  it('GET /react/0.13.3/react.js', done => {
    request(`http://localhost:${proxyPort}`)
      .get('/react/0.13.3/react.js')
      .expect(/React\sv0\.13\.3/, done);
  });

  it('GET /style.css', done => {
    request(`http://localhost:${proxyPort}`)
      .get('/style.css')
      .expect(/@font-face/, done);
  });

  it('GET /func', done => {
    request(`http://localhost:${proxyPort}`)
      .get('/func')
      .expect('1', done);
  });

  it('GET /local', done => {
    request(`http://localhost:${proxyPort}`)
      .get('/local')
      .expect(/local/, done);
  });
});

