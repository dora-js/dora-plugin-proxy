import {
  proxyServer as ProxyServer,
  isRootCAFileExists,
  generateRootCA,
} from 'anyproxy';
import getRule from './getRule';

!isRootCAFileExists() && generateRootCA();

export default {
  'name': 'proxy',
  'server.after': (args) => {
    const { port, silent } = args.query;
    new ProxyServer({
      type: 'http',
      port: port || 8989,
      hostname: 'localhost',
      rule: getRule(args),
      disableWebInterface: true,
      silent,
    });
  },
};
