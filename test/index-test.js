import dora from 'dora';
import { join } from 'path';

const port = '12345';

describe('index', () => {

  it('normal', done => {

    dora({
      port,
      plugins: ['../src/index'],
      cwd: __dirname,
    });

    //return new Promise(resolve => {
    //  dora({
    //    plugins: ['../index'],
    //    cwd: __dirname,
    //  });
    //
    //  //const date = new Date();
    //  //while (new Date - date < 500) {}
    //  //resolve();
    //});
  });
});

