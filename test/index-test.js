import dora from 'dora';
import { join } from 'path';
import request from 'supertest';
import { stringify } from 'qs';

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
      .expect(200, {
        list: [
          {id: 1},
          {id: 2},
          {id: 3},
          {id: 4},
          {id: 5},
        ]
      }, done);
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
      if(res.body.data.id !== 2) throw new Error('Error the id of movie is not 2');
    })
    .end(function(err) {
      if (err) return done(err);
      done();
    });
  });

  it('POST /page.do?cb=jQuery21407292539589107037_1450166204069 to test req.query', done => {
    request(`http://localhost:${proxyPort}`)
      .post('/page.do?cb=jQuery21407292539589107037_1450166204069')
      .expect(function(res){
        if (res.body.cb !== 'jQuery21407292539589107037_1450166204069') throw new Error('Error cb is not jQuery21407292539589107037_1450166204069');
      })
      .end(function(err) {
        if (err) return done(err);
        done();
      });
  });

  it('GET /birthday/:year/:month/:day to test req.params', done => {
    request(`http://localhost:${proxyPort}`)
      .get('/birthday/1987/8/18')
      .expect(function(res){
        if (!(res.body.year === '1987' && res.body.month === '8' &&  res.body.day === '18')) throw new Error('Error birthday is not 1987 8 18');
      })
      .end(function(err) {
        if (err) return done(err);
        done();
      });
  });

  it('POST /birthday/:id to test req.postData', done => {
    request(`http://localhost:${proxyPort}`)
      .post('/birthday/pigcan')
      .send(stringify({ name: 'pigcan', species: 'people' }))
      .expect(function(res){
        if (!(res.body.name === 'pigcan' && res.body.species === 'people')) throw new Error('Error pigcan is not a human kind suppose to be');
      })
      .end(function(err) {
        if (err) return done(err);
        done();
      });
  });
});

