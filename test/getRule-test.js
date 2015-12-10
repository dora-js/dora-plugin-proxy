import expect from 'expect';
import getRule from '../src/getRule';
import { join } from 'path';

describe('getRule', () => {

  it('default rule', () => {
    expect(getRule({
      cwd: __dirname,
      query: {},
    }).summary()).toEqual('Anyproxy rule: dora-plugin-proxy');
  });

  it('custom rule.js', () => {
    expect(getRule({
      cwd: join(__dirname, 'fixtures/getRule'),
    }).a).toEqual(1);
  });
});
