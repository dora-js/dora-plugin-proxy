import {
  proxyServer as ProxyServer,
  isRootCAFileExists,
  generateRootCA,
} from 'anyproxy';
import getRule from './getRule';

!isRootCAFileExists() && generateRootCA();

export default {
  'server.after': (args) => {
    new ProxyServer({
      type: 'http',
      port: 8989,
      hostname: 'localhost',
      rule: getRule(args),
    });
  },
};
