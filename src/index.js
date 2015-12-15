import {
  proxyServer as ProxyServer,
  isRootCAFileExists,
  generateRootCA,
} from 'dora-anyproxy';
import getRule from './getRule';

!isRootCAFileExists() && generateRootCA();

export default {
  'name': 'proxy',
  'server.after': (args) => {
    const { log } = args;
    const { port } = args.query;
    const proxyServer = new ProxyServer({
      type: 'http',
      port: port || 8989,
      hostname: 'localhost',
      rule: getRule(args),
      disableWebInterface: true,
    });
    proxyServer.on('finish', (err, result) => {
      if (err) {
        log.error(err);
      } else {
        log.info(`listened on ${port}`);
      }
    });
  },
};
