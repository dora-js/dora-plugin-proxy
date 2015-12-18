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
      verbose: true,
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

  it('fallback to dora server', done => {
    request(`http://localhost:${proxyPort}`)
      .get('/not-match.js')
      .expect(/not-match/, done);
  });

  it('GET /pigcan/:id use mockjs BASIC', done => {
    request(`http://localhost:${proxyPort}`)
      .get('/pigcan/1')
      .expect(function(res){
        if(!(res.body.list[0].id !== NaN && typeof res.body.list[0].id === 'number')) throw new Error('Error id must be a number');
      })
      .end(function(err) {
        if (err) return done(err);
        done();
      });
  });

  it('GET /movies use mockjs DPD', done => {
    request(`http://localhost:${proxyPort}`)
    .get('/movies')
    .expect(function(res){
    if(res.body.data.length !== 5) throw new Error('Error the number of movie is not 5');
    })
    .end(function(err) {
      if (err) return done(err);
      done();
    });
  });

  xit('GET /movies use mockjs DPD - id is specified', done => {
    request(`http://localhost:${proxyPort}`)
    .get('/movie/2')
    .expect(function(res){
      console.log(res.body)
      if(res.body.data.id !== 2) throw new Error('Error the id of movie is not 2');
    })
    .end(function(err) {
      if (err) return done(err);
      done();
    });
  });

});

