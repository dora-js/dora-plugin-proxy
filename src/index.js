import {
  proxyServer as ProxyServer,
  isRootCAFileExists,
  generateRootCA,
} from 'anyproxy';
import getRule from './getRule';

!isRootCAFileExists() && generateRootCA();

export default {
  'server.after': (args) => {
    const { port } = args.query;
    new ProxyServer({
      type: 'http',
      port: port || 8989,
      hostname: 'localhost',
      rule: getRule(args),
    });
  },
};
